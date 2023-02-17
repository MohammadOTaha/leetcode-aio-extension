import React from 'react';
import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';
import Status from './Status';

function init() {
  const timer = setInterval(() => {
    const dockDiv = document.getElementsByClassName('mt-3 flex space-x-4')[0];
    const statsDiv = document.getElementsByClassName('px-5 py-3 pt-[38px]')[0];

    if (dockDiv && statsDiv) {
      clearInterval(timer);

      renderStatusIcon(dockDiv);
      removeLikesAndDislikes(dockDiv);
      removeDifficulty(dockDiv);

      removeStats(statsDiv);
    }
  });

  function renderStatusIcon(targetDiv: Element) {
    if (document.getElementById('status-container')) {
      document.getElementById('status-container').remove();
    }

    const statusContainer = document.createElement('div');
    statusContainer.id = 'status-container';
    targetDiv.insertBefore(statusContainer, targetDiv.firstChild);
    createRoot(statusContainer).render(<Status />);
  }

  function removeLikesAndDislikes(targetDiv: Element) {
    const container = targetDiv.childNodes[3];
    for (let i = 0; i < container.childNodes.length; i++) {
      if (container.childNodes[i].childNodes[1]) {
        container.childNodes[i].removeChild(container.childNodes[i].childNodes[1]);
      }
    }
  }

  function removeDifficulty(targetDiv: Element) {
    targetDiv.removeChild(targetDiv.childNodes[1]);
  }

  function removeStats(targetDiv: Element) {
    while (targetDiv.firstChild) {
      targetDiv.removeChild(targetDiv.firstChild);
    }
  }
}

init();