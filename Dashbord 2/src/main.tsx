import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Notifications from './components/Notifications';
import './index.css';
import '../services/api.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App /><Notifications />
  </StrictMode>
);
