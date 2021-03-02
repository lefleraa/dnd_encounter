import React, { useState } from 'react';
import classNames from 'classnames';
import noop from 'lodash-es/noop';
import { Icon } from 'atoms';
import { CombatantBtnWrap } from './fragments';
import { faHeart } from '@fortawesome/pro-duotone-svg-icons';
import { faHeartBroken } from '@fortawesome/pro-regular-svg-icons';
import { useHealthGate } from 'hooks';

/////////////////////////////
// HEALTH
/////////////////////////////

const CombatantHealth = ({
  combatant = {},
  character = {},
  combatantInsights = {},
  localActions = {},
  actions = {},
}) => {
  const { combatant_id, damage } = combatant;
  const { total_health } = character;
  const { isOverkill, isDeathSaving } = combatantInsights;
  const { overkillDeath = noop, dispatchEvent = noop } = actions;
  const { setAddingDamage = noop } = localActions;

  // TRACK EVENT STATES

  const [mouseOver, setMouseOver] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [mouseMovementX, setMouseMovementX] = useState(0);

  // CONVERT DRAG DISTANCE TO HEALTH INTEGER

  const step = 8;
  const healthdiff = mouseMovementX / step;
  const { healthChange, healthEvent } = useHealthGate({
    combatant_id,
    total_health,
    damage,
    value: healthdiff <= 0 ? Math.floor(healthdiff) : Math.ceil(healthdiff),
  });

  // HANDLE MOUSE EVENTS

  const handleOnMouseMove = (e) => {
    if (mouseDown) {
      setMouseMovementX(mouseMovementX + e.movementX);
      if (Math.abs(mouseMovementX) >= step && damage <= total_health) {
        setDragging(true);
      }
    }
  };

  const handleOnMouseDown = () => {
    setMouseDown(true);
  };

  const handleOnMouseUp = () => {
    if (dragging && healthChange) {
      dispatchEvent(healthEvent, {
        callback: () => {
          overkillDeath({
            combatant_id,
            healthChange,
          });
        },
      });
    } else {
      setAddingDamage(true);
    }
    setMouseMovementX(0);
    setDragging(false);
    setMouseDown(false);
    setMouseOver(false);
  };

  const handleMouseEnter = () => {
    setMouseOver(true);
  };

  const handleMouseLeave = () => {
    setMouseMovementX(0);
    setDragging(false);
    setMouseDown(false);
    setMouseOver(false);
  };

  const percentage = isOverkill
    ? 0
    : ((total_health - damage + healthChange) / total_health) * 100;

  return (
    <div className={classNames(!!isDeathSaving && 'u-opacity-3')}>
      <CombatantBtnWrap
        disabled={!!isDeathSaving}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseMove={handleOnMouseMove}
      >
        {!!dragging && (
          <div
            className="u-pos-fixed u-opacity-0"
            style={{
              left: 0,
              top: 0,
              height: '100%',
              width: '100%',
              zIndex: 1,
            }}
          ></div>
        )}
        <div className="Combatant__Health d-flex flex-nowrap align-items-center pl-3 pr-3">
          <div className="col-auto p-0 pr-2">
            <Icon
              icon={!!isDeathSaving ? faHeartBroken : faHeart}
              className={classNames(
                !!isDeathSaving ? 'u-color-gray-light ' : 'u-color-error'
              )}
            />
          </div>
          <div className="col p-0 d-flex justify-content-center">
            {!!dragging ? (
              <p
                className={classNames(
                  'm-0 u-nowrap',
                  !!healthChange
                    ? healthChange < 0
                      ? 'u-color-error'
                      : 'u-color-confirm'
                    : 'u-color-gray'
                )}
              >
                {!!healthChange
                  ? healthChange < 0
                    ? healthChange
                    : `+${healthChange}`
                  : '0'}
              </p>
            ) : (
              <p className="m-0 u-nowrap u-color-white">
                {isOverkill ? 0 : total_health - damage} / {total_health}
              </p>
            )}
          </div>
          <div
            className={classNames(
              'Combatant__Health__Bar',
              percentage >= 66
                ? 'u-bg-confirm'
                : percentage >= 33
                ? 'u-bg-warning'
                : 'u-bg-error'
            )}
            style={{
              width: `${percentage}%`,
            }}
          ></div>
        </div>
      </CombatantBtnWrap>
    </div>
  );
};

export default CombatantHealth;
