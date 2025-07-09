import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold">Acquah Consult</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <Link to="/forms" className="hover:text-yellow-400 transition-colors">Apply</Link>
            <Link to="/login" className="hover:text-yellow-400 transition-colors">Login</Link>
            <Link to="/signup" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors">Sign Up</Link>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            <Link to="/" className="block py-2 hover:text-yellow-400 transition-colors">Home</Link>
            <Link to="/forms" className="block py-2 hover:text-yellow-400 transition-colors">Apply</Link>
            <Link to="/login" className="block py-2 hover:text-yellow-400 transition-colors">Login</Link>
            <Link to="/signup" className="block py-2 bg-yellow-400 text-gray-900 px-4 rounded-lg hover:bg-yellow-300 transition-colors">Sign Up</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;