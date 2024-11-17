import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './pages/home';

const appElement = document.createElement('div');
appElement.setAttribute('id', 'app');
document.body.appendChild(appElement);

ReactDOM.render(<Home />, document.getElementById('app'));
