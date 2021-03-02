import React, { useEffect, useState, useRef, useCallback } from 'react';
import classNames from 'classnames';
import cleanprops from 'clean-react-props';
import { Icon, BtnWrap } from 'atoms';
import { trapFocus } from 'helpers';
import { faTimes } from '@fortawesome/pro-light-svg-icons';

const defaultProps = {
  isOpen: false,
  width: 'large',
  placement: 'right',
};

const IconColumn = ({ onHide, placement }) => {
  return (
    <div
      className={classNames(
        'col-auto',
        placement === 'right' ? 'pr-0 pl-5' : 'pl-0 pr-5'
      )}
    >
      <BtnWrap onClick={typeof onHide === 'function' ? () => onHide() : null}>
        <Icon icon={faTimes} size="lg" className="u-color-gray" />
      </BtnWrap>
    </div>
  );
};

let drawerTrigger = null;
let drawerFocusCleanUp = null;

const Drawer = ({ onHide, isOpen, children, placement, width, ...rest }) => {
  const [showOverlayBg, setShowOverlayBg] = useState(isOpen);
  const panel = useRef(null);
  const panelBody = useRef(null);

  const escEvent = useCallback((event) => {
    if (event.keyCode === 27) {
      onClose();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escEvent, false);
    return () => {
      onClose();
      document.removeEventListener('keydown', escEvent, false);
    };
  }, []);

  function onShow() {
    const { loopFocus, focusCleanUp } = trapFocus();
    drawerFocusCleanUp = focusCleanUp;

    document.body.style.overflow = 'hidden';

    // store previous focused node
    if (!drawerTrigger) {
      drawerTrigger = document.activeElement;
    }

    panelBody.current.focus();
    panel.current.scrollTop = 0;

    loopFocus({
      el: panelBody.current,
      focusElement: panelBody.current,
    });
  }

  function onClose() {
    document.body.style.overflow = 'auto';

    if (!!drawerTrigger) {
      drawerTrigger.focus();
      drawerTrigger = null;
    }

    if (!!drawerFocusCleanUp) {
      drawerFocusCleanUp();
    }

    if (typeof onHide === 'function') {
      onHide();
    }
  }

  useEffect(() => {
    setTimeout(
      () => {
        setShowOverlayBg(isOpen);
      },
      !!isOpen ? 0 : 200 // duration matches css transition duration
    );
    if (!!isOpen) {
      onShow();
    } else {
      onClose();
    }
  }, [isOpen]);

  return (
    <>
      {!!showOverlayBg && (
        <div
          className={classNames(
            'Drawer--BgOverlay',
            !!isOpen && 'Drawer--BgOverlay--show'
          )}
          onClick={onClose}
        ></div>
      )}
      <div
        {...cleanprops(rest)}
        className={classNames(
          'Drawer',
          `Drawer--${width}`,
          !!isOpen && 'Drawer--open',
          `Drawer--${placement}`
        )}
        role="dialog"
        tabIndex="-1"
        ref={panel}
      >
        <div
          role="document"
          ref={panelBody}
          tabIndex="0"
          className="u-border-0 p-5"
          style={{ boxShadow: 'none', outline: 'none' }}
        >
          <div className="d-flex">
            {placement === 'left' && (
              <IconColumn onHide={onHide} placement={placement} />
            )}
            <div className="col p-0">{children}</div>
            {placement === 'right' && (
              <IconColumn onHide={onHide} placement={placement} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Drawer.defaultProps = defaultProps;

export default Drawer;
