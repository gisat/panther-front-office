import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import loadApp from './app-old';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

loadApp();
