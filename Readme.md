# LeetCode Problems Status and Reminders Extension

## Introduction
This extension is used to mark problems in LeetCode by how sure you are about the solution. 
It also provides a reminder for the problems you are not sure about.

## Features
- Set the status of a problem (Happy, Neutral, Sad, or None)
- Set a reminder for a problem (a notification will be shown in the browser)
- Seamless integration with LeetCode

## Installation
> The extension is not published (yet), so you need to install it manually.
1. `git clone https://github.com/MohammadOTaha/leetcode-status-extension.git`
2. `cd leetcode-status-extension`
3. `yarn install`
4. `yarn build`
5. Open Chrome and go to `chrome://extensions/`
6. Enable `Developer mode`
7. Click on `Load unpacked` and select the `dist` folder in the extension directory
8. Enjoy! (and open issues if you find any bugs)

## Usage
After installing the extension, a new button will be added below the problem name,
through which you can set the status of the problem and/or set a reminder for it.
![Set Status](./docs/set_status.png)
![Set Reminder](./docs/add_reminder.png)