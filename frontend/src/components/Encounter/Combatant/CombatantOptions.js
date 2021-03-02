import React from 'react';
import noop from 'lodash-es/noop';
import { Icon, Dropdown } from 'atoms';
import { CombatantBtn } from './fragments';
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons';

/////////////////////////////
// OPTION MENU
/////////////////////////////

const CombatantOptions = ({
  combatant = {},
  eventHandlers = {},
  dispatchEvent = noop,
  localActions = {},
  combatantInsights = {},
}) => {
  const { combatant_id } = combatant;
  const { setEditingInitiative = noop } = localActions;
  const {
    combatant_fled,
    combatant_remove,
    combatant_dead,
    combatant_turn_start,
    combatant_roll_initiative,
  } = eventHandlers;

  const { isUnset, isActive, isDead, isComplete } = combatantInsights;

  return (
    <Dropdown
      placement="BOTTOM_RIGHT"
      components={{
        trigger: <CombatantBtn icon={faEllipsisH} />,
      }}
      menuItems={[
        {
          hidden: isUnset || isActive || isDead,
          text: `Start Turn`,
          before: (
            <Icon
              icon={combatant_turn_start.historyLog.icon}
              className={`u-color-${combatant_turn_start.historyLog.iconColor}`}
              fw={true}
            />
          ),
          action: () =>
            dispatchEvent({
              type: combatant_turn_start.type,
              payload: {
                combatant_id,
              },
            }),
        },
        {
          hidden: isDead || isComplete,
          text: isUnset ? `Roll Initiative` : `Re-Roll Initiative`,
          before: (
            <Icon
              icon={combatant_roll_initiative.historyLog.icon}
              className={`u-color-${combatant_roll_initiative.historyLog.iconColor}`}
              fw={true}
            />
          ),
          action: () => setEditingInitiative(true),
        },
        {
          hidden: isUnset || isDead || isComplete,
          text: `Flee`,
          before: (
            <Icon
              icon={combatant_fled.historyLog.icon}
              className={`u-color-${combatant_fled.historyLog.iconColor}`}
              fw={true}
            />
          ),
          action: () =>
            dispatchEvent({
              type: combatant_fled.type,
              payload: {
                combatant_id,
              },
            }),
        },
        {
          hidden: isDead,
          text: `Dead`,
          before: (
            <Icon
              icon={combatant_dead.historyLog.icon}
              className={`u-color-${combatant_dead.historyLog.iconColor}`}
              fw={true}
            />
          ),
          action: () =>
            dispatchEvent({
              type: combatant_dead.type,
              payload: {
                combatant_id,
              },
            }),
        },
        {
          text: `Remove`,
          before: (
            <Icon
              icon={combatant_remove.historyLog.icon}
              className={`u-color-${combatant_remove.historyLog.iconColor}`}
              fw={true}
            />
          ),
          action: () =>
            dispatchEvent({
              type: combatant_remove.type,
              payload: {
                combatant_id,
              },
            }),
        },
      ]}
    />
  );
};

export default CombatantOptions;
