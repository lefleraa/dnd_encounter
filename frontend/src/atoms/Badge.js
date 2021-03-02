import React from 'react';
import classNames from 'classnames';

const Badge = ({ variant = 'gray-darkest', inverted, children }) => {
  return (
    <div
      className={classNames(
        'Badge',
        !!inverted
          ? `u-bg-white u-color-${variant}`
          : `u-bg-${variant} u-color-white`
      )}
    >
      {children}
    </div>
  );
};

export default Badge;
