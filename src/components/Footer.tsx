import React from 'react';
import { Facebook, Instagram, MessageCircle, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Acquah Consult</h3>
            <p className="text-gray-300">
              We help you apply for your passport and birth certificate easily and quickly.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/forms" className="hover:text-yellow-400 transition-colors">Apply for Documents</a></li>
              <li><a href="/login" className="hover:text-yellow-400 transition-colors">Login</a></li>
              <li><a href="/signup" className="hover:text-yellow-400 transition-colors">Sign Up</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://whatsapp.com" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <MessageCircle className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Acquah Consult. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;