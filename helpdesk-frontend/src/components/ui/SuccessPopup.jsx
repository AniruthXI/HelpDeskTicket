// src/components/ui/SuccessPopup.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

export const SuccessPopup = ({ isOpen, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-30"></div>

            {/* Popup */}
            <div className="relative bg-white rounded-lg shadow-xl transform transition-all max-w-sm w-full mx-4">
                <div className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-3 text-center">
                        <h3 className="text-lg font-medium text-gray-900">Success!</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">{message}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};