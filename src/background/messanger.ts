import { Messages } from '../enums/Messages';

export async function getSessionCookie() {
  return await sendMessage({ message: Messages.SESSION_COOKIE_GET });
}

export async function getProblemStatus(problemName: string) {
  return await sendMessage({ message: Messages.PROBLEM_STATUS_GET, problemName });
}

export async function setProblemStatus(problemName: string, status: string) {
  return await sendMessage({ message: Messages.PROBLEM_STATUS_SET, problemName, status });
}

function sendMessage(message) {
  return new Promise<string>((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError || !response) {
        reject('MESSENGER.SEND_MESSAGE_ERR');
      } else {
        resolve(response);
      }
    });
  });
}
