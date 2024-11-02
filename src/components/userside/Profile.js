import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../../redux/slices/authSlice';
import { User, Mail, Phone, Camera, Edit2, X } from 'lucide-react';
import Navbar from "./Navbar";
const Profile = () => {
  const dispatch = useDispatch();
  const { userProfile, profileLoading, profileError } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    profileImage: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phoneNumber || '',
        profileImage: userProfile.profileImage || null
      });
    }
  }, [userProfile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] instanceof File || (key !== 'profileImage' && formData[key])) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const resultAction = await dispatch(updateUserProfile(formDataToSend));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        setIsEditing(false);
        setPreviewImage(null);
        dispatch(fetchUserProfile());
      } else {
        setUpdateError(resultAction.payload || 'Failed to update profile');
      }
    } catch (error) {
      setUpdateError('An error occurred while updating the profile');
      console.error('Error updating profile:', error);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="w-32 h-32 relative">
          <div className="absolute inset-0 rounded-full border-t-4 border-purple-500 animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-r-4 border-pink-500 animate-ping"></div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-red-900/20 border border-red-500 text-red-200 px-6 py-4 rounded-lg backdrop-blur-sm">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{profileError}</span>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
        <Navbar/> 
    
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl">
          {updateError && (
            <div className="bg-red-900/20 border-b border-red-500 text-red-200 px-6 py-3">
              <span className="block sm:inline">{updateError}</span>
            </div>
          )}
          
          <div className="bg-gradient-to-r from-gray-900/50 to-purple-900/50 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                      {(previewImage || userProfile?.profileImage) ? (
                        <img 
                          src={previewImage || userProfile.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-full h-full p-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-pink-600 hover:bg-pink-700 rounded-full p-3 cursor-pointer transform hover:scale-110 transition-transform duration-300">
                      <Camera size={20} className="text-white" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
                
                <div className="text-center md:text-left">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-3xl font-bold bg-gray-800/50 text-white rounded-lg px-4 py-2 border border-purple-500/30 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    />
                  ) : (
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                      {userProfile?.name}
                    </h1>
                  )}
                  <p className="text-gray-400 mt-2">{userProfile?.email}</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform duration-300"
              >
                {isEditing ? <X size={24} /> : <Edit2 size={24} />}
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20 hover:scale-102 transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-pink-500/20 rounded-full p-3">
                    <Mail className="text-pink-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 text-white rounded-lg px-3 py-2 mt-1 border border-purple-500/30 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                      />
                    ) : (
                      <p className="text-white text-lg">{userProfile?.email}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20 hover:scale-102 transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500/20 rounded-full p-3">
                    <Phone className="text-purple-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Phone</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 text-white rounded-lg px-3 py-2 mt-1 border border-purple-500/30 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                      />
                    ) : (
                      <p className="text-white text-lg">{userProfile?.phoneNumber || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setPreviewImage(null);
                    setUpdateError(null);
                    if (userProfile) {
                      setFormData({
                        name: userProfile.name || '',
                        email: userProfile.email || '',
                        phoneNumber: userProfile.phoneNumber || '',
                        profileImage: userProfile.profileImage || null
                      });
                    }
                  }}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800/50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;