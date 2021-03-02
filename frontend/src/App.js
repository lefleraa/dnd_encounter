import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { Home } from 'pages/Home';
import { Encounters } from 'pages/Encounters';
import { EncounterPlayer } from 'pages/EncounterPlayer';
import { EncounterDM } from 'pages/EncounterDM';

const App = () => {
  return (
    <Router>
      <Switch>
        <Redirect exact from="/" to="/home" />
        <Route exact path="/home">
          <Home />
        </Route>
        <Route path="/encounters">
          <Encounters />
        </Route>
        <Route path="/encounter/:id?">
          <EncounterPlayer />
        </Route>
        <Route path="/encounterDM/:id?">
          <EncounterDM />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
