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
      className="bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out shadow-lg"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
    >
      <div className="flex flex-col items-center mb-6">
        <motion.div
          className="flex items-center justify-center w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Scissors size={28} className="text-indigo-400 mr-2" />
          <h1 className="text-3xl font-bold text-indigo-400">BaRbberZ</h1>
        </motion.div>
        <p className="text-sm text-gray-400 mt-1">Manage Your Barbershop</p>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden absolute top-4 right-4 text-white focus:outline-none"
      >
        {isOpen ? "×" : "☰"}
      </button>
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              {item.icon}
            </motion.div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 mt-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;