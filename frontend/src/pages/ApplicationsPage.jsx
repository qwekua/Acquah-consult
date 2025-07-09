import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CreditCard, Clock, AlertCircle, Search } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

const ApplicationsPage = () => {
  const [paymentModal, setPaymentModal] = React.useState({ isOpen: false, application: null });

  const handlePaymentSuccess = (paymentData) => {
    // Handle successful payment
    console.log('Payment successful:', paymentData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Application</h1>
            <p className="text-xl text-gray-600">Select the document(s) you want to apply for</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                <strong>Important:</strong> A birth certificate is required before applying for a passport. Payment is required to process your application.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CreditCard className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Birth Certificate</h3>
              <p className="text-gray-600 mb-6">
                Apply for your official birth certificate from Ghana's vital statistics.
              </p>
              <div className="flex justify-between items-center mb-6">
                <span className="text-3xl font-bold text-blue-600">GHC 400</span>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>10 working days</span>
                </div>
              </div>
              <Link
                to="/birth-certificate"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors block text-center"
              >
                Apply for Birth Certificate
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Passport</h3>
              <p className="text-gray-600 mb-6">
                Apply for your Ghana passport to travel internationally.
              </p>
              <div className="flex justify-between items-center mb-6">
                <span className="text-3xl font-bold text-blue-600">GHC 1,400</span>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>10 working days</span>
                </div>
              </div>
              <Link
                to="/passport"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors block text-center"
              >
                Apply for Passport
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Apply for Both</h3>
            <p className="text-gray-600 mb-6 text-center">
              Get both your birth certificate and passport processed together.
            </p>
            <div className="flex justify-center items-center mb-6">
              <div className="text-center">
                <span className="text-3xl font-bold text-blue-600">GHC 1,800</span>
                <p className="text-gray-600 mt-2">Total for both documents</p>
              </div>
            </div>
            <div className="text-center">
              <Link
                to="/birth-certificate"
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg hover:bg-yellow-300 transition-colors inline-block font-semibold"
              >
                Start with Birth Certificate
              </Link>
              <p className="text-sm text-gray-500 mt-2">
                We'll guide you through the passport application after completing your birth certificate.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
              <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Track Your Application</h3>
              <p className="text-gray-600 mb-6">
                Already submitted an application? Track its status here.
              </p>
              <Link
                to="/track"
                className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-block font-semibold"
              >
                Track Application
              </Link>
            </div>
          </div>
        </div>

        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={() => setPaymentModal({ isOpen: false, application: null })}
          application={paymentModal.application}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default ApplicationsPage;