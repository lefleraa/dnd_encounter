import React from 'react';
import ConfirmationProvider from 'components/ConfirmationProvider';
import {
  EncounterProvider,
  CombatantList,
  EncounterHeader,
} from 'components/Encounter';
import { SocketContextProvider } from 'contexts';
import PageLayout from '../PageLayout';
import { useParams } from 'react-router-dom';

const Encounter = () => {
  let { id } = useParams();

  return (
    <SocketContextProvider>
      <ConfirmationProvider>
        {({ actions }) => (
          <EncounterProvider {...actions} encounterId={id}>
            <PageLayout
              components={{
                header: <EncounterHeader />,
                content: <CombatantList />,
              }}
            />
          </EncounterProvider>
        )}
      </ConfirmationProvider>
    </SocketContextProvider>
  );
};

export default Encounter;
