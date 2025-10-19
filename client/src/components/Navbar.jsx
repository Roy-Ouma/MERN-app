import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaFacebook, FaInstagram, FaTwitterSquare, FaYoutube } from 'react-icons/fa';
import { Link } from "react-router-dom";
import useStore from "../store";
import Logo from '../components/Logo';
import ThemeSwitch from './Switch';

const Navbar = () => {
  const { user } = useStore();
  const [showProfile, setShowProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function getInitials(fullname) {
      if (!fullname || typeof fullname !== 'string') return '?';
      const names = fullname.trim().split(' ').filter(Boolean);
      if (names.length === 0) return '?';
      if (names.length === 1) {
          return names[0].slice(0, 2).toUpperCase() || '?';
      }
      const first = names[0][0] ? names[0][0].toUpperCase() : '';
      const last = names[names.length - 1][0] ? names[names.length - 1][0].toUpperCase() : '';
      return (first + last) || '?';
  }

  return (
    <nav className="w-full z-50 sticky top-0 left-0 bg-white dark:bg-gray-900 shadow-md border-b border-orange-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center py-4 px-4 md:px-8 gap-4">
        {/* Left: socials (desktop only) */}
        <div className='hidden md:flex items-center gap-3 text-[20px]'>
          <Link to='/' className='text-red-600'><FaYoutube /></Link>
          <Link to='/' className='text-blue-600'><FaFacebook /></Link>
          <Link to='/' className='text-rose-600'><FaInstagram /></Link>
          <Link to='/' className='text-blue-500'><FaTwitterSquare /></Link>
        </div>

        {/* Center: logo */}
        <div className="flex-1 flex items-center justify-center md:justify-start">
          <Link to="/" aria-label="Home">
            <Logo />
          </Link>
        </div>

        {/* Desktop nav links (center/right) */}
        <div className='hidden md:flex flex-1 items-center justify-center'>
          <ul className='flex gap-6 md:gap-8 text-base text-black dark:text-white'>
            <li><Link to='/' className='hover:text-red-600 dark:hover:text-red-600 transition-colors'>Home</Link></li>
            <li><Link to='/blog' className='hover:text-red-600 dark:hover:text-red-600 transition-colors'>Blog</Link></li>
            <li><Link to='/live' className='hover:text-orange-500 dark:hover:text-orange-400 font-semibold transition-colors'>Live</Link></li>
            <li><Link to='/contact' className='hover:text-red-600 dark:hover:text-red-600 transition-colors'>Contact</Link></li>
            <li><Link to='/about' className='hover:text-red-600 dark:hover:text-red-600 transition-colors'>About</Link></li>
          </ul>
        </div>

        {/* Right: theme + sign-in + profile (desktop) */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <ThemeSwitch />
          {!user?.token ? (
            <Link
              to="/sign-in"
              className="px-4 py-1.5 rounded-full font-semibold bg-slate-900 text-white transition-colors dark:bg-white dark:text-gray-600"
              aria-label="Sign in"
            >
              Sign in
            </Link>
          ) : (
            <button
              type="button"
              className="relative flex items-center gap-2 focus:outline-none"
              onClick={() => setShowProfile((p) => !p)}
              aria-haspopup="true"
              aria-expanded={showProfile}
            >
              {user?.user?.image ? (
                <img src={user.user.image} alt="profile" className='w-8 h-8 rounded-full object-cover' />
              ) : (
                <span className='w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium'>
                  {getInitials(user?.user?.name)}
                </span>
              )}
              <span className='font-medium text-black dark:text-gray-300'>
                {user?.user?.name?.split(' ')[0]}
              </span>
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden ml-2 text-2xl" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open Menu">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-3/4 max-w-xs bg-white dark:bg-gray-900 h-full shadow-xl p-6 overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <Link to="/" onClick={() => setMobileOpen(false)}>
                <Logo />
              </Link>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-2xl">
                <AiOutlineClose className="text-gray-800 dark:text-white" />
              </button>
            </div>

            <nav className="flex flex-col gap-5">
              <Link to='/' onClick={() => setMobileOpen(false)} className='text-lg font-medium text-black dark:text-white'>Home</Link>
              <Link to='/blog' onClick={() => setMobileOpen(false)} className='text-lg font-medium text-black dark:text-white'>Blog</Link>
              <Link to='/live' onClick={() => setMobileOpen(false)} className='text-lg font-semibold text-orange-500 dark:text-orange-400'>Live</Link>

              <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

              <Link to='/contact' onClick={() => setMobileOpen(false)} className='text-base text-black dark:text-white'>Contact</Link>
              <Link to='/about' onClick={() => setMobileOpen(false)} className='text-base text-black dark:text-white'>About</Link>

              <div className="mt-6 flex items-center gap-3">
                <ThemeSwitch />
                {!user?.token ? (
                  <Link
                    to="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="ml-auto inline-flex px-4 py-1.5 rounded-full font-semibold bg-slate-900 text-white dark:bg-white dark:text-gray-600"
                  >
                    Sign in
                  </Link>
                ) : (
                  <div className="ml-auto flex items-center gap-3">
                    {user?.user?.image ? (
                      <img src={user.user.image} alt="profile" className='w-8 h-8 rounded-full object-cover' />
                    ) : (
                      <span className='w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium'>
                        {getInitials(user?.user?.name)}
                      </span>
                    )}
                    <span className="font-medium text-black dark:text-gray-300">{user?.user?.name?.split(' ')[0]}</span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-4">
                <Link to='/' className='text-red-600 text-2xl'><FaYoutube /></Link>
                <Link to='/' className='text-blue-600 text-2xl'><FaFacebook /></Link>
                <Link to='/' className='text-rose-600 text-2xl'><FaInstagram /></Link>
                <Link to='/' className='text-blue-500 text-2xl'><FaTwitterSquare /></Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;