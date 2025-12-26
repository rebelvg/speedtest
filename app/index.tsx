import * as React from 'react';
import { Home } from './pages/home';
import { createRoot } from 'react-dom/client';

const appElement = document.createElement('div');
appElement.setAttribute('id', 'app');
document.body.appendChild(appElement);

const root = createRoot(appElement);
root.render(<Home />);
