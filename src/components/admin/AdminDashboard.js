import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../../redux/slices/adminAuthSlice';
import { useNavigate } from 'react-router-dom';
import { Bell, Users, ShoppingBag, Calendar, DollarSign, PlusCircle, FileText, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg fixed w-full top-0 left-0 z-50">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-2xl mr-4 focus:outline-none">
              ☰
            </button>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Admin Dashboard
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => alert('Notifications clicked!')}
              className="relative text-xl focus:outline-none hover:text-blue-400 transition-colors duration-300"
            >
              <Bell size={24} />
              <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-full transition duration-300 transform hover:bg-red-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Container for Sidebar and Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 h-screen fixed top-16 left-0 overflow-y-auto border-r border-gray-700 transition-all duration-300 ease-in-out`}>
          <nav className="p-4">
            <ul className="space-y-4">
              {[
                { icon: <Users size={20} />, text: "User Management" },
                { icon: <ShoppingBag size={20} />, text: "Shopkeeper Management" },
                { icon: <FileText size={20} />, text: "Analytics" },
                { icon: <Bell size={20} />, text: "Notifications Management" },
                { icon: <Settings size={20} />, text: "Settings" },
              ].map((item, index) => (
                <li key={index}>
                  <a href={`#${item.text.toLowerCase().replace(' ', '-')}`} className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded transition-colors duration-300">
                    {item.icon}
                    {isSidebarOpen && <span>{item.text}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} p-6 flex-1 transition-all duration-300 ease-in-out`}>
          <section id="dashboard-overview">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Dashboard Overview</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                { icon: <Users size={24} />, title: "Total Users", value: "1,245", color: "from-blue-500 to-blue-600" },
                { icon: <ShoppingBag size={24} />, title: "Total Shopkeepers", value: "320", color: "from-green-500 to-green-600" },
                { icon: <Calendar size={24} />, title: "Active Bookings", value: "89", color: "from-yellow-500 to-yellow-600" },
                { icon: <DollarSign size={24} />, title: "Total Revenue", value: "$12,345", color: "from-purple-500 to-purple-600" },
              ].map((card, index) => (
                <div key={index} className={`bg-gradient-to-br ${card.color} p-6 rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    {card.icon}
                  </div>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <PlusCircle size={20} />, text: "Add New User" },
                  { icon: <PlusCircle size={20} />, text: "Add New Shopkeeper" },
                  { icon: <FileText size={20} />, text: "View Reports" },
                  { icon: <Calendar size={20} />, text: "Manage Bookings" },
                ].map((action, index) => (
                  <a
                    key={index}
                    href={`#${action.text.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white p-3 rounded-lg transition duration-300 transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {action.icon}
                    <span>{action.text}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;