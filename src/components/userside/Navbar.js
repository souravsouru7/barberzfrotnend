import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, User, Menu, X, Home, UserCircle, Calendar, Heart, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../redux/slices/authSlice';
import FavoritesModal from './FavoritesModal';


const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Get notifications and messages from Redux store




  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('userLocation');
    localStorage.removeItem('lastSearchResults');
    navigate('/login');
  };



  const navItems = [
    { name: 'Dashboard', path: '/home', icon: Home },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Bookings', path: '/bookings', icon: Calendar },
    { 
      name: 'Favorites', 
      icon: Heart,
      action: () => setIsFavoritesOpen(true)
    }
  ];

  const handleNavClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      navigate(item.path);
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      className="bg-gradient-to-r from-gray-900 to-purple-900 p-4 text-gray-100 sticky top-0 z-40 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
          BaRbberZ
        </motion.h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {isAuthenticated && navItems.map((item) => (
            <motion.button
              key={item.name}
              onClick={() => handleNavClick(item)}
              className={`hover:text-pink-500 transition-colors duration-300 relative group flex items-center ${
                location.pathname === item.path ? 'text-pink-500' : ''
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.name}
              {item.path && (
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: location.pathname === item.path ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Auth Buttons and Notification Bell */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <div className="relative">
              <motion.button
                className="relative p-2 text-gray-300 hover:text-white focus:outline-none"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-6 h-6" />
                
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full">
                   
                  </span>
                
              </motion.button>

           
            </div>
          )}

          {isAuthenticated ? (
            <>
              <motion.span 
                className="text-gray-300 hidden md:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Welcome, {user?.name}
              </motion.span>
              <motion.button
                onClick={handleLogout}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 px-4 rounded-full hover:from-pink-700 hover:to-purple-700 transition-colors duration-300 flex items-center focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100 py-2 px-4 rounded-full hover:from-gray-600 hover:to-gray-700 transition-colors duration-300 flex items-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 px-4 rounded-full hover:from-pink-700 hover:to-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                >
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-gradient-to-r from-gray-900 to-purple-900 py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto">
              {isAuthenticated && navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center w-full text-left py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white ${
                    location.pathname === item.path ? 'bg-gray-700 text-white' : ''
                  }`}
                  whileHover={{ x: 10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </motion.button>
              ))}
              {isAuthenticated && (
                <motion.div
                  className="px-4 py-2 text-gray-300 border-t border-gray-700 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome, {user?.name}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorites Modal */}
      <FavoritesModal 
        isOpen={isFavoritesOpen} 
        onClose={() => setIsFavoritesOpen(false)} 
      />
    </motion.nav>
  );
};

export default Navbar;