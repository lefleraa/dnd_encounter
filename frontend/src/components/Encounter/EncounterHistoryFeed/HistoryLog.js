import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import BtnWrap from 'atoms/BtnWrap';
import DetailHeading from 'atoms/DetailHeading';
import Icon from 'atoms/Icon';
import IconSquare from 'atoms/IconSquare';
import Avatar from 'atoms/Avatar';
import { EncounterContext } from '../EncounterProvider';
import {
  faHistory,
  faCertificate,
  faMinus,
} from '@fortawesome/pro-regular-svg-icons';

const HistoryLogDivider = ({ className, ...rest }) => {
  return (
    <div
      className={classNames(
        'HistoryLog__Divider mt-1 mb-2',
        'animate__animated animate__fadeIn animate__slow',
        className
      )}
      {...rest}
    >
      <IconSquare size={32} className="u-bg-none u-opacity-5">
        <Icon icon={faMinus} rotation={90} size="sm" />
      </IconSquare>
    </div>
  );
};

const HistoryLog = ({
  historyLog = {},
  active,
  components = {},
  style,
  onClick,
}) => {
  const [hover, setHover] = useState(false);
  const encounterContext = useContext(EncounterContext);
  const { encounter = {} } = encounterContext;
  const { helpers = {} } = encounter;

  const {
    msg,
    before,
    after,
    icon,
    iconColor,
    showAvatar,
    dividerAfter,
    dividerBefore,
    disabled,
    heading,
    metaData = {},
  } = historyLog;
  const { event = {}, bypass } = metaData;
  const { payload = {} } = event;

  const combatant = helpers.getCombatantById(payload.combatant_id);
  const character = helpers.getCharacterById(payload.combatant_id);
  const { isEnemy } = helpers.getCombatantInsights({
    combatant,
    character,
  });

  const { avatar } = character || {};

  const { before: beforeComponent, after: afterComponent } = components;

  return (
    <>
      {!!dividerBefore && <HistoryLogDivider />}
      <BtnWrap
        block
        className={classNames(
          'HistoryLog mb-1',
          !!(hover && !disabled) && 'HistoryLog__hover',
          !!(active && !disabled) && 'HistoryLog__active',
          !!(bypass && !active) && 'HistoryLog__faded'
        )}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        disabled={disabled}
        onClick={!!disabled ? () => {} : onClick}
        style={style}
      >
        <div className="d-flex align-items-center u-width-p-12">
          {!!beforeComponent && (
            <div className="col-auto p-0 pr-2 u-color-white">
              {beforeComponent}
            </div>
          )}
          {!heading && (
            <div className="col-auto d-flex align-items-center pl-0 HistoryLog__Icon">
              {!!(hover && !disabled && !active) ? (
                <IconSquare size={32}>
                  <Icon
                    icon={faHistory}
                    fw={true}
                    flip={!!bypass ? 'horizontal' : null}
                    className="u-color-white"
                    size="sm"
                  />
                </IconSquare>
              ) : !!showAvatar ? (
                <Avatar avatar={avatar} circle={isEnemy} size={32} />
              ) : (
                <IconSquare size={32}>
                  <Icon
                    icon={icon || faCertificate}
                    fw={true}
                    className={`u-color-${!!iconColor ? iconColor : 'primary'}`}
                    size="sm"
                  />
                </IconSquare>
              )}
            </div>
          )}
          <div className="col p-0 u-color-white HistoryLog__Text">
            {!!before && (
              <div className="small u-text-italic u-text-normal u-color-gray-light">
                <span className="small">{before}</span>
              </div>
            )}
            {!!heading ? (
              <DetailHeading className="m-0">{heading}</DetailHeading>
            ) : (
              <>
                {!!(msg || character) ? (
                  <div className="u-text-normal small">
                    {!!msg ? msg : character.name}
                  </div>
                ) : (
                  <div className="u-text-normal small">
                    Loading character...
                  </div>
                )}
                {!!after && (
                  <div className="small u-text-italic u-text-normal u-color-gray-light">
                    <span className="small">{after}</span>
                  </div>
                )}
              </>
            )}
          </div>
          {!!afterComponent && (
            <div className="col-auto p-0 pl-2 u-color-white">
              {afterComponent}
            </div>
          )}
        </div>
      </BtnWrap>
      {!!dividerAfter && <HistoryLogDivider />}
    </>
  );
};

export { HistoryLogDivider };
export default HistoryLog;
