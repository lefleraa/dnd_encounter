import React, { useState } from 'react';
import classNames from 'classnames';
import noop from 'lodash-es/noop';
import Icon from 'atoms/Icon';
import BtnWrap from 'atoms/BtnWrap';
import { faArrowRight, faCheck } from '@fortawesome/pro-regular-svg-icons';
import { faDiceD20 } from '@fortawesome/pro-light-svg-icons';

/////////////////////////////
// INITIATIVE
/////////////////////////////

const CombatantInitiative = ({
  combatant = {},
  insights = {},
  combatantInsights = {},
  dispatchEvent = noop,
  eventHandlers = {},
  localActions = {},
}) => {
  const { combatant_id, initiative } = combatant;
  const { encounterStarted } = insights;
  const {
    combatant_turn_start,
    combatant_turn_end,
    combatant_dead,
  } = eventHandlers;
  const { setEditingInitiative = noop } = localActions;
  const [hover, setHover] = useState(false);

  const { isUnset, isDead, isComplete, isActive } = combatantInsights;

  const RollIcon = () => {
    return (
      <Icon
        icon={faDiceD20}
        size="lg"
        className={classNames(!hover && 'u-opacity-7')}
      />
    );
  };

  return (
    <BtnWrap
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (isUnset || !encounterStarted) {
          setEditingInitiative(true);
        } else {
          if (!isDead) {
            dispatchEvent({
              type: isActive
                ? combatant_turn_end.type
                : combatant_turn_start.type,
              payload: { combatant_id },
            });
          }
        }
      }}
    >
      <div
        className={classNames(
          'Combatant__Initiative',
          isDead && 'Combatant__Initiative__dead',
          isComplete && 'Combatant__Initiative__complete',
          isUnset && 'Combatant__Initiative__null'
        )}
      >
        <div className="content d-flex align-items-center justify-content-center u-color-white">
          {isDead ? (
            <Icon icon={combatant_dead.historyLog.icon} />
          ) : !!hover ? (
            <>
              {!!(isUnset || !encounterStarted) ? (
                <RollIcon />
              ) : isActive ? (
                <Icon icon={faCheck} />
              ) : (
                <Icon icon={faArrowRight} />
              )}
            </>
          ) : (
            <>
              {!!isUnset ? (
                <RollIcon />
              ) : isComplete ? (
                <Icon icon={faCheck} />
              ) : (
                String(initiative).padStart(2, '0')
              )}
            </>
          )}
        </div>
      </div>
    </BtnWrap>
  );
};

export default CombatantInitiative;
