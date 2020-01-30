import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
  } from 'react-router-dom';
import App from './App';

ReactDOM.render((
    <Router>
    <div className="container">
      <Route exact path="/" component={App} />
    </div>
  </Router>
), document.getElementById('root'));