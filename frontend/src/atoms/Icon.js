import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Icon = ({ fw, className, ...rest }) => {
  return (
    <FontAwesomeIcon
      className={classNames('Icon', className)}
      fixedWidth={fw}
      {...rest}
    />
  );
};

export default Icon;
