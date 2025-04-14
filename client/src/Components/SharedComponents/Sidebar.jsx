import React, { useState ,useEffect} from 'react';
import Logo from '../../assets/LogoTransparent.svg';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { createPortal } from "react-dom";
import ResetPassword from '../../Pages/Resgistration/ResetPassword'
import green from '../../assets/green.webp'
import tom from '../../assets/tom.webp'
import tom2 from '../../assets/tom2.webp'
import tom3 from '../../assets/tom3.webp'
import pinkpanther from '../../assets/pinkpanther.webp'
import spondgebox from '../../assets/spondgebox.webp'


function Sidebar({ className, setonlineStatus, onlineStatus }) {

  const ProfileImagearr = [green, tom, tom2, pinkpanther, spondgebox,tom3];
  const randomIndex = Math.floor(Math.random() * ProfileImagearr.length);
      const [Username, setUsername] = useState('');
      const [ProfileImage, setProfileImage] = useState(ProfileImagearr[randomIndex]);
  
  const navigate = useNavigate();
  const [isMenuClicked, setisMenuClicked] = useState(false);
  const [IsResetpassOpen, setIsResetpassOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State to toggle settings dropdown

    useEffect(() => {
        
          var userIdFromCookie = Cookies.get('Userid');
          // var ProfileImageCooke = Cookies.get('ProfileImage');
          if (userIdFromCookie) {
            setUsername(userIdFromCookie); // Update Username state
          }
          // if(ProfileImageCooke){
          //   setProfileImage(JSON.parse(ProfileImageCooke));
          // }
       
        }, []);

  function Logout() {
    Cookies.remove('LoginStatus');
    navigate('/');
  }

  const navLinks = [
    { link: 'Dashboard', href: '/Dashboard' },
    { link: 'User Chat', href: '/UserChat' },
    { link: 'Horizon Ai', href: '/Chat' },
    { link: 'ChatNexus', href: '/ChatNexus' },
    // { link: 'Settings', href: '#' },
  ];

  return (
    <>
    {IsResetpassOpen && createPortal(
                
                <ResetPassword onClose={setIsResetpassOpen}  />,
                document.body
            
              )}
      {/* Button for mobile screens to toggle the menu */}
      <div className='flex sticky w-screen z-50 top-0 p-2 lg:hidden right-5 justify-between bg-black '> 
        <button
          className="p-2 rounded-md"
          onClick={() => setisMenuClicked(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        {onlineStatus && (
          <button
            className="p-2 rounded-md"
            onClick={() => setonlineStatus(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Sidebar for larger screens */}
      <aside className={`hidden ${className} lg:flex flex-col gap-4 p-4 w-64 bg-gray-900 border-r pr-5 border-[#646cff] h-screen`}>
        <div className="flex gap-2 my-3 items-center justify-center">
          <img src={Logo} alt="" className="w-9 h-9" />
          <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text">
            MemoriaNexus
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center w-full gap-3 mb-4 ">
        <img src={ProfileImage} alt="" className='h-28 w-28 bg-[#131822] border-2 border-cyan-300 rounded-full object-cover  left-1/2' />
         <p className='text-base text-center text-cyan-300'>@{Username}</p>
        </div>

        {navLinks.slice(0, 4).map((link, index) => (
          <Link
            key={index}
            to={link.href}
            className="px-4 py-2 text-white rounded-lg box hover:bg-gray-800"
          >
            {link.link}
          </Link>
        ))}

        {/* Settings dropdown */}
        <div className="relative">
          <button
            className="flex items-center justify-between w-full px-4 py-2 text-white rounded-lg box hover:bg-gray-800"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            Settings
            <ChevronDown className={`h-5 w-5 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSettingsOpen && (
            <div className="absolute left-0 w-full my-2 bg-gray-800 rounded-lg shadow-lg">
              <button
                onClick={() => setIsResetpassOpen(true)} 
                className="w-full px-4 py-2 text-left text-white rounded-none hover:bg-gray-700"
              >
                Reset Password
              </button>
              <button
                className="w-full px-4 py-2 text-left text-white rounded-none hover:bg-gray-700"
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
          className="absolute p-2 top-5 left-5"
          onClick={() => setisMenuClicked(false)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center justify-center w-full gap-3 mb-4 ">
        <img src={ProfileImage} alt="" className='h-28 w-28 bg-[#131822] border-2 border-cyan-300 rounded-full object-cover  left-1/2' />
         <p className='text-base text-center text-cyan-300'>@{Username}</p>
        </div>

        {navLinks.map((navLink, index) => (
          <div
            className="py-2 text-4xl border-b-2 rounded-sm navLink border-cyan-300"
            key={index}
          >
            <Link to={navLink.href}>{navLink.link}</Link>
          </div>
        ))}

        <a
          className="flex items-center gap-2 py-2 text-4xl border-b-2 rounded-sm navLink border-cyan-300"
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
