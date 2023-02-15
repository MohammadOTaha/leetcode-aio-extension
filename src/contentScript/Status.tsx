import React, { useEffect, useState } from 'react';
import { getProblemStatus, setProblemStatus } from '../background/messanger';
import { Popover, Transition } from '@headlessui/react';

const faceSVGPaths = {
  happy: [
    <path
      d="M12 17C14.2091 17 16 15.2091 16 13H8C8 15.2091 9.79086 17 12 17Z"
      fill="currentColor"
    />,
    <path
      d="M10 10C10 10.5523 9.55228 11 9 11C8.44772 11 8 10.5523 8 10C8 9.44772 8.44772 9 9 9C9.55228 9 10 9.44772 10 10Z"
      fill="currentColor"
    />,
    <path
      d="M15 11C15.5523 11 16 10.5523 16 10C16 9.44772 15.5523 9 15 9C14.4477 9 14 9.44772 14 10C14 10.5523 14.4477 11 15 11Z"
      fill="currentColor"
    />,
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
      fill="currentColor"
    />
  ],
  neutral: [
    <path
      d="M9 11C9.55228 11 10 10.5523 10 10C10 9.44772 9.55228 9 9 9C8.44772 9 8 9.44772 8 10C8 10.5523 8.44772 11 9 11Z"
      fill="currentColor"
    />,
    <path
      d="M9 15C8.44772 15 8 15.4477 8 16C8 16.5523 8.44772 17 9 17H15C15.5523 17 16 16.5523 16 16C16 15.4477 15.5523 15 15 15H9Z"
      fill="currentColor"
    />,
    <path
      d="M16 10C16 10.5523 15.5523 11 15 11C14.4477 11 14 10.5523 14 10C14 9.44772 14.4477 9 15 9C15.5523 9 16 9.44772 16 10Z"
      fill="currentColor"
    />,
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
      fill="currentColor"
    />
  ],
  sad: [
    <path
      d="M9 11C9.55228 11 10 10.5523 10 10C10 9.44772 9.55228 9 9 9C8.44772 9 8 9.44772 8 10C8 10.5523 8.44772 11 9 11Z"
      fill="currentColor"
    />,
    <path
      d="M14 17C14 15.8954 13.1046 15 12 15C10.8954 15 10 15.8954 10 17H8C8 14.7909 9.79086 13 12 13C14.2091 13 16 14.7909 16 17H14Z"
      fill="currentColor"
    />,
    <path
      d="M16 10C16 10.5523 15.5523 11 15 11C14.4477 11 14 10.5523 14 10C14 9.44772 14.4477 9 15 9C15.5523 9 16 9.44772 16 10Z"
      fill="currentColor"
    />,
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
      fill="currentColor"
    />
  ],
  default: [
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
    />
  ]
};

const faceColor = {
  happy: 'text-green-500',
  neutral: 'text-yellow-500',
  sad: 'text-red-500',
  default: 'text-gray-500'
};

const statusString = {
  happy: '100% understood!',
  neutral: 'Need to review the code.',
  sad: 'Needs to be solved again.',
  default: 'Not marked.'
};

export default function Status() {
  const [status, setStatus] = useState(null);
  const [showAddReminder, setShowAddReminder] = useState(true);
  const [reminderDate, setReminderDate] = useState(null);
  const [reminderTime, setReminderTime] = useState(null);

  const problemName = window.location.href.replace(/(^\w+:|^)\/\//, '').split('/')[2];

  const handleStatusChange = (status) => {
    setProblemStatus(problemName, status)
      .then(() => {
        setStatus(status);
        // alert('Status updated!');
      })
      .catch(() => alert('Error updating status! Please refresh the page or try again later.'));
  };

  const handleAddReminderOnClick = () => {
    setShowAddReminder(false);
  };

  const handleCancelOnClick = () => {
    setShowAddReminder(true);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getProblemStatus(problemName);
      setStatus(status);
    };

    fetchStatus().catch(() => setStatus('default'));
  }, []);

  if (status === null) return <></>;

  return (
    <Popover className="relative">
      <Popover.Button
        className={`
           ${faceColor[status]} 
           rounded
           hover:bg-fill-3 
           dark:hover:bg-dark-fill-3
           cursor-pointer
           p-[2px]
           `}>
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={status === 'default' ? 2 : 0}
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          {faceSVGPaths[status].map((path, index) => (
            <React.Fragment key={index}>{path}</React.Fragment>
          ))}
        </svg>
      </Popover.Button>

      <Transition
        as={React.Fragment}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0">
        <Popover.Panel className="absolute z-10 mt-1">
          <div className="overflow-hidden rounded-lg shadow-level3 dark:shadow-dark-level3 ring-1 ring-black ring-opacity-5">
            <div className="flex flex-col bg-layer-2 dark:bg-dark-layer-2 px-3 py-4 w-[17rem]">
              <div className="flex ml-2 gap-2">
                <span className="font-bold">Status:</span>
                <span className={`font-bold ${faceColor[status]}`}>{statusString[status]}</span>
              </div>

              <div className="divider my-0 -mx-3 opacity-50" />

              <div className="flex ml-2 gap-2">
                <span className="font-bold pt-[3px]">Change to:</span>
                {Object.keys(faceSVGPaths).map((key, index) => {
                  return (
                    <button
                      key={index}
                      className={
                        'rounded hover:bg-fill-3 dark:hover:bg-dark-fill-3 cursor-pointer p-[2px] ' +
                        faceColor[key] +
                        (status === key ? ' bg-fill-3 dark:bg-dark-fill-3' : '')
                      }
                      onClick={() => {
                        handleStatusChange(key);
                      }}>
                      <svg
                        width="1.65em"
                        height="1.65em"
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth={key === 'default' ? 2 : 0}
                        stroke="currentColor"
                        xmlns="http://www.w3.org/2000/svg">
                        {faceSVGPaths[key].map((path, index) => (
                          <React.Fragment key={index}>{path}</React.Fragment>
                        ))}
                      </svg>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 w-full gap-2">
                {showAddReminder ? (
                  <button
                    onClick={handleAddReminderOnClick}
                    className="px-3 py-1.5 w-full gap-2 items-center justify-center focus:outline-none inline-flex bg-fill-3 dark:bg-dark-fill-3 hover:bg-fill-2 dark:hover:bg-dark-fill-2 text-label-2 dark:text-dark-label-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-4 h-4">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                      />
                    </svg>

                    <b> Add Reminder </b>
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="w-1/2 px-2 py-1.5 rounded-lg bg-fill-3 dark:bg-dark-fill-3 text-label-2 dark:text-dark-label-2"
                        onChange={(e) => setReminderDate(e.target.value)}
                      />

                      <input
                        type="time"
                        className="w-1/2 px-2 py-1.5 rounded-lg bg-fill-3 dark:bg-dark-fill-3 text-label-2 dark:text-dark-label-2"
                        onChange={(e) => setReminderTime(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 w-4/5 gap-2 items-center justify-center  focus:outline-none inline-flex bg-green-s dark:bg-dark-green-s hover:bg-green-3 dark:hover:bg-dark-green-3 text-white dark:text-dark-label-2 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>

                        <b> Confirm </b>
                      </button>

                      <button
                        onClick={handleCancelOnClick}
                        className="px-3 py-1.5 w-1/5 items-center justify-center  focus:outline-none inline-flex bg-red-s dark:bg-dark-red-s hover:bg-red-3 dark:hover:bg-dark-red-3 text-white dark:text-dark-label-2 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-4 h-4">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
