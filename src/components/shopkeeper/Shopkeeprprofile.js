import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShopkeeperProfile } from '../../redux/slices/shopkeeperSlice';
import { Scissors, Edit2 } from 'lucide-react';
import EditShopkeeperProfile from './EditShopkeeperProfile';

const ShopkeeperProfile = () => {
  const dispatch = useDispatch();
  const { shopkeeper, loading, error } = useSelector((state) => state.shopkeeper);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch profile data when component mounts
    dispatch(fetchShopkeeperProfile());
  }, [dispatch]); // Only depend on dispatch

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!shopkeeper) return <ErrorMessage message="No shopkeeper data found" />;

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl mb-6">
        <div className="flex items-center">
          <Scissors size={28} className="text-indigo-600 mr-2" />
          <div className="text-2xl text-gray-800 font-bold">Shopkeeper Profile</div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/50"
        >
          <Edit2 size={20} className="mr-2" />
          Edit Profile
        </button>
      </header>

      {isEditing ? (
        <EditShopkeeperProfile 
          shopkeeper={shopkeeper} 
          onCancel={() => setIsEditing(false)} 
          onSuccess={() => {
            setIsEditing(false);
            dispatch(fetchShopkeeperProfile());
          }}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
          <div className="profile-header flex flex-col md:flex-row items-center mb-6">
            <div className="profile-picture mb-6 md:mb-0 md:mr-8">
              <img
                src={shopkeeper?.profileImage || "/api/placeholder/160/160"}
                alt="Shopkeeper Avatar"
                className="w-40 h-40 rounded-full border-4 border-indigo-600 shadow-lg object-cover"
              />
            </div>
            <div className="profile-info grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <ProfileInfo label="Shop Name" value={shopkeeper?.shopName} />
              <ProfileInfo label="Owner Name" value={shopkeeper?.name} />
              <ProfileInfo label="Email" value={shopkeeper?.email} />
              <ProfileInfo label="Contact Number" value={shopkeeper?.contactNumber} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileInfo = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
    <label className="font-semibold text-gray-700 block mb-1">{label}:</label>
    <p className="text-gray-800">{value || 'N/A'}</p>
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

export default ShopkeeperProfile;