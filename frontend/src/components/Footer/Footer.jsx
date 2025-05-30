import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegCopyright } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-white text-blue-700 p-2 rounded-lg mr-3">
                <FaRegCopyright size={24} />
              </div>
              <h2 className="text-2xl font-bold">WAT System</h2>
            </div>
            <p className="text-blue-200">
              Empowering education through weekly assessments and performance tracking.
            </p>
            <div className="flex space-x-4 pt-2">
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="bg-blue-800 hover:bg-blue-700 p-2 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold uppercase tracking-wider border-b border-blue-500 pb-2">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MdOutlineEmail className="mt-1 mr-3 text-blue-300" size={18} />
                <a href="mailto:wat.support@gmail.com" className="hover:text-blue-300 transition">
                  wat.support@gmail.com
                </a>
              </div>
              <div className="flex items-start">
                <FaPhone className="mt-1 mr-3 text-blue-300" size={16} />
                <a href="tel:+919876543210" className="hover:text-blue-300 transition">
                  +91-9876543210
                </a>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-blue-300" size={16} />
                <span>
                  CSE Dept, RGUKT, R.K.Valley, India
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold uppercase tracking-wider border-b border-blue-500 pb-2">
              Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", path: "/about" },
                { name: "Features", path: "/features" },
                { name: "FAQs", path: "/faq" },
                { name: "Contact", path: "/contact" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path} 
                    className="hover:text-blue-300 transition flex items-center"
                  >
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold uppercase tracking-wider border-b border-blue-500 pb-2">
              Newsletter
            </h3>
            <p className="text-blue-200">
              Subscribe to get updates on new features and improvements.
            </p>
            <div className="flex mt-4">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 text-white-800 rounded-l focus:outline-none w-full"
              />
              <button className="bg-blue-800 hover:bg-blue-800 px-4 py-2 rounded-r transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright and Bottom Links */}
        <div className="border-t border-blue-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-blue-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Weekly Assessment Tests. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="/privacy" className="text-blue-300 hover:text-white text-sm transition">
              Privacy Policy
            </a>
            <a href="/terms" className="text-blue-300 hover:text-white text-sm transition">
              Terms of Service
            </a>
            <a href="/cookies" className="text-blue-300 hover:text-white text-sm transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;