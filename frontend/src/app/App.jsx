import React from 'react';
import './App.css';
import { ROUTES } from '../routes';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Switch>
          {ROUTES.map((route, index) => <Route key={index} {...route} />)}
        </Switch>
      </Router>
    </>
  );
}

export default App;
