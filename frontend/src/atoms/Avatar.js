import React from 'react';
import classNames from 'classnames';
import cleanProps from 'clean-react-props';

const Avatar = ({ className, avatar, size = 50, circle, ...rest }) => {
  return (
    <div
      className={classNames('Avatar', !!circle && 'Avatar__circle', className)}
      style={{
        backgroundImage: `url(${avatar})`,
        width: size,
        maxWidth: size,
        minWidth: size,
        height: size,
        maxHeight: size,
        minHeight: size,
      }}
      {...cleanProps(rest)}
    ></div>
  );
};

export default Avatar;
