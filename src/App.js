import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route, Switch
} from 'react-router-dom';

// Component Imports
import Home from './components/Home';
import Results from './components/Results';
import NoMatch from "./components/NoMatch";
import './App.css';

const BasicExample = () => (
  <Router>
    <div className="brand-banner">
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/bookings/:landingId" component={Results}/>
        <Route component={NoMatch}/>
      </Switch>
    </div>
  </Router>
);

export default BasicExample;
