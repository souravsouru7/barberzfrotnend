import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const VerificationPending = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-yellow-200 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center mb-4">
        <AlertCircle className="text-yellow-500 mr-2 animate-pulse" size={24} />
        <h2 className="text-lg font-semibold text-gray-800">Account Verification</h2>
      </div>
      <p className="mb-4 text-gray-600">Your account is currently under verification.</p>
      <p className="text-gray-600">Please wait until the verification process is complete.</p>
      <div className="mt-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    </div>
  );
};

export default VerificationPending;