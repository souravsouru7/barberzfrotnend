import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/userside/Register";
import Login from "./components/userside/Login";
import HomePage from "./components/userside/HomePage";
import Dashbord from "./components/shopkeeper/Dashboard";
import ForgotPassword from "./components/userside/ForgotPassword";

import ResetPassword from "./components/userside/ResetPassword";
import Profile from "./components/userside/Profile";
import ConditionalRoute from "./components/protection/ConditionalRoute";
import AdminRoutes from "./Routes/AdminRoutes";
import VerificationPending from "./components/shopkeeper/VerificationPending";
import ProtectedRouteuser from "./components/protection/ProtectedRouteuser";
import Conditionforuser from "./components/protection/Conditionforuser";
import { useDispatch } from "react-redux";
import ShopDetailsPage from "./components/userside/ShopDetailsPage";
import ShopKeeperRoutes from "./Routes/ShopKeeperRoutes";
import BookingPage from "./components/userside/BookingPage";
import BookingConfirmation from "./components/userside/BookingConfirmation";
import PreloadingScreen from "./components/PreloadingScreen";
import UserBookings from "./components/userside/UserBooking";
const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <ConditionalRoute>
                <PreloadingScreen />
              </ConditionalRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ConditionalRoute>
                <Register />
              </ConditionalRoute>
            }
          />
          <Route
            path="/login"
            element={
              <Conditionforuser>
                <Login />
              </Conditionforuser>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRouteuser>
                <HomePage />
              </ProtectedRouteuser>
            }
          />
          <Route
            path="/booking-confirmation/:bookingId"
            element={
              <ProtectedRouteuser>
                <BookingConfirmation />
              </ProtectedRouteuser>
            }
          />

          <Route
            path="/shops/:shopId"
            element={
              <ProtectedRouteuser>
                <ShopDetailsPage />
              </ProtectedRouteuser>
            }
          />
          <Route
            path="/booking/:shopId"
            element={
              <ProtectedRouteuser>
                <BookingPage />
              </ProtectedRouteuser>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRouteuser>
                <UserBookings />
              </ProtectedRouteuser>
            }
          />
          <Route
          path="/profile"
          element={
              <ProtectedRouteuser>
                <Profile />
              </ProtectedRouteuser>
            }
          />
         
         
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/shopkeeper/dashbord"
            element={
              <ConditionalRoute isProtected={true}>
                <Dashbord />
              </ConditionalRoute>
            }
          />
          <Route
            path="/shopkeeper/verification-pending"
            element={<VerificationPending />}
            sProtected={false}
          />

          <Route path="/*" element={<ShopKeeperRoutes />} />
          <Route path="/*" element={<AdminRoutes />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
