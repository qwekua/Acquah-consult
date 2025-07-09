import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ApplicationsPage from './pages/ApplicationsPage';
import BirthCertificateForm from './pages/BirthCertificateForm';
import PassportForm from './pages/PassportForm';
import TrackingPage from './pages/TrackingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/track" element={<TrackingPage />} />
            <Route 
              path="/applications" 
              element={
                <ProtectedRoute>
                  <ApplicationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/birth-certificate" 
              element={
                <ProtectedRoute>
                  <BirthCertificateForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/passport" 
              element={
                <ProtectedRoute>
                  <PassportForm />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;