import React from 'react';
import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';
import Status from './Status';

function render() {
  const timer = setInterval(() => {
    const targetDiv = document.getElementsByClassName('mt-3 flex space-x-4')[0];
    if (targetDiv) {
      clearInterval(timer);

      if (document.getElementById('app-container')) {
        return;
      }

      const appContainer = document.createElement('div');
      appContainer.id = 'app-container';
      targetDiv.insertBefore(appContainer, targetDiv.childNodes[1]);
      createRoot(appContainer).render(<Status status={'neutral'} />);
    }
  });
}

render();
