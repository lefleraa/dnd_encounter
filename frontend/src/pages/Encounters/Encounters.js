import React, { useEffect, useState } from 'react';
import Header from 'components/Header';
import Card from 'components/Card';
import Btn from 'atoms/Btn';
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
  const { id, name } = encounter;
  const { DELETE } = ACTIONS;
  return (
    <Card className="p-4 mb-3 d-flex align-items-center">
      <div className="col-auto p-0 pr-4">
        <IconSquare icon={faMountains} />
      </div>
      <div className="col p-0">
        <p className="m-0 u-text-medium">{name || 'Untitled'}</p>
      </div>
      <div className="col-auto p-0 pl-4">
        <Btn variant="subtle" onClick={() => DELETE(id)}>
          Delete
        </Btn>
      </div>
      <div className="col-auto p-0 pl-4">
        <Btn>
          Continue
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
              after: (
                <Btn variant="primary" onClick={ACTIONS.CREATE}>
                  <Icon icon={faPlus} className="mr-2" />
                  ADD ENCOUNTER
                </Btn>
              ),
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
              <Card className="p-4 d-flex align-items-center justify-content-center">
                <div className="u-text-center pt-5 pb-5">
                  <Icon
                    icon={faAxeBattle}
                    size="2x"
                    className="u-color-primary"
                  />
                  <p className="mb-0 mt-3 u-color-gray">No Encounters</p>
                  <Btn
                    variant="primary"
                    className="mt-4"
                    onClick={ACTIONS.CREATE}
                  >
                    <Icon icon={faPlus} className="mr-2" />
                    ADD
                  </Btn>
                </div>
              </Card>
            )}
          </>
        ),
      }}
    />
  );
};

export default Encounters;
