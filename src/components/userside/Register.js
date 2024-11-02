import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, verifyOtp } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: authLoading, error, otpSent, otpVerified } = useSelector((state) => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // New useEffect for handling redirection after OTP verification
  useEffect(() => {
    if (otpVerified) {
      // Optional: Delay before redirecting to show the success message
      const redirectTimer = setTimeout(() => {
        navigate('/login');
      }, 2000); // 2-second delay

      return () => clearTimeout(redirectTimer);
    }
  }, [otpVerified, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Full Name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) errors.email = 'Email Address is required';
    else if (!emailRegex.test(email)) errors.email = 'Please enter a valid email address';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const userData = { name, email, password, phoneNumber };
    dispatch(registerUser(userData));
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpData = { email, otp };
    dispatch(verifyOtp(otpData));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-gray-100">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
        <p className="text-white ml-3">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-gray-100">
      <motion.main 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-2xl mt-20"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            BaRbberZ
          </h1>
          <p className="text-gray-300">Style meets convenience</p>
        </motion.div>

        <section className="text-center mb-8">
          <motion.h2 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-3xl font-bold mb-2 text-white"
          >
            Create Your Account
          </motion.h2>
          <p className="text-gray-300">Join us and start booking your barber appointments easily.</p>
        </section>

        <section>
          {authLoading ? (
            <div className="flex justify-center items-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
              <p className="ml-3">Loading...</p>
            </div>
          ) : !otpSent ? (
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="fullName" className="block mb-2 font-semibold">Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-3 mb-1 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 ${formErrors.name ? 'border-red-500' : ''}`}
                />
                {formErrors.name && <p className="text-red-500 mb-4">{formErrors.name}</p>}
              </motion.div>

              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="email" className="block mb-2 mt-4 font-semibold">Email Address:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3 mb-1 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 ${formErrors.email ? 'border-red-500' : ''}`}
                />
                {formErrors.email && <p className="text-red-500 mb-4">{formErrors.email}</p>}
              </motion.div>

              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="phone" className="block mb-2 mt-4 font-semibold">Phone Number:</label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 mb-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="password" className="block mb-2 mt-4 font-semibold">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-3 mb-1 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 ${formErrors.password ? 'border-red-500' : ''}`}
                />
                {formErrors.password && <p className="text-red-500 mb-4">{formErrors.password}</p>}
              </motion.div>

              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="confirmPassword" className="block mb-2 mt-4 font-semibold">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 mb-1 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {formErrors.confirmPassword && <p className="text-red-500 mb-4">{formErrors.confirmPassword}</p>}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-4 flex items-center mt-4"
              >
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  required
                  className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="terms">
                  I agree to the{' '}
                  <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">
                    Terms and Conditions
                  </a>
                </label>
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full p-3 mt-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-white font-bold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Register
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="otp" className="block mb-2 font-semibold">Enter OTP:</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full p-3 mb-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
                />
              </motion.div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full p-3 mt-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-white font-bold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Verify OTP
              </motion.button>
            </form>
          )}

          {otpVerified && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500 mt-4 p-2 bg-green-100 bg-opacity-10 rounded"
            >
              OTP Verified! Your account has been created. Redirecting to login...
            </motion.p>
          )}

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mt-4 p-2 bg-red-100 bg-opacity-10 rounded"
            >
              {typeof error === 'string' ? error : error.message || 'An error occurred'}
            </motion.p>
          )}

          <div className="mt-8 text-center">
            <p className="mb-4">
              Already have an account?{' '}
              <a href="/login" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">
                Login here
              </a>
            </p>
          </div>
        </section>
      </motion.main>

      <footer className="w-full bg-gray-900 bg-opacity-50 text-gray-300 py-5 text-center mt-8">
        <p>&copy; 2024 BaRbberZ Booking. All rights reserved.</p>
        <div className="mt-3 space-x-4">
          <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">Terms of Service</a>
          <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Register;
