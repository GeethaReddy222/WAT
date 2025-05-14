import React, { useState, useEffect } from 'react';
import { Link, useLocation} from 'react-router-dom';
import { 
  FaHome, 
  FaInfoCircle, 
  FaSignInAlt, 
  FaUserPlus,
  FaUserGraduate,
  FaUserTie,
  FaUserShield,
  FaCalendarAlt
} from 'react-icons/fa';

import logo from '../../assets/logo.png';
import WAT_ABSTRACT from '../../assets/WAT_ABSTRACT.pdf';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, [location]);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/studentregister" ||
    location.pathname === "/facultyregister" ||
    location.pathname === "/adminregister";

  const isHomePage = location.pathname === "/";

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 mr-2 rounded-full border-2 border-white"
          />
          <h1 className="text-xl font-bold">Weekly Assessment Tests</h1>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="focus:outline-none text-white hover:text-yellow-300 transition-colors"
          >
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`md:flex items-center md:space-x-6 ${isOpen ? 'block mt-4' : 'hidden'} md:mt-0`}>
          {/* Home - always visible */}
          <div className="relative">
            <Link
              to="/"
              className="flex items-center px-3 py-2 hover:text-yellow-300 transition-colors"
              onMouseEnter={() => setHoveredLink('home')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <FaHome className="mr-2" />
              Home
            </Link>
            <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-300 transition-all duration-300 ${
              hoveredLink === 'home' || (hoveredLink === null && location.pathname === "/") ? 'w-full' : 'w-0'
            }`}></span>
          </div>

          {/* About */}
          <div className="relative">
            <Link
              to="/about"
              className="flex items-center px-3 py-2 hover:text-yellow-300 transition-colors"
              onMouseEnter={() => setHoveredLink('about')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <FaInfoCircle className="mr-2" />
              About
            </Link>
            <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-300 transition-all duration-300 ${
              hoveredLink === 'about' || (hoveredLink === null && location.pathname === "/about") ? 'w-full' : 'w-0'
            }`}></span>
          </div>

          {/* Show Login/Register on home page OR if not authenticated and not on auth pages */}
          {(isHomePage || (!isAuthenticated && !isAuthPage)) && (
            <>
              {/* Login */}
              <div className="relative">
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 hover:text-yellow-300 transition-colors"
                  onMouseEnter={() => setHoveredLink('login')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <FaSignInAlt className="mr-2" />
                  Login
                </Link>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-300 transition-all duration-300 ${
                  hoveredLink === 'login' || (hoveredLink === null && location.pathname === "/login") ? 'w-full' : 'w-0'
                }`}></span>
              </div>
              
              {/* Register */}
              <div className="relative">
                <button
                  onClick={() => setIsRegisterOpen(!isRegisterOpen)}
                  className="flex items-center px-3 py-2 hover:text-yellow-300 transition-colors"
                  onMouseEnter={() => setHoveredLink('register')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <FaUserPlus className="mr-2" />
                  Register
                </button>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-300 transition-all duration-300 ${
                  hoveredLink === 'register' ? 'w-full' : 'w-0'
                }`}></span>
                {isRegisterOpen && (
                  <div className="absolute mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50 border border-gray-200">
                    <Link
                      to="/studentregister"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setIsRegisterOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      <FaUserGraduate className="mr-2 text-blue-600" />
                      Student
                    </Link>
                    <Link
                      to="/facultyregister"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setIsRegisterOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      <FaUserTie className="mr-2 text-green-600" />
                      Faculty
                    </Link>
                    <Link
                      to="/adminregister"
                      className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setIsRegisterOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      <FaUserShield className="mr-2 text-purple-600" />
                      Admin
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* WAT TIMETABLE - always visible */}
          <a
            href={WAT_ABSTRACT}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition duration-300"
          >
            <FaCalendarAlt className="mr-2" />
            WAT TIMETABLE
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;