import React, { useState } from 'react';
import { ChevronDown, User, LogOut, Scissors } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/shopkeeperSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { shopkeeper } = useSelector((state) => state.shopkeeper);
    
    const handleLogout = () => {
        dispatch(logout());
        navigate('/shopkeeper/login');
    };
    
    return (
        <header className="flex justify-between items-center bg-gray-900 bg-opacity-70 backdrop-blur-xl border-b border-gray-700 text-gray-100 p-4 shadow-lg">
            <div className="shop-title text-xl font-semibold flex items-center">
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-2 rounded-full mr-3 shadow-lg">
                    <Scissors size={24} className="text-white" />
                </div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold">
                    Welcome, Shopkeeper
                </span>
            </div>
            
            <div className="user-avatar relative">
                <div
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 rounded-xl p-2 transition-all duration-300"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 p-0.5">
                        <img 
                            src="/api/placeholder/40/40" 
                            alt="User Avatar" 
                            className="w-full h-full rounded-full border-2 border-gray-900"
                        />
                    </div>
                    <span className="username font-medium text-gray-300">
                        {shopkeeper?.name || "Shopkeeper"}
                    </span>
                    <ChevronDown 
                        size={20} 
                        className={`text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} 
                    />
                </div>
                
                {dropdownOpen && (
                    <div className="dropdown absolute right-0 mt-2 w-48 bg-gray-900 rounded-xl shadow-lg py-1 z-10 border border-gray-700">
                        <a 
                            href="#" 
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                        >
                            <User size={16} className="mr-3" />
                            Profile
                        </a>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
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