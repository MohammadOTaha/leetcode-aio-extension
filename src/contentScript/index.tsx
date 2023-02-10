import React from 'react';
import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';
import Status from './Status';

function init() {
  const timer = setInterval(() => {
    const targetDiv = document.getElementsByClassName('mt-3 flex space-x-4')[0];

    if (targetDiv) {
      clearInterval(timer);

      const appContainer = document.createElement('div');
      targetDiv.insertBefore(appContainer, targetDiv.childNodes[2]);
      createRoot(appContainer).render(<Status status={"neutral"} />);

      console.log(appContainer);
    }
  });
}

init();
