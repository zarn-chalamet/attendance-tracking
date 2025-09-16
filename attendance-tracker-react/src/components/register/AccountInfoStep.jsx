import React from 'react';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AccountInfoStep = ({
  formData,
  showPassword,
  showConfirmPassword,
  handleInputChange,
  setShowPassword,
  setShowConfirmPassword,
  nextStep
}) => {

  const handleContinue = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Information</h3>
      
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Username *
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="your.email@company.com"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <span>Continue</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default AccountInfoStep;