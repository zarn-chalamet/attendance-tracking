import React from 'react';
import { ChevronLeft, UserPlus, Camera, CheckCircle } from 'lucide-react';

const FaceVerificationStep = ({
  formData,
  isScanning,
  cameraError,
  videoRef,
  canvasRef,
  startCamera,
  stopCamera,
  captureFace,
  prevStep,
  isLoading
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Face Verification</h3>
      <p className="text-gray-600 text-sm mb-4">
        Scan your face for secure attendance tracking
      </p>

      {!isScanning && !formData.faceEmbedding && (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-10 h-10 text-blue-600" />
          </div>
          <p className="text-gray-600 mb-4">We'll use this for secure check-ins</p>
          <button
            type="button"
            onClick={startCamera}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
          >
            Start Camera
          </button>
          {cameraError && (
            <div className="mt-4">
              <p className="text-red-500 text-sm mb-2">Camera access failed</p>
              <button
                onClick={startCamera}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Retry Camera Access
              </button>
            </div>
          )}
        </div>
      )}

      {isScanning && (
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 object-cover"
            />
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="hidden"
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={stopCamera}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={captureFace}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Capture
            </button>
          </div>
        </div>
      )}

      {formData.faceEmbedding && !isScanning && (
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-48 h-48 bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={formData.faceEmbedding}
              alt="Captured face"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <p className="text-green-600 font-medium">Face captured successfully!</p>
          <button
            type="button"
            onClick={startCamera}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Retake Photo
          </button>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          type="submit"
          disabled={!formData.faceEmbedding || isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              <span>Complete Registration</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FaceVerificationStep;