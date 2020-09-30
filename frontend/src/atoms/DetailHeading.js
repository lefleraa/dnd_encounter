import React from 'react';
import classNames from 'classnames';

const DetailHeading = ({ className, children, style, ...rest }) => {
  return (
    <p
      className={classNames(
        'DetailHeading m-0 u-text-uppercase small u-text-medium',
        className
      )}
      style={{
        letterSpacing: 3,
        ...style,
      }}
      {...rest}
    >
      {children}
    </p>
  );
};

export default DetailHeading;
