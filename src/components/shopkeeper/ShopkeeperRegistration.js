import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerShopkeeper } from '../../redux/slices/shopkeeperSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

const ShopkeeperRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: ''
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.shopkeeper);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...dataToSend } = formData;
      dispatch(registerShopkeeper(dataToSend));
    }
  };

  useEffect(() => {
    if (success) {
      navigate('/shopkeeper/login');
    }
  }, [success, navigate]);

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
            BarbberZ
          </h1>
          <p className="text-gray-300">Shopkeeper Registration</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <fieldset className="space-y-4">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 mb-1 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </motion.div>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 mb-1 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </motion.div>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 mb-1 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </motion.div>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 mb-1 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </motion.div>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                placeholder="Contact Number"
                value={formData.contactNumber}
                onChange={handleChange}
                className={`w-full p-3 mb-1 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 ${errors.contactNumber ? 'border-red-500' : ''}`}
              />
              {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
            </motion.div>
          </fieldset>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full p-3 mt-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-white font-bold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mt-4 p-2 bg-red-100 bg-opacity-10 rounded"
            >
              {error}
            </motion.p>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="mb-4">
            Already have an account?{' '}
            <Link to="/shopkeeper/login" className="text-pink-400 hover:text-pink-300 transition-colors duration-300">
              Login here
            </Link>
          </p>
        </div>
      </motion.main>
    </div>
  );
};

export default ShopkeeperRegistration;