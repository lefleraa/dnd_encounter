import React from 'react';
import Container from 'components/Container';
import Panel from 'components/Panel';

const PageLayout = ({ components = {} }) => {
  const { header, content, panelLeft, panelRight } = components;
  return (
    <>
      {!!panelLeft && (
        <Panel size={panelLeft.size || 290} className="LeftPanel">
          {panelLeft.component}
        </Panel>
      )}
      <Panel>
        {!!header && (
          <Panel auto={true} className="MainHeader">
            {header}
          </Panel>
        )}
        <Panel scroll={true} className="MainPanel">
          <Container>{content}</Container>
        </Panel>
      </Panel>
      {!!panelRight && (
        <Panel size={panelRight.size || 290} className="RightPanel">
          {panelRight.component}
        </Panel>
      )}
    </>
  );
};

export default PageLayout;
