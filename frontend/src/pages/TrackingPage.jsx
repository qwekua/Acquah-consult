import React, { useState } from 'react';
import { Search, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { trackingAPI } from '../services/api';

const TrackingPage = () => {
  const [searchType, setSearchType] = useState('applicationId');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in_progress':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      let response;
      if (searchType === 'applicationId') {
        response = await trackingAPI.trackByApplicationId(searchValue.trim());
        setResults({ applications: [response.data.application] });
      } else {
        response = await trackingAPI.trackByEmail(searchValue.trim());
        setResults({ applications: response.data.applications });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error tracking application');
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Application</h1>
            <p className="text-xl text-gray-600">Enter your application ID or email to check status</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search by:
                  </label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="applicationId">Application ID</option>
                    <option value="email">Email Address</option>
                  </select>
                </div>
                
                <div className="flex-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {searchType === 'applicationId' ? 'Application ID' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type={searchType === 'email' ? 'email' : 'text'}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={searchType === 'applicationId' ? 'e.g., AC-123456-ABCDE' : 'your@email.com'}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Track Application'}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              {results.applications.map((application, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Application #{application.applicationId}
                      </h3>
                      <p className="text-gray-600">
                        Type: {getTypeDisplay(application.type)}
                      </p>
                      <p className="text-gray-600">
                        Submitted: {formatDate(application.submittedAt)}
                      </p>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-2 capitalize">{application.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {application.statusHistory && application.statusHistory.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Status History</h4>
                      <div className="space-y-3">
                        {application.statusHistory.map((history, historyIndex) => (
                          <div key={historyIndex} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            {getStatusIcon(history.status)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900 capitalize">
                                  {history.status.replace('_', ' ')}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatDate(history.updatedAt)}
                                </span>
                              </div>
                              {history.notes && (
                                <p className="text-gray-600 text-sm mt-1">{history.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;