import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SERVER_URL from '../../constant.mjs';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/LogoTransparent.svg'
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import ResetPassword from './ResetPassword';



function Login({onClose, SignUpOpen}) {
  const navigate = useNavigate();
    const [IsResetpassOpen, setIsResetpassOpen] = useState(false);
  
  const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Login Check
  useEffect(() => {
    const loginTokenCookie = Cookies.get('LoginStatus');
    if (loginTokenCookie) {
      navigate('/Dashboard'); 
    }
  }, [navigate]);

  function OpenSignup(){
    onClose(false);
    SignUpOpen(true)
  }


  //Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${SERVER_URL}/user/signin`, {
        email,
        password,
      });

      const { token, message,user } = response.data;
      Cookies.set('LoginStatus', JSON.stringify(token), {
        expires: 1,
        path: '/',
        secure: true,
        sameSite: 'strict',
      });

      if (response.status === 200) {
        const loginTokenCookie = Cookies.get('LoginStatus');
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${loginTokenCookie}`;

        console.log(message);
        Cookies.set('LoginStatus', JSON.stringify(token), {
          expires: 1,
          path: '/',
          secure: true,
          sameSite: 'strict',
        });
       
{user &&
  console.log(user.username);
        Cookies.set('Userid', user.username, {
          expires: 1,
          path: '/',
          secure: true,
          sameSite: 'strict',
        });
        Cookies.set('ProfileImage', JSON.stringify(user.profileImage), {
          expires: 1,
          path: '/',
          secure: true,
          sameSite: 'strict',
        });
        Cookies.set('Email', JSON.stringify(user.email), {
          expires: 1,
          path: '/',
          secure: true,
          sameSite: 'strict',
        });
      }
        setLoading(false);

        navigate('/Dashboard'); 
      }
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.status ) {
        setError(err.response.data.message);
      }  else {
        setError('An error occurred. Please try again later.');
      }

      console.error('Error during login:', err);
    }
  };

  return (
    <>
     {IsResetpassOpen && createPortal(
                
                <ResetPassword onClose={setIsResetpassOpen}  />,
                document.body
            
              )}
      <div className="flex fixed inset-0 z-[9999]  justify-center w-screen items-center h-screen">
     
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
      
      ></div>
      
        <div className="relative bg-[#131822] p-10 w-[90vw] sm:w-[80vw] md:w-auto rounded-lg border-cyan-300 border-2 animate-breathe">
          
            <button 
                      onClick={() => onClose(false)} 
                      className="absolute top-4 p-1 rounded-full right-4 text-cyan-300 hover:text-cyan-500"
                    >
                      <X size={24} />
                    </button>
          
           <div className="flex gap-2 mb-6 items-center justify-center">
                    <img src={Logo} alt="" className="w-9 h-9" />
                    <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text">
                      MemoriaNexus
                    </h1>
                  </div>
          <form className="w-full md:min-w-96" onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                className="w-full p-3 text-cyan-300 border-b border-cyan-300"
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <input
                className="w-full p-3 text-cyan-300 border-b border-cyan-300"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <label className="block text-cyan-300 mb-2 text-base" htmlFor="password">
              New here? <a className="hover:underline" onClick={OpenSignup} >Sign Up</a>
            </label>

            <p className='text-cyan-300 mb-6 text-base cursor-pointer hover:underline'  onClick={() => setIsResetpassOpen(true)}  > forgot password? </p>

            <button
              className="box w-full py-2 px-4 text-base font-bold text-cyan-300 border border-cyan-300 rounded-md transition duration-300"
              type="submit"
            >
              {loading ? 'Logging up...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
