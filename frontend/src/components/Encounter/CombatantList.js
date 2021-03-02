import React, { useContext, useState } from 'react';
import noop from 'lodash-es/noop';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Drawer, Card, InterfaceState } from 'components';
import { EncounterContext } from './EncounterProvider';
import { Combatant } from './Combatant';
import { faUsersCrown } from '@fortawesome/pro-light-svg-icons';

const DragCombatantList = ({ list, onDragEnd }) => {
  return (
    !!(list && list.length) && (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {list.map((combatant, i) => {
                return (
                  <Draggable
                    key={combatant.combatant_id}
                    draggableId={combatant.combatant_id}
                    index={i}
                  >
                    {(provided, snapshot) => {
                      const {
                        innerRef,
                        draggableProps,
                        dragHandleProps,
                      } = provided;
                      return (
                        <>
                          <div
                            ref={innerRef}
                            {...draggableProps}
                            style={draggableProps.style}
                            className="d-block"
                          >
                            <Combatant
                              combatant={combatant}
                              dragHandleProps={dragHandleProps}
                            />
                          </div>
                          {provided.placeholder}
                        </>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  );
};

const CombatantList = () => {
  const encounterContext = useContext(EncounterContext);
  const { encounter = {}, eventHandlers = {} } = encounterContext;

  const { combatant_move_up, combatant_move_down } = eventHandlers;
  const { combatants = {}, actions = {} } = encounter;
  const { dispatchEvent = noop } = actions;
  const {
    list = [],
    ready = [],
    complete = [],
    dead = [],
    unset = [],
  } = combatants;

  const [showDrawer, setShowDrawer] = useState(false);

  function onDragEnd({ source, destination, draggableId }) {
    // dropped outside the list
    if (!destination || source.index === destination.index) {
      return;
    }

    dispatchEvent({
      type:
        destination.index > source.index
          ? combatant_move_down.type
          : combatant_move_up.type,
      payload: {
        combatant_id: draggableId,
        startIndex: complete.length + source.index,
        endIndex: complete.length + destination.index,
      },
    });
  }

  return (
    <>
      {!!(list && list.length) ? (
        <Card className="CombatantList p-5 u-overflow-hidden">
          <div className="CombatantList__Inner u-pos-relative">
            {/* COMPLETED COMBATANTS */}
            {!!(complete && complete.length) &&
              complete.map((combatant) => {
                return (
                  <Combatant
                    key={combatant.combatant_id}
                    combatant={combatant}
                  />
                );
              })}
            {/* READY COMBATANTS */}
            <DragCombatantList list={ready} onDragEnd={onDragEnd} />
            {/* DEAD COMBATANTS */}
            {!!(dead && dead.length) &&
              dead.map((combatant) => {
                return (
                  <Combatant
                    key={combatant.combatant_id}
                    combatant={combatant}
                  />
                );
              })}
            {/* UNSET INITIATIVE COMBATANTS */}
            {!!(unset && unset.length) &&
              unset.map((combatant) => {
                return (
                  <Combatant
                    key={combatant.combatant_id}
                    combatant={combatant}
                  />
                );
              })}
          </div>
        </Card>
      ) : (
        <InterfaceState
          icon={faUsersCrown}
          text="No Combatants"
          btnText="ADD COMBATANT"
        />
      )}
      <Drawer isOpen={showDrawer} onHide={() => setShowDrawer(false)}>
        blah
      </Drawer>
    </>
  );
};

export default CombatantList;
