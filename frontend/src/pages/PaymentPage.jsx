import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import { paymentsAPI } from '../services/api';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, failed
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  useEffect(() => {
    if (reference || trxref) {
      verifyPayment(reference || trxref);
    } else {
      setStatus('failed');
      setError('No payment reference found');
    }
  }, [reference, trxref]);

  const verifyPayment = async (ref) => {
    try {
      const response = await paymentsAPI.verifyPayment(ref);
      
      if (response.data.success) {
        setStatus(response.data.data.status === 'success' ? 'success' : 'failed');
        setPaymentData(response.data.data);
        
        if (response.data.data.status !== 'success') {
          setError('Payment was not successful');
        }
      } else {
        setStatus('failed');
        setError(response.data.message);
      }
    } catch (err) {
      setStatus('failed');
      setError(err.response?.data?.message || 'Payment verification failed');
    }
  };

  const handleContinue = () => {
    if (status === 'success') {
      navigate('/applications');
    } else {
      navigate('/applications');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            {status === 'loading' && (
              <>
                <Loader className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Payment</h2>
                <p className="text-gray-600">Please wait while we confirm your payment...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">
                  Your payment has been confirmed and your application is now being processed.
                </p>
                
                {paymentData && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold">
                          {paymentData.currency} {paymentData.amount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application ID:</span>
                        <span className="font-mono text-sm">
                          {paymentData.application?.applicationId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Date:</span>
                        <span className="text-sm">
                          {new Date(paymentData.paid_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleContinue}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Continue to Applications
                </button>
              </>
            )}

            {status === 'failed' && (
              <>
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h2>
                <p className="text-gray-600 mb-4">
                  {error || 'Your payment could not be processed. Please try again.'}
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={handleContinue}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Try Again
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;