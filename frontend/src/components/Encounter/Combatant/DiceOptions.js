import React from 'react';
import noop from 'lodash-es/noop';
import Icon from 'atoms/Icon';
import Dropdown from 'atoms/Dropdown';
import { CombatantBtn } from './fragments';
import { diceTypes } from 'data';

/////////////////////////////
// OPTION MENU
/////////////////////////////

const DiceOptions = ({ combatant = {}, actions = {} }) => {
  const { combatant_id } = combatant;
  const { rollDice = noop } = actions;

  return (
    <Dropdown
      placement="BOTTOM_RIGHT"
      components={{
        trigger: <CombatantBtn icon={diceTypes.d20.icon} />,
      }}
      menuItems={[
        {
          text: diceTypes.d4.name,
          before: (
            <Icon
              icon={diceTypes.d4.icon}
              className="u-color-white"
              fw={true}
            />
          ),
          action: () => rollDice({ combatant_id, dice: diceTypes.d4.code }),
        },
        {
          text: diceTypes.d6.name,
          before: (
            <Icon
              icon={diceTypes.d6.icon}
              className="u-color-white"
              fw={true}
            />
          ),
          action: () => rollDice({ combatant_id, dice: diceTypes.d6.code }),
        },
        {
          text: diceTypes.d8.name,
          before: (
            <Icon
              icon={diceTypes.d8.icon}
              className="u-color-white"
              fw={true}
            />
          ),
          action: () => rollDice({ combatant_id, dice: diceTypes.d8.code }),
        },
        {
          text: diceTypes.d10.name,
          before: (
            <Icon
              icon={diceTypes.d10.icon}
              className="u-color-white"
              fw={true}
            />
          ),
          action: () => rollDice({ combatant_id, dice: diceTypes.d10.code }),
        },
        {
          text: diceTypes.d12.name,
          before: (
            <Icon
              icon={diceTypes.d12.icon}
              className="u-color-white"
              fw={true}
            />
          ),
          action: () => rollDice({ combatant_id, dice: diceTypes.d12.code }),
        },
        {
          text: diceTypes.d20.name,
          before: (
            <Icon
              icon={diceTypes.d20.icon}
              className="u-color-white"
              fw={true}
            />
          ),
          action: () => rollDice({ combatant_id, dice: diceTypes.d20.code }),
        },
      ]}
    />
  );
};

export default DiceOptions;
