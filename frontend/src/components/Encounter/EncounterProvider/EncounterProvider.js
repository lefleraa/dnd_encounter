import React, { useReducer, useEffect, createContext, useState } from 'react';
import socket from 'socket';
import find from 'lodash-es/find';
import noop from 'lodash-es/noop';
import groupBy from 'lodash-es/groupBy';
import eventHandlers from './eventHandlers';
import { encounterHelpers, socketHelper } from 'helpers';
import { useWindow } from 'hooks';

import combatantTypes from 'data/combatantTypes';
import combatantStatuses from 'data/combatantStatuses';
import useEncounterInsights from './useEncounterInsights';
import { faHistory } from '@fortawesome/pro-light-svg-icons';

import { initEvents, eventReducer } from './eventReducer';
import { initEncounter, encounterReducer } from './encounterReducer';

import { mockCharacters } from 'mock';

import { triggerToast } from 'components/Toast';
import { faAxeBattle, faCheck } from '@fortawesome/pro-regular-svg-icons';

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
// CONTEXT PROVIDER
////////////////////////////

const EncounterContext = createContext();

////////////////////////////
// WEBSOCKET CHANNEL
////////////////////////////

const ENCOUNTER_STREAM = {
  CHANNEL: undefined,
  NAME: 'encounter:lobby',
  PUSH_EVENT: 'event',
};

////////////////////////////
// ENCOUNTER PROVIDER
////////////////////////////

const EncounterProvider = ({ children, pushConfirmationModal = noop }) => {
  const { combatant_turn_start, combatant_dead } = eventHandlers;

  const [eventState, dispatchLocalEvents] = useReducer(
    eventReducer,
    initEvents
  );
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
  // HANDLE WINDOW STATE
  /////////////////////////////////////////////////////////

  const [windowState, setWindowState] = useState();
  const [activeWindow, setActiveWindow] = useState(false);

  useWindow(
    {
      onMount: () => {
        setWindowState('mounted');
        setActiveWindow(true);
        triggerToast({
          icon: faAxeBattle,
          text: 'Battle!',
        });
      },
      onFocus: () => {
        setWindowState('focus');
        setActiveWindow(true);
        triggerToast({
          icon: faCheck,
          text: 'Synced.',
        });
      },
      onBlur: () => {
        setWindowState('blur');
        setActiveWindow(true);
      },
      onOnline: () => {
        setWindowState('online');
        setActiveWindow(true);
      },
      onOffline: () => {
        setWindowState('offline');
        setActiveWindow(false);
      },
      onLoad: () => {
        setWindowState('loaded');
        setActiveWindow(true);
      },
      onUnload: () => {
        setWindowState('unloaded');
        setActiveWindow(false);
      },
    },
    []
  );

  /////////////////////////////////////////////////////////
  // KEEP FRONT END EVENTS IN SYNC WITH THE SERVER
  // VIA WEBSOCKET CHANNEL
  /////////////////////////////////////////////////////////

  useEffect(() => {
    ENCOUNTER_STREAM.CHANNEL = socket.channel(ENCOUNTER_STREAM.NAME, {});

    const { join = noop, leave = noop } = socketHelper({
      channel: ENCOUNTER_STREAM.CHANNEL,
      event: ENCOUNTER_STREAM.PUSH_EVENT,
      onPush: ({ events }) => {
        dispatchLocalEvents({
          type: 'setEvents',
          payload: events.map((event) => {
            return {
              ...event,
              payload: event.payload || {},
            };
          }),
        });
      },
    });

    if (activeWindow) {
      join();
    }
    return () => {
      leave();
    };
  }, [windowState]);

  /////////////////////////////////////////////////////////
  // HANDLE PUSH EVENT
  /////////////////////////////////////////////////////////

  const dispatchEvent = (event, options) => {
    const { callback = noop } = options || {};
    const handlePush = () => {
      ENCOUNTER_STREAM.CHANNEL.push(ENCOUNTER_STREAM.PUSH_EVENT, event);
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
      if (eventHandlers[event.type]) {
        dispatchEncounter({
          ...event,
          metaData: {
            historyIndex: i,
            event,
          },
          config: {
            snapshot: !!(i > currentEventIndex) ? true : false,
          },
        });
      }
    });
  }, [events]);

  /////////////////////////////////////////////////////////
  // ENSURE ACTIVE CANDIDATE
  /////////////////////////////////////////////////////////

  // useEffect(() => {
  //   if (!round || !activeCombatantCandidate || !onMostRecentEvent) {
  //     return;
  //   }

  //   if (
  //     !activeCombatant ||
  //     activeCombatant.combatant_id !== activeCombatantCandidate.combatant_id
  //   ) {
  //     dispatchEvent({
  //       type: combatant_turn_start.type,
  //       payload: {
  //         combatant_id: activeCombatantCandidate.combatant_id,
  //       },
  //     });
  //   }
  // }, [activeCombatant, activeCombatantCandidate, onMostRecentEvent]);

  /////////////////////////////////////////////////////////
  // ACTIONS
  /////////////////////////////////////////////////////////

  const actions = {
    pushConfirmationModal,
    dispatchEvent,

    setHistoryIndex: (eventIndex) => {
      dispatchLocalEvents({
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
  };

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
          actions,
        },
        eventHandlers,
        combatantStatuses,
        combatantTypes,
      }}
    >
      {children}
    </EncounterContext.Provider>
  );
};

export { EncounterProvider, EncounterContext };
