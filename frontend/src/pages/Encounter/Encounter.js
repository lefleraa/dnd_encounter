import React from 'react';
import ConfirmationProvider from 'components/ConfirmationProvider';
import { EncounterProvider, CombatantList } from 'components/Encounter';
import Header from 'components/Header';
import PageLayout from '../PageLayout';

const Encounter = () => {
  return (
    <ConfirmationProvider>
      {({ actions }) => (
        <EncounterProvider {...actions}>
          <PageLayout
            components={{
              header: <Header heading="Battle at the Banks" />,
              content: <CombatantList />,
            }}
          />
        </EncounterProvider>
      )}
    </ConfirmationProvider>
  );
};

export default Encounter;
