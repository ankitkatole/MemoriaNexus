import React, { useState } from 'react';
import axios from 'axios';
import SERVER_URL from '../../constant.mjs';
import { X } from "lucide-react";
import Logo from '../../assets/LogoTransparent.svg';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function ResetPassword({ onClose }) {
    const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(''); // Still need to capture OTP for submission
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Send OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${SERVER_URL}/user/forgotpassword`, { email });
      setOtpSent(true);
      setSuccess('OTP sent to your email.');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/user/updatepassword`, {
        email,
        otp, // Include OTP in password reset
        newPassword,
      });
      setSuccess('Password changed successfully.');
      setOtpSent(false);
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      Cookies.remove('LoginStatus');
      navigate('/Login');
    } catch (err) {
      setError('Failed to change password. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex fixed inset-0 z-[9999] justify-center w-screen items-center h-screen">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <div className="relative bg-[#131822] p-10 w-[90vw] sm:w-[82vw] md:w-auto rounded-lg border-cyan-300 border-2 animate-breathe">
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

        <form className="w-full md:min-w-96" onSubmit={handlePasswordChange}>

          <div className="mb-6 flex gap-2 items-center">
            <input
              className="w-full p-3 text-cyan-300 border-b border-cyan-300"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={otpSent}
            />
            <button 
              type="button"
              onClick={handleSendOtp}
              className="py-2 px-4 text-cyan-300 border border-cyan-300 whitespace-nowrap rounded-md"
              disabled={otpSent || loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>

          {otpSent && (
            <div className="mb-6">
              <input
                className="w-full p-3 text-cyan-300 border-b border-cyan-300"
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          {otpSent && (
            <>
              <div className="mb-6">
                <input
                  className="w-full p-3 text-cyan-300 border-b border-cyan-300"
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <input
                  className="w-full p-3 text-cyan-300 border-b border-cyan-300"
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                className="w-full py-2 px-4 text-base font-bold text-cyan-300 border border-cyan-300 rounded-md"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Changing Password...' : 'Reset Password'}
              </button>
            </>
          )}

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
