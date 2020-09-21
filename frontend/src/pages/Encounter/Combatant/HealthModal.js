import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';
import noop from 'lodash-es/noop';
import { faCheck } from '@fortawesome/pro-regular-svg-icons';
import Icon from 'atoms/Icon';
import SlideTabs from 'components/SlideTabs';
import Btn from 'atoms/Btn';
import Modal from 'components/Modal';
import FormControl from 'react-bootstrap/FormControl';
import { faHeart } from '@fortawesome/pro-duotone-svg-icons';
import { useHealthGate } from 'hooks';
import { EncounterContext } from 'components/EncounterProvider';

const HealthInput = forwardRef(
  ({ value, onChange = noop, onKeyPress = noop }, ref) => {
    return (
      <div className="InputModal__Input">
        <FormControl
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          aria-label="Health Input"
          autoFocus={true}
          type="text"
          ref={ref}
        />
      </div>
    );
  }
);

const HealthModal = ({ show, onHide, combatant = {} }) => {
  const encounterContext = useContext(EncounterContext);
  const { encounter = {}, eventTypes = {} } = encounterContext;
  const { actions = {}, helpers = {} } = encounter;
  const { dispatchEvent = noop, overkillDeath = noop } = actions;
  const { combatant_dead } = eventTypes;

  const { damage, combatant_id } = combatant;
  const character = helpers.getCharacterById(combatant_id);
  const { name, total_health } = character;
  const [changed, setChanged] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [healthType, setHealthType] = useState(true);
  const healthInput = useRef();

  useEffect(() => {
    setIsOpen(!!show);
  }, [show]);

  const { healthChange, healthEvent } = useHealthGate({
    combatant_id,
    total_health,
    damage,
    value: healthType === 'damage' ? -value : value,
  });

  const handleOnTypeToggle = (option) => {
    if (!option) {
      return;
    }

    setHealthType(option.code);
    if (healthInput.current) {
      healthInput.current.focus();
    }
  };

  const handleOnSubmit = () => {
    setChanged(true);
    setIsOpen(false);
  };

  const handleOnExited = () => {
    if (changed) {
      if (healthType === 'dead') {
        dispatchEvent({
          type: combatant_dead.type,
          payload: {
            combatant_id,
          },
        });
      } else {
        if (healthChange) {
          dispatchEvent(healthEvent, {
            callback: () => {
              overkillDeath({
                combatant_id,
                healthChange,
              });
            },
          });
        }
      }
    }
    setValue(0);
    setChanged(false);
    setHealthType('damage');
    onHide();
  };

  const handleOnKeyPress = (e) => {
    if (e.charCode === 13) {
      handleOnSubmit();
    }
  };

  const handleOnChange = (e) => {
    let inputValue = parseInt(e.target.value) || 0;
    if (inputValue > -1 && inputValue <= 999) {
      setValue(inputValue);
      setChanged(true);
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={() => setIsOpen(false)}
      onExited={handleOnExited}
      centered={true}
      dismissBtn={true}
    >
      <div className="InputModal">
        <Modal.Header>
          <Modal.TitleLockup
            icon={faHeart}
            iconColor="error"
            preTitle={name}
            title="Health"
          />
        </Modal.Header>
        <Modal.Body>
          <SlideTabs
            options={[
              {
                component: 'Damage',
                code: 'damage',
                color: 'error',
              },
              {
                component: 'Heal',
                code: 'heal',
                color: 'confirm',
              },
              {
                component: 'Dead',
                code: 'dead',
                color: 'gray',
              },
            ]}
            onChange={handleOnTypeToggle}
          />
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: 100 }}
          >
            {!!(healthType === 'dead') ? (
              <Icon
                icon={combatant_dead.historyLog.icon}
                size="4x"
                className="u-color-gray animate__animated animate__fadeInUp animate__faster"
              />
            ) : (
              <div className="animate__animated animate__fadeInUp animate__faster">
                <HealthInput
                  value={value}
                  onChange={handleOnChange}
                  onKeyPress={handleOnKeyPress}
                  ref={healthInput}
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Btn
            variant="primary"
            className="u-pos-relative u-z-index-1"
            onClick={() => handleOnSubmit()}
          >
            Submit
            <Icon icon={faCheck} className="ml-2" />
          </Btn>
        </Modal.Footer>
      </div>
    </Modal>
  );
};
export default HealthModal;
