import React from 'react';
import ReactDOM from 'react-dom/client';
import 'utils/buffer';
import 'fonts.css';
import 'index.css';
import { ModalProvider } from 'modals';
import { App } from 'App';
import reportWebVitals from 'reportWebVitals';
import { Web3ReactWrapper } from 'web3';
import { NotificationProvider } from 'notifications/NotificationsProvider';
import { Router } from 'routing';
import { LazyMotion } from 'motion';
import { QueryProvider } from 'queries';
import { TokensProvider } from 'tokens';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <LazyMotion>
      <QueryProvider>
        <TokensProvider>
          <NotificationProvider>
            <Web3ReactWrapper>
              <Router>
                <ModalProvider>
                  <App />
                </ModalProvider>
              </Router>
            </Web3ReactWrapper>
          </NotificationProvider>
        </TokensProvider>
      </QueryProvider>
    </LazyMotion>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
