import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      errors.email = 'Email Address is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

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
            Log In
          </motion.h2>
          <p className="text-gray-300">Access your account to manage your bookings.</p>
        </section>

        <section>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
              <p>Loading...</p>
            </div>
          ) : (
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-3 mb-1 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 ${formErrors.email ? 'border-red-500' : ''}`}
                  />
                  {formErrors.email && <p className="text-red-500 mb-4">{formErrors.email}</p>}
                </motion.div>

                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
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
              </fieldset>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full p-3 mt-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-white font-bold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Log In
              </motion.button>
              <motion.a 
                href='/forgot-password'
                whileHover={{ scale: 1.05 }}
                className="block mt-4 text-pink-400 hover:text-pink-300 transition-colors duration-300"
              >
                Forgot password?
              </motion.a>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 mt-4 p-2 bg-red-100 bg-opacity-10 rounded"
                >
                  {typeof error === 'string' ? error : error.message || 'An error occurred'}
                </motion.p>
              )}
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="mb-4">
              New here? <a href="/register" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">Create an account</a>
            </p>
           
          </div>
        </section>
      </motion.main>

      <footer className="w-full bg-gray-900 bg-opacity-50 text-gray-300 py-5 text-center mt-8">
        <p>&copy; 2024 BaRbbeZ Booking. All rights reserved.</p>
        <div className="mt-3 space-x-4">
          <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">Terms of Service</a>
          <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;