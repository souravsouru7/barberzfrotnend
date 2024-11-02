import React, { useState } from 'react';
import { ChevronDown, User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/shopkeeperSlice'; // Assuming you have this logout action
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate=useNavigate()

    // Get the shopkeeper's name from the Redux store
    const { shopkeeper } = useSelector((state) => state.shopkeeper);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/shopkeeper/login');

    };

    return (
        <header className="flex justify-between items-center bg-gray-800 text-gray-100 p-4 shadow-md">
            <div className="shop-title text-xl font-semibold flex items-center">
                <span className="bg-indigo-600 text-white p-2 rounded-full mr-3">SK</span>
                Welcome, Shopkeeper
            </div>
            <div className="user-avatar relative">
                <div 
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 rounded-full p-2 transition-colors duration-200"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <img src="/api/placeholder/40/40" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-400" />
                    <span className="username font-medium">{shopkeeper?.name || "Shopkeeper"}</span>
                    <ChevronDown size={20} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {dropdownOpen && (
                    <div className="dropdown absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-10">
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors duration-200">
                            <User size={16} className="mr-3" />
                            Profile
                        </a>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900 transition-colors duration-200"
                        >
                            <LogOut size={16} className="mr-3" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
