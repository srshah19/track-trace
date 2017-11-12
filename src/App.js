import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

// Component Imports
import Home from './components/Home';
import Results from './components/Results';
import './App.css';

const BasicExample = () => (
  <Router>
    <div className="brand-banner">
      <Route exact path="/" component={Home}/>
      <Route path="/results/:landingId" component={Results}/>
    </div>
  </Router>
);

export default BasicExample;
