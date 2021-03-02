import React from 'react';
import classNames from 'classnames';
import { Icon, BtnWrap } from 'atoms';

/////////////////////////////
// FRAGMENTS
/////////////////////////////

export const CombatantBtnWrap = ({
  children,
  className,
  disabled,
  ...rest
}) => {
  return (
    <BtnWrap
      {...rest}
      display="inline-flex"
      className={classNames(
        'Combatant__Btn__Wrap align-items-center',
        !!disabled && 'Combatant__Btn__Wrap__disabled',
        className
      )}
    >
      {children}
    </BtnWrap>
  );
};

export const CombatantBtn = ({
  icon,
  className,
  subtle = true,
  error = false,
  confirm = false,
  disabled = false,
  ...rest
}) => {
  return (
    <CombatantBtnWrap className={className} disabled={disabled} {...rest}>
      <div
        className={classNames(
          'Combatant__Btn d-flex align-items-center justify-content-center',
          !!subtle && 'Combatant__Btn__subtle',
          !!error && 'Combatant__Btn__error',
          !!confirm && 'Combatant__Btn__confirm',
          !!disabled && 'Combatant__Btn__disabled'
        )}
      >
        <Icon icon={icon} />
      </div>
    </CombatantBtnWrap>
  );
};
