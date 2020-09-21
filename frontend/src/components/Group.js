import React, { useState, useEffect, forwardRef } from 'react';
import noop from 'lodash-es/noop';
import classNames from 'classnames';
import Collapsible from 'react-collapsible';

////////////////////////
// GROUP
////////////////////////

const Group = forwardRef(
  (
    {
      open: isOpen,
      collapsible = true,
      openByDefault,
      transitionTime = 150,
      overflowWhenOpen = 'visible',
      onClose = noop,
      onOpening = noop,
      className,
      style,
      children,
      lazyRender,
      ...rest
    },
    ref
  ) => {
    const [open, setOpen] = useState(openByDefault);
    const [concealed, setConcealed] = useState(false);

    useEffect(() => {
      setOpen(!!isOpen);
    }, [isOpen]);

    return (
      <div className={classNames('d-block Group', className)} style={style}>
        {!!collapsible ? (
          <Collapsible
            {...rest}
            onClose={() => {
              if (!!lazyRender) {
                setConcealed(true);
              }
              onClose();
            }}
            onOpening={() => {
              if (!!lazyRender) {
                setConcealed(false);
              }
              onOpening();
            }}
            ref={ref}
            lazyRender={lazyRender}
            open={open}
            transitionTime={transitionTime}
            overflowWhenOpen={overflowWhenOpen}
            easing="ease-in-out"
          >
            {!concealed && children}
          </Collapsible>
        ) : (
          children
        )}
      </div>
    );
  }
);

Group.displayName = 'Group';
export default Group;
