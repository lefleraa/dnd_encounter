import React from 'react';
import Header from 'components/Header';
import { PageLayout, SiteWrapper } from 'layout';

const Home = () => {
  return (
    <SiteWrapper>
      <PageLayout
        components={{
          header: <Header heading="Home" />,
        }}
      />
    </SiteWrapper>
  );
};

export default Home;
