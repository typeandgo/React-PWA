import React from 'react';
import ReactDOM from 'react-dom';
import 'styles/index.scss';
import App from 'components/App';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function() {
      console.log('Service worker registered!');
    })
}