import cloneDeep from 'lodash-es/cloneDeep';
import eventHandlers from './eventHandlers';

////////////////////////////////
// REDUCER
////////////////////////////////

const initEncounter = {
  round: 0,
  combatants: [],
  history: {
    list: [],
  },
  character_lookup: {},
};

const {
  encounter_created,
  reorder_combatants_by_initiative,
  round_increment,
  combatant_add,
  combatant_remove,
  combatant_fled,
  combatant_dead,
  combatant_turn_end,
  combatant_turn_start,
  combatant_roll_initiative,
  combatant_damage,
  combatant_heal,
  combatant_move_up,
  combatant_move_down,
} = eventHandlers;

function encounterReducer(throughState, action) {
  const { type, payload, metaData = {}, config = {} } = action;
  let state = cloneDeep(throughState);

  const passedProps = {
    type,
    payload,
    state,
    metaData,
    snapshot: !!config.snapshot ? cloneDeep(throughState) : undefined,
  };

  switch (type) {
    case 'resetEncounter':
      return { ...initEncounter };
    case 'setEncounter':
      return payload;
    case 'setCombatants':
      return {
        ...state,
        combatants: payload || [],
      };
    case encounter_created.type:
      return encounter_created._hydrate(passedProps);
    case reorder_combatants_by_initiative.type:
      return reorder_combatants_by_initiative._hydrate(passedProps);
    case round_increment.type:
      return round_increment._hydrate(passedProps);
    case combatant_add.type:
      return combatant_add._hydrate(passedProps);
    case combatant_remove.type:
      return combatant_remove._hydrate(passedProps);
    case combatant_fled.type:
      return combatant_fled._hydrate(passedProps);
    case combatant_dead.type:
      return combatant_dead._hydrate(passedProps);
    case combatant_turn_end.type:
      return combatant_turn_end._hydrate(passedProps);
    case combatant_turn_start.type:
      return combatant_turn_start._hydrate(passedProps);
    case combatant_roll_initiative.type:
      return combatant_roll_initiative._hydrate(passedProps);
    case combatant_move_up.type:
      return combatant_move_up._hydrate(passedProps);
    case combatant_move_down.type:
      return combatant_move_down._hydrate(passedProps);
    case combatant_damage.type:
      return combatant_damage._hydrate(passedProps);
    case combatant_heal.type:
      return combatant_heal._hydrate(passedProps);
    default:
      return state;
  }
}
export { encounterReducer, initEncounter };
