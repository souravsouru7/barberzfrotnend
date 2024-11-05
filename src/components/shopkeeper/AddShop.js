import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addShop, resetStatus } from '../../redux/slices/shopSlice';
import { Store, Image, Phone, FileText, Upload, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddShop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shopkeeper } = useSelector(state => state.shopkeeper);
  const { loading, error, success } = useSelector(state => state.shop);

  const [shopData, setShopData] = useState({
    shopName: '',
    ownerId: '',
    address: '',
    contactNumber: '',
    description: '',
    shopImage: null,
    licenseImage: null,
  });

  // Add state for file names
  const [fileNames, setFileNames] = useState({
    shopImage: '',
    licenseImage: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    return () => {
      dispatch(resetStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!shopkeeper || !localStorage.getItem('token')) {
      navigate('/login');
    } else {
      setShopData(prevState => ({
        ...prevState,
        ownerId: shopkeeper.id,
      }));
    }
  }, [navigate, shopkeeper]);

  useEffect(() => {
    if (success) {
      dispatch(resetStatus());
      navigate('/dashboard');
    }
  }, [success, dispatch, navigate]);

  const validate = () => {
    let errors = {};
    if (!shopData.shopName) errors.shopName = 'Shop name is required';
    if (!shopData.ownerId) errors.ownerId = 'Shopkeeper ID is required';
    if (!shopData.address) errors.address = 'Address is required';
    if (!shopData.contactNumber || !/^\d{10}$/.test(shopData.contactNumber)) {
      errors.contactNumber = 'Valid contact number is required (10 digits)';
    }
    if (!shopData.description) errors.description = 'Description is required';
    if (!shopData.shopImage) errors.shopImage = 'Shop image is required';
    if (!shopData.licenseImage) errors.licenseImage = 'License image is required';
    return errors;
  };

  const handleChange = (e) => {
    setShopData({ ...shopData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShopData({ ...shopData, [e.target.name]: file });
      setFileNames({ ...fileNames, [e.target.name]: file.name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    setFormErrors({});

    try {
      await dispatch(addShop(shopData)).unwrap();
    } catch (err) {
      console.error('Failed to add shop:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-purple-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <header className="flex justify-between items-center bg-gray-900 bg-opacity-70 backdrop-blur-xl p-6 rounded-2xl mb-6 border border-gray-800">
          <motion.div 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="flex items-center"
          >
            <Store size={28} className="text-pink-500 mr-3" />
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Add New Shop
            </div>
          </motion.div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 p-8"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-pink-500 bg-opacity-10 border-l-4 border-pink-500 p-4 rounded"
            >
              <div className="flex items-center">
                <AlertCircle size={20} className="text-pink-500 mr-2" />
                <p className="text-pink-500">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              icon={<Store size={20} className="text-gray-400" />}
              label="Shop Name"
              name="shopName"
              value={shopData.shopName}
              onChange={handleChange}
              error={formErrors.shopName}
            />

            <InputField
              icon={<FileText size={20} className="text-gray-400" />}
              label="Address"
              name="address"
              value={shopData.address}
              onChange={handleChange}
              error={formErrors.address}
            />

            <InputField
              icon={<Phone size={20} className="text-gray-400" />}
              label="Contact Number"
              name="contactNumber"
              value={shopData.contactNumber}
              onChange={handleChange}
              error={formErrors.contactNumber}
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">
                <div className="flex items-center mb-1">
                  <FileText size={20} className="text-gray-400 mr-2" />
                  Description
                </div>
              </label>
              <textarea
                name="description"
                value={shopData.description}
                onChange={handleChange}
                className="w-full bg-gray-800 border-gray-700 rounded-lg shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 text-white transition-all duration-300 min-h-[100px]"
              />
              {formErrors.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-pink-500 text-sm mt-1"
                >
                  {formErrors.description}
                </motion.p>
              )}
            </div>

            <FileUploader
              icon={<Image size={20} />}
              label="Shop Image"
              name="shopImage"
              onChange={handleFileChange}
              error={formErrors.shopImage}
              fileName={fileNames.shopImage}
            />

            <FileUploader
              icon={<FileText size={20} />}
              label="License Image"
              name="licenseImage"
              onChange={handleFileChange}
              error={formErrors.licenseImage}
              fileName={fileNames.licenseImage}
            />

            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding Shop...
                  </span>
                ) : (
                  'Add Shop'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

const InputField = ({ icon, label, name, value, onChange, error }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-1"
  >
    <label className="block text-sm font-medium text-gray-300">
      <div className="flex items-center mb-1">
        <span className="mr-2">{icon}</span>
        {label}
      </div>
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-800 text-white border-gray-700 rounded-lg shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-300"
    />
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-pink-500 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

const FileUploader = ({ icon, label, name, onChange, error, fileName }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-1"
  >
    <label className="block text-sm font-medium text-gray-300">
      <div className="flex items-center mb-1">
        <span className="text-gray-400 mr-2">{icon}</span>
        {label}
      </div>
    </label>
    <div className="mt-1">
      <label className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-pink-500 transition-colors duration-300 bg-gray-800 bg-opacity-50">
        <div className="space-y-1 text-center">
          <Upload size={24} className="mx-auto text-gray-400" />
          <div className="flex flex-col text-sm text-gray-400">
            <div className="flex justify-center">
              <span className="relative font-medium text-pink-500 hover:text-pink-400">
                Click to upload
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            {fileName && (
              <span className="mt-2 text-gray-300">
                Selected file: {fileName}
              </span>
            )}
          </div>
        </div>
        <input
          type="file"
          name={name}
          onChange={onChange}
          className="sr-only"
        />
      </label>
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-pink-500 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

export default AddShop;