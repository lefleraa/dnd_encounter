import React from 'react';
import ConfirmationProvider from 'components/ConfirmationProvider';
import {
  EncounterProvider,
  CombatantList,
  EncounterHeader,
  EncounterHistoryFeed,
} from 'components/Encounter';
import PageLayout from '../PageLayout';
import { useParams } from 'react-router-dom';

const EncounterDM = () => {
  let { id } = useParams();

  return (
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
  );
};

export default EncounterDM;
