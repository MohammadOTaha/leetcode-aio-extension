import React from 'react';
import { createRoot } from 'react-dom/client';
import LeetCodeSingleton from '../api/leetcode';
import '../assets/tailwind.css';
import { getSessionCookie } from '../background/messanger';
import Popup from './Popup';

async function render() {
  const appContainer = document.createElement('div');
  document.body.appendChild(appContainer);
  const root = createRoot(appContainer);

  let username, error;
  try {
    let sessionCookie = await getSessionCookie();
    username = LeetCodeSingleton.getInstance(sessionCookie).getUserName();
  } catch (e) {
    error = true;
  } finally {
    root.render(<Popup username={username} error={error} />);
  }
}

(async () => {
  await render();
})();
