import React, { useState } from 'react';
import { useUser } from '../Context/UserContext';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Home, Mail, User } from 'react-feather';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useUser();

  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to={user?.role === 'admin' ? "/admin" : "/"} className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-orange-500">
          Event<span className="text-white">Book</span> {user?.role === 'admin' && 'Dashboard'}
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center">
          {user?.role !== 'admin' && (
            <div className="flex items-center space-x-6 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <Link to="/" className="hover:text-purple-300 flex items-center gap-1 transition-all">
                <Home size={16} /> Home
              </Link>
              <Link to="/events" className="hover:text-purple-300 flex items-center gap-1 transition-all">
                <Calendar size={16} /> Events
              </Link>
              <Link to="/contact" className="hover:text-purple-300 flex items-center gap-1 transition-all">
                <Mail size={16} /> Contact
              </Link>
            </div>
          )}
          {!isAuthenticated ? (
            <Link to="/login" 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full 
              hover:from-purple-600 hover:to-orange-600 shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2">
              <User size={16} /> Login
            </Link>
          ) : (
            <Link to="/profile" className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-full 
              hover:from-green-600 hover:to-teal-600 shadow-lg hover:shadow-teal-500/30 transition-all flex items-center gap-2">
              <User size={16} /> {user?.name || 'Profile'}
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-6 space-y-4 bg-indigo-900/90 backdrop-blur-sm rounded-lg mx-4 mt-2">
          {user?.role !== 'admin' && (
            <>
              <Link to="/" onClick={() => setIsOpen(false)}
                className="py-3 px-4 hover:bg-white/10 rounded-lg transition-all flex items-center gap-2">
                <Home size={18} /> Home
              </Link>
              <Link to="/events" onClick={() => setIsOpen(false)}
                className="py-3 px-4 hover:bg-white/10 rounded-lg transition-all flex items-center gap-2">
                <Calendar size={18} /> Events
              </Link>
              <Link to="/contact" onClick={() => setIsOpen(false)}
                className="py-3 px-4 hover:bg-white/10 rounded-lg transition-all flex items-center gap-2">
                <Mail size={18} /> Contact
              </Link>
            </>
          )}
          <div className="pt-2">
            {!isAuthenticated ? (
              <Link to="/login" onClick={() => setIsOpen(false)}
                className="w-full text-center bg-gradient-to-r from-purple-500 to-orange-500 text-white px-6 py-3 rounded-lg 
                hover:from-purple-600 hover:to-orange-600 shadow-lg transition-all flex justify-center items-center gap-2">
                <User size={18} /> Login
              </Link>
            ) : (
              <Link to="/profile" onClick={() => setIsOpen(false)}
                className="w-full text-center bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg  hover:from-green-600 hover:to-teal-600 shadow-lg transition-all flex justify-center items-center gap-2">
                <User size={18} /> {user?.name || 'Profile'}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;