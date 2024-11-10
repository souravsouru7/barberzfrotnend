import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateShop, fetchShopDetails } from '../../redux/slices/shopSlice'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';

const UpdateShop = () => {
  const { state } = useLocation(); 
  const shop = useSelector((state) => state.shop.shop);
  const token = useSelector((state) => state.auth.token); // Make sure you're getting token from the correct slice
  const loading = useSelector((state) => state.shop.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get shopId from either state or current shop
  const shopId = state?.shopId || shop?._id;

  const [shopData, setShopData] = useState({
    shopName: '',
    address: '',
    contactNumber: '',
    description: '',
    shopImage: null,
    licenseImage: null,
  });

  useEffect(() => {
    // Only fetch if we have shopId and token
    if (shopId && token) {
      dispatch(fetchShopDetails({ ownerId: shopId, token }));
    } else {
      console.error('Missing shopId or token:', { shopId, token });
      navigate('/dashboard/shopdetails'); // Redirect if no shopId
    }
  }, [dispatch, shopId, token, navigate]);

  useEffect(() => {
    if (shop) {
      setShopData({
        shopName: shop.shopName || '',
        address: shop.address || '',
        contactNumber: shop.contactNumber || '',
        description: shop.description || '',
      });
    }
  }, [shop]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setShopData({
      ...shopData,
      [name]: files ? files[0] : value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!shopId) {
      console.error('No shopId available for update');
      return;
    }

    try {
      await dispatch(updateShop({ 
        shopId, 
        shopData, 
        token 
      })).unwrap();
      navigate('/dashboard/shopdetails');
    } catch (error) {
      console.error('Error updating shop:', error);
      // Handle error (you might want to show an error message to the user)
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!shop || !shopId) {
    return <ErrorMessage message="No shop data available to update." />;
  }
  return (
    <div className="bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen p-6">
      <header className="flex justify-between items-center bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-xl mb-6 shadow-lg">
        <div className="flex items-center">
          <Scissors size={28} className="text-pink-500 mr-2" />
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Update Shop
          </div>
        </div>
      </header>

      <form onSubmit={handleFormSubmit} className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6 space-y-6">
        <InputField 
          label="Shop Name" 
          name="shopName" 
          value={shopData.shopName} 
          onChange={handleInputChange} 
          required 
        />
        <InputField 
          label="Address" 
          name="address" 
          value={shopData.address} 
          onChange={handleInputChange} 
          required 
        />
        <InputField 
          label="Contact Number" 
          name="contactNumber" 
          value={shopData.contactNumber} 
          onChange={handleInputChange} 
          required 
        />
        <TextAreaField 
          label="Description" 
          name="description" 
          value={shopData.description} 
          onChange={handleInputChange} 
          required 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileInput label="Shop Image" name="shopImage" onChange={handleInputChange} />
          <FileInput label="License Image" name="licenseImage" onChange={handleInputChange} />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-pink-500/50"
          >
            Update Shop
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-gray-700 border-gray-600 rounded-lg py-2 px-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows="4"
      className="w-full bg-gray-700 border-gray-600 rounded-lg py-2 px-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
    />
  </div>
);

const FileInput = ({ label, name, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      type="file"
      id={name}
      name={name}
      onChange={onChange}
      className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-pink-600 file:to-purple-600 file:text-white hover:file:from-pink-700 hover:file:to-purple-700 file:transition-all file:duration-300"
    />
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-xl shadow-lg border-l-4 border-red-500">
    <h3 className="text-lg font-bold text-red-400 mb-2">Error</h3>
    <p className="text-gray-300">{message}</p>
  </div>
);

export default UpdateShop;
