import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logoText from '/src/assets/logo.png';
import VerifyLogin from './VerifyLogin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const API_CALL = import.meta.env.VITE_API_CALL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API_CALL}/auth/login`, { email });
      console.log('Logged in:', response.data);
      if (response.data.status === 'success' && response.data.message.includes('Verification code sent')) {
        setShowOtpPopup(true);
      } else if (response.data.status === 'success' && !response.data.message.includes('Verification code sent')) {
        const { token, data: { user } } = response.data;
        if (user.role === 'admin' || user.role === 'super-admin') {
          navigate('/admin/dashboard', { state: { token, user } });
        } else {
          alert('Restricted access: Only admins or super-admins can log in.');
        }
      }
    } catch (err) {
      console.error('Error details:', err.response?.data, err.response?.status, err.response?.headers);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleOtpVerify = async (otp) => {
    try {
      console.log('Verifying OTP:', { email, otp }); // Debug log
      if (!otp || otp.trim() === '') {
        setError('Please provide a valid OTP code');
        return;
      }
      const response = await axios.post(`${API_CALL}/auth/verifyEmailOrPhone`, { email, otp });
      console.log('OTP Verified:', response.data);
      if (response.data.status === 'success') {
        const { token, data: { user } } = response.data;
        if (user.role === 'admin' || user.role === 'super-admin') {
          navigate('/admin/dashboard', { state: { token, user } });
        } else {
          alert('Restricted access: Only admins or super-admins can log in.');
        }
      }
    } catch (err) {
      console.error('OTP Verification Error:', err.response?.data, err.response?.status, err.response?.headers);
      setError(err.response?.data?.message || 'Invalid OTP or server error');
    } finally {
      setShowOtpPopup(false); // Ensure popup closes
    }
  };

  const resendOtp = async () => {
    try {
      const response = await axios.post(`${API_CALL}/auth/login/resendOtp`, { email });
      console.log('Resend OTP:', response.data);
      if (response.data.status === 'success') {
        setError('Verification code resent successfully');
      }
    } catch (err) {
      console.error('Resend OTP Error:', err.response?.data, err.response?.status, err.response?.headers);
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const backgroundImages = [
    'https://i.pinimg.com/736x/b8/0d/02/b80d025503e3f7c2008b450a46716ae1.jpg',
    'https://i.pinimg.com/1200x/0e/c8/20/0ec8201c6d715d5079e6d9949c067ee6.jpg',
    'https://i.pinimg.com/736x/e2/a9/c5/e2a9c573d7972606c419a4ce6ea91364.jpg',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <img src={logoText} alt="Untitle UI Logo" className="h-10 mx-auto mb-2" />
            <h1 className="text-xl font-semibold">Welcome back, Admin</h1>
            <p className="text-gray-500">Please enter your details</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              className="w-full bg-gray-100 text-gray-700 p-2 rounded border flex items-center justify-center gap-2 hover:bg-gray-200"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Log in with Google
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border rounded"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <motion.button
              type="submit"
              className="w-full bg-[#bf40bf] text-white p-2 rounded hover:bg-[#9932cc] transition"
              whileTap={{ scale: 0.95 }}
            >
              Log in
            </motion.button>
            <p className="text-center text-sm text-gray-500">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-indigo-600 hover:underline">Sign up for free</Link>
            </p>
            {showOtpPopup && (
              <button
                type="button"
                onClick={resendOtp}
                className="w-full text-center text-sm text-purple-600 hover:underline mt-2"
              >
                Resend OTP
              </button>
            )}
          </form>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-4 md:p-12 flex items-center justify-center relative hidden md:block" style={{ backgroundColor: 'black' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0"
            style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        <motion.div
          className="text-center bg-transparent backdrop-blur bg-opacity-80 p-6 rounded-lg flex items-center justify-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={logoText} className="h-28" alt="Logo" />
          <h1 className="text-white font-bold text-4xl">Blumdate</h1>
        </motion.div>
      </div>
      {showOtpPopup && (
        <VerifyLogin
          email={email}
          onVerify={handleOtpVerify}
          onClose={() => setShowOtpPopup(false)}
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};

export default Login;