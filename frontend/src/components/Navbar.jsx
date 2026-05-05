import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowRight, GraduationCap } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/eligibility', label: 'Eligibility' },
    { path: '/process', label: 'Process' },
    { path: '/guidelines', label: 'Guidelines' },
    { path: '/team', label: 'Team' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[70px]">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-navy rounded-full flex items-center justify-center shadow-md group-hover:bg-blue-bright transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-navy text-sm lg:text-base leading-tight">
                CUI Abbottabad
              </span>
              <span className="text-[9px] lg:text-[10px] font-bold tracking-wider text-blue-bright uppercase">
                FYP Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors hover:text-blue-bright ${
                      isActive ? 'text-blue-bright' : 'text-gray-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop Portal Login Button (Updated Styles) */}
          <Link 
            to="/login" 
            className="hidden md:flex items-center gap-2 bg-navy text-white px-7 py-2.5 rounded-full font-bold text-sm hover:bg-blue-bright transition-all shadow-lg shadow-navy/10 active:scale-95"
          >
            Portal Login
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6 text-navy" /> : <Menu className="w-6 h-6 text-navy" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block py-2 text-base font-semibold transition-colors ${
                        isActive ? 'text-blue-bright' : 'text-gray-700'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2">
                {/* Mobile Portal Login Button (Updated Styles) */}
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-navy text-white py-3 rounded-full font-bold hover:bg-blue-bright transition-colors"
                >
                  Portal Login
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;