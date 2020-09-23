import React, { useState, useEffect } from 'react';
import noop from 'lodash-es/noop';
import Icon from 'atoms/Icon';
import { faDiceD20 } from '@fortawesome/pro-light-svg-icons';
import { faCheck } from '@fortawesome/pro-regular-svg-icons';
import Btn from 'atoms/Btn';
import Modal from 'components/Modal';
import FormControl from 'react-bootstrap/FormControl';

const InitiativeInput = ({
  value = '00',
  onChange = noop,
  onKeyPress = noop,
}) => {
  return (
    <div className="InputModal__Input">
      <FormControl
        value={
          !!(value !== undefined || value !== null)
            ? String(value).padStart(2, '0')
            : '00'
        }
        onChange={onChange}
        onKeyPress={onKeyPress}
        aria-label="Initiative Input"
        autoFocus={true}
        type="number"
      />
    </div>
  );
};

const InitiativeModal = ({ show, onHide, character = {}, onSubmit = noop }) => {
  const { name } = character;
  const [changed, setChanged] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [initiative, setInitiative] = useState();

  useEffect(() => {
    setIsOpen(!!show);
  }, [show]);

  const handleSubmit = () => {
    if (initiative && changed) {
      onSubmit(initiative);
    }
    setChanged(false);
    setInitiative();
    onHide();
  };

  const handleOnKeyPress = (e) => {
    if (e.charCode === 13) {
      setIsOpen(false);
    }
  };

  const handleOnChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (typeof value === 'number' && value > -1 && value <= 99) {
      setInitiative(value);
      setChanged(true);
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={() => setIsOpen(false)}
      onExited={handleSubmit}
      centered={true}
    >
      <div className="InputModal">
        <Modal.Header>
          <Modal.TitleLockup
            icon={faDiceD20}
            iconColor="primary"
            preTitle={name}
            title="Roll Inititaive"
          />
        </Modal.Header>
        <Modal.Body>
          <div className="animate__animated animate__fadeInUp animate__faster">
            <InitiativeInput
              value={initiative}
              onChange={handleOnChange}
              onKeyPress={handleOnKeyPress}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Btn
            variant="primary"
            className="u-pos-relative u-z-index-1"
            onClick={() => setIsOpen(false)}
          >
            Confirm
            <Icon icon={faCheck} className="ml-2" />
          </Btn>
        </Modal.Footer>
      </div>
    </Modal>
  );
};
export default InitiativeModal;
