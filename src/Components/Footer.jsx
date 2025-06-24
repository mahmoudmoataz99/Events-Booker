import React from 'react';
import { Link } from 'react-router';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-lg font-bold mb-4">EventBook</h4>
          <p>Your trusted platform for discovering and booking events around you.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to='' className="hover:text-blue-400">Home</Link></li>
            <li><Link to='/events' className="hover:text-blue-400">Events</Link></li>
            <li><Link to='/login' className="hover:text-blue-400">Login</Link></li>
            <li><Link to='/register' className="hover:text-blue-400">Register</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">Contact</h4>
          <p>Email: support@eventbook.com</p>
          <p>Phone: +1 (800) 123-4567</p>
        </div>
      </div>
      <div className="text-center text-gray-400 mt-8">
        © {new Date().getFullYear()} EventBook. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
