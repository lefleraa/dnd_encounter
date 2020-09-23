import { eventHandlers } from 'components/Encounter';
import { compactObject } from 'helpers';

const useHealthGate = ({ value, combatant_id, total_health, damage }) => {
  const { combatant_damage, combatant_heal } = eventHandlers;
  let current_health = total_health - damage;
  let isDamage = value <= 0;
  let healthChange = isDamage ? Math.floor(value) : Math.ceil(value);

  if (isDamage && Math.abs(healthChange) > current_health) {
    healthChange = -current_health;
  } else if (damage - healthChange < 0) {
    healthChange = damage;
  }

  return {
    healthChange,
    healthEvent: {
      type: healthChange < 0 ? combatant_damage.type : combatant_heal.type,
      payload: compactObject({
        combatant_id,
        damage: healthChange < 0 ? Math.abs(healthChange) : undefined,
        health: healthChange >= 0 ? Math.abs(healthChange) : undefined,
      }),
    },
  };
};

export default useHealthGate;
