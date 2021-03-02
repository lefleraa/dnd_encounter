import React from 'react';
import classNames from 'classnames';
import { Icon } from 'atoms';

const IconSquare = ({
  icon,
  iconSize,
  size = 40,
  children,
  className,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        'IconSquare d-inline-flex align-items-center justify-content-center',
        className
      )}
      style={{
        width: size,
        height: size,
      }}
      {...rest}
    >
      {!!children ? children : <Icon icon={icon} size={iconSize} />}
    </div>
  );
};

export default IconSquare;
