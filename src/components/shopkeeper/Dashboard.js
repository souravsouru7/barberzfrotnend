import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, User, ShoppingBag, LogOut, List, Clock, Calendar, Scissors, PowerOff, Bell } from 'lucide-react';
import { fetchShopDetails, toggleWorkMode } from '../../redux/slices/shopSlice';
import { logout } from '../../redux/slices/shopkeeperSlice';
import { fetchNotifications, markAsRead } from '../../redux/slices/notificationSlice';
import AnalyticsDashboard from './AnalyticsDashboard'; // Make sure this path is correct

const NavigationCard = ({ icon, label, to }) => (
  <NavLink to={to}>
    {({ isActive }) => (
      <div className={`
        p-4 rounded-xl transition-all duration-300
        ${isActive 
          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/50' 
          : 'bg-white text-gray-600 hover:bg-gray-50'}
      `}>
        <div className="flex flex-col items-center space-y-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
      </div>
    )}
  </NavLink>
);

const WorkModeToggle = ({ isWorkModeOn, onToggle }) => (
  <div className="flex items-center space-x-3">
    <span className="text-sm font-medium text-gray-200">Work Mode:</span>
    <button
      onClick={onToggle}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
        ${isWorkModeOn ? 'bg-gradient-to-r from-pink-600 to-purple-600' : 'bg-gray-200'}
      `}
    >
      <span className="sr-only">Toggle work mode</span>
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
          transition duration-200 ease-in-out
          ${isWorkModeOn ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
    <PowerOff size={20} className={isWorkModeOn ? 'text-green-500' : 'text-red-500'} />
  </div>
);

const NotificationDropdown = ({ notifications, loading, onNotificationClick }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMilliseconds = now - date;
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${diffInDays} days ago`;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-1 z-20 max-h-96 overflow-y-auto">
      <div className="px-4 py-2 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
      </div>
      {loading ? (
        <div className="p-4 text-center text-gray-400">Loading...</div>
      ) : !notifications || notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-400">No notifications</div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            onClick={() => onNotificationClick(notification)}
            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
              !notification.isRead ? 'bg-gradient-to-r from-pink-50 to-purple-50' : ''
            }`}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {notification.type === 'BOOKING_CREATED' ? 'New Booking' : notification.type}
                </p>
                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTime(notification.createdAt)}
                </p>
              </div>
              {!notification.isRead && (
                <span className="w-2 h-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full mt-2"></span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { shopkeeper, token } = useSelector((state) => state.shopkeeper);
  const { shop } = useSelector((state) => state.shop);
  const { items: notifications, unreadCount, loading } = useSelector((state) => state.notifications);
  const [isWorkModeOn, setIsWorkModeOn] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    if (shopkeeper?.id && token) {
      dispatch(fetchShopDetails({ ownerId: shopkeeper.id, token }));
    }
  }, [dispatch, shopkeeper?.id, token]);

  useEffect(() => {
    if (shop?._id) {
      dispatch(fetchNotifications(shop._id));
      
      const pollInterval = setInterval(() => {
        dispatch(fetchNotifications(shop._id));
      }, 30000);

      return () => clearInterval(pollInterval);
    }
  }, [dispatch, shop?._id]);

  useEffect(() => {
    if (shop) {
      setIsWorkModeOn(shop.isWorkModeOn);
    }
  }, [shop]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/shopkeeper/login');
  };

  const handleToggleWorkMode = () => {
    if (shop) {
      dispatch(toggleWorkMode({ shopId: shop._id, token }))
        .then(() => {
          setIsWorkModeOn(!isWorkModeOn);
        })
        .catch((error) => {
          console.error('Failed to toggle work mode:', error);
        });
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id));
    }
    
    switch (notification.type) {
      case 'BOOKING_CREATED':
        navigate('/dashboard/viewbookings');
        break;
      case 'PROFILE_UPDATE':
        navigate('/dashboard/profile');
        break;
      default:
        break;
    }
    
    setNotificationOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationOpen && !event.target.closest('.notification-dropdown')) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationOpen]);

  const navigationItems = [
    { icon: <Home size={24} />, label: "Overview", to: "/dashboard" },
    { icon: <User size={24} />, label: "Profile", to: "/dashboard/profile" },
    ...(shop 
      ? [
          { icon: <ShoppingBag size={24} />, label: "Shop", to: "/dashboard/shopdetails" },
          { icon: <List size={24} />, label: "Services", to: "/dashboard/manageservices" },
          { icon: <Clock size={24} />, label: "Time Slots", to: "/dashboard/managetime" },
          { icon: <Calendar size={24} />, label: "Bookings", to: "/dashboard/viewbookings" }
        ]
      : [{ icon: <ShoppingBag size={24} />, label: "Add Shop", to: "/dashboard/addshop" }]
    )
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Scissors size={32} className="text-gradient-to-r from-pink-600 to-purple-600" />
          <h1 className="text-2xl font-bold text-gray-200">BaRbberZ</h1>
        </div>
        <div className="flex items-center space-x-4">
          {shop && <WorkModeToggle isWorkModeOn={isWorkModeOn} onToggle={handleToggleWorkMode} />}
          <div className="relative notification-dropdown">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 relative"
            >
              <Bell size={24} className="text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-600 to-purple-600 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {notificationOpen && (
              <NotificationDropdown
                notifications={notifications}
                loading={loading}
                onNotificationClick={handleNotificationClick}
              />
            )}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:from-red-600 hover:to-red-700 transition-colors duration-300"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {navigationItems.map((item, index) => (
          <NavigationCard key={index} {...item} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-sm p-6">
        {location.pathname === '/dashboard' ? (
          <AnalyticsDashboard />
        ) : (
          <Outlet context={{ shopId: shop?._id }} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;