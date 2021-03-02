import React, { useContext } from 'react';
import keys from 'lodash-es/keys';
import noop from 'lodash-es/noop';
import { Header } from 'components';
import { Dropdown, Btn, Icon, IconBtn } from 'atoms';
import { EncounterContext } from './EncounterProvider';
import {
  faPlus,
  faEllipsisH,
  faCog,
  faArrowRight,
} from '@fortawesome/pro-regular-svg-icons';
import { faHelmetBattle, faDiceD20 } from '@fortawesome/pro-light-svg-icons';
import { combatantTypes } from 'data';

import { mockCharacters } from 'mock';

const AddBtn = () => {
  const encounterContext = useContext(EncounterContext);
  const { eventHandlers = {}, encounter = {} } = encounterContext;
  const { actions = {} } = encounter;
  const { combatant_add } = eventHandlers;
  const { dispatchEvent = noop } = actions;

  // mock
  const handleAddCombatant = () => {
    dispatchEvent({
      type: combatant_add.type,
      payload: {
        combatant_id:
          mockCharacters[Math.floor(Math.random() * mockCharacters.length)]
            .combatant_id,
      },
    });
  };

  return (
    <Dropdown
      placement="BOTTOM_RIGHT"
      components={{
        trigger: <IconBtn icon={faPlus} />,
        content: (
          <>
            {keys(combatantTypes).map((combatantTypeKey) => {
              const { icon, description, code, color } = combatantTypes[
                combatantTypeKey
              ];
              return (
                <Dropdown.MenuItem
                  key={code}
                  before={
                    <Icon
                      icon={icon}
                      fw={true}
                      className={`u-color-${color}`}
                    />
                  }
                  text={`Add ${description}`}
                  action={handleAddCombatant}
                />
              );
            })}
          </>
        ),
      }}
    />
  );
};

const OptionMenu = () => {
  const encounterContext = useContext(EncounterContext);
  const { eventHandlers = {}, encounter = {} } = encounterContext;
  const { actions = {} } = encounter;
  const { reorder_combatants_by_initiative } = eventHandlers;
  const { dispatchEvent = noop, pushConfirmationModal = noop } = actions;

  return (
    <Dropdown
      placement="BOTTOM_RIGHT"
      components={{
        trigger: <IconBtn icon={faEllipsisH} />,
        content: (
          <>
            <Dropdown.MenuItem
              before={
                <Icon
                  icon={reorder_combatants_by_initiative.historyLog.icon}
                  fw={true}
                />
              }
              text="Re-order by Initiative"
              action={() => {
                pushConfirmationModal({
                  variant: 'white',
                  icon: reorder_combatants_by_initiative.historyLog.icon,
                  text: 'This will reset the order of combatants',
                  cancelText: 'No',
                  confirmText: 'Yes',
                  action: () =>
                    dispatchEvent({
                      type: reorder_combatants_by_initiative.type,
                    }),
                });
              }}
            />
          </>
        ),
      }}
    />
  );
};

const RoundIncrementor = () => {
  const encounterContext = useContext(EncounterContext);
  const { encounter = {}, eventHandlers = {} } = encounterContext;
  const { actions = {}, insights = {}, round } = encounter;
  const {
    encounterStarted,
    roundComplete,
    hasInPlayCombatants,
    hasUnsetCombatants,
    hasTurnReadyCombatants,
    hasCombatants,
  } = insights;
  const { pushConfirmationModal = noop, dispatchEvent = noop } = actions;
  const { round_increment } = eventHandlers;

  const handleTriggerStartEncounter = () => {
    const handlePush = () => {
      dispatchEvent({
        type: round_increment.type,
      });
    };

    if (!!hasUnsetCombatants) {
      pushConfirmationModal({
        icon: faDiceD20,
        preTitle: 'Start Encounter',
        text: 'Not all combatants have rolled initiative.',
        confirmText: 'Start',
        action: handlePush,
      });
    } else {
      handlePush();
    }
  };

  const handleTriggerNextRound = () => {
    const handlePush = () => {
      dispatchEvent({
        type: round_increment.type,
      });
    };

    if (!roundComplete || !hasInPlayCombatants) {
      pushConfirmationModal({
        icon: faHelmetBattle,
        preTitle: (
          <>
            Round {round}
            <Icon icon={faArrowRight} className="ml-3 mr-3 u-opacity-6" />
            Round {round + 1}
          </>
        ),
        text: !!hasTurnReadyCombatants
          ? 'Not all combatants have taken their turn yet.'
          : `There will be no active combatants for round ${round + 1}.`,
        confirmText: 'Start',
        action: handlePush,
      });
    } else {
      handlePush();
    }
  };

  return (
    <div className="u-width-8">
      {!!encounterStarted ? (
        <>
          <Btn
            variant={
              !!(roundComplete && hasInPlayCombatants) ? 'primary' : 'default'
            }
            onClick={handleTriggerNextRound}
            block={true}
          >
            ROUND {round + 1}
            <Icon icon={faArrowRight} className="ml-2" />
          </Btn>
        </>
      ) : (
        <Btn
          variant={
            !!(hasUnsetCombatants || !hasCombatants) ? 'default' : 'primary'
          }
          disabled={!hasCombatants}
          onClick={hasCombatants ? handleTriggerStartEncounter : null}
          block={true}
        >
          ROUND 1
          <Icon icon={faArrowRight} className="ml-2" />
        </Btn>
      )}
    </div>
  );
};

const EncounterHeader = () => {
  const encounterContext = useContext(EncounterContext);
  const { encounter = {} } = encounterContext;
  const { name } = encounter;

  return (
    <Header
      heading={name || 'Untitled'}
      components={{
        backBtn: {
          text: 'Encounters',
          path: '/encounters',
        },
        after: (
          <>
            <div className="col-auto pr-0 pl-3">
              <OptionMenu />
            </div>
            <div className="col-auto pr-0 pl-2">
              <AddBtn />
            </div>
            <div className="col-auto pr-0 pl-2">
              <IconBtn icon={faCog} />
            </div>
            <div className="col-auto pr-0 pl-4">
              <RoundIncrementor />
            </div>
          </>
        ),
      }}
    />
  );
};

export default EncounterHeader;
