import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRouteuser = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to OTP page if not authenticated
  }

  return children; // Allow access if authenticated
};

export default ProtectedRouteuser
