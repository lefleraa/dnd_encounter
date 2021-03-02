import React, { forwardRef, useEffect, useRef, useCallback } from 'react';
import cleanProps from 'clean-react-props';
import classNames from 'classnames';
import { ToggleLayer, anchor } from 'react-laag';
import { Btn, BtnWrap } from 'atoms';
import { trapFocus } from 'helpers';

const Trigger = forwardRef(
  (
    { triggerComponent, caret, toggle, className, block, open, close, ...rest },
    ref
  ) => {
    return (
      <>
        {typeof triggerComponent === 'function' ? (
          triggerComponent({ open, close, toggle }, ref)
        ) : (
          <BtnWrap
            {...rest}
            ref={ref}
            onClick={toggle}
            className={classNames(
              'Dropdown--Trigger p-0',
              !!block && `d-block u-width-p-12`,
              className
            )}
            isMenu={true}
          >
            {!!triggerComponent ? (
              triggerComponent
            ) : (
              <Btn text="Dropdown" caret={caret} block={block} />
            )}
          </BtnWrap>
        )}
      </>
    );
  }
);

const MenuHeading = ({ children }) => {
  if (!children) {
    return null;
  }
  return (
    <div className="Dropdown--Menu--Item--Heading">
      <h6 className="u-mb-0">{children}</h6>
    </div>
  );
};

const MenuItem = ({
  before,
  after,
  text,
  href,
  action,
  active,
  disabled = false,
  i,
  children,
  className,
  close,
  onClick,
  closeOnItemClick,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        'Dropdown--Menu--Item',
        !!disabled && 'Dropdown--Menu--Item--disabled',
        className
      )}
      {...cleanProps(rest)}
    >
      <BtnWrap
        href={!!disabled ? null : href}
        onClick={
          !!disabled
            ? null
            : typeof onClick === 'function'
            ? () => {
                onClick();
                if (!!closeOnItemClick) {
                  close();
                }
              }
            : typeof action === 'function'
            ? () => {
                action();
                if (!!closeOnItemClick) {
                  close();
                }
              }
            : null
        }
        className={classNames(
          'Dropdown--Menu--Item--Inner',
          !!active && 'active',
          !!disabled && 'disabled'
        )}
      >
        <div className="d-flex align-items-center">
          {!!before && <div className="col-auto pl-0 pr-3">{before}</div>}
          <div className="col p-0">{children || text}</div>
          {!!after && <div className="col-auto pr-0 pl-3">{after}</div>}
        </div>
      </BtnWrap>
    </div>
  );
};

let menuTrigger = null;
let menuFocusCleanUp = null;

const Menu = forwardRef(
  (
    {
      style,
      menuItems,
      close,
      className,
      contentComponent,
      overflowAuto,
      closeOnItemClick,
      ...rest
    },
    ref
  ) => {
    const menu = useRef(null);

    const escEvent = useCallback((event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    }, []);

    function onShow() {
      const { loopFocus, focusCleanUp } = trapFocus();
      menuFocusCleanUp = focusCleanUp;

      // store previous focused node
      if (!menuTrigger) {
        menuTrigger = document.activeElement;
      }

      // Wrap in a setTimeout to ensure the
      // menu is in position before focusing.
      // Prevents a terribble scroll to bottom
      // of page on menu display.
      setTimeout(() => {
        menu.current.focus();
        loopFocus({
          el: menu.current,
          focusElement: menu.current,
        });
      }, 1);
    }

    function onClose() {
      if (!!menuTrigger) {
        menuTrigger.focus();
        menuTrigger = null;
      }

      if (!!menuFocusCleanUp) {
        menuFocusCleanUp();
      }

      if (typeof close === 'function') {
        close();
      }
    }

    useEffect(() => {
      onShow();
      document.addEventListener('keydown', escEvent, false);
      return () => {
        onClose();
        document.removeEventListener('keydown', escEvent, false);
      };
    }, []);

    return (
      <div
        ref={ref}
        style={{ ...style }}
        {...cleanProps(rest)}
        className={classNames(
          'Dropdown--Menu u-z-index-10',
          !!overflowAuto && 'u-overflow-auto',
          className
        )}
      >
        <div
          ref={menu}
          tabIndex="0"
          className="Dropdown--Menu--Inner"
          style={{
            border: 0,
            outline: 'none',
            boxShadow: 'none',
          }}
        >
          {typeof contentComponent === 'function' ? (
            <>{contentComponent({ close: onClose })}</>
          ) : (
            <>
              {!!contentComponent ? (
                contentComponent
              ) : (
                <>
                  {!!(menuItems && menuItems.length) &&
                    menuItems.map((item, i) => {
                      if (item.hidden) {
                        return null;
                      }
                      return (
                        <MenuItem
                          i={i}
                          key={i}
                          {...item}
                          closeOnItemClick={closeOnItemClick}
                          close={onClose}
                        />
                      );
                    })}
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);

const Dropdown = ({
  components = {},
  caret = 'down',
  placement = 'BOTTOM_LEFT',
  autoAdjust = true,
  snapToAnchor = false,
  triggerOffset = 3,
  closeOnOutsideClick = true,
  closeOnItemClick = true,
  preferX = 'left',
  preferY = 'bottom',
  container,
  block,
  menuItems,
  children: MenuChildren,
  className,
  menuClassName,
  fixed = true,
  dimensions = {},
  ...rest
}) => {
  return (
    <ToggleLayer
      container={() => document.querySelector(container)}
      placement={{
        anchor: anchor[placement],
        autoAdjust,
        triggerOffset,
        snapToAnchor,
        layerDimensions: dimensions,
      }}
      fixed={fixed}
      closeOnOutsideClick={closeOnOutsideClick}
      preferX={preferX}
      preferY={preferY}
      renderLayer={({ layerProps, isOpen, close }) => {
        return (
          isOpen && (
            <Menu
              ref={layerProps.ref}
              menuItems={menuItems}
              close={close}
              contentComponent={components.content}
              overflowAuto={!!dimensions.height}
              closeOnItemClick={closeOnItemClick}
              className={menuClassName}
              style={{
                ...layerProps.style,
              }}
            />
          )
        );
      }}
    >
      {({ toggle, close, open, triggerRef }) => {
        return (
          <Trigger
            triggerComponent={components.trigger}
            ref={triggerRef}
            toggle={toggle}
            close={close}
            open={open}
            caret={caret}
            block={block}
            className={className}
            {...rest}
          />
        );
      }}
    </ToggleLayer>
  );
};

Dropdown.MenuItem = MenuItem;
Dropdown.MenuHeading = MenuHeading;

export default Dropdown;
