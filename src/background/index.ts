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
    chrome.cookies.get({ url: 'https://leetcode.com', name: 'LEETCODE_SESSION' }, (cookie) => {
      if (cookie) {
        sendResponse(cookie.value);
      } else {
        sendResponse(null);
      }
    });
  }

  if (request.message === Messages.PROBLEM_STATUS_GET) {
    chrome.cookies.get({ url: 'https://leetcode.com', name: 'LEETCODE_SESSION' }, (cookie) => {
      if (cookie) {
        LeetCodeSingleton.getInstance(cookie.value)
          .getProblemStatus(request.problemName)
          .then((status) => {
            sendResponse(status);
          });
      } else {
        sendResponse(null);
      }
    });
  }

  if (request.message === Messages.PROBLEM_STATUS_SET) {
    chrome.cookies.get({ url: 'https://leetcode.com', name: 'LEETCODE_SESSION' }, (cookie) => {
      if (cookie) {
        LeetCodeSingleton.getInstance(cookie.value)
          .setProblemStatus(request.problemName, request.status)
          .then((status) => {
            sendResponse(status);
          });
      } else {
        sendResponse(null);
      }
    });
  }

  if (request.message === Messages.PROBLEM_REMINDER_GET) {
    chrome.cookies.get({ url: 'https://leetcode.com', name: 'LEETCODE_SESSION' }, (cookie) => {
      if (cookie) {
        LeetCodeSingleton.getInstance(cookie.value)
          .getProblemReminder(request.problemName)
          .then((dateTime) => {
            sendResponse(dateTime);
          });
      } else {
        sendResponse(null);
      }
    });
  }

  if (request.message === Messages.PROBLEM_REMINDER_SET) {
    chrome.cookies.get({ url: 'https://leetcode.com', name: 'LEETCODE_SESSION' }, (cookie) => {
      if (cookie) {
        LeetCodeSingleton.getInstance(cookie.value)
          .setProblemReminder(request.problemName, request.dateTime)
          .then((status) => {
            sendResponse(status);
          });
      } else {
        sendResponse(null);
      }
    });
  }

  if (request.message === Messages.PROBLEM_REMINDER_CLEAR) {
    chrome.cookies.get({ url: 'https://leetcode.com', name: 'LEETCODE_SESSION' }, (cookie) => {
      if (cookie) {
        LeetCodeSingleton.getInstance(cookie.value)
          .clearProblemReminder(request.problemName)
          .then((status) => {
            sendResponse(status);
          });
      } else {
        sendResponse(null);
      }
    });
  }

  return true;
});
