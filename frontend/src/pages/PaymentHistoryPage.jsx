import React, { useState, useEffect } from 'react';
import { CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { paymentsAPI } from '../services/api';

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await paymentsAPI.getPaymentHistory();
      setPayments(response.data.payments);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeDisplay = (type) => {
    switch (type) {
      case 'birth_certificate':
        return 'Birth Certificate';
      case 'passport':
        return 'Passport';
      case 'both':
        return 'Birth Certificate & Passport';
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading payment history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment History</h1>
            <p className="text-xl text-gray-600">View all your payment transactions</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {payments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payments Yet</h3>
              <p className="text-gray-600">You haven't made any payments yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {payments.map((payment) => (
                <div key={payment.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {getTypeDisplay(payment.applicationType)}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Reference: {payment.reference}
                      </p>
                      {payment.application && (
                        <p className="text-gray-600 text-sm">
                          Application: {payment.application.applicationId}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0 text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-2 capitalize">{payment.status}</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {payment.currency} {payment.amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Created:</span> {formatDate(payment.createdAt)}
                    </div>
                    {payment.paidAt && (
                      <div>
                        <span className="font-medium">Paid:</span> {formatDate(payment.paidAt)}
                      </div>
                    )}
                    {payment.application && (
                      <div>
                        <span className="font-medium">Application Status:</span>
                        <span className="ml-1 capitalize">{payment.application.status.replace('_', ' ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;