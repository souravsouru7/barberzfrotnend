import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PreloadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFadeIn(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleUserTypeSelection = (userType) => {
    if (userType === 'user') {
      navigate('/login');
    } else {
      navigate('/shopkeeper/login');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-900 to-purple-900 text-white"
    >
      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-pink-500 animate-spin"></div>
              <div className="absolute inset-0 rounded-full border-r-4 border-l-4 border-purple-500 animate-spin-slow"></div>
            </div>
            <motion.p 
              className="mt-4 text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-bold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                BaRbberZ
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Are you a user or a shopkeeper?
            </motion.p>

            <motion.div 
              className="space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUserTypeSelection('user')}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-pink-500/25"
              >
                User
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUserTypeSelection('shopkeeper')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25"
              >
                Shopkeeper
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PreloadingScreen;