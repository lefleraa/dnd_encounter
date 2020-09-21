import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';

const Scrollbars = forwardRef((props, ref) => {
  return (
    <PerfectScrollbar
      ref={ref}
      {...props}
      className={classNames('u-pos-absolute', props.className)}
    >
      {props.children || ''}
    </PerfectScrollbar>
  );
});

export default Scrollbars;
