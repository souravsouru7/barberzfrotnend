import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookingConfirmation } from '../../redux/slices/bookingSlice';
import { FaCalendarAlt, FaClock, FaMoneyBillWave, FaStore, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBooking, currentPayment, shopDetails, loading, error } = useSelector((state) => state.booking);

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingConfirmation(bookingId));
    }
  }, [dispatch, bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentBooking || !currentPayment || !shopDetails) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="bg-yellow-500 text-gray-900 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">No Information Available</h2>
          <p>We couldn't find any booking information. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
      <main className="p-8 max-w-4xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-pink-500">
          <h1 className="text-4xl font-bold text-pink-500 mb-8 text-center">Booking Confirmation</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-pink-500 mb-4">Your Booking Summary</h2>
              <div className="space-y-3">
                <p className="flex items-center"><FaStore className="mr-2 text-pink-500" /> <strong>Service:</strong> {currentBooking.service.serviceName}</p>
                <p className="flex items-center"><FaCalendarAlt className="mr-2 text-pink-500" /> <strong>Date:</strong> {new Date(currentBooking.bookingDate).toLocaleDateString()}</p>
                <p className="flex items-center"><FaClock className="mr-2 text-pink-500" /> <strong>Time Slot:</strong> {currentBooking.bookingSlot}</p>
                <p className="flex items-center"><FaMoneyBillWave className="mr-2 text-pink-500" /> <strong>Total Cost:</strong> ${currentPayment.totalAmount}</p>
              </div>
            </section>

            <section className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-pink-500 mb-4">Shop Details</h2>
              <div className="space-y-3">
                <p className="flex items-center"><FaStore className="mr-2 text-pink-500" /> <strong>Shop Name:</strong> {shopDetails.shopName}</p>
                <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-pink-500" /> <strong>Address:</strong> {shopDetails.address}</p>
                <p className="flex items-center"><FaPhone className="mr-2 text-pink-500" /> <strong>Contact:</strong> {shopDetails.contactNumber}</p>
              </div>
            </section>
          </div>

          <section className="mt-8 text-center">
            <h2 className="text-2xl font-semibold text-pink-500 mb-4">Thank You!</h2>
            <p className="text-lg">Your booking has been successfully confirmed. We look forward to seeing you!</p>
          </section>

          <section className="mt-8 text-center">
            <button
              onClick={() => navigate('/home')}
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Back to Home
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;