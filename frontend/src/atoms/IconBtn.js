import React from 'react';
import classNames from 'classnames';
import BtnWrap from 'atoms/BtnWrap';
import IconSquare from 'atoms/IconSquare';

const IconBtn = ({ icon, size, className, children, ...rest }) => {
  return (
    <BtnWrap className={classNames('IconBtn', className)} {...rest}>
      <IconSquare icon={icon} size={size}>
        {children}
      </IconSquare>
    </BtnWrap>
  );
};

export default IconBtn;
