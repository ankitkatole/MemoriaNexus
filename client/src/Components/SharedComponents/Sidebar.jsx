import React, { useState } from 'react';
import Logo from '../../assets/LogoTransparent.svg';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { createPortal } from "react-dom";
import ResetPassword from '../../Pages/Resgistration/ResetPassword'


function Sidebar({ className, setonlineStatus, onlineStatus }) {

  
  const navigate = useNavigate();
  const [isMenuClicked, setisMenuClicked] = useState(false);
  const [IsResetpassOpen, setIsResetpassOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State to toggle settings dropdown

  function Logout() {
    Cookies.remove('LoginStatus');
    navigate('/');
  }

  const navLinks = [
    { link: 'Dashboard', href: '/Dashboard' },
    { link: 'User Chat', href: '/UserChat' },
    { link: 'Horizon Ai', href: '/Chat' },
    // { link: 'Settings', href: '#' },
  ];

  return (
    <>
    {IsResetpassOpen && createPortal(
                
                <ResetPassword onClose={setIsResetpassOpen}  />,
                document.body
            
              )}
      {/* Button for mobile screens to toggle the menu */}
      <div className='flex sticky w-screen top-0 p-2 lg:hidden right-5 justify-between bg-black '> 
        <button
          className="rounded-md  p-2"
          onClick={() => setisMenuClicked(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        {onlineStatus && (
          <button
            className="rounded-md  p-2"
            onClick={() => setonlineStatus(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Sidebar for larger screens */}
      <aside className={`hidden ${className} lg:flex flex-col gap-4 p-4 w-64 bg-gray-900 border-r pr-5 border-[#646cff] h-screen`}>
        <div className="flex gap-4 my-3">
          <img src={Logo} alt="" className="w-7 h-7" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            MemoriaNexus
          </h1>
        </div>

        <div className="h-28 w-28 relative text-5xl left-1/2 -translate-x-1/2 mb-4 bg-[#131822] border-2 border-cyan-300 rounded-full flex items-center justify-center text-white">
          G
        </div>

        {navLinks.slice(0, 3).map((link, index) => (
          <Link
            key={index}
            to={link.href}
            className="text-white box hover:bg-gray-800 py-2 px-4 rounded-lg"
          >
            {link.link}
          </Link>
        ))}

        {/* Settings dropdown */}
        <div className="relative">
          <button
            className="text-white box hover:bg-gray-800 flex items-center justify-between px-4 py-2 w-full rounded-lg"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            Settings
            <ChevronDown className={`h-5 w-5 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSettingsOpen && (
            <div className="absolute left-0 my-2  w-full bg-gray-800 rounded-lg shadow-lg">
              <button
                onClick={() => setIsResetpassOpen(true)} 
                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-none"
              >
                Reset Password
              </button>
              <button
                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-none"
                onClick={Logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile menu slider */}
      <div
        className={`slider ${isMenuClicked ? 'translate-x-0' : '-translate-x-full'} w-64 bg-gray-900 border-r border-cyan-300 fixed lg:hidden z-[7777] inset-0 h-screen transition-transform duration-500 text-white text-5xl flex flex-col gap-4 justify-center items-center`}
      >
        <button
          className="absolute top-5 left-5  p-2"
          onClick={() => setisMenuClicked(false)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {navLinks.map((navLink, index) => (
          <div
            className="navLink border-b-2 text-4xl border-cyan-300 py-2 rounded-sm"
            key={index}
          >
            <Link to={navLink.href}>{navLink.link}</Link>
          </div>
        ))}

        <a
          className="navLink flex items-center gap-2 border-b-2 text-4xl border-cyan-300 py-2 rounded-sm"
          onClick={Logout}
        >
          <LogOut size={26} />
          Logout
        </a>
      </div>
    </>
  );
}

export default Sidebar;
