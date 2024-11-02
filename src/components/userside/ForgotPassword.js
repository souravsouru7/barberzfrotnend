import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      navigate('/reset-password');
    }
  }, [success, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-gray-100">
      <motion.main 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-2xl mt-20"
      >
        <section className="text-center mb-8">
          <motion.h1 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"
          >
            Forgot Password
          </motion.h1>
          <p className="text-gray-300">Enter your email to receive an OTP.</p>
        </section>

        <section>
          <form onSubmit={handleSubmit}>
            <fieldset className="mb-4">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="email" className="block mb-2 font-semibold">Email Address:</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 mb-1 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
                  required
                />
              </motion.div>
            </fieldset>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full p-3 mt-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-white font-bold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </motion.button>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 mt-4 p-2 bg-red-100 bg-opacity-10 rounded"
              >
                {String(error)}
              </motion.p>
            )}
            {success && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-500 mt-4 p-2 bg-green-100 bg-opacity-10 rounded"
              >
                OTP sent to your email
              </motion.p>
            )}
          </form>

          <div className="mt-8 text-center">
            <motion.a 
              href="/login"
              whileHover={{ scale: 1.05 }}
              className="text-pink-400 hover:text-pink-300 transition-colors duration-300"
            >
              Back to Login
            </motion.a>
          </div>
        </section>
      </motion.main>

      <footer className="w-full bg-gray-900 bg-opacity-50 text-gray-300 py-5 text-center mt-8">
        <p>&copy; 2024 Barber Shop Booking. All rights reserved.</p>
        <div className="mt-3 space-x-4">
          <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">Terms of Service</a>
          <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword;