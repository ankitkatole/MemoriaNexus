import React, { useState } from 'react';
import axios from 'axios';
import SERVER_URL from '../../constant.mjs';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/LogoTransparent.svg'

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState(''); // State for frontend validation errors

  const validateForm = () => {
    const { firstName, lastName, email, password } = formData;

    // Name validation: Only alphabets allowed
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      return 'First and last names should only contain alphabets.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    // Password validation: Minimum 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and contain both letters and numbers.';
    }

    return '';
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationError(''); // Reset previous errors

    const validationErrorMsg = validateForm();
    if (validationErrorMsg) {
      setLoading(false);
      setValidationError(validationErrorMsg);
      return;
    }

    try {
      await axios.post(`${SERVER_URL}/user/signup`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setLoading(false);
      alert('Signup successful!');
      navigate('/');
    } catch (error) {
      setLoading(false);
      
      if (error.response && error.response.status) {
        setError(error.response.data.message);
      } else if (error.response?.errors?.[0]) {
        setError(error.response.errors[0].message);
      } else {
        setError('An error occurred during signup. Please try again.');
      }

      console.error('Error during signup:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <div className="flex justify-center w-screen items-center h-screen">
        <div className="relative p-10 w-[90vw] sm:w-[80vw] md:w-auto rounded-lg border-cyan-300 border-2 animate-breathe">
          <div className='flex gap-2 items-center mb-6'> 
            <img src={Logo} alt="" className='w-7 h-7' />
            <h2 className="text-2xl font-semibold text-cyan-400 ">SIGN UP</h2>
          </div>
          <form className="w-full md:min-w-96" onSubmit={handleSubmit}>
            <div className="grid grid-flow-row md:grid-cols-2 gap-9">
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
            {validationError && <p className="text-red-500 mb-4  ">{validationError}</p>} {/* Display validation error message */}
            {error && <p className="text-red-500 mb-4 ">{error}</p>} {/* Display server error message */}
            <label className="block text-cyan-300 mb-6 text-base">
              Already Have an account? <a href="/" className="hover:underline">LOG IN</a>
            </label>
            <button
              className="w-full py-2 px-4 text-base font-bold text-cyan-300 border border-cyan-300 rounded-md transition duration-300"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'SIGN UP'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
