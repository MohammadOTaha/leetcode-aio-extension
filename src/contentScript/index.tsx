import React from 'react';
import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';
import ContentScript from './contentScript';

function init() {
  const timer = setInterval(() => {
    const targetDiv = document.getElementsByClassName('mt-3 flex space-x-4')[0];
    if (targetDiv) {
      clearInterval(timer);

      const appContainer = document.createElement('div');
      targetDiv.appendChild(appContainer);
      if (!appContainer) {
        throw new Error('Can not find AppContainer');
      }
      const root = createRoot(appContainer);
      console.log(appContainer);
      root.render(<ContentScript />);
    }
  });
}

init();
