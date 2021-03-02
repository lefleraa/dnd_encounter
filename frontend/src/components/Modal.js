import React from 'react';
import classNames from 'classnames';
import BsModal from 'react-bootstrap/Modal';
import { DetailHeading, BtnWrap, Icon } from 'atoms';
import { faTimes } from '@fortawesome/pro-light-svg-icons';

const Modal = ({
  children,
  dimensions,
  dismissBtn = true,
  centered = false,
  className,
  onHide,
  ...rest
}) => {
  return (
    <BsModal
      className={classNames(
        !!(centered || dimensions) && 'modal-center',
        className
      )}
      onHide={onHide}
      {...rest}
    >
      <ModalDismiss
        className="animate__animated animate__fadeInDown animate__fast"
        style={{ animationDelay: '400ms' }}
        onClick={onHide}
      />
      <div
        className="animate__animated animate__fadeIn"
        style={{ animationDelay: '200ms' }}
      >
        <div
          style={{
            ...dimensions,
          }}
          style={!!dimensions ? { ...dimensions } : undefined}
          className={classNames(
            'u-pos-relative u-z-index-1',
            !!dimensions && 'd-flex flex-column justify-content-between'
          )}
        >
          {children}
        </div>
      </div>
    </BsModal>
  );
};

const ModalHeader = ({ children, className, ...rest }) => {
  return (
    <BsModal.Header
      className={classNames(
        'justify-content-center align-items-center p-5',
        className
      )}
      {...rest}
    >
      {children}
    </BsModal.Header>
  );
};

const ModalDismiss = ({ className, style, ...rest }) => {
  return (
    <BtnWrap
      className={classNames(
        className,
        'ModalDismiss u-pos-absolute u-z-index-2'
      )}
      style={{ ...style, top: 10, right: 10 }}
      {...rest}
    >
      <div
        className={classNames(
          'u-bg-gray-dark u-color-gray-light u-bg-hover-error u-color-hover-white',
          'd-flex align-items-center justify-content-center u-border-radius-circle'
        )}
        style={{ width: 25, height: 25 }}
      >
        <Icon icon={faTimes} fw={true} />
      </div>
    </BtnWrap>
  );
};

const ModalTitle = ({ children, className, ...rest }) => {
  return (
    <BsModal.Title className={classNames(className)} {...rest}>
      {children}
    </BsModal.Title>
  );
};

const ModalPreTitle = ({ children, ...rest }) => {
  return <DetailHeading {...rest}>{children}</DetailHeading>;
};

const ModalTitleLockup = ({
  before,
  icon,
  preTitle,
  title,
  color,
  iconColor = 'gray',
}) => {
  return (
    <div className="d-inline-flex align-items-center">
      {!!before && <div className="mr-3">{before}</div>}
      {!!icon && (
        <Icon
          icon={icon}
          size="2x"
          className={classNames('mr-3', `u-color-${iconColor}`)}
        />
      )}
      <div>
        {!!preTitle && <Modal.PreTitle>{preTitle}</Modal.PreTitle>}
        <Modal.Title className={`u-color-${color}`}>{title}</Modal.Title>
      </div>
    </div>
  );
};

const ModalBody = ({ children, className, ...rest }) => {
  return (
    <BsModal.Body
      className={classNames('pt-0 pb-0 pl-5 pr-5', className)}
      {...rest}
    >
      {children}
    </BsModal.Body>
  );
};

const ModalFooter = ({ children, className, ...rest }) => {
  return (
    <BsModal.Footer
      className={classNames(
        'justify-content-center align-items-center p-5',
        className
      )}
      {...rest}
    >
      {children}
    </BsModal.Footer>
  );
};

Modal.Header = ModalHeader;
Modal.Dismiss = ModalDismiss;
Modal.PreTitle = ModalPreTitle;
Modal.Title = ModalTitle;
Modal.TitleLockup = ModalTitleLockup;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
