import React from 'react';

const LoginFooter = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-xs text-gray-500">
        © {new Date().getFullYear()} VannessPlus. All rights reserved.
      </p>
    </div>
  );
};

export default LoginFooter;