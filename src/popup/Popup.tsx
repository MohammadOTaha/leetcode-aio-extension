import React from 'react';

interface PopupProps {
  username?: string;
  error?: boolean;
}

const Popup: React.FC<PopupProps> = ({ username, error }) => {
  return (
    <div className="w-96">
      <p className="text-2xl text-green-900 text-center">LeetCode Problems Status</p>
      {error ? (
        <p className="text-red-900 text-center">Please login to LeetCode first.</p>
      ) : (
        <p className="text-green-900 text-center">Hello, {username}!</p>
      )}
    </div>
  );
};

export default Popup;
