import { Messages } from '../enums/Messages';
import LeetCodeSingleton from '../api/leetcode';

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
  if (request.message === Messages.SESSION_COOKIE_REQUEST) {
    chrome.cookies.get({ url: 'https://leetcode.com', name: 'LEETCODE_SESSION' }, (cookie) => {
      if (cookie) {
        sendResponse(cookie.value);
      } else {
        sendResponse(null);
      }
    });
  }

  if (request.message === Messages.PROBLEM_STATUS_REQUEST) {
    chrome.cookies.get({ url: 'https://leetcode.com', name: 'LEETCODE_SESSION' }, (cookie) => {
      if (cookie) {
        LeetCodeSingleton.getInstance(cookie.value).getProblemStatus(request.problemName).then((status) => {
          sendResponse(status);
        });
      } else {
        sendResponse(null);
      }
    });
  }

  return true;
});
