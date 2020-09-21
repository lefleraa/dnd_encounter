import React, { useReducer, useEffect, createContext, useState } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import find from 'lodash-es/find';
import compact from 'lodash-es/compact';
import groupBy from 'lodash-es/groupBy';
import noop from 'lodash-es/noop';
import { eventTypes } from 'data';
import { encounterHelpers } from 'helpers';
import { concat } from 'lodash-es';
import { initEncounter, encounterReducer } from './reducer';
import combatantTypes from 'data/combatantTypes';
import combatantStatuses from 'data/combatantStatuses';
import useEncounterInsights from './useEncounterInsights';
import { faHistory } from '@fortawesome/pro-light-svg-icons';
import socket from 'socket';

import { mockCharacters } from 'mock';

////////////////////////////
// CHARACTER LOOKUP
// TODO: Toss on state to ensure more
// up to date data
////////////////////////////

const character_lookup = {};

function addCharacterLookup({ combatant_id }) {
  if (character_lookup[combatant_id]) {
    return null;
  }

  let character = find(mockCharacters, ['combatant_id', combatant_id]);

  if (character) {
    character_lookup[combatant_id] = character;
  }
}

////////////////////////////
// EVENTS REDUCER
////////////////////////////

const initEvents = {
  events: [],
  currentEventIndex: 0,
};

function eventsReducer(throughState, action) {
  const { type, payload } = action;
  let state = cloneDeep(throughState);
  const { events = [], currentEventIndex } = state || {};

  switch (type) {
    case 'resetEvents':
      return { ...initEvents };
    case 'setEvents':
      return {
        ...state,
        events: payload || [],
      };
    case 'setCurrentEvent':
      return {
        ...state,
        currentEventIndex:
          payload === undefined || payload === null
            ? events.length - 1
            : payload,
      };
    case 'pushEvent':
      let list = compact(concat(events, [payload]));
      return {
        ...state,
        events: list,
        currentEventIndex: list.length - 1,
      };
    default:
      return state;
  }
}

let channel = socket.channel('encounter:lobby', {}); // connect to encounter socket

////////////////////////////
// HOOK
////////////////////////////

const EncounterContext = createContext();

const EncounterProvider = ({ children, pushConfirmationModal = noop }) => {
  const { combatant_turn_start, combatant_dead } = eventTypes;

  const [eventState, dispatchEvents] = useReducer(eventsReducer, initEvents);
  const { events = [], currentEventIndex } = eventState;

  const [encounter, dispatchEncounter] = useReducer(
    encounterReducer,
    initEncounter
  );
  const { round, history = {} } = encounter;

  const { combatants = {}, insights = {} } = useEncounterInsights({
    encounter,
    eventState,
  });
  const {
    onMostRecentEvent,
    activeCombatant,
    activeCombatantCandidate,
  } = insights;

  /////////////////////////////////////////////////////////
  // KEEP FRONT END EVENTS IN SYNC WITH THE SERVER
  /////////////////////////////////////////////////////////

  useEffect(() => {
    channel.on('shout', (event) => {
      console.log('incomingEvent', event);
      dispatchEvents({
        type: 'pushEvent',
        payload: {
          ...event,
          payload: event.payload || {},
        },
      });
    });
    channel.join(); // join the channel.
  }, []);

  /////////////////////////////////////////////////////////
  // HYDRATE STATE VIA EVENTS:
  // Re-runs every time an event is pushed.
  /////////////////////////////////////////////////////////

  useEffect(() => {
    // CLEAR STATE AFTER EACH EVENT PUSH
    // reset state since we will always run through
    // the entirety of the events each time
    // a new event is pushed.
    dispatchEncounter({
      type: 'setEncounter',
      payload: {
        ...initEncounter,
      },
    });
    events.forEach((event, i) => {
      const { payload = {} } = event;
      const { combatant_id } = payload;

      // ADD CHARACTER LOOKUPS
      addCharacterLookup({ combatant_id });

      // FORM ALL ENCOUNTER STATE FROM EVENT DATA
      if (eventTypes[event.type]) {
        dispatchEncounter({
          ...event,
          metaData: {
            historyIndex: i,
          },
          config: {
            snapshot: !!(i > currentEventIndex) ? true : false,
          },
        });
      }
    });
  }, [events]);

  /////////////////////////////////////////////////////////
  // HANDLE PUSH EVENT
  /////////////////////////////////////////////////////////

  const dispatchEvent = (event, options) => {
    const { callback = noop } = options || {};
    const handlePush = () => {
      channel.push('shout', event);
      callback();
    };

    if (!!onMostRecentEvent) {
      handlePush();
    } else {
      pushConfirmationModal({
        variant: 'error',
        icon: faHistory,
        preTitle: 'Re-writing History',
        text: 'A past action is currently selected.',
        detail: 'This will overwrite actions in your history.',
        confirmText: 'Continue',
        action: handlePush,
      });
    }
  };

  /////////////////////////////////////////////////////////
  // ENSURE ACTIVE CANDIDATE
  /////////////////////////////////////////////////////////

  useEffect(() => {
    if (!round || !activeCombatantCandidate || !onMostRecentEvent) {
      return;
    }

    if (
      !activeCombatant ||
      activeCombatant.combatant_id !== activeCombatantCandidate.combatant_id
    ) {
      dispatchEvent({
        type: combatant_turn_start.type,
        payload: {
          combatant_id: activeCombatantCandidate.combatant_id,
        },
      });
    }
  }, [activeCombatant, activeCombatantCandidate, onMostRecentEvent]);

  /////////////////////////////////////////////////////////
  // RETURN
  /////////////////////////////////////////////////////////

  return (
    <EncounterContext.Provider
      value={{
        encounter: {
          ...encounter,
          history: {
            ...history,
            rounds: groupBy(history.list, (historyLog) => {
              return historyLog.metaData.round;
            }),
            currentHistoryIndex: eventState.currentEventIndex,
          },
          combatants,
          helpers: {
            ...encounterHelpers,
            getCombatantById: (combatant_id) => {
              return encounterHelpers.getCombatantById({
                combatant_id,
                combatants: combatants.list,
              });
            },
            getCharacterById: (combatant_id) => {
              return encounterHelpers.getCharacterById({
                combatant_id,
                character_lookup,
              });
            },
          },
          insights,
          actions: {
            pushConfirmationModal,
            dispatchEvent,
            setCurrentEvent: (eventIndex) => {
              dispatchEvents({
                type: 'setCurrentEvent',
                payload: eventIndex,
              });
            },
            overkillDeath: ({ combatant_id, healthChange }) => {
              encounterHelpers.overkillDeath({
                combatant_id,
                healthChange,
                combatants: combatants.list,
                character_lookup,
                onOverkill: ({ character }) => {
                  const { name } = character;
                  pushConfirmationModal({
                    variant: 'white',
                    icon: combatant_dead.historyLog.icon,
                    preTitle: name,
                    title: 'Kill Combatant?',
                    text: `${name} is exhausted.`,
                    detail: `Would you like to mark them dead?`,
                    cancelText: 'No',
                    confirmText: 'Yes',
                    action: () =>
                      dispatchEvent({
                        type: combatant_dead.type,
                        payload: {
                          combatant_id,
                        },
                      }),
                  });
                },
              });
            },
          },
        },
        eventTypes,
        combatantStatuses,
        combatantTypes,
      }}
    >
      {children}
    </EncounterContext.Provider>
  );
};

export { EncounterProvider, EncounterContext };
