import React from 'react';
import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';
import Popup from './Popup';

function render() {
  const appContainer = document.createElement('div');
  document.body.appendChild(appContainer);
  const root = createRoot(appContainer);
  root.render(<Popup />);
}

render();
