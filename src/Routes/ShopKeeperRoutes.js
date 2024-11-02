import React from 'react';
import ShopkeeperRegistration from "../components/shopkeeper/ShopkeeperRegistration";
import Login from '../components/shopkeeper/Login';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../components/shopkeeper/Dashboard';
import ShopkeeperProfile from "../components/shopkeeper/Shopkeeprprofile";
import AddShop from '../components/shopkeeper/AddShop';
import ShopDetails from '../components/shopkeeper/ShopDetails';
import UpdateShop from '../components/shopkeeper/UpdateShop';
import ServiceManagement from '../components/shopkeeper/ServiceManagement';
import TimeSlotManagement from '../components/shopkeeper/TimeSlotManagement';
import ViewBookings from '../components/shopkeeper/ViewBookings';
import AuthCallback from '../components/shopkeeper/AuthCallback';
function ShopKeeperRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/shopkeeper/register' element={<ShopkeeperRegistration />} />
      <Route path='/shopkeeper/login' element={<Login />} />
      <Route path="/auth-callback" element={<AuthCallback />} />
      {/* Dashboard Layout with Nested Routes */}
      <Route path='/dashboard' element={<Dashboard />}>
        <Route index element={<ShopDetails />} /> {/* Default dashboard view */}
        <Route path="profile" element={<ShopkeeperProfile />} />
        <Route path="addshop" element={<AddShop />} />
        <Route path="shopdetails" element={<ShopDetails />} />
        <Route path="updateshop" element={<UpdateShop />} />
        <Route path="manageservices" element={<ServiceManagement />} />
        <Route path="managetime" element={<TimeSlotManagement />} /> {/* Updated path */}
        <Route path="viewbookings" element={<ViewBookings />} /> {/* Updated path */}
      </Route>
    </Routes>
  );
}

export default ShopKeeperRoutes;