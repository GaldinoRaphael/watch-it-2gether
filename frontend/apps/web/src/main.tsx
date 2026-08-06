import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { environmentService } from '@watch-it/infrastructure';
import { App } from './App';

environmentService.configure({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
});

// Warm up the server on app load (cold-start on free-tier hosting)
fetch(`${import.meta.env.VITE_API_BASE_URL}/health`).catch(() => undefined);

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
