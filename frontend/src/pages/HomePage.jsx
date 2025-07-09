import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CreditCard, FileText, Users, Search, Shield } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-400">Acquah Consult</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            We help you apply for your passport and birth certificate easily and quickly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors inline-block"
            >
              Get Started Today
            </Link>
            <Link
              to="/track"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
            >
              Track Application
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Passport Application</h3>
              <p className="text-gray-600 mb-6">Get help with your Ghana passport application process.</p>
              <div className="flex justify-between items-center mb-6">
                <span className="text-3xl font-bold text-blue-600">GHC 1,400</span>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>10 working days</span>
                </div>
              </div>
              <Link
                to="/applications"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors block text-center"
              >
                Apply Now
              </Link>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CreditCard className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Birth Certificate</h3>
              <p className="text-gray-600 mb-6">Get assistance with your birth certificate application.</p>
              <div className="flex justify-between items-center mb-6">
                <span className="text-3xl font-bold text-blue-600">GHC 400</span>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>10 working days</span>
                </div>
              </div>
              <Link
                to="/applications"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors block text-center"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Assistance</h3>
              <p className="text-gray-600">Our experienced team guides you through every step of the application process.</p>
            </div>
            <div className="text-center">
              <Clock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-600">Get your documents processed quickly within 10 working days.</p>
            </div>
            <div className="text-center">
              <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Your personal information is protected with industry-standard security measures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Search className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Track Your Application</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay updated on your application status with our real-time tracking system.
          </p>
          <Link
            to="/track"
            className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Track Now
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Acquah Consult for their document needs.
          </p>
          <Link
            to="/signup"
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;