import React from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginFormFields from './LoginFormFields';

const LoginForm = ({
  credentials,
  showPassword,
  isLoading,
  setCredentials,
  setShowPassword,
  handleSubmit
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-600">Sign in to continue your journey</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <LoginFormFields
          credentials={credentials}
          showPassword={showPassword}
          setCredentials={setCredentials}
          setShowPassword={setShowPassword}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Remember me</span>
          </label>

          <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Sign in</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;