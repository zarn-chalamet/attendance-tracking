import React from 'react';
import { Sparkles } from 'lucide-react';

const LoginSidebar = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-blue-900 p-12 text-white">
      <div className="mt-25 max-w-md mx-auto flex flex-col justify-center">
        {/* Logo & Tagline */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-light tracking-tight">VannessPlus</h1>
          </div>
          <p className="text-gray-300 text-sm font-light">Excellence in every solution</p>
        </div>
        
        {/* Features - Minimal List */}
        <div className="space-y-6 mb-12">
          <div className="flex items-start space-x-4">
            <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            </div>
            <span className="text-gray-200 font-light">Secure attendance tracking</span>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            </div>
            <span className="text-gray-200 font-light">Real-time monitoring</span>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            </div>
            <span className="text-gray-200 font-light">Advanced analytics</span>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-auto pt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm font-light leading-relaxed">
            "Transforming business operations with innovative technology solutions since 2015"
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSidebar;