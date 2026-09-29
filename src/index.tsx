import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

import App from './components/app/app';
import store from './services/store';

const container = document.getElementById('root')!;
const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider >
  </React.StrictMode>
);
