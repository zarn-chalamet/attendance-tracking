import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, MapPin } from 'lucide-react';

const OfficeSelectionStep = ({
  formData,
  offices,
  handleOfficeSelect,
  prevStep,
  nextStep
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Your Office</h3>
      <p className="text-gray-600 text-sm mb-4">
        Choose your primary office location for attendance tracking
      </p>

      <div className="space-y-3">
        {offices.map((office) => (
          <div
            key={office.id}
            onClick={() => handleOfficeSelect(office.id)}
            className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
              formData.officeId === office.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                formData.officeId === office.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{office.name}</h4>
                <p className="text-sm text-gray-600">
                  {office.latitude}, {office.longitude}
                </p>
              </div>
              {formData.officeId === office.id && (
                <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={!formData.officeId}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
        >
          <span>Continue</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default OfficeSelectionStep;