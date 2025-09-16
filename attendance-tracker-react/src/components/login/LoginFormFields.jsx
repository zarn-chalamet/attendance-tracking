import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginFormFields = ({
  credentials,
  showPassword,
  setCredentials,
  setShowPassword
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="your.email@company.com"
          value={credentials.email}
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginFormFields;