import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Star, Store, Heart } from 'lucide-react';
import { getFavorites, removeFromFavorites, clearFavoritesError } from '../../redux/slices/authSlice';

const FavoritesModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { 
    favoriteShops,
    favoritesLoading, 
    favoritesError,
    user
  } = useSelector((state) => state.auth);

  const [hoveredShop, setHoveredShop] = useState(null);

  useEffect(() => {
    if (isOpen && user?._id) {
      dispatch(getFavorites(user._id))
        .unwrap()
        .catch(error => console.error('Error fetching favorites:', error));
    }
    
    return () => {
      if (favoritesError) {
        dispatch(clearFavoritesError());
      }
    };
  }, [isOpen, dispatch, user, favoritesError]);

  const handleRemoveFavorite = async (shopId) => {
    if (user?._id) {
      try {
        await dispatch(removeFromFavorites({ userId: user._id, shopId })).unwrap();
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const shopVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white bg-opacity-80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-purple-600 flex items-center">
                <Heart className="w-7 h-7 text-pink-500 mr-3 animate-pulse" />
                Favorite Shops
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-2 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {favoritesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : favoritesError ? (
                <div className="text-red-500 text-center py-8 bg-red-50 rounded-lg">
                  <p className="font-semibold">Oops! Something went wrong.</p>
                  <p className="text-sm mt-2">{favoritesError}</p>
                </div>
              ) : !favoriteShops || favoriteShops.length === 0 ? (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center bg-white bg-opacity-50 rounded-xl">
                  <Store className="w-16 h-16 mb-4 text-gray-400" />
                  <p className="text-xl font-semibold mb-2">No favorite shops yet</p>
                  <p className="text-sm">Start exploring and add some favorites!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {favoriteShops.map((shop) => (
                    <motion.div
                      key={shop._id}
                      className="bg-white rounded-xl p-4 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow duration-300"
                      variants={shopVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      onHoverStart={() => setHoveredShop(shop._id)}
                      onHoverEnd={() => setHoveredShop(null)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={shop.shopimage || "/api/placeholder/80/80"}
                            alt={shop.shopName}
                            className="w-20 h-20 rounded-lg object-cover border-2 border-purple-200"
                          />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 opacity-0 rounded-lg"
                            animate={{ opacity: hoveredShop === shop._id ? 0.3 : 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{shop.shopName}</h3>
                          <p className="text-sm text-gray-500">{shop.address}</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => handleRemoveFavorite(shop._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                        disabled={favoritesLoading}
                        title="Remove from favorites"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FavoritesModal;