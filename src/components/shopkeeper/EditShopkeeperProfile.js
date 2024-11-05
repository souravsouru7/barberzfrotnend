import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateShopkeeper } from '../../redux/slices/shopkeeperSlice';
import { Save, X } from 'lucide-react';

const EditShopkeeperProfile = ({ shopkeeper, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    shopName: shopkeeper.shopName || '',
    name: shopkeeper.name || '',
    email: shopkeeper.email || '',
    contactNumber: shopkeeper.contactNumber || '',
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      profileImage: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        form.append(key, formData[key]);
      }
    }
    
    try {
      const shopkeeperId = shopkeeper._id;
      if (!shopkeeperId) {
        throw new Error('Shopkeeper ID is missing');
      }
      
      await dispatch(updateShopkeeper({ 
        id: shopkeeperId, 
        formData: form 
      })).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        Edit Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Shop Name</label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-gray-100 shadow-sm 
              focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Owner Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-gray-100 shadow-sm 
              focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-gray-100 shadow-sm 
              focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-gray-100 shadow-sm 
              focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Profile Image</label>
          <input
            type="file"
            name="profileImage"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-pink-600 file:text-white
              hover:file:bg-pink-700
              file:transition-colors file:duration-300"
          />
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-300 
              bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
          >
            <X size={20} className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white 
              bg-gradient-to-r from-pink-600 to-purple-600 
              hover:from-pink-700 hover:to-purple-700 
              transition-all duration-300 transform hover:-translate-y-1 
              shadow-lg shadow-pink-500/50"
          >
            <Save size={20} className="mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditShopkeeperProfile;