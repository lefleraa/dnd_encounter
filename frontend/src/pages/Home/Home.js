import React from 'react';
import Panel from 'components/Panel';
import Header from 'components/Header';
import PageLayout from '../PageLayout';

const Home = () => {
  return (
    <PageLayout
      components={{
        header: <Header heading="Home" />,
      }}
    />
  );
};

export default Home;
