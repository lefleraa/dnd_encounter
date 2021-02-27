import React from 'react';
import ConfirmationProvider from 'components/ConfirmationProvider';
import {
  EncounterProvider,
  CombatantList,
  EncounterHeader,
  EncounterHistoryFeed,
} from 'components/Encounter';
import { SocketContextProvider } from 'contexts';
import PageLayout from '../PageLayout';
import { useParams } from 'react-router-dom';

const EncounterDM = () => {
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
                panelRight: {
                  size: 290,
                  component: <EncounterHistoryFeed />,
                },
              }}
            />
          </EncounterProvider>
        )}
      </ConfirmationProvider>
    </SocketContextProvider>
  );
};

export default EncounterDM;
