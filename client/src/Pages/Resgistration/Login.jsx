import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SERVER_URL from '../../constant.mjs';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/LogoTransparent.svg'
import { X } from "lucide-react";



function Login({onClose, SignUpOpen}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Login Check
  useEffect(() => {
    const loginTokenCookie = Cookies.get('LoginStatus');
    if (loginTokenCookie) {
      navigate('/Home'); 
    }
  }, [navigate]);

  function OpenSignup(){
    onClose(false);
    SignUpOpen(true)
  }


  //Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${SERVER_URL}/user/signin`, {
        email,
        password,
      });

      const { token, message } = response.data;
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
        navigate('/'); 
      }
    } catch (err) {
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
          
          <div className='flex gap-2 items-center mb-6'> 
                    <img src={Logo} alt="" className='w-7 h-7' />
                    <h2 className="text-2xl font-semibold text-cyan-400 ">Log In</h2>
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
            <label className="block text-cyan-300 mb-6 text-base" htmlFor="password">
              New here? <a className="hover:underline" onClick={OpenSignup} >Sign Up</a>
            </label>
            <button
              className="box w-full py-2 px-4 text-base font-bold text-cyan-300 border border-cyan-300 rounded-md transition duration-300"
              type="submit"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
