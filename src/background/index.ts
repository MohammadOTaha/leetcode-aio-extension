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
  if (request.message === Messages.SESSION_COOKIE_GET) {
    getSessionCookie()
      .then((cookie) => sendResponse({ data: cookie }))
      .catch((reason) => sendResponse({ error: reason }));
  }

  if (request.message === Messages.PROBLEM_STATUS_GET) {
    getSessionCookie()
      .then((cookie) =>
        LeetCodeSingleton.getInstance(cookie)
          .getProblemStatus(request.problemName)
          .then((status) => sendResponse({ data: status }))
          .catch(() => sendResponse({ error: 'Failed to get problem status. Please try again.' }))
      )
      .catch((reason) => sendResponse({ error: reason }));
  }

  if (request.message === Messages.PROBLEM_STATUS_SET) {
    getSessionCookie()
      .then((cookie) =>
        LeetCodeSingleton.getInstance(cookie)
          .setProblemStatus(request.problemName, request.status)
          .then((status) => sendResponse({ data: status }))
          .catch(() => sendResponse({ error: 'Failed to set problem status. Please try again.' }))
      )
      .catch((reason) => sendResponse({ error: reason }));
  }

  if (request.message === Messages.PROBLEM_REMINDER_GET) {
    getSessionCookie()
      .then((cookie) =>
        LeetCodeSingleton.getInstance(cookie)
          .getProblemReminder(request.problemName)
          .then((dateTime) => sendResponse({ data: dateTime }))
          .catch(() => sendResponse({ error: 'Failed to get problem reminder. Please try again.' }))
      )
      .catch((reason) => sendResponse({ error: reason }));
  }

  if (request.message === Messages.PROBLEM_REMINDER_SET) {
    getSessionCookie()
      .then((cookie) =>
        LeetCodeSingleton.getInstance(cookie)
          .setProblemReminder(request.problemName, request.dateTime)
          .then((status) => sendResponse({ data: status }))
          .catch(() => sendResponse({ error: 'Failed to set problem reminder. Please try again.' }))
      )
      .catch((reason) => sendResponse({ error: reason }));
  }

  if (request.message === Messages.PROBLEM_REMINDER_CLEAR) {
    getSessionCookie()
      .then((cookie) =>
        LeetCodeSingleton.getInstance(cookie)
          .clearProblemReminder(request.problemName)
          .then((status) => sendResponse({ data: status }))
          .catch(() => sendResponse({ error: 'Failed to clear problem reminder. Please try again.' }))
      )
      .catch((reason) => sendResponse({ error: reason }));
  }

  return true;
});

function getSessionCookie() {
  return new Promise<string>((resolve, reject) => {
    chrome.cookies.get({ url: 'https://leetcode.com', name: 'LEETCODE_SESSION' }, (cookie) => {
      if (cookie) {
        resolve(cookie.value);
      } else {
        reject('Please make sure you are logged in to LeetCode and try again.');
      }
    });
  });
}
