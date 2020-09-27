import React, { useEffect, useState } from 'react';
import Header from 'components/Header';
import PageLayout from '../PageLayout';

import { getEncounters } from 'network';

const Encounters = () => {
  const [encounters, setEncounters] = useState();

  useEffect(() => {
    const { promise } = getEncounters();
    promise.then((response) => {
      const { data, error } = response;
      if (data) {
        setEncounters(data);
      }
    });
  }, []);

  return (
    <PageLayout
      components={{
        header: <Header heading="Encounters" />,
        content: (
          <>
            {!encounters
              ? 'No Encounters'
              : encounters.map((encounter) => {
                  return <div>{encounter.name}</div>;
                })}
          </>
        ),
      }}
    />
  );
};

export default Encounters;
