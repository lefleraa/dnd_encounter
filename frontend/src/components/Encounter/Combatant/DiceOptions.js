import React from 'react';
import noop from 'lodash-es/noop';
import Icon from 'atoms/Icon';
import Dropdown from 'atoms/Dropdown';
import { CombatantBtn } from './fragments';
import {
  faDiceD4,
  faDiceD6,
  faDiceD8,
  faDiceD10,
  faDiceD12,
  faDiceD20,
} from '@fortawesome/pro-light-svg-icons';

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
        trigger: <CombatantBtn icon={faDiceD20} />,
      }}
      menuItems={[
        {
          text: `D4`,
          before: <Icon icon={faDiceD4} className="u-color-white" fw={true} />,
          action: () => rollDice({ combatant_id, dice: 'd4' }),
        },
        {
          text: `D6`,
          before: <Icon icon={faDiceD6} className="u-color-white" fw={true} />,
          action: () => rollDice({ combatant_id, dice: 'd6' }),
        },
        {
          text: `D8`,
          before: <Icon icon={faDiceD8} className="u-color-white" fw={true} />,
          action: () => rollDice({ combatant_id, dice: 'd8' }),
        },
        {
          text: `D10`,
          before: <Icon icon={faDiceD10} className="u-color-white" fw={true} />,
          action: () => rollDice({ combatant_id, dice: 'd10' }),
        },
        {
          text: `D12`,
          before: <Icon icon={faDiceD12} className="u-color-white" fw={true} />,
          action: () => rollDice({ combatant_id, dice: 'd12' }),
        },
        {
          text: `D20`,
          before: <Icon icon={faDiceD20} className="u-color-white" fw={true} />,
          action: () => rollDice({ combatant_id, dice: 'd20' }),
        },
      ]}
    />
  );
};

export default DiceOptions;
