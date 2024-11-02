// src/routes/AdminRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AdminDashboard from '../components/admin/AdminDashboard';
import ProtectedRoute from '../components/protection/ProtectedRoute';
import ShopKeeper from "../components/admin/ShopKeeper"
import ShopkeeperDetails from '../components/admin/ShopkeeperDetails';
import VerifyOtp from '../components/admin/VerifyOtp';
import SendOtp from '../components/admin/SendOtp';
const AdminRoutes = () => {
  return (
    <Routes>
    
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />

          </ProtectedRoute>
         
            
         
        }
      />
      <Route path='/admin/shopkeeperprofile'element={ <ProtectedRoute>
           <ShopKeeper/>
          </ProtectedRoute>} />

          <Route path='/admin/shopkeeperprofile/:id'element={ <ProtectedRoute>
           <ShopkeeperDetails/>
          </ProtectedRoute>} />


          <Route path='/admin/login' element={<SendOtp/>}/>
          <Route path='/admin/verifyotp' element={<VerifyOtp/>}/>
    </Routes>
  );
};

export default AdminRoutes;
