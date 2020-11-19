import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'styles/index.scss';
// import { Provider } from 'react-redux';
// import store from 'store';
import NotFound from 'pages/NotFound';
import Home from 'pages/Home';
import About from 'pages/About';
import Fallback from 'pages/Fallback';

const App = () => {
  return (
    // <Provider store={ store }>
    // </Provider>

    <Router>
      <Switch>
        <Route exact path={ '/' } component={ Home } />
        <Route exact path={ '/about' } component={ About } />
        <Route exact path={ '/fallback' } component={ Fallback } />
        <Route component={ NotFound } />
      </Switch>
    </Router>
  );
};

export default App;
