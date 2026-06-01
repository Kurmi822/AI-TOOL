import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safeguard against non-fatal Ethereum proxy errors from external sources
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && (
      args[0].includes('Failed to assign ethereum proxy') || 
      args[0].includes('Invalid property descriptor') ||
      args[0].includes('Cannot set property ethereum')
    )) {
      return;
    }
    originalError.apply(console, args);
  };

  window.addEventListener('error', (event) => {
    if (event.message && (
      event.message.includes('Failed to assign ethereum proxy') || 
      event.message.includes('Invalid property descriptor') ||
      event.message.includes('Cannot set property ethereum')
    )) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
