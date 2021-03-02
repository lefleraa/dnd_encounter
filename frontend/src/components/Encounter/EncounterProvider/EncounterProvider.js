import React, { useReducer, useEffect, createContext } from 'react';
import find from 'lodash-es/find';
import noop from 'lodash-es/noop';
import eventHandlers from './eventHandlers';
import { encounterHelpers, rollD } from 'helpers';
import { useWindow, useChannel } from 'hooks';

import combatantTypes from 'data/combatantTypes';
import combatantStatuses from 'data/combatantStatuses';
import useEncounterInsights from './useEncounterInsights';

import {
  initEvents,
  eventReducer,
  initEncounter,
  encounterReducer,
} from 'components/Encounter';

import { mockCharacters } from 'mock';
import { getEncounter } from 'network';

import { triggerToast } from 'components/Toast';
import InterfaceState from 'components/InterfaceState';
import { faHistory } from '@fortawesome/pro-light-svg-icons';
import {
  faAxeBattle,
  faCheck,
  faArrowLeft,
} from '@fortawesome/pro-regular-svg-icons';

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
// ENCOUNTER PROVIDER
////////////////////////////

const EncounterContext = createContext({});

const EncounterProvider = ({
  children,
  encounterId,
  pushConfirmationModal = noop,
}) => {
  const [eventState, dispatchLocalEvents] = useReducer(
    eventReducer,
    initEvents
  );
  const { events = [], currentEventIndex, safeToPush, loading } = eventState;

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

  const {
    combatant_turn_start,
    combatant_dead,
    combatant_roll_dice,
  } = eventHandlers;

  /////////////////////////////////////////////////////////
  // GET ENCOUNTER
  /////////////////////////////////////////////////////////

  function fetchEncounter(id) {
    dispatchLocalEvents({
      type: 'setLoading',
      payload: true,
    });
    dispatchLocalEvents({
      type: 'setSafeToPush',
      payload: false,
    });
    const { promise } = getEncounter(id);
    promise
      .then((response) => {
        const { data, error } = response || {};
        if (error) {
          // on error
          return;
        }
        if (data.data) {
          const { id, name, started, encounter_events = [] } = data.data;
          // on success
          dispatchEncounter({
            type: 'setEncounter',
            payload: {
              id,
              name,
              started,
            },
          });
          dispatchLocalEvents({
            type: 'setEvents',
            payload: encounter_events.map((event) => {
              return {
                ...event,
                payload: event.payload || {},
              };
            }),
          });
        }
      })
      .finally(() => {
        dispatchLocalEvents({
          type: 'setLoading',
          payload: false,
        });
        dispatchLocalEvents({
          type: 'setSafeToPush',
          payload: true,
        });
      });
  }

  useEffect(() => {
    if (encounterId) {
      fetchEncounter(encounterId);
    }
  }, [encounterId]);

  /////////////////////////////////////////////////////////
  // HANDLE WINDOW STATE
  /////////////////////////////////////////////////////////

  useWindow(
    {
      enableListeners: !!encounter.id,
      onMount: () => {
        triggerToast({
          icon: faAxeBattle,
          text: 'Battle!',
        });
      },
      onFocus: () => {
        triggerToast({
          icon: faCheck,
          text: 'Synced.',
        });
      },
      onBlur: () => {},
      onOnline: () => {},
      onOffline: () => {},
      onLoad: () => {},
      onUnload: () => {},
    },
    [encounter.id]
  );

  /////////////////////////////////////////////////////////
  // KEEP FRONT END EVENTS IN SYNC WITH THE SERVER
  // VIA WEBSOCKET CHANNEL
  /////////////////////////////////////////////////////////

  const CHANNEL = {
    NAME: 'encounter:lobby',
    PUSH_EVENT_NAME: 'event',
  };

  const { channel, socket } = useChannel({
    channelName: CHANNEL.NAME,
  });

  useEffect(() => {
    if (channel) {
      channel.on(CHANNEL.PUSH_EVENT_NAME, (response) => {
        const { encounter = {} } = response || {};
        const { encounter_events = [] } = encounter;
        dispatchLocalEvents({
          type: 'setEvents',
          payload: encounter_events.map((event) => {
            return {
              ...event,
              payload: event.payload || {},
            };
          }),
        });
        dispatchLocalEvents({
          type: 'setSafeToPush',
          payload: true,
        });
      });
    }
  }, [channel]);

  /////////////////////////////////////////////////////////
  // HANDLE PUSH EVENT
  /////////////////////////////////////////////////////////

  const handleEventPush = ({ event, callback = noop }) => {
    if (!safeToPush) {
      console.warn("REJECTED EVENT: Reason: 'Busy pushing event'");
      return;
    }
    // optimistic push to prevent a UI flash when rebuilding state
    // from scratch when the channel version arrives
    dispatchLocalEvents({
      type: 'setSafeToPush',
      payload: false,
    });
    runEncounterEvent(event);
    if (channel) {
      channel.push(CHANNEL.PUSH_EVENT_NAME, {
        ...event,
        payload: event.payload || null,
        encounter_id: encounter.id,
      });
    }
    callback();
  };

  const dispatchEvent = (event, options) => {
    const { callback } = options || {};

    if (!!onMostRecentEvent) {
      handleEventPush({ event, callback });
    } else {
      pushConfirmationModal({
        variant: 'error',
        icon: faHistory,
        preTitle: 'Re-writing History',
        text: 'A past action is currently selected.',
        detail: 'This will overwrite actions in your history.',
        confirmText: 'Continue',
        action: () => handleEventPush({ event, callback }),
      });
    }
  };

  /////////////////////////////////////////////////////////
  // PROPERLY SET ACTIVE CANDIDATE
  /////////////////////////////////////////////////////////

  // function setActiveCombatant() {
  //   const { combatant_id } = activeCombatantCandidate || {};
  //   const { combatant_id: active_combatant_id } = activeCombatant || {};

  //   if (!round || !onMostRecentEvent) {
  //     return;
  //   }

  //   const noActiveCandidate = !!(!active_combatant_id && combatant_id);
  //   const newCandidateCombatant = !!(
  //     combatant_id && combatant_id !== active_combatant_id
  //   );

  //   if (noActiveCandidate || newCandidateCombatant) {
  //     dispatchEvent({
  //       type: combatant_turn_start.type,
  //       payload: { combatant_id },
  //     });
  //   }
  // }

  // useEffect(() => {
  //   setActiveCombatant();
  // }, [round, onMostRecentEvent, activeCombatant, activeCombatantCandidate]);

  /////////////////////////////////////////////////////////
  // HYDRATE STATE VIA EVENTS:
  // Re-runs every time an event is pushed.
  /////////////////////////////////////////////////////////

  function runEncounterEvent(event, i) {
    const { payload = {} } = event;
    const { combatant_id } = payload;

    // ADD CHARACTER LOOKUPS
    addCharacterLookup({ combatant_id });

    // FORM ALL ENCOUNTER STATE FROM EVENT DATA
    if (eventHandlers[event.type]) {
      const action = {
        ...event,
      };

      if (i !== undefined) {
        action.metaData = {
          historyIndex: i,
          event,
        };
        action.config = {
          snapshot: !!(i > currentEventIndex) ? true : false,
        };
      }

      dispatchEncounter(action);
    }
  }

  useEffect(() => {
    // CLEAR STATE AFTER EACH EVENT PUSH
    // reset state since we will always run through
    // the entirety of the events each time
    // a new event is pushed.
    dispatchEncounter({
      type: 'clearEncounter',
    });

    events.forEach((event, i) => {
      runEncounterEvent(event, i);
    });
  }, [events]);

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

    rollDice: ({ combatant_id, dice = 'd20' }) => {
      const roll = rollD(dice);
      if (!roll) {
        return;
      }
      dispatchEvent({
        type: combatant_roll_dice.type,
        payload: {
          combatant_id,
          dice,
          roll: roll.total,
        },
      });
    },
  };

  /////////////////////////////////////////////////////////
  // RETURN
  /////////////////////////////////////////////////////////

  if (!!loading) {
    return (
      <InterfaceState
        text="Loading Encounter..."
        loading={true}
        pageLayout={true}
      />
    );
  }

  if (!encounter.id) {
    return (
      <InterfaceState
        text="No encounter found."
        icon={faAxeBattle}
        btnText="Encounters"
        btnIcon={faArrowLeft}
        btnTo="/encounters"
        pageLayout={true}
      />
    );
  }

  return (
    <EncounterContext.Provider
      value={{
        encounter: {
          ...encounter,
          history: {
            ...history,
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
