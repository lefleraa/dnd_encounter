import {
  faHelmetBattle,
  faSwords,
  faAlienMonster,
  faPaw,
} from '@fortawesome/pro-duotone-svg-icons';

const combatantTypes = {
  player: {
    code: 'player',
    description: 'Player',
    icon: faHelmetBattle,
    color: 'success',
  },
  creature: {
    code: 'creature',
    description: 'Creature',
    icon: faPaw,
    color: 'error',
  },
  monster: {
    code: 'monster',
    description: 'Monster',
    icon: faAlienMonster,
    color: 'error',
  },
  enemy: {
    code: 'enemy',
    description: 'Combatant',
    icon: faSwords,
    color: 'error',
  },
};

export default combatantTypes;
