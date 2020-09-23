import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Panel from 'components/Panel';
import MainMenu from 'components/MainMenu';
import { Home } from 'pages/Home';
import { Encounters } from 'pages/Encounters';
import { Encounter } from 'pages/Encounter';
import { EncounterDM } from 'pages/EncounterDM';

const App = () => {
  return (
    <Router>
      <Panel className="u-width-p-12 u-height-p-10 u-pos-fixed">
        <Panel direction="row">
          <Panel size={200} className="LeftPanel">
            <Panel scroll={true}>
              <MainMenu />
            </Panel>
          </Panel>
          <Panel direction="row">
            <Switch>
              <Redirect exact from="/" to="/home" />
              <Route exact path="/home">
                <Home />
              </Route>
              <Route path="/encounters">
                <Encounters />
              </Route>
              <Route path="/encounter">
                <Encounter />
              </Route>
              <Route path="/encounter_dm">
                <EncounterDM />
              </Route>
            </Switch>
          </Panel>
        </Panel>
      </Panel>
    </Router>
  );
};

export default App;
