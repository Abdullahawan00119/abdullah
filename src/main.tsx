// ensure deprecation warnings from three are silenced as early as possible
import * as THREE from 'three';
if ((THREE as any).Clock && !(THREE as any).Timer) {
  (THREE as any).Timer = (THREE as any).Clock;
  console.warn('THREE.Clock deprecated – aliasing to Timer (global)');
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
