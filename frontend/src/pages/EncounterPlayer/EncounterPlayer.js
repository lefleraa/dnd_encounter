import React from 'react';
import ConfirmationProvider from 'components/ConfirmationProvider';
import {
  EncounterProvider,
  CombatantList,
  EncounterHeader,
  EncounterFeed,
} from 'components/Encounter';
import { SocketContextProvider } from 'contexts';
import { PageLayout, SiteWrapper } from 'layout';
import { useParams } from 'react-router-dom';

const EncounterPlayer = () => {
  let { id } = useParams();

  return (
    <SiteWrapper hasAccount={false}>
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
                    component: <EncounterFeed />,
                  },
                }}
              />
            </EncounterProvider>
          )}
        </ConfirmationProvider>
      </SocketContextProvider>
    </SiteWrapper>
  );
};

export default EncounterPlayer;
