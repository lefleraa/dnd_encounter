import remove from 'lodash-es/remove';
import find from 'lodash-es/find';
import clone from 'lodash-es/clone';
import { faRunning } from '@fortawesome/pro-duotone-svg-icons';
import {
  faTrash,
  faCheck,
  faSortAmountUp,
  faSortAmountDownAlt,
  faArrowRight,
  faSortNumericUp,
  faPlus,
  faTombstone,
} from '@fortawesome/pro-regular-svg-icons';
import { faDiceD20 } from '@fortawesome/pro-light-svg-icons';
import { faHeartBroken, faAxeBattle } from '@fortawesome/pro-solid-svg-icons';
import { encounterHelpers } from 'helpers';
import { combatantStatuses, diceTypes } from 'data';

const historyLog = {
  msg: undefined,
  before: undefined,
  after: undefined,
  icon: undefined,
  iconColor: undefined,
  showAvatar: undefined,
  dividerBefore: false,
  dividerAfter: false,
  disabled: false,
  silent: false,
  heading: undefined,
};

const pushToHistory = ({ state = {}, metaData, snapshot, historyLog }) => {
  const { history = {} } = state;
  let throughState = state;

  if (typeof metaData !== 'object') {
    return throughState;
  }

  // If createSnapshot is true, ignore the new state
  // as defined by the reducer function and use the
  // state snapshot captured right before running
  // the function.
  if (!!snapshot) {
    // although we might bypass the new state
    // (using a cloned snapshot instead), we need
    // to ensure the snapshot keeps the proper
    // round set here before render
    snapshot.round = state.round;
    throughState = snapshot;
  }

  historyLog.metaData = {
    ...metaData,
    round: throughState.round,
    bypass: !!snapshot,
  };

  const clonedHistory = clone(history.list);
  clonedHistory.push(historyLog);

  throughState.history.list = clonedHistory;

  return throughState;
};

