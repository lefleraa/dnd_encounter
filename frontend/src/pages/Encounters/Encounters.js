import React, { useEffect, useState } from 'react';
import Header from 'components/Header';
import InterfaceState from 'components/InterfaceState';
import Card from 'components/Card';
import Btn from 'atoms/Btn';
import BtnWrap from 'atoms/BtnWrap';
import Icon from 'atoms/Icon';
import IconSquare from 'atoms/IconSquare';
import PageLayout from '../PageLayout';
import { getEncounters, createEncounter, deleteEncounter } from 'network';
import {
  faMountains,
  faArrowRight,
  faPlus,
} from '@fortawesome/pro-regular-svg-icons';
import { faAxeBattle } from '@fortawesome/pro-light-svg-icons';

const Encounter = ({ encounter = {}, ACTIONS = {} }) => {
  const { id, name, started } = encounter;
  const { DELETE } = ACTIONS;

  const toPath = `/encounter/${id}`;

  return (
    <Card className="p-0 mb-3 d-flex align-items-center">
      <BtnWrap to={toPath} className="col p-4 d-flex align-items-center">
        <div className="col-auto p-0 pr-4">
          <IconSquare icon={faMountains} className="u-color-primary" />
        </div>
        <div className="col p-0">
          <p className="m-0 u-text-medium u-color-white">
            {name || 'Untitled'}
          </p>
        </div>
      </BtnWrap>
      <div className="col-auto p-0">
        <Btn variant="subtle" onClick={() => DELETE(id)}>
          Delete
        </Btn>
      </div>
      <div className="col-auto p-0 pl-2 pr-4">
        <Btn variant={!!started ? 'primary' : 'default'} to={toPath}>
          {!!started ? 'Continue' : 'Start'}
          <Icon icon={faArrowRight} className="ml-2" />
        </Btn>
      </div>
    </Card>
  );
};

const Encounters = () => {
  const [encounters, setEncounters] = useState();

  const ACTIONS = {
    GET_LIST: () => {
      const { promise } = getEncounters();
      promise.then((response) => {
        const { data, error } = response;
        if (data) {
          setEncounters(data.data);
        }
      });
    },

    CREATE: () => {
      const { promise } = createEncounter();
      promise
        .then((response) => {
          const { data, error } = response;
          if (error) {
            // on error
            return;
          }
          if (data) {
            // on success
          }
        })
        .finally(ACTIONS.GET_LIST);
    },

    DELETE: (id) => {
      const { promise } = deleteEncounter(id);
      promise
        .then((response) => {
          const { data, error } = response;
          if (error) {
            // on error
            return;
          }
          if (data) {
            // on success
          }
        })
        .finally(ACTIONS.GET_LIST);
    },
  };

  useEffect(() => {
    ACTIONS.GET_LIST();
  }, []);

  return (
    <PageLayout
      components={{
        header: (
          <Header
            heading="Encounters"
            components={{
              after: !!(encounters && encounters.length) ? (
                <Btn
                  variant="primary"
                  onClick={ACTIONS.CREATE}
                  className="animate__animated animate__fadeIn"
                >
                  <Icon icon={faPlus} className="mr-2" />
                  ADD ENCOUNTER
                </Btn>
              ) : null,
            }}
          />
        ),
        content: (
          <>
            {!!(encounters && encounters.length) ? (
              encounters.map((encounter) => {
                return (
                  <Encounter
                    key={encounter.encounter_id}
                    encounter={encounter}
                    ACTIONS={ACTIONS}
                  />
                );
              })
            ) : (
              <InterfaceState
                icon={faAxeBattle}
                text="No Encounters"
                btnText="ADD ENCOUNTER"
                btnAction={ACTIONS.CREATE}
              />
            )}
          </>
        ),
      }}
    />
  );
};

export default Encounters;
