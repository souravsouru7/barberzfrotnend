import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom'; 
const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const { loading, passwordReset, error } = useSelector((state) => state.auth);
  
    useEffect(() => {
      setTimeout(()=>{
        if (passwordReset) {
            navigate('/login'); 
          }
      },1000)
    }, [passwordReset, navigate]); 
  
    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(resetPassword({ email, otp, newPassword }));
    };
  
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-100">
        <main className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg mt-40">
          <section className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
            <p className="text-gray-400">Enter your details to reset your password.</p>
          </section>
  
          <section>
            <form onSubmit={handleSubmit}>
              <fieldset className="mb-4">
                <label htmlFor="email" className="block mb-2">Email Address:</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  required
                />
  
                <label htmlFor="otp" className="block mb-2">OTP:</label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  required
                />
  
                <label htmlFor="newPassword" className="block mb-2">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  required
                />
              </fieldset>
  
              <button
                type="submit"
                disabled={loading}
                className="w-full p-3 bg-pink-600 rounded-lg text-white hover:bg-pink-700"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
  
            {passwordReset && <p className="text-green-500 mt-4">Password has been reset successfully.</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </section>
        </main>
  
        <footer className="bg-gray-900 text-gray-300 py-5 text-center mt-10">
          <p>&copy; 2024 Barber Shop Booking. All rights reserved.</p>
          <div className="mt-3">
            <a href="#" className="text-pink-500 hover:underline">Privacy Policy</a> |
            <a href="#" className="text-pink-500 hover:underline mx-2">Terms of Service</a> |
            <a href="#" className="text-pink-500 hover:underline">Contact</a>
          </div>
        </footer>
      </div>
    );
  };
  
  export default ResetPassword;
  