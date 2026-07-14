import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { CustomCursor } from './components/CustomCursor';
import './index.css';

// Lenis smooth scroll implementation
import Lenis from 'lenis';

if (typeof window !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Global error interception to handle cross-origin "Script error." and expected RPC propagation errors
  window.addEventListener('error', (event) => {
    if (event.message === 'Script error.' || !event.filename) {
      event.preventDefault();
      return;
    }
    const msg = (event.message || '').toLowerCase();
    if (msg.includes('genlayer rpc error') || msg.includes('not found') || msg.includes('no contract')) {
      event.preventDefault();
      return;
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const reasonStr = (typeof reason === 'string' ? reason : reason?.message || String(reason || '')).toLowerCase();
    if (reasonStr.includes('not found') || reasonStr.includes('genlayer rpc error') || reasonStr.includes('404') || reasonStr.includes('no contract')) {
      event.preventDefault();
    }
  });

  const originalConsoleError = console.error;
  console.error = function (...args) {
    const argStr = args.map(arg => {
      if (typeof arg === 'string') return arg;
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    }).join(' ').toLowerCase();

    if (
      (argStr.includes('genlayer rpc error') || argStr.includes('read contract error')) && 
      (argStr.includes('not found') || argStr.includes('0x395b') || argStr.includes('no contract') || argStr.includes('404'))
    ) {
      console.warn('[Expected RPC Propagation Warning]:', ...args);
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomCursor />
    <App />
  </StrictMode>,
);
