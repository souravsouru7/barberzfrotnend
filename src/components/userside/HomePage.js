import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { searchShops } from '../../redux/slices/shopSlice';
import { 
  MapPin, Search, Star, Calendar, Scissors, 
  CheckCircle, Clock, Shield, Award, TrendingUp,
  ThumbsUp, Users, DollarSign, Smartphone, XCircle
} from 'lucide-react';
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
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Find Your Spot</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city or ZIP code"
                  className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 backdrop-blur-md border border-gray-700 focus:ring-2 focus:ring-pink-500 text-white"
                />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-full font-semibold text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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

const ShopCard = ({ shop, onBookNow }) => (
  <motion.div
    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-pink-500 transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="relative">
      <img 
        src={shop.shopimage || '/api/placeholder/400/300?text=Shop'} 
        alt={shop.shopName} 
        className="w-full h-56 object-cover"
      />
      <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full">
        <div className="flex items-center">
          <Star className="w-4 h-4 mr-1" />
          <span>{shop.rating || '4.5'}</span>
        </div>
      </div>
      {!shop.isWorkModeOn && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="text-white text-2xl font-bold">Currently Closed</div>
        </div>
      )}
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-white mb-2">{shop.shopName}</h3>
      <p className="text-gray-400 mb-4">{shop.description}</p>
      {shop.isWorkModeOn ? (
        <motion.button
          onClick={() => onBookNow(shop._id)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-6 rounded-full group w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Book Now
          <Calendar className="inline-block w-5 h-5 ml-2 transform group-hover:rotate-12 transition-transform" />
        </motion.button>
      ) : (
        <div className="text-red-500 flex items-center justify-center">
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
  const { shops, loading, error } = useSelector((state) => state.shop);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { title: "Quick Booking", description: "Book your slot in under 2 minutes" },
    { title: "Real-time Availability", description: "See live slot availability" },
    { title: "Verified Reviews", description: "Read authentic customer feedback" },
    { title: "Special Offers", description: "Exclusive deals and discounts" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      setLocation(storedLocation);
      dispatch(searchShops(storedLocation));
    } else {
      setIsLocationDialogOpen(true);
    }
  }, [dispatch]);

  const handleLocationSubmit = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem('userLocation', newLocation);
    dispatch(searchShops(newLocation));
  };

  const handleBookNow = (shopId) => {
    navigate(`/shops/${shopId}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <LocationDialog
          isOpen={isLocationDialogOpen}
          onClose={() => setIsLocationDialogOpen(false)}
          onSubmit={handleLocationSubmit}
        />

        {/* Hero Section */}
        <section className="relative h-screen">
          
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 800 400" 
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#111827" }} />
                <stop offset="100%" style={{ stopColor: "#1F2937" }} />
              </linearGradient>
              <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#EC4899" }} />
                <stop offset="100%" style={{ stopColor: "#8B5CF6" }} />
              </linearGradient>
            </defs>
            
            <rect width="800" height="400" fill="url(#bgGradient)" />
            
            <circle cx="700" cy="50" r="80" fill="url(#highlightGradient)" opacity="0.1" />
            <circle cx="100" cy="350" r="60" fill="url(#highlightGradient)" opacity="0.1" />
            
            <g transform="translate(600, 200)">
              <rect x="-15" y="-80" width="30" height="160" fill="#444" rx="15" />
              <g>
                <rect x="-15" y="-80" width="30" height="160" fill="#EC4899" opacity="0.8" />
                <path d="M-20,-100 L40,100" stroke="white" strokeWidth="15" opacity="0.6" />
                <path d="M-40,-100 L20,100" stroke="#8B5CF6" strokeWidth="15" opacity="0.6" />
              </g>
            </g>
            
            <g transform="translate(150, 200)">
              <path 
                d="M40,0 A40,40 0 1,1 0,40 A40,40 0 1,1 40,0" 
                fill="none" 
                stroke="url(#highlightGradient)" 
                strokeWidth="4"
              />
              <path d="M35,-5 L-35,65" stroke="white" strokeWidth="4"/>
              <path d="M-35,-5 L35,65" stroke="white" strokeWidth="4"/>
            </g>
          </svg>

          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-gray-900"></div>

          {/* Content */}
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-bold mb-6"
              >
                Skip the Wait,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  Book Your Style
                </span>
              </motion.h1>
              <p className="text-xl text-gray-300 mb-8">
                Find and book appointments at top-rated salons near you instantly.
                No more waiting in lines!
              </p>
              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <motion.div 
                  className="flex"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative flex-grow">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500" />
                    <input
                      type="text"
                      placeholder="Enter your location..."
                      className="w-full pl-12 pr-4 py-4 rounded-l-full bg-white/10 backdrop-blur-md border border-gray-700 focus:ring-2 focus:ring-pink-500 text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => handleLocationSubmit(searchQuery)}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-r-full"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </motion.div>
              </div>

              {/* Feature Carousel */}
              <div className="mt-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{features[activeFeature].title}</h3>
                      <p className="text-gray-400">{features[activeFeature].description}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Shop Listings */}
        {location && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <motion.h2
                className="text-4xl font-bold text-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Barbershops in {location}
              </motion.h2>
              
              {loading ? (
                <p className="text-center text-gray-400">Loading shop details...</p>
              ) : error ? (
                <p className="text-center text-red-500">Error: {error}</p>
              ) : shops.length === 0 ? (
                <p className="text-center text-gray-400">No barbershops found in this area.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {shops.map((shop) => (
                    <ShopCard key={shop._id} shop={shop} onBookNow={handleBookNow} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-4xl font-bold text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Why Choose Our Platform?
            </motion.h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: <Clock />, title: "Time Saving", description: "No more waiting in queues" },
                { icon: <Shield />, title: "Verified Salons", description: "All salons are verified and rated" },
                { icon: <DollarSign />, title: "Best Prices", description: "Competitive prices and offers" },
                { icon: <Smartphone />, title: "Mobile Ready", description: "Book from anywhere, anytime" },
                { icon: <Award />, title: "Top Rated", description: "Access to best stylists" },
                { icon: <ThumbsUp />, title: "Satisfaction", description: "100% satisfaction guaranteed" },
                { icon: <Users />, title: "Community", description: "Read & write reviews" },
                { icon: <Scissors />, title: "Style Range", description: "Wide range of services" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-pink-500 mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-500">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Salon Experience?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made salon booking hassle-free
            </p>
            <motion.button
              onClick={() => setIsLocationDialogOpen(true)}
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Your Appointment Now
            </motion.button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;