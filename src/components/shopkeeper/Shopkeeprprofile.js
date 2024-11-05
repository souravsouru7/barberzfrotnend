import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShopkeeperProfile } from '../../redux/slices/shopkeeperSlice';
import { Scissors, Edit2 } from 'lucide-react';
import EditShopkeeperProfile from './EditShopkeeperProfile';

const ShopkeeperProfile = () => {
  const dispatch = useDispatch();
  const { shopkeeper, loading, error, token } = useSelector((state) => state.shopkeeper);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token && shopkeeper?.id) {
        try {
          console.log('Fetching profile with token:', token);
          console.log('Shopkeeper ID:', shopkeeper.id);
          const result = await dispatch(fetchShopkeeperProfile()).unwrap();
          console.log('Fetched profile data:', result);
          setProfileData(result);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };

    fetchProfile();
  }, [dispatch, token, shopkeeper?.id]);

  const displayData = profileData || shopkeeper;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="p-6">
        <ErrorMessage message="No shopkeeper data found. Please try logging in again." />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen p-6">
      <header className="flex justify-between items-center bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-xl mb-6 shadow-lg">
        <div className="flex items-center">
          <Scissors size={28} className="text-pink-500 mr-2" />
          <div className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold">
            Shopkeeper Profile
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-pink-500/50 flex items-center"
        >
          <Edit2 size={20} className="mr-2" />
          Edit Profile
        </button>
      </header>

      {isEditing ? (
        <EditShopkeeperProfile 
          shopkeeper={displayData} 
          onCancel={() => setIsEditing(false)} 
          onSuccess={() => {
            setIsEditing(false);
            dispatch(fetchShopkeeperProfile())
              .unwrap()
              .then((data) => {
                setProfileData(data);
              })
              .catch((error) => {
                console.error('Failed to refresh profile:', error);
              });
          }}
        />
      ) : (
        <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
          <div className="profile-header flex flex-col md:flex-row items-center mb-6">
            <div className="profile-picture mb-6 md:mb-0 md:mr-8">
              <img
                src={displayData?.profileImage || "/api/placeholder/160/160"}
                alt="Shopkeeper Avatar"
                className="w-40 h-40 rounded-full border-4 border-pink-500 shadow-lg object-cover"
              />
            </div>
            <div className="profile-info grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <ProfileInfo label="Shop Name" value={displayData?.shopName} />
              <ProfileInfo label="Owner Name" value={displayData?.name} />
              <ProfileInfo label="Email" value={displayData?.email} />
              <ProfileInfo label="Contact Number" value={displayData?.contactNumber} />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-700 bg-opacity-50 rounded-xl">
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-3">
              Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-400">Account ID:</span>
                <p className="font-medium text-gray-100">{displayData?.id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Account Status:</span>
                <p className="font-medium text-green-400">Active</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileInfo = ({ label, value }) => (
  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-xl shadow-sm">
    <label className="font-semibold text-gray-400 block mb-1">{label}:</label>
    <p className="text-gray-100">{value || 'N/A'}</p>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-xl shadow-lg border-l-4 border-red-500">
    <h3 className="text-lg font-bold text-red-500 mb-2">Error</h3>
    <p className="text-gray-300">{message}</p>
  </div>
);

export default ShopkeeperProfile;