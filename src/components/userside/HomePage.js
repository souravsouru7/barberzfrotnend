import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllShops, resetShopState, searchShops } from '../../redux/slices/shopSlice';
import { logout } from '../../redux/slices/authSlice';
import { Scissors, Search, Calendar, CheckCircle, MapPin, Star, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Layout from './Layout';

const LocationDialog = ({ isOpen, onClose, onSubmit }) => {
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(location);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Find Your Spot</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500" />
                <motion.input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city or ZIP code"
                  className="w-full p-4 pl-12 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:opacity-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Discover Barbershops
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HomePageSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <h2 className="text-4xl font-bold text-white mb-8">Find Your Nearby Barber Shops</h2>
      <form className="flex justify-center mb-8" onSubmit={handleSubmit}>
        <div className="relative w-2/3">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="w-full py-3 px-6 pl-10 bg-gradient-to-r from-gray-800 to-gray-900 text-white placeholder-gray-400 rounded-l-full focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
            placeholder="Enter your location or ZIP code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-r-full hover:opacity-80 transition-opacity duration-300 flex items-center focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
        >
          <Search className="w-6 h-6" />
        </button>
      </form>
      <div className="flex justify-center space-x-6">
        {['Haircut', 'Beard Trim', 'Styling'].map((service) => (
          <label key={service} className="text-gray-400 flex items-center cursor-pointer group">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded focus:ring-pink-500 transition-colors duration-300"
            />
            <span className="ml-2 group-hover:text-white transition-colors duration-300">{service}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const ShopCard = ({ shop, onBookNow }) => (
  <motion.div
    className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg overflow-hidden w-96 hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 transform hover:-translate-y-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="relative">
      <img src={shop.shopimage || '/api/placeholder/400/300?text=Shop'} alt={shop.shopName} className="w-full h-56 object-cover" />
      <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-full text-sm flex items-center">
        <Star className="w-4 h-4 mr-1" />
        {shop.rating || '4.5'}
      </div>
      {!shop.isWorkModeOn && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="text-white text-2xl font-bold">Currently Closed</div>
        </div>
      )}
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-white mb-3">{shop.shopName}</h3>
      <p className="text-gray-400 mb-6">{shop.description}</p>
      {shop.isWorkModeOn ? (
        <button
          onClick={() => onBookNow(shop._id)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-6 rounded-full hover:opacity-80 transition-opacity duration-300 inline-flex items-center group focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
        >
          Book Now
          <Calendar className="w-5 h-5 ml-2 transform group-hover:rotate-12 transition-transform duration-300" />
        </button>
      ) : (
        <div className="text-red-500 flex items-center">
          <XCircle className="w-5 h-5 mr-2" />
          Currently Closed
        </div>
      )}
    </div>
  </motion.div>
);

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { shops, loading, error } = useSelector((state) => state.shop);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [localShops, setLocalShops] = useState([]);

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    const storedShops = JSON.parse(localStorage.getItem('lastSearchResults'));
    
    if (storedLocation) {
      setLocation(storedLocation);
      dispatch(searchShops(storedLocation));
    } else {
      setIsLocationDialogOpen(true);
    }

    if (storedShops) {
      setLocalShops(storedShops);
    }
  }, [dispatch]);

  useEffect(() => {
    if (shops.length > 0) {
      setLocalShops(shops);
      localStorage.setItem('lastSearchResults', JSON.stringify(shops));
    }
  }, [shops]);

  const handleLocationSubmit = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem('userLocation', newLocation);
    dispatch(searchShops(newLocation));
    setIsLocationDialogOpen(false);
  };

  const handleSearch = (searchTerm) => {
    setLocation(searchTerm);
    localStorage.setItem('userLocation', searchTerm);
    dispatch(searchShops(searchTerm));
  };

  const handleBookNow = (shopId) => {
    navigate(`/shops/${shopId}`);
  };

  return (
    <Layout>
      <div className="text-gray-200 font-sans bg-gradient-to-b from-gray-900 to-black">
        <LocationDialog
          isOpen={isLocationDialogOpen}
          onClose={() => setIsLocationDialogOpen(false)}
          onSubmit={handleLocationSubmit}
        />

        <section className="relative bg-fixed bg-center h-screen" style={{ backgroundImage: "url('https://cdn.leonardo.ai/users/88308f0d-b1b4-4b42-8c44-dd4f3eec5fb7/generations/66bd7af7-e2d1-42aa-ad93-faf21e930ee0/Leonardo_Phoenix_A_vibrant_colorful_cartoon_animation_depictin_3.jpg')" }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black"></div>
          <div className="relative flex items-center justify-center h-full text-center p-4">
            <motion.div
              className="max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl font-bold text-white mb-6">Book Your Perfect Haircut in Minutes</h1>
              <p className="text-xl text-gray-400 mb-8">Easily book an appointment at your favorite barbershop near you.</p>
              <a
                href="#search"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-8 rounded-full text-lg hover:opacity-80 transition-opacity duration-300 inline-flex items-center group focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
              >
                Find a Barbershop
                <Scissors className="w-5 h-5 ml-2 transform group-hover:rotate-45 transition-transform duration-300" />
              </a>
            </motion.div>
          </div>
        </section>

        <section id="search" className="bg-gradient-to-b from-gray-900 to-gray-800 py-16 text-center">
          <HomePageSearch onSearch={handleSearch} />
        </section>

        <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-16 text-center">
          <motion.h2
            className="text-5xl font-bold text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {location ? `Barbershops in ${location}` : 'Featured Barbershops'}
          </motion.h2>
          <div className="container mx-auto flex flex-wrap justify-center gap-8">
            {loading ? (
              <p className="text-gray-400">Loading shop details...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : localShops.length === 0 ? (
              <p className="text-gray-400">No barbershops found in this area. Try a different location.</p>
            ) : (
              localShops.map((shop) => (
                <ShopCard key={shop._id} shop={shop} onBookNow={handleBookNow} />
              ))
            )}
          </div>
        </section>

        <section className="bg-gradient-to-b from-gray-900 to-black py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Scissors className="w-12 h-12 text-gradient-to-r from-pink-500 to-purple-500 mb-4" />, title: 'Expert Stylists', description: 'Our barbers are highly skilled professionals.' },
                { icon: <Calendar className="w-12 h-12 text-gradient-to-r from-pink-500 to-purple-500 mb-4" />, title: 'Easy Booking', description: 'Book your appointment with just a few clicks.' },
                { icon: <CheckCircle className="w-12 h-12 text-gradient-to-r from-pink-500 to-purple-500 mb-4" />, title: 'Quality Service', description: 'We ensure 100% satisfaction with every visit.' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {item.icon}
                  <h3 className="text-2xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;