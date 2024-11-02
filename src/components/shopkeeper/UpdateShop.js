import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateShop, fetchShopDetails } from '../../redux/slices/shopSlice'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';

const UpdateShop = () => {
  const { state } = useLocation(); 
  const { shopId } = state || {}; 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shop, token, loading } = useSelector((state) => state.shop);

  const [shopData, setShopData] = useState({
    shopName: '',
    address: '',
    contactNumber: '',
    description: '',
    shopImage: null,
    licenseImage: null,
  });

  useEffect(() => {
    if (shopId && !shop) {
      dispatch(fetchShopDetails({ ownerId: shopId, token }));
    }
  }, [dispatch, shopId, shop, token]);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(updateShop({ shopId, shopData, token }))
      .then(() => {
        navigate('/dashboard/shopdetails');
      });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!shop) {
    return <ErrorMessage message="No shop data available to update." />;
  }

  return (
    <div className="bg-gray-100">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl mb-6">
        <div className="flex items-center">
          <Scissors size={28} className="text-indigo-600 mr-2" />
          <div className="text-2xl text-gray-800 font-bold">Update Shop</div>
        </div>
      </header>

      <form onSubmit={handleFormSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
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
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 shadow-lg shadow-indigo-500/50"
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
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border-gray-300 rounded-lg py-2 px-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows="4"
      className="w-full border-gray-300 rounded-lg py-2 px-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
    />
  </div>
);

const FileInput = ({ label, name, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="file"
      id={name}
      name={name}
      onChange={onChange}
      className="w-full text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition duration-200"
    />
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
    <h3 className="text-lg font-bold text-red-500 mb-2">Error</h3>
    <p className="text-gray-800">{message}</p>
  </div>
);

export default UpdateShop;