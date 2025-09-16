import React from 'react';
import { Eye, EyeOff, UserPlus, Camera, ChevronLeft, ChevronRight, CheckCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import AccountInfoStep from './AccountInfoStep';
import OfficeSelectionStep from './OfficeSelectionStep';
import FaceVerificationStep from './FaceVerificationStep';

const RegisterForm = ({
  step,
  formData,
  offices,
  showPassword,
  showConfirmPassword,
  isLoading,
  isScanning,
  cameraError,
  videoRef,
  canvasRef,
  handleInputChange,
  handleOfficeSelect,
  setShowPassword,
  setShowConfirmPassword,
  startCamera,
  stopCamera,
  captureFace,
  handleSubmit,
  nextStep,
  prevStep
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Step {step} of 3</span>
          <div className="flex space-x-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i <= step ? 'bg-blue-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Account Information */}
        {step === 1 && (
          <AccountInfoStep
            formData={formData}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            handleInputChange={handleInputChange}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            nextStep={nextStep}
          />
        )}

        {/* Step 2: Office Selection */}
        {step === 2 && (
          <OfficeSelectionStep
            formData={formData}
            offices={offices}
            handleOfficeSelect={handleOfficeSelect}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}

        {/* Step 3: Face Verification */}
        {step === 3 && (
          <FaceVerificationStep
            formData={formData}
            isScanning={isScanning}
            cameraError={cameraError}
            videoRef={videoRef}
            canvasRef={canvasRef}
            startCamera={startCamera}
            stopCamera={stopCamera}
            captureFace={captureFace}
            prevStep={prevStep}
            isLoading={isLoading}
          />
        )}
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;