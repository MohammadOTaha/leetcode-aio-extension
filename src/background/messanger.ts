import { Messages } from '../enums/Messages';

export async function requestSessionCookie() {
  return await sendMessage({ message: Messages.SESSION_COOKIE_REQUEST });
}

export async function requestProblemStatus(problemName: string) {
  return await sendMessage({ message: Messages.PROBLEM_STATUS_REQUEST, problemName });
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
