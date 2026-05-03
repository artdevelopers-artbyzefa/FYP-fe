import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0d1b4b] text-white pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-lg">CUI Abbottabad</p>
                <p className="text-xs text-blue-300 tracking-wider uppercase">FYP Management System</p>
              </div>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">
              The official Final Year Project Management Portal for the Department of Computer Science.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['About', 'Process', 'Eligibility', 'Guidelines'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-sm text-blue-200 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {['FAQ', 'Contact', 'Team', 'Support'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-sm text-blue-200 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-blue-200">
                <i className="fas fa-envelope"></i>
                <span>csfyp@cuiatd.edu.pk</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-blue-200">
                <i className="fas fa-phone"></i>
                <span>+92-992-383591 Ext. 240</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-blue-200">
                <i className="fas fa-map-marker-alt"></i>
                <span>Abbottabad Campus</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-blue-300">
            © {currentYear} COMSATS University Islamabad, Abbottabad Campus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;