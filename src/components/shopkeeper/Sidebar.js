import React, { useState } from 'react';
import { Home, User, ShoppingBag, LogOut, List, Clock, Calendar, Scissors } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = ({ shop }) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { label: "Dashboard Overview", icon: <Home size={20} />, href: "/dashboard" },
    { label: "Profile Section", icon: <User size={20} />, href: "/dashboard/profile" },
  ];

  if (shop) {
    menuItems.push(
      { label: "Manage Shop", icon: <ShoppingBag size={20} />, href: "/dashboard/shopdetails" },
      { label: "Manage Services", icon: <List size={20} />, href: "/dashboard/manageservices" },
      { label: "Manage Time Slots", icon: <Clock size={20} />, href: "/dashboard/managetime" },
      { label: "View Bookings", icon: <Calendar size={20} />, href: "/dashboard/viewbookings" }
    );
  } else {
    menuItems.push({ label: "Add Shop", icon: <ShoppingBag size={20} />, href: "/dashboard/addshop" });
  }

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg text-white w-64 min-h-screen space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out border-r border-gray-700"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
    >
      <div className="flex flex-col items-center mb-8">
        <motion.div
          className="flex items-center justify-center w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Scissors size={28} className="text-pink-500 mr-2" />
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            BaRbberZ
          </h1>
        </motion.div>
        <p className="text-sm text-gray-300 mt-2">Manage Your Barbershop</p>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden absolute top-4 right-4 text-white focus:outline-none"
      >
        {isOpen ? "×" : "☰"}
      </button>

      <nav className="space-y-3">
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white"
                }`
              }
            >
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }}
                className={`transition-colors duration-300`}
              >
                {item.icon}
              </motion.div>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="absolute bottom-8 left-0 w-full px-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition duration-300 shadow-lg"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;