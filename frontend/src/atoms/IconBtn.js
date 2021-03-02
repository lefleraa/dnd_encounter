import React from 'react';
import classNames from 'classnames';
import { BtnWrap, IconSquare } from 'atoms';

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
