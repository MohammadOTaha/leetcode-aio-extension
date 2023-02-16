import { Messages } from '../enums/Messages';

export async function getSessionCookie() {
  return await sendMessage({ message: Messages.SESSION_COOKIE_GET });
}

export async function getProblemStatus(problemName: string) {
  const { error, data } = await sendMessage({ message: Messages.PROBLEM_STATUS_GET, problemName });

  if (error) {
    throw new Error(error);
  }

  return data;
}

export async function setProblemStatus(problemName: string, status: string) {
  const { error, data } = await sendMessage({
    message: Messages.PROBLEM_STATUS_SET,
    problemName,
    status
  });

  if (error) {
    throw new Error(error);
  }

  return data;
}

export async function getProblemReminder(problemName: string) {
  const { error, data } = await sendMessage({
    message: Messages.PROBLEM_REMINDER_GET,
    problemName
  });

  if (error) {
    throw new Error(error);
  }

  return data;
}

export async function setProblemReminder(problemName: string, dateTime: Date) {
  const { error, data } = await sendMessage({
    message: Messages.PROBLEM_REMINDER_SET,
    problemName,
    dateTime
  });

  if (error) {
    throw new Error(error);
  }

  await sendMessage({
    message: Messages.REMINDER_SET_ALARM,
    problemName,
    dateTime
  });

  return data;
}

export async function clearProblemReminder(problemName: string) {
  const { error, data } = await sendMessage({
    message: Messages.PROBLEM_REMINDER_CLEAR,
    problemName
  });

  if (error) {
    throw new Error(error);
  }

  await sendMessage({
    message: Messages.REMINDER_CLEAR_ALARM,
    problemName
  });

  return data;
}

function sendMessage(message) {
  interface Response {
    error?: string;
    data?: any;
  }

  return new Promise<Response>((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError || !response) {
        reject('Something went wrong. Please try again later.');
      } else {
        resolve(response);
      }
    });
  });
}
