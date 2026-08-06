import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { environmentService } from '@watch-it/infrastructure';
import { App } from './App';

environmentService.configure({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
});

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
