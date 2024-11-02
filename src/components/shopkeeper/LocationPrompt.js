// LocationPrompt.js

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchShopsByLocation } from '../../redux/slices/shopSlice';

const LocationPrompt = ({ onLocationSubmit }) => {
  const [location, setLocation] = useState('');
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      dispatch(searchShopsByLocation(location));
      onLocationSubmit();
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex items-center justify-center">
      <form onSubmit={handleSearch} className="p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-white mb-4">Enter your location</h2>
        <input
          type="text"
          placeholder="Enter your city or ZIP code"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full py-2 px-4 mb-4 bg-gray-700 text-white rounded focus:ring-2 focus:ring-pink-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-pink-500 text-white py-2 px-4 rounded-full hover:bg-pink-400 transition-colors duration-300"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default LocationPrompt;
