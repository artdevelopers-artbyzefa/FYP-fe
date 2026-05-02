import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, LogIn, GraduationCap } from 'lucide-react';

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
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-navy rounded-full flex items-center justify-center shadow-md group-hover:bg-blue transition-colors">
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

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-blue-bright ${
                      isActive ? 'text-blue-bright' : 'text-gray-700'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link to="/login" className="hidden md:flex btn-primary">
            Portal Login
            <LogIn className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <ul className="flex flex-col gap-3">
              {navLinks.map(link => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block py-2 text-base font-medium transition-colors ${
                        isActive ? 'text-blue-bright' : 'text-gray-700'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  Portal Login
                  <LogIn className="w-4 h-4" />
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
