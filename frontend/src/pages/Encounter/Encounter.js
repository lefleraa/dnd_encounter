import React from 'react';
import CombatantList from './CombatantList';
import { EncounterHistoryFeed } from './EncounterHistoryFeed';
import EncounterHeader from './EncounterHeader';
import { EncounterProvider } from 'components/EncounterProvider';
import ConfirmationProvider from 'components/ConfirmationProvider';
import PageLayout from '../PageLayout';

const Encounter = () => {
  return (
    <ConfirmationProvider>
      {({ actions }) => (
        <EncounterProvider {...actions}>
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

export default Encounter;
