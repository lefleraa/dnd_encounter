import { DiceRoll } from 'rpg-dice-roller';

const rollD = (r = 'd20') => {
  const roll = new DiceRoll(r);
  return roll;
};

export default rollD;
