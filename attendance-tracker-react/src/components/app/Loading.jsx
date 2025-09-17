import React from 'react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      
      {/* Optional loading text */}
      <p className="mt-4 text-gray-600 text-lg font-medium">{message}</p>
    </div>
  );
};

export default Loading;
