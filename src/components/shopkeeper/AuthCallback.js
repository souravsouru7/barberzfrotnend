import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginShopkeepers } from '../../redux/slices/shopkeeperSlice';

const AuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const shopkeeperStr = params.get('shopkeeper');

    if (token && shopkeeperStr) {
      try {
        const shopkeeper = JSON.parse(decodeURIComponent(shopkeeperStr));
        
        // Dispatch login action
        dispatch(loginShopkeepers({ 
          token, 
          shopkeeper
        }));

        // Add a small delay to ensure Redux state is updated
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } catch (error) {
        console.error('Error processing authentication:', error);
        navigate('/shopkeeper/login');
      }
    } else {
      navigate('/shopkeeper/login');
    }
  }, []);

  // Show loading state while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;