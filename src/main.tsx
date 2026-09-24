import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { viewForPath } from './data/routes';

hydrateRoot(document.getElementById('root')!,
  <StrictMode>
    <App initialView={viewForPath(window.location.pathname)} />
  </StrictMode>
);
