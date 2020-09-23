import { eventHandlers } from 'components/Encounter';

const mockEvents = [
  {
    type: eventHandlers.encounter_created.type,
  },

  // POPULATING

  {
    type: eventHandlers.combatant_add.type,
    payload: {
      combatant_id: '159c9ba1-6e13-455d-81f7-af719d6de8f3',
    },
  },
  {
    type: eventHandlers.combatant_add.type,
    payload: {
      combatant_id: 'b8a77a90-c3ee-499e-8261-821e7e4e30c7',
    },
  },
  {
    type: eventHandlers.combatant_add.type,
    payload: {
      combatant_id: 'bfd56576-37cf-494e-998d-4b5777c06708',
    },
  },
  {
    type: eventHandlers.combatant_remove.type,
    payload: {
      combatant_id: 'bfd56576-37cf-494e-998d-4b5777c06708',
    },
  },
  {
    type: eventHandlers.combatant_add.type,
    payload: {
      combatant_id: 'bc3ee65e-d69d-4595-a65f-7361597176b2',
    },
  },
  {
    type: eventHandlers.combatant_add.type,
    payload: {
      combatant_id: 'bfd56576-37cf-494e-998d-4b5777c06708',
    },
  },
  {
    type: eventHandlers.combatant_add.type,
    payload: {
      combatant_id: 'ecc94626-3199-4171-9a5e-d9c3c88ba723',
    },
  },

  // ROLLING INITIATIVE

  // {
  //   type: eventHandlers.combatant_roll_initiative.type,
  //   payload: {
  //     combatant_id: 'b8a77a90-c3ee-499e-8261-821e7e4e30c7',
  //     initiative: 11,
  //   },
  // },
  // {
  //   type: eventHandlers.combatant_roll_initiative.type,
  //   payload: {
  //     combatant_id: '159c9ba1-6e13-455d-81f7-af719d6de8f3',
  //     initiative: 13,
  //   },
  // },
  // {
  //   type: eventHandlers.combatant_roll_initiative.type,
  //   payload: {
  //     combatant_id: 'ecc94626-3199-4171-9a5e-d9c3c88ba723',
  //     initiative: 18,
  //   },
  // },
  // {
  //   type: eventHandlers.combatant_roll_initiative.type,
  //   payload: {
  //     combatant_id: 'bfd56576-37cf-494e-998d-4b5777c06708',
  //     initiative: 11,
  //   },
  // },

  // MANUAL REORDER w/ FOLLOW UP INITIATIVE and MOVE DOWN

  // {
  //   type: eventHandlers.combatant_move_down.type,
  //   payload: {
  //     combatant_id: 'b8a77a90-c3ee-499e-8261-821e7e4e30c7',
  //     startIndex: 0,
  //     endIndex: 1,
  //   },
  // },
  // {
  //   type: eventHandlers.combatant_move_up.type,
  //   payload: {
  //     combatant_id: 'ecc94626-3199-4171-9a5e-d9c3c88ba723',
  //     startIndex: 2,
  //     endIndex: 1,
  //   },
  // },
  // {
  //   type: eventHandlers.combatant_move_down.type,
  //   payload: {
  //     combatant_id: 'bfd56576-37cf-494e-998d-4b5777c06708',
  //     startIndex: 0,
  //     endIndex: 2,
  //   },
  // },

  // // START TURN

  // {
  //   type: eventHandlers.combatant_turn_start.type,
  //   payload: {
  //     combatant_id: 'ecc94626-3199-4171-9a5e-d9c3c88ba723',
  //   },
  // },
  // {
  //   type: eventHandlers.combatant_damage.type,
  //   payload: {
  //     combatant_id: '159c9ba1-6e13-455d-81f7-af719d6de8f3',
  //     damage: 45,
  //   },
  // },
  // {
  //   type: eventHandlers.combatant_dead.type,
  //   payload: {
  //     combatant_id: '159c9ba1-6e13-455d-81f7-af719d6de8f3',
  //   },
  // },
  // {
  //   type: eventHandlers.combatant_turn_end.type,
  //   payload: {
  //     combatant_id: 'ecc94626-3199-4171-9a5e-d9c3c88ba723',
  //   },
  // },

  // // // START NEW TURN

  // {
  //   type: eventHandlers.combatant_turn_start.type,
  //   payload: {
  //     combatant_id: 'bfd56576-37cf-494e-998d-4b5777c06708',
  //   },
  // },
  // {
  //   type: eventHandlers.combatant_damage.type,
  //   payload: {
  //     combatant_id: 'bfd56576-37cf-494e-998d-4b5777c06708',
  //     damage: 10,
  //   },
  // },
  // {
  //   type: eventHandlers.combatant_turn_end.type,
  //   payload: {
  //     combatant_id: 'bfd56576-37cf-494e-998d-4b5777c06708',
  //   },
  // },

  // // START TURN

  // {
  //   type: eventHandlers.combatant_turn_start.type,
  //   payload: {
  //     combatant_id: 'b8a77a90-c3ee-499e-8261-821e7e4e30c7',
  //   },
  // },
];

export { mockEvents };
