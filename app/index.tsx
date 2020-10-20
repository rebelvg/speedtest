import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { injectGlobal } from 'styled-components';
import { Home } from './pages/home';
import normalize from 'styled-normalize';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { Provider } from 'rebass';

const appElement = document.createElement('div');
appElement.setAttribute('id', 'app');
document.body.appendChild(appElement);

injectGlobal`
 @import url('https://fonts.googleapis.com/css?family=Open+Sans&subset=cyrillic');
  * {

    box-sizing: border-box; }
    body { margin: 0;
  }
  ${normalize}
`;

ReactDOM.render(
  <BrowserRouter>
    <Provider>
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('app'),
);
