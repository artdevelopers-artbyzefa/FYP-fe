import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <span className="text-gray-400 font-medium">CUI FYP System</span>
        <div className="flex gap-8">
          <Link to="/about" className="text-gray-400 hover:text-blue-bright transition-colors">About</Link>
          <Link to="/guidelines" className="text-gray-400 hover:text-blue-bright transition-colors">Guidelines</Link>
          <Link to="/contact" className="text-gray-400 hover:text-blue-bright transition-colors">Contact</Link>
        </div>
        <span className="text-gray-400 text-xs">
          © 2026 CUI Abbottabad – Department of Computer Science. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
