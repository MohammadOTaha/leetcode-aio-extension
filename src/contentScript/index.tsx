import React from 'react';
import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';
import Status from './Status';

function render() {
  const timer = setInterval(() => {
    const targetDiv = document.getElementsByClassName('mt-3 flex space-x-4')[0];
    if (targetDiv) {
      clearInterval(timer);

      if (document.getElementById('status-container')) {
        document.getElementById('status-container').remove();
      }

      const statusContainer = document.createElement('div');
      statusContainer.id = 'status-container';
      statusContainer.className = 'dropdown';
      targetDiv.insertBefore(statusContainer, targetDiv.childNodes[1]);
      createRoot(statusContainer).render(<Status />);
    }
  });
}

render();
