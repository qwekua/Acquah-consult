import React, { useState } from 'react';
import { X, CreditCard, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { paymentsAPI } from '../services/api';

const PaymentModal = ({ isOpen, onClose, application, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const prices = {
    birth_certificate: { amount: 400, label: 'Birth Certificate' },
    passport: { amount: 1400, label: 'Passport' },
    both: { amount: 1800, label: 'Birth Certificate & Passport' }
  };

  const applicationPrice = prices[application?.type] || { amount: 0, label: 'Unknown' };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Initialize payment
      const response = await paymentsAPI.initializePayment({
        applicationId: application.id,
        applicationType: application.type
      });

      if (response.data.success) {
        // Load Paystack inline script if not already loaded
        if (!window.PaystackPop) {
          const script = document.createElement('script');
          script.src = 'https://js.paystack.co/v1/inline.js';
          script.onload = () => initiatePaystackPayment(response.data.data);
          document.head.appendChild(script);
        } else {
          initiatePaystackPayment(response.data.data);
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  const initiatePaystackPayment = (paymentData) => {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: application.userEmail,
      amount: paymentData.amount * 100, // Convert to kobo
      currency: 'GHS',
      ref: paymentData.reference,
      callback: function(response) {
        verifyPayment(response.reference);
      },
      onClose: function() {
        setLoading(false);
      }
    });

    handler.openIframe();
  };

  const verifyPayment = async (reference) => {
    try {
      const response = await paymentsAPI.verifyPayment(reference);
      
      if (response.data.success && response.data.data.status === 'success') {
        setSuccess(true);
        setTimeout(() => {
          onPaymentSuccess(response.data.data);
          onClose();
        }, 2000);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h4>
              <p className="text-gray-600">Your application is now being processed.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Application Type:</span>
                  <span className="font-semibold">{applicationPrice.label}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Application ID:</span>
                  <span className="font-mono text-sm">{application?.applicationId}</span>
                </div>
                <div className="flex items-center justify-between mb-4 text-lg">
                  <span className="text-gray-900 font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    GHC {applicationPrice.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-medium">Secure Payment</p>
                    <p className="text-blue-600 text-sm">
                      Your payment is processed securely through Paystack. 
                      We accept all major cards and mobile money.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay GHC {applicationPrice.amount.toLocaleString()}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;