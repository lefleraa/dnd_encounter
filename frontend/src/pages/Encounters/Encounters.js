import React from 'react';
import Header from 'components/Header';
import PageLayout from '../PageLayout';

const Encounters = () => {
  return (
    <PageLayout
      components={{
        header: <Header heading="Encounters" />,
      }}
    />
  );
};

export default Encounters;
