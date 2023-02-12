import { Messages } from '../enums/Messages';

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url && changeInfo.url.startsWith('https://leetcode.com/problems/')) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ['contentScript.js']
      })
      .then(() => {
        console.log('content script injected');
      });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === Messages.REQUEST_SESSION_COOKIE) {
    chrome.cookies.get({ url: 'https://leetcode.com', name: 'LEETCODE_SESSION' }, (cookie) => {
      if (cookie) {
        sendResponse(cookie.value);
      } else {
        sendResponse(null);
      }
    });
  }

  return true;
});