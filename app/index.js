import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {injectGlobal} from 'styled-components';
import App from './pages/index';
import normalize from 'styled-normalize';
import {ThemeProvider} from 'styled-components';
import {theme} from './theme';

const appElement = document.createElement('div');
appElement.setAttribute('id', 'app');
document.body.appendChild(appElement);

injectGlobal`
 @import url('https://fonts.googleapis.com/css?family=Open+Sans&subset=cyrillic');
  * {
    font-family: 'Open Sans', sans-serif;
  }
  ${normalize}
`;

ReactDOM.render(
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <App/>
        </ThemeProvider>
    </BrowserRouter>,
    document.getElementById('app'),
);
