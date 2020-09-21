import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import noop from 'lodash-es/noop';
import Icon from 'atoms/Icon';
import Avatar from 'atoms/Avatar';

import { combatantTypes } from 'data';
import { EncounterContext } from 'components/EncounterProvider';

import CombatantHealth from './CombatantHealth';
import CombatantDeathSaves from './CombatantDeathSaves';
import CombatantInitiative from './CombatantInitiative';
import CombatantOptions from './CombatantOptions';
import InitiativeModal from './InitiativeModal';
import HealthModal from './HealthModal';

import { faShieldAlt } from '@fortawesome/pro-duotone-svg-icons';
import { faGripVertical, faLockAlt } from '@fortawesome/pro-regular-svg-icons';

/////////////////////////////
// TITLE
/////////////////////////////

const TitleLockup = ({ character = {}, combatant = {} }) => {
  const { character_type, name, level } = character;
  const { dead } = combatant;
  const { code, description, icon, color: iconColor } = character_type;

  const TitleDetail = ({ children }) => {
    return (
      <p className="m-0 mr-4 small u-text-light u-color-gray-light u-nowrap">
        {children}
      </p>
    );
  };

  return (
    <>
      <p className="m-0 u-color-white">{name}</p>
      <div className="d-flex align-items-center mt-1">
        <Icon
          fw={true}
          size="sm"
          icon={icon}
          className={classNames('mr-2', `u-color-${iconColor}`)}
        />
        <TitleDetail>
          {!!dead ? (
            'Dead'
          ) : (
            <>
              {description}
              {code === combatantTypes.player.code && ` / Level ${level}`}
            </>
          )}
        </TitleDetail>
      </div>
    </>
  );
};

/////////////////////////////
// ARMOR CLASS
/////////////////////////////

const ArmorClass = ({ character = {} }) => {
  const { ac } = character;
  return (
    <div className="Combatant__Armor d-flex flex-nowrap align-items-center">
      <Icon icon={faShieldAlt} className="mr-2 u-color-success" />
      <p className="m-0 u-color-white">{ac}</p>
    </div>
  );
};

/////////////////////////////
// MAIN
/////////////////////////////

const Combatant = ({ combatant = {}, dragHandleProps }) => {
  const encounterContext = useContext(EncounterContext);
  const {
    encounter = {},
    eventTypes = {},
    combatantStatuses = {},
  } = encounterContext;
  const { actions = {}, insights = {}, helpers = {} } = encounter;
  const { dispatchEvent = noop } = actions;
  const { combatant_roll_initiative } = eventTypes;
  const { combatant_id, active } = combatant;

  // CREATE LOCAL STATE TO MANAGE COMBATANT UI CONTROLS

  const [editingInitiative, setEditingInitiative] = useState(false);
  const [addingDamage, setAddingDamage] = useState(false);
  let localActions = {
    setEditingInitiative,
    setAddingDamage,
  };

  // CHECK FOR CHARACTER RETURN IF UNDEFINED.
  // TODO: REMOVE THIS 'RETURN' IN FAVOR OF LAZY LOADED LIST ITEM

  const character = helpers.getCharacterById(combatant_id);
  if (!character) {
    return null;
  }

  // GATHER AND DEFINE COMBATANT LEVEL INSIGHTS

  const combatantInsights = helpers.getCombatantInsights({
    combatant,
    character,
  });
  const {
    isEnemy,
    isUnset,
    isDead,
    isComplete,
    isTurnReady,
    isDeathSaving,
  } = combatantInsights;

  // ALL PROPS PASSED TO CHILDREN IN UNITY

  const passedProps = {
    character,
    combatant,
    insights,
    combatantInsights,
    eventTypes,
    combatantStatuses,
    dispatchEvent,
    localActions,
    actions,
  };

  // RETURN

  return (
    <>
      <div
        className={classNames(
          'Combatant d-flex align-items-center',
          !isTurnReady && 'Combatant__inactive',
          active && 'Combatant__active'
        )}
      >
        <div className="col-auto d-flex align-items-center pl-0 pr-3">
          <div {...dragHandleProps}>
            <Icon
              icon={!!dragHandleProps ? faGripVertical : faLockAlt}
              fw={true}
              className={classNames(
                'u-color-gray-dark',
                !!dragHandleProps && 'u-color-hover-gray',
                !!isUnset && 'u-opacity-0'
              )}
            />
          </div>
        </div>
        <div className="col-auto d-flex align-items-center pl-0 pr-3">
          <CombatantInitiative {...passedProps} />
        </div>
        <div className="col p-0 d-flex align-items-center">
          {!!character ? (
            <>
              <div
                className={classNames(
                  'col-auto d-flex align-items-center pl-0 pr-3',
                  !isTurnReady && 'Combatant__fade'
                )}
              >
                <Avatar avatar={character.avatar} circle={isEnemy} />
              </div>
              <div
                className={classNames(
                  'Combatant__Name col p-0',
                  !isTurnReady && 'Combatant__fade'
                )}
              >
                <TitleLockup {...passedProps} />
              </div>
              <div className="col p-0"></div>
              {!isDead && (
                <div className={classNames('d-flex align-items-center')}>
                  <div className="col-auto pr-4 pl-2">
                    <ArmorClass {...passedProps} />
                  </div>
                  {!!(isDeathSaving && !isComplete) && (
                    <div className="col-auto pr-0 pl-2">
                      <CombatantDeathSaves {...passedProps} />
                    </div>
                  )}
                  <div className="col-auto pr-0 pl-2">
                    <CombatantHealth {...passedProps} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>Loading character...</>
          )}
        </div>
        <div className="col-auto p-0 pl-2">
          <CombatantOptions {...passedProps} />
        </div>
      </div>
      <InitiativeModal
        {...passedProps}
        show={editingInitiative}
        onHide={() => setEditingInitiative(false)}
        onSubmit={(initiative) => {
          dispatchEvent({
            type: combatant_roll_initiative.type,
            payload: {
              combatant_id,
              initiative,
            },
          });
        }}
      />
      <HealthModal
        {...passedProps}
        show={addingDamage}
        onHide={() => setAddingDamage(false)}
      />
    </>
  );
};

export default Combatant;
