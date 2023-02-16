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
          .catch(() =>
            sendResponse({ error: 'Failed to clear problem reminder. Please try again.' })
          )
      )
      .catch((reason) => sendResponse({ error: reason }));
  }

  if (request.message === Messages.REMINDER_SET_ALARM) {
    chrome.alarms.create(request.problemName, { when: new Date(request.dateTime).getTime() });

    chrome.alarms.getAll().then((alarms) => console.log(alarms));

    sendResponse({ data: true });
  }

  if (request.message === Messages.REMINDER_CLEAR_ALARM) {
    chrome.alarms.clear(request.problemName).then(() => sendResponse({ data: true }));

    chrome.alarms.getAll().then((alarms) => console.log(alarms));
  }

  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.notifications.create(alarm.name, {
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'LeetCode Reminder',
    message: `It's time to solve ${alarm.name}!`,
    buttons: [{ title: 'Go to problem' }]
  });

  getSessionCookie()
    .then((cookie) =>
      LeetCodeSingleton.getInstance(cookie)
        .clearProblemReminder(alarm.name)
        .then(() => console.log('Problem reminder cleared.'))
        .catch(() => console.log('Failed to clear problem reminder.'))
    )
    .catch((reason) => console.log(reason));
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  chrome.tabs.create({ url: `https://leetcode.com/problems/${notificationId}` }).then(() => {
    chrome.notifications.clear(notificationId);
  });

  chrome.alarms.clear(notificationId).then(() => console.log('Alarm cleared.'));
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
