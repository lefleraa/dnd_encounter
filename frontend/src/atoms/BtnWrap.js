import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import cleanProps from 'clean-react-props';
import { Link } from 'react-router-dom';

const propTypes = {
  type: PropTypes.oneOf(['button', 'reset', 'submit', null]),
  margin: PropTypes.string,
  disabled: PropTypes.bool,
  display: PropTypes.oneOf([
    'inline',
    'inline-block',
    'block',
    'flex',
    'inline-flex',
    null,
  ]),
};

const defaultProps = {
  type: 'button',
  margin: 'm-0',
  disabled: false,
  display: 'inline-block',
};

const BtnWrap = forwardRef(
  (
    {
      className,
      style,
      children,
      type,
      margin,
      disabled,
      block,
      display = 'inline-block',
      label,
      ...rest
    },
    ref
  ) => {
    const Tag = rest.to
      ? Link
      : rest.href
      ? 'a'
      : rest.naked
      ? 'span'
      : rest.onClick
      ? 'button'
      : 'span';

    const classes = classNames(
      'u-pos-vertical-align u-cursor-default',
      'u-text-left u-border-0',
      display && !block && `d-${display}`,
      block && `d-block u-width-p-12`,
      disabled && 'disabled',
      margin,
      className
    );

    return (
      <Tag
        aria-label={label}
        type={type}
        className={classes}
        disabled={disabled}
        aria-disabled={disabled}
        style={{
          ...style,
          outline: 'none',
          boxShadow: 'none',
          background: 'none',
          padding: 0,
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }}
        {...cleanProps(rest)}
        ref={ref}
      >
        {children}
      </Tag>
    );
  }
);

BtnWrap.displayName = 'BtnWrap';
BtnWrap.propTypes = propTypes;
BtnWrap.defaultProps = defaultProps;

export default BtnWrap;
