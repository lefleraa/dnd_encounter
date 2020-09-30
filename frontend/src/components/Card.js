import React from 'react';
import classNames from 'classnames';

////////////////////////
// Card
////////////////////////

const Card = ({ children, className }) => {
  return <div className={classNames('Card', className)}>{children}</div>;
};

export default Card;
