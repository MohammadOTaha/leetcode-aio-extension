import { Messages } from '../enums/Messages';

function sendMessage(message) {
  return new Promise<string>((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError || !response) {
        reject("Session cookie not found");
      } else {
        resolve(response);
      }
    });
  });
}

export async function requestSessionCookie() {
  return await sendMessage({ message: Messages.REQUEST_SESSION_COOKIE });
}