import React, { useState, useEffect, useReducer } from 'react';
import noop from 'lodash-es/noop';
import remove from 'lodash-es/remove';
import concat from 'lodash-es/concat';
import cloneDeep from 'lodash-es/cloneDeep';
import { Modal } from 'components';
import { Btn } from 'atoms';
import { v4 as uuidv4 } from 'uuid';

const ConfirmModal = ({
  show,
  onConfirm = noop,
  onExited = noop,
  onHide = noop,
  confirmationModal = {},
  ...rest
}) => {
  const {
    id,
    variant = 'warning',
    icon,
    preTitle,
    title = 'Are You Sure?',
    cancelText = 'Nevermind',
    confirmText = "I'm Sure",
    text,
    detail,
    action = noop,
  } = confirmationModal;
  const [isOpen, setIsOpen] = useState(show);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setIsOpen(!!show);
  }, [show, id]);

  const handleOnConfirm = () => {
    setConfirmed(true);
    setIsOpen(false);
    onConfirm(id);
  };

  const handleOnExited = () => {
    if (confirmed) {
      action();
    }
    setConfirmed(false);
    onExited(id);
  };

  const handleOnHide = () => {
    setIsOpen(false);
    onHide(id);
  };

  return (
    <Modal
      {...rest}
      show={isOpen}
      onHide={handleOnHide}
      onExited={handleOnExited}
      dimensions={{
        width: 400,
      }}
    >
      <Modal.Header>
        <Modal.TitleLockup
          icon={icon}
          preTitle={preTitle}
          title={title}
          color={variant}
        />
      </Modal.Header>
      {!!text && (
        <Modal.Body>
          <p className="m-0 u-text-center u-color-gray-lighter">{text}</p>
          {!!detail && (
            <p className="mb-0 mt-3 u-text-center u-text-italic small u-color-gray-light">
              {detail}
            </p>
          )}
        </Modal.Body>
      )}
      <Modal.Footer>
        <Btn variant="subtle" className="mr-1" onClick={() => setIsOpen(false)}>
          {cancelText}
        </Btn>
        <Btn
          variant={variant === 'error' ? 'error' : 'primary'}
          onClick={handleOnConfirm}
          autoFocus={true}
        >
          {confirmText}
        </Btn>
      </Modal.Footer>
    </Modal>
  );
};

const initConfirmationModals = {
  list: [],
};

function modalReducer(state, action) {
  const { type, payload = {} } = action;
  let list = cloneDeep(state.list);

  switch (type) {
    case 'resetModals':
      return { ...initConfirmationModals };
    case 'pushConfirmationModal':
      list = concat(list, [
        {
          ...payload,
          id: uuidv4(),
        },
      ]);
      return {
        ...state,
        list,
      };
    case 'clearConfirmationModal':
      remove(list, (modal) => {
        return modal.id === payload;
      });
      return {
        ...state,
        list,
      };
    default:
      return state;
  }
}

const ConfirmationProvider = ({ children }) => {
  const [modals, dispatchModals] = useReducer(
    modalReducer,
    initConfirmationModals
  );

  const { list = [] } = modals;
  const confirmationModal = list[0];

  const pushConfirmationModal = (modal) => {
    dispatchModals({
      type: 'pushConfirmationModal',
      payload: modal,
    });
  };

  const clearConfirmationModal = (id) => {
    dispatchModals({
      type: 'clearConfirmationModal',
      payload: id,
    });
  };

  return (
    <>
      {children({
        actions: {
          pushConfirmationModal,
          clearConfirmationModal,
        },
      })}
      <ConfirmModal
        show={!!confirmationModal}
        onExited={clearConfirmationModal}
        confirmationModal={confirmationModal}
      />
    </>
  );
};

export default ConfirmationProvider;
