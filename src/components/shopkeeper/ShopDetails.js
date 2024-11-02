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

  if (loading) return <div className="text-gray-800">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!shop) return <div className="text-gray-800">Please add a shop first.</div>;

  return (
    <div className="bg-gray-100">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl mb-6">
        <div className="flex items-center">
          <Scissors size={28} className="text-indigo-600 mr-2" />
          <div className="text-2xl text-gray-800 font-bold">Shop Details</div>
        </div>
        <div className="flex items-center space-x-4">
          <img src="avatar.png" alt="User Avatar" className="w-10 h-10 rounded-full" />
          <span className="text-gray-800 cursor-pointer">
            {shopkeeper?.name || "Shop Owner"}
          </span>
        </div>
      </header>

      <div className="space-y-6">
        <div>
          <button
            onClick={() => navigate('/dashboard/updateshop')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/50"
          >
            <Edit className="inline-block mr-2 h-5 w-5" />
            Update Shop Details
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              <TableRow icon={<Store />} label="Shop Name" value={shop.shopName} />
              <TableRow icon={<MapPin />} label="Address" value={shop.address} />
              <TableRow icon={<Phone />} label="Contact Number" value={shop.contactNumber} />
              <TableRow icon={<FileText />} label="Description" value={shop.description} />
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageCard label="Shop Image" src={shop.shopimage} />
          <ImageCard label="License Image" src={shop.licenseUrl} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
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
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap w-12">
      <div className="text-indigo-600">{icon}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-gray-600">{label}</div>
    </td>
    <td className="px-6 py-4">
      <div className="text-gray-800">{value || 'Not provided'}</div>
    </td>
  </tr>
);

const ImageCard = ({ label, src }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-gray-600 mb-4 font-medium">{label}</h3>
    <img
      src={src || "/api/placeholder/400/320"}
      alt={label}
      className="w-full h-48 object-cover rounded-lg"
    />
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white hover:bg-indigo-600 hover:text-white text-gray-800 p-4 rounded-xl transition-colors duration-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/50"
  >
    {label}
  </button>
);

export default ShopDetails;