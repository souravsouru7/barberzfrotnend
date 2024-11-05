import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchShopDetails } from '../../redux/slices/shopSlice';
import { Store, MapPin, Phone, FileText, Edit, Scissors } from 'lucide-react';

const ShopDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shop, loading, error } = useSelector((state) => state.shop);
  const { shopkeeper } = useSelector((state) => state.shopkeeper);

  useEffect(() => {
    if (shopkeeper?._id) {
      dispatch(fetchShopDetails({ ownerId: shopkeeper._id, token: shopkeeper.token }));
    }
  }, [dispatch, shopkeeper]);

  if (loading) return <div className="text-gray-100">Loading...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;
  if (!shop) return <div className="text-gray-100">Please add a shop first.</div>;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen p-6">
      <header className="flex justify-between items-center bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-xl mb-6 shadow-lg">
        <div className="flex items-center">
          <Scissors size={28} className="text-pink-500 mr-2" />
          <div className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold">
            Shop Details
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <img src="avatar.png" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-pink-500" />
          <span className="text-gray-100 cursor-pointer">
            {shopkeeper?.name || "Shop Owner"}
          </span>
        </div>
      </header>

      <div className="space-y-6">
        <div>
          <button
            onClick={() => navigate('/dashboard/updateshop')}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg shadow-pink-500/50"
          >
            <Edit className="inline-block mr-2 h-5 w-5" />
            Update Shop Details
          </button>
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <tbody className="divide-y divide-gray-700">
              <TableRow icon={<Store className="text-pink-500" />} label="Shop Name" value={shop.shopName} />
              <TableRow icon={<MapPin className="text-pink-500" />} label="Address" value={shop.address} />
              <TableRow icon={<Phone className="text-pink-500" />} label="Contact Number" value={shop.contactNumber} />
              <TableRow icon={<FileText className="text-pink-500" />} label="Description" value={shop.description} />
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageCard label="Shop Image" src={shop.shopimage} />
          <ImageCard label="License Image" src={shop.licenseUrl} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton 
              label="Manage Services" 
              onClick={() => navigate('/dashboard/manageservices')} 
            />
            <ActionButton 
              label="Manage Time Slots" 
              onClick={() => navigate('/dashboard/managetime')} 
            />
            <ActionButton 
              label="View Bookings" 
              onClick={() => navigate('/dashboard/viewbookings')} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TableRow = ({ icon, label, value }) => (
  <tr className="hover:bg-gray-700 hover:bg-opacity-50 transition-colors duration-300">
    <td className="px-6 py-4 whitespace-nowrap w-12">
      <div>{icon}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-gray-400">{label}</div>
    </td>
    <td className="px-6 py-4">
      <div className="text-gray-100">{value || 'Not provided'}</div>
    </td>
  </tr>
);

const ImageCard = ({ label, src }) => (
  <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg">
    <h3 className="text-gray-400 mb-4 font-medium">{label}</h3>
    <img
      src={src || "/api/placeholder/400/320"}
      alt={label}
      className="w-full h-48 object-cover rounded-lg border border-gray-700"
    />
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-gray-100 p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-pink-500/50"
  >
    {label}
  </button>
);

export default ShopDetails;