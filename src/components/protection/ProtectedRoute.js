import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.adminAuth);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />; // Redirect to OTP page if not authenticated
  }

  return children; 
};

export default ProtectedRoute;
