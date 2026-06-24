import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/i18n';
import { AuthProvider } from './lib/AuthContext';

// Suppress benign cross-origin "Script error." often thrown in sandboxed iframe previews
if (typeof window !== 'undefined') {
  // 1. Capture via window.onerror and return true to stop propagation
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    const msgStr = typeof message === 'string' ? message : (message && (message as any).message);
    if (
      msgStr === 'Script error.' ||
      !source ||
      (typeof msgStr === 'string' && msgStr.includes('Script error'))
    ) {
      console.warn('Suppressed cross-origin Script error via window.onerror:', message, source);
      return true; // Prevent default browser handling
    }
    if (originalOnError) {
      return originalOnError.apply(window, [message, source, lineno, colno, error]);
    }
    return false;
  };

  // 2. Capture via addEventListener('error')
  window.addEventListener('error', (event) => {
    if (
      event.message === 'Script error.' ||
      !event.filename ||
      (event.message && event.message.includes('Script error'))
    ) {
      console.warn('Suppressed cross-origin Script error in iframe context:', event);
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  // 3. Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msgStr = reason instanceof Error ? reason.message : String(reason);
    if (msgStr === 'Script error.' || (msgStr && msgStr.includes('Script error'))) {
      console.warn('Suppressed unhandled promise Script error:', reason);
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
