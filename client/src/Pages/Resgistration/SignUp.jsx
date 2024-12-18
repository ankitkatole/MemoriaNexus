import React, { useState } from 'react'
import axios from 'axios'
import SERVER_URL from '../../constant.mjs'
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const[Loading,setLoading] =useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${SERVER_URL}/user/signup`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
       
     

      
      setLoading(false);
      alert('Signup successful:');
      navigate('/');


    } catch (error) {
      setLoading(false);

      console.error('Error during signup:', error.response ? error.response.data : error.message);
      
    }
  };

  return (
    <>
      <div className="flex justify-center w-screen items-center h-screen ">
        <div className="relative p-10 w-[90vw] sm:w-[80vw] md:w-auto rounded-lg border-cyan-300 border-2 animate-breathe">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6">SIGN UP</h2>
          <form className='w-full md:min-w-96' onSubmit={handleSubmit}>
            <div className='grid grid-flow-row md:grid-cols-2 gap-9 '>
              <div className="mb-6">
                <input
                  className="w-full p-3 text-cyan-300 border-b border-cyan-300"
                  type="text"
                  id="firstName"
                  placeholder="Enter your first name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-6">
                <input
                  className="w-full p-3 text-cyan-300 border-b border-cyan-300"
                  type="text"
                  id="lastName"
                  placeholder="Enter your last name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-6">
              <input
                className="w-full p-3 text-cyan-300 border-b border-cyan-300"
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <input
                className="w-full p-3 text-cyan-300 border-b border-cyan-300"
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <label className="block text-cyan-300 mb-6 text-base">
              Already Have an account? <a href="/" className='hover:underline'>LOG IN</a>
            </label>
            <button
              className="w-full py-2 px-4 text-base font-bold text-cyan-300 border border-cyan-300 rounded-md transition duration-300"
              type="submit"
            >
            { Loading ? 'Signning up...' : 'SIGN UP'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
