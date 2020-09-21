import compact from 'lodash-es/compact';
import filter from 'lodash-es/filter';
import orderBy from 'lodash-es/orderBy';
import noop from 'lodash-es/noop';
import concat from 'lodash-es/concat';
import cloneDeep from 'lodash-es/cloneDeep';
import find from 'lodash-es/find';
import combatantStatuses from 'data/combatantStatuses';
import combatantTypes from 'data/combatantTypes';

const encounterHelpers = {
  isUnsetCombatant: (combatant) => {
    return combatant.status === combatantStatuses.unset;
  },
  isTurnReadyCombatant: (combatant) => {
    return combatant.status === combatantStatuses.ready;
  },
  isInPlay: (combatant) => {
    return !!(
      combatant.status === combatantStatuses.complete ||
      combatant.status === combatantStatuses.ready
    );
  },
  isOutOfPlay: (combatant) => {
    return !!(
      combatant.status === combatantStatuses.dead ||
      combatant.status === combatantStatuses.unset
    );
  },
  isCompleteCombatant: (combatant) => {
    return combatant.status === combatantStatuses.complete;
  },
  isDeadCombatant: (combatant) => {
    return combatant.status === combatantStatuses.dead;
  },
  isDeathSaving: (combatant) => {
    if (!combatant) {
      return false;
    }

    const { deathSaves } = combatant;
    let isDeathSaving = false;

    if (!!deathSaves) {
      deathSaves.map((save) => {
        if (!isDeathSaving && save !== null && save !== undefined) {
          isDeathSaving = true;
        }
      });
    }
    return isDeathSaving;
  },

  getActiveCombatant: (combatants) => {
    return find(combatants, ['active', true]);
  },
  getCombatantInsights: ({ combatant, character }) => {
    if (!combatant || !character) {
      return {};
    }
    const { damage } = combatant;
    const { character_type, total_health } = character;

    return {
      isComplete: encounterHelpers.isCompleteCombatant(combatant),
      isTurnReady: encounterHelpers.isTurnReadyCombatant(combatant),
      isDead: encounterHelpers.isDeadCombatant(combatant),
      isUnset: encounterHelpers.isUnsetCombatant(combatant),
      isDeathSaving: encounterHelpers.isDeathSaving(combatant),
      isEnemy: character_type.code
        ? character_type.code !== combatantTypes.player.code
        : false,
      isOverkill: damage > total_health,
    };
  },
  getCombatantById: ({ combatant_id, combatants }) => {
    return find(combatants, ['combatant_id', combatant_id]);
  },
  getCharacterById: ({ combatant_id, character_lookup }) => {
    return character_lookup[combatant_id];
  },

  orderCombatants: (combatants, iteratees) => {
    let clonedCombatants = orderBy(
      cloneDeep(combatants),
      concat(['status'], iteratees)
    );
    filter(clonedCombatants).forEach((combatant, i) => {
      {
        combatant.combatant_index = i;
      }
    });
    return orderBy(
      clonedCombatants,
      concat(['status', 'combatant_index'], iteratees || ['initiative'])
    );
  },
  reorderCombatants: ({ combatants = [], startIndex, endIndex }) => {
    if (startIndex === endIndex) {
      return encounterHelpers.orderCombatants(combatants);
    }

    const result = Array.from(combatants);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return encounterHelpers.orderCombatants(result);
  },
  filterCombatants: (combatants, predicate) => {
    return compact(
      combatants.map((combatant) => {
        if (predicate(combatant)) {
          return combatant;
        } else {
          return undefined;
        }
      })
    );
  },

  overkillDeath: ({
    combatant_id,
    healthChange,
    combatants,
    character_lookup,
    onOverkill = noop,
  }) => {
    const combatant = find(combatants, ['combatant_id', combatant_id]);
    const character = character_lookup[combatant_id];

    if (!combatant || !character) {
      return;
    }

    const { damage } = combatant;
    const { total_health } = character;

    if (
      (healthChange < 0 && Math.abs(healthChange) >= total_health - damage) ||
      total_health === damage
    ) {
      onOverkill({ combatant, character });
    }
  },
};

export default encounterHelpers;
