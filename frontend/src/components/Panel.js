import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col } from 'react-bootstrap';
import Scrollbars from 'components/Scrollbars';

const propTypes = {
  direction: PropTypes.oneOf(['column', 'row', null]),
  size: PropTypes.number,
  grid: PropTypes.number,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
  auto: PropTypes.bool,
  scroll: PropTypes.bool,
};

const defaultProps = {
  direction: 'column',
  auto: false,
  scroll: false,
};

const Panel = ({
  className,
  children,
  direction,
  size,
  grid,
  alignItems,
  justifyContent,
  auto,
  scroll,
  ...props
}) => {
  const isRow = direction === 'row';
  const classes = classNames(
    'd-flex flex-nowrap p-0 u-overflow-hidden u-pos-relative',
    !!isRow ? 'flex-row' : 'flex-column',
    !!alignItems && 'align-items-' + alignItems,
    !!justifyContent && 'justify-content-' + justifyContent,
    !!direction ? 'flex-' + direction : 'flex-column',
    className
  );

  let sizeNum = auto ? 'auto' : size ? undefined : grid ? grid : undefined;

  return (
    <Col
      {...props}
      xs={sizeNum}
      className={classes}
      style={{
        maxWidth: !isRow ? size : undefined,
        minWidth: !isRow ? size : undefined,
        maxHeight: isRow ? size : undefined,
        minHeight: isRow ? size : undefined,
      }}
    >
      {!!scroll ? (
        <Scrollbars className={classes}>{children}</Scrollbars>
      ) : (
        children
      )}
    </Col>
  );
};

Panel.displayName = 'Panel';
Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;

export default Panel;
