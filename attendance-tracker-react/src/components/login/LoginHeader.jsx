import React from 'react';
import { Sparkles } from 'lucide-react';

const LoginHeader = () => {
  return (
    <div className="lg:hidden text-center mb-8">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          VannessPlus
        </h1>
      </div>
      <p className="text-gray-600">Next-generation attendance solutions</p>
    </div>
  );
};

export default LoginHeader;