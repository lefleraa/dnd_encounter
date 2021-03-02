import React from 'react';
import { Panel } from 'components';
import { MainMenu } from 'layout';

const SiteWrapper = ({ children, hasAccount = true }) => {
  return (
    <Panel className="u-width-p-12 u-height-p-10 u-pos-fixed">
      <Panel direction="row">
        {!!hasAccount && (
          <Panel size={200} className="LeftPanel">
            <Panel scroll={true}>
              <MainMenu />
            </Panel>
          </Panel>
        )}
        <Panel direction="row">{children}</Panel>
      </Panel>
    </Panel>
  );
};

export default SiteWrapper;