const eventHandlers = {
  //////////////////////
  // ENCOUNTER
  //////////////////////

  // CREATE ENCOUNTER
  // payload: none
  encounter_created: {
    type: 'encounter_created',
    historyLog: {
      ...historyLog,
      msg: 'Encounter',
      after: 'Created',
      icon: faAxeBattle,
    },
    _hydrate: (params) => {
      return pushToHistory({
        ...params,
        historyLog: {
          ...eventHandlers.encounter_created.historyLog,
          heading: 'Pre-round',
        },
      });
    },
  },

  //////////////////////
  // ROUND
  //////////////////////

  // INCREMENT ROUND
  // payload: none
  round_increment: {
    type: 'round_increment',
    historyLog: {
      ...historyLog,
      msg: 'Round',
      after: 'Started',
      dividerBefore: true,
    },
    _hydrate: (params) => {
      const { state = {} } = params;
      const { combatants = [] } = state;

      combatants.forEach((c) => {
        c.active = false;
        if (encounterHelpers.isInPlay(c)) {
          c.status = combatantStatuses.ready;
        }
      });

      state.round++;

      return pushToHistory({
        ...params,
        historyLog: {
          ...eventHandlers.round_increment.historyLog,
          heading: `Round ${state.round}`,
        },
      });
    },
  },

  //////////////////////
  // COMBATANTS
  //////////////////////

  // INCREMENT ROUND
  // payload: none
  reorder_combatants_by_initiative: {
    type: 'reorder_combatants_by_initiative',
    historyLog: {
      ...historyLog,
      before: 'Re-ordered by',
      msg: 'Initiative',
      icon: faSortNumericUp,
      iconColor: 'gray-light',
    },
    _hydrate: (params) => {
      const { state = {} } = params;
      const { combatants = [] } = state;

      return pushToHistory({
        ...params,
        state: {
          ...state,
          combatants: encounterHelpers.orderCombatants(combatants, [
            'initiative',
          ]),
        },
        historyLog: {
          ...eventHandlers.reorder_combatants_by_initiative.historyLog,
        },
      });
    },
  },

  //////////////////////
  // COMBATANT
  //////////////////////

  // ADD COMBATANT
  // payload: combatant_id
  combatant_add: {
    type: 'combatant_add',
    historyLog: {
      ...historyLog,
      after: 'added to encounter',
      showAvatar: true,
    },
    _hydrate: (params) => {
      const { state = {}, payload = {} } = params;
      const { combatants = [] } = state;
      const { combatant_id } = payload;

      combatants.push({
        combatant_id,
        combatant_index: undefined,
        initiative: undefined,
        status: combatantStatuses.unset,
        active: false,
        damage: 0,
        deathSaves: [null, null, null],
      });

      return pushToHistory({
        ...params,
        historyLog: {
          ...eventHandlers.combatant_add.historyLog,
        },
      });
    },
  },

  // REMOVE COMBATANT
  // payload: combatant_id
  combatant_remove: {
    type: 'combatant_remove',
    historyLog: {
      ...historyLog,
      after: 'removed from encounter',
      icon: faTrash,
      iconColor: 'error',
    },
    _hydrate: (params) => {
      const { state = {}, payload = {} } = params;
      const { combatants = [] } = state;
      const { combatant_id } = payload;

      remove(combatants, (combatant) => {
        return combatant.combatant_id === combatant_id;
      });

      return pushToHistory({
        ...params,
        historyLog: {
          ...eventHandlers.combatant_remove.historyLog,
        },
      });
    },
  },

  // MARK COMBATANT AS FLED
  // payload: combatant_id
  combatant_fled: {
    type: 'combatant_fled',
    historyLog: {
      ...historyLog,
      after: 'has fled',
      icon: faRunning,
      iconColor: 'warning',
    },
    _hydrate: (params) => {
      const { state = {}, payload = {} } = params;
      const { combatants = [] } = state;
      const { combatant_id } = payload;

      remove(combatants, (combatant) => {
        return combatant.combatant_id === combatant_id;
      });

      return pushToHistory({
        ...params,
        historyLog: {
          ...eventHandlers.combatant_fled.historyLog,
        },
      });
    },
  },

  // MARK COMBATANT DEAD
  // payload: combatant_id
  combatant_dead: {
    type: 'combatant_dead',
    historyLog: {
      ...historyLog,
      after: 'has died',
      icon: faTombstone,
      iconColor: 'gray-light',
    },
    _hydrate: (params) => {
      const { state = {}, payload = {} } = params;
      const { combatants = [] } = state;
      const { combatant_id } = payload;

      const combatant = find(combatants, ['combatant_id', combatant_id]) || {};

      combatant.status = combatantStatuses.dead;

      return pushToHistory({
        ...params,
        state: {
          ...state,
          combatants: encounterHelpers.reorderCombatants({
            combatants,
            startIndex: combatant.combatant_index,
            endIndex:
              encounterHelpers.filterCombatants(combatants, (c) => {
                return !encounterHelpers.isOutOfPlay(c);
              }).length - 1,
          }),
        },
        historyLog: {
          ...eventHandlers.combatant_dead.historyLog,
        },
      });
    },
  },

  // ADD COMBATANT DAMAGE
  // payload: combatant_id, damage
  combatant_damage: {
    type: 'combatant_damage',
    historyLog: {
      ...historyLog,
      after: 'took damage',
      icon: faHeartBroken,
      iconColor: 'error',
    },
    _hydrate: (params) => {
      const { state = {}, payload = {} } = params;
      const { combatants = [] } = state;
      const { combatant_id, damage } = payload;

      const combatant = find(combatants, ['combatant_id', combatant_id]) || {};

      combatant.damage = combatant.damage + damage;

      return pushToHistory({
        ...params,
        historyLog: {
          ...eventHandlers.combatant_damage.historyLog,
          after: `took ${damage} damage`,
        },
      });
    },
  },

  // HEAL COMBATANT
  // payload: combatant_id, damage
  combatant_heal: {
    type: 'combatant_heal',
    historyLog: {
      ...historyLog,
      after: 'received health',
      icon: faPlus,
      iconColor: 'confirm',
    },
    _hydrate: (params) => {
      const { state = {}, payload = {} } = params;
      const { combatants = [] } = state;
      const { combatant_id, health } = payload;

      const combatant = find(combatants, ['combatant_id', combatant_id]) || {};

      if (health >= combatant.damage) {
        combatant.damage = 0;
      } else {
        combatant.damage = combatant.damage - health;
      }

      return pushToHistory({
        ...params,
        historyLog: {
          ...eventHandlers.combatant_heal.historyLog,
          after: `received ${health} health`,
        },
      });
    },
  },

  // MOVE COMBATANT UP
  // payload: combatant_id, startIndex, endIndex
  combatant_move_up: {
    type: 'combatant_move_up',
    historyLog: {
      ...historyLog,
      after: 'moved up',
      icon: faSortAmountUp,
      iconColor: 'gray-light',
    },
    _hydrate: (params) => {
      const { state = {}, payload = {} } = params;
      const { combatants } = state;
      const { startIndex, endIndex } = payload;

      return pushToHistory({
        ...params,
        state: {
          ...state,
          combatants: encounterHelpers.reorderCombatants({
            combatants,
            startIndex,
            endIndex,
          }),
        },
        historyLog: {
          ...eventHandlers.combatant_move_up.historyLog,
          after: `moved from position ${startIndex + 1} to ${endIndex + 1}`,
        },
      });
    },
  },

  // MOVE COMBATANT DOWN
  // payload: combatant_id, startIndex, endIndex
  combatant_move_down: {
    type: 'combatant_move_down',
    historyLog: {
      ...historyLog,
      after: 'moved down',
      icon: faSortAmountDownAlt,
      iconColor: 'gray-light',
    },
    _hydrate: (params) => {
      const { state = {}, payload = {} } = params;
      const { combatants } = state;
      const { startIndex, endIndex } = payload;

      return pushToHistory({
        ...params,
        state: {
          ...state,
          combatants: encounterHelpers.reorderCombatants({
            combatants,
            startIndex,
            endIndex,
          }),
        },
        historyLog: {
          ...eventHandlers.combatant_move_down.historyLog,
          after: `moved from position ${startIndex + 1} to ${endIndex + 1}`,
        },
      });
    },
  },

  // END COMBATANT TURN
  // payload: combatant_id
  combatant_turn_end: {
    type: 'combatant_turn_end',
    historyLog: {
      ...historyLog,
      before: 'Ended turn for',
      icon: faCheck,
      iconColor: 'confirm',
      disabled: true,
    },
    _hydrate: (params) => {
      const { state = {}, payload = {} } = params;
      const { combatants = [] } = state;
      const { combatant_id } = payload;

      const combatant = find(combatants, ['combatant_id', combatant_id]) || {};

      combatants.forEach((c) => {
        c.active = false;
        if (encounterHelpers.isInPlay(c)) {
          c.status =
            c.combatant_index <= combatant.combatant_index
              ? combatantStatuses.complete
              : combatantStatuses.ready;
        }
      });

      return pushToHistory({
        ...params,
        state: {
          ...state,
          combatants,
        },
        historyLog: {
          ...eventHandlers.combatant_turn_end.historyLog,
        },
      });
    },
  },

  // START COMBATANT TURN
  // payload: combatant_id
  combatant_turn_start: {
    type: 'combatant_turn_start',
    historyLog: {
      ...historyLog,
      before: 'Started turn for',
      icon: faArrowRight,
      iconColor: 'primary',
      showAvatar: true,
      dividerBefore: true,
    },
    _hydrate: (params) => {
      const { state = {}, payload = {} } = params;
      const { combatants = [] } = state;
      const { combatant_id } = payload;

      const combatant = find(combatants, ['combatant_id', combatant_id]) || {};

      combatants.forEach((c) => {
        c.active = c.combatant_id === combatant_id;
        if (encounterHelpers.isInPlay(c)) {
          c.status =
            c.combatant_index >= combatant.combatant_index
              ? combatantStatuses.ready
              : combatantStatuses.complete;
        }
      });

      return pushToHistory({
        ...params,
        state: {
          ...state,
          combatants,
        },
        historyLog: {
          ...eventHandlers.combatant_turn_start.historyLog,
        },
      });
    },
  },

  // ROLL COMBATANT INITIATIVE
  // payload: combatant_id, initiative
  combatant_roll_initiative: {
    type: 'combatant_roll_initiative',
    historyLog: {
      ...historyLog,
      after: 'rolled initiative',
      icon: faDiceD20,
      iconColor: 'primary',
    },
    _hydrate: (params) => {
      const { state = {}, payload = {} } = params;
      const { combatants = [] } = state;
      const { combatant_id, initiative } = payload;

      const combatant = find(combatants, ['combatant_id', combatant_id]) || {};

      remove(combatants, (c) => {
        return c.combatant_id === combatant_id;
      });
      combatant.initiative = initiative;
      combatant.combatant_index = undefined;
      combatant.status = combatantStatuses.ready;
      combatants.push(combatant);

      let endIndex = combatants.length - 1;
      for (let i = 0; i < combatants.length; i++) {
        const c = combatants[i];
        endIndex = i;
        if (
          encounterHelpers.isTurnReadyCombatant(c) &&
          c.initiative > combatant.initiative
        ) {
          break;
        }
      }

      return pushToHistory({
        ...params,
        state: {
          ...state,
          combatants: encounterHelpers.reorderCombatants({
            combatants,
            startIndex: combatants.length - 1,
            endIndex,
          }),
        },
        historyLog: {
          ...eventHandlers.combatant_roll_initiative.historyLog,
          after: `rolled ${initiative} initiative`,
        },
      });
    },
  },

  // ROLL DICE
  // payload: combatant_id, dice roll
  combatant_roll_dice: {
    type: 'combatant_roll_dice',
    historyLog: {
      ...historyLog,
      after: 'rolled dice',
      iconColor: 'white',
    },
    _hydrate: (params) => {
      const { payload = {} } = params;
      const { dice, roll } = payload;

      let icon;

      switch (dice) {
        case diceTypes.d4.code:
          icon = diceTypes.d4.icon;
          break;
        case diceTypes.d6.code:
          icon = diceTypes.d6.icon;
          break;
        case diceTypes.d8.code:
          icon = diceTypes.d8.icon;
          break;
        case diceTypes.d10.code:
          icon = diceTypes.d10.icon;
          break;
        case diceTypes.d12.code:
          icon = diceTypes.d12.icon;
          break;
        case diceTypes.d20.code:
          icon = diceTypes.d20.icon;
          break;
        default:
          icon = diceTypes.d20.icon;
      }

      return pushToHistory({
        ...params,
        historyLog: {
          ...eventHandlers.combatant_roll_dice.historyLog,
          icon,
          after: `rolled ${dice} for ${roll}`,
        },
      });
    },
  },
};

export default eventHandlers;
