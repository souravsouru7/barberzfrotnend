import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, DollarSign, CheckCircle } from "lucide-react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

// Import your Redux actions
import { fetchShopById } from "../../redux/slices/shopSlice";
import { saveBooking, savePayment } from "../../redux/slices/bookingSlice";
import { fetchAvailableSlots } from "../../redux/slices/timeSlotSlice";

const BookingPage = () => {
  const { shopId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const { currentShop, loading: shopLoading, error: shopError } = useSelector((state) => state.shop);
  const { availableSlots, loading: slotsLoading, error: slotsError } = useSelector((state) => state.timeSlots);
  const user = useSelector((state) => state.auth.user);

  // Local state
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch shop data on component mount
  useEffect(() => {
    if (shopId) {
      dispatch(fetchShopById(shopId));
    }
  }, [dispatch, shopId]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (shopId && selectedDate) {
      dispatch(fetchAvailableSlots({ shopId, date: selectedDate }));
    }
  }, [dispatch, shopId, selectedDate]);

  // Helper functions
  const getAvailableTimeSlots = () => {
    if (!availableSlots) return [];
    return availableSlots.map(slot => ({
      _id: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime
    }));
  };

  const selectedServiceDetails = currentShop?.services.find(
    (service) => service._id === selectedService
  );

  const getAvailableDates = (daysToShow = 7) => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Handle payment success
  const handlePaymentSuccess = async (details, data) => {
    try {
      setPaymentProcessing(true);
      const selectedSlot = getAvailableTimeSlots().find(
        (slot) => slot._id === selectedTimeSlot
      );

      const bookingData = {
        shopId,
        userId: user._id,
        service: {
          _id: selectedService,
          serviceName: selectedServiceDetails.serviceName,
          duration: selectedServiceDetails.duration,
          price: selectedServiceDetails.price,
        },
        bookingDate: selectedDate.toISOString(),
        bookingSlot: {
          _id: selectedTimeSlot,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
        totalAmount: selectedServiceDetails.price,
      };

      const bookingResponse = await dispatch(saveBooking(bookingData)).unwrap();

      const paymentData = {
        bookingId: bookingResponse._id,
        userId: user._id,
        paymentMethod: "PayPal",
        transactionId: details.id,
        totalAmount: parseFloat(details.purchase_units[0].amount.value),
        paymentStatus: details.status.toLowerCase() === "completed" ? "Paid" : "Pending",
      };

      await dispatch(savePayment(paymentData)).unwrap();

      setPaymentSuccess(true);
      setPaymentProcessing(false);

      setTimeout(() => {
        navigate(`/booking-confirmation/${bookingResponse._id}`);
      }, 2000);
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentProcessing(false);
      alert("Payment processing failed. Please try again.");
    }
  };

  // Handle booking confirmation
  const handleBookingConfirmation = () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot) {
      alert("Please select all booking details.");
      return;
    }
    setPaymentProcessing(true);
  };

  // Loading state
  if (shopLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <motion.div
          className="w-16 h-16 border-t-4 border-pink-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Error state
  if (shopError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
        Error: {shopError}
      </div>
    );
  }

  // Time Slot Section Component
  const TimeSlotSection = () => (
    <AnimatePresence>
      {selectedDate && (
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 text-pink-400">
            Select a Time Slot
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {slotsLoading ? (
              <motion.div
                className="col-span-full flex justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-8 h-8 text-pink-500" />
              </motion.div>
            ) : slotsError ? (
              <p className="col-span-full text-center text-red-500">
                Error loading time slots: {slotsError}
              </p>
            ) : getAvailableTimeSlots().length > 0 ? (
              getAvailableTimeSlots().map((slot) => (
                <motion.button
                  key={slot._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-lg ${
                    selectedTimeSlot === slot._id
                      ? "bg-pink-500 text-white"
                      : "bg-gray-800"
                  } hover:bg-pink-400 transition-all duration-300 shadow-lg`}
                  onClick={() => setSelectedTimeSlot(slot._id)}
                >
                  <Clock className="w-6 h-6 mb-2 mx-auto" />
                  <p className="text-center">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </motion.button>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400">
                No time slots available for this date.
              </p>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-gray-200 p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"
        >
          Book Your Appointment at {currentShop?.shopName}
        </motion.h1>

        {/* Services Section */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 text-pink-400">
            Select a Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentShop?.services.map((service) => (
              <motion.button
                key={service._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-lg ${
                  selectedService === service._id
                    ? "bg-pink-500 text-white"
                    : "bg-gray-800"
                } hover:bg-pink-400 transition-all duration-300 shadow-lg`}
                onClick={() => setSelectedService(service._id)}
              >
                <h3 className="font-semibold text-lg mb-2">
                  {service.serviceName}
                </h3>
                <p className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />${service.price}
                </p>
                <p className="flex items-center mt-2">
                  <Clock className="w-4 h-4 mr-1" />
                  {service.duration} minutes
                </p>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Date Selection */}
        <AnimatePresence>
          {selectedService && (
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-semibold mb-6 text-pink-400">
                Select a Date
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getAvailableDates().map((date, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-lg ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? "bg-pink-500 text-white"
                        : "bg-gray-800"
                    } hover:bg-pink-400 transition-all duration-300 shadow-lg`}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTimeSlot(null);
                    }}
                  >
                    <Calendar className="w-6 h-6 mb-2 mx-auto" />
                    <p className="text-center">
                      {index === 0
                        ? "Today"
                        : index === 1
                        ? "Tomorrow"
                        : date.toLocaleDateString(undefined, {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Time Slots Section */}
        <TimeSlotSection />

        {/* Booking Summary */}
        <AnimatePresence>
          {selectedService && selectedDate && selectedTimeSlot && (
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="mb-12 bg-gray-800 p-8 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-6 text-pink-400">
                Booking Summary
              </h2>
              <div className="space-y-4">
                <p className="flex items-center">
                  <span className="font-semibold mr-2">Service:</span>
                  {selectedServiceDetails?.serviceName} - ${selectedServiceDetails?.price}
                </p>
                <p className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-semibold mr-2">Date:</span>
                  {selectedDate?.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-semibold mr-2">Time:</span>
                  {getAvailableTimeSlots().find(
                    (slot) => slot._id === selectedTimeSlot
                  )?.startTime}
                </p>
                <p className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span className="font-semibold mr-2">Total:</span>
                  ${selectedServiceDetails?.price}
                </p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Payment Section */}
        <AnimatePresence>
          {!paymentSuccess && selectedService && selectedDate && selectedTimeSlot && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="space-y-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-lg text-lg font-semibold"
                disabled={paymentProcessing}
                onClick={handleBookingConfirmation}
              >
                {paymentProcessing ? "Processing..." : "Confirm Booking"}
              </motion.button>

              {paymentProcessing && (
                <PayPalScriptProvider
                  options={{
                    "client-id": "AX8vJHmoiXwxbyFjEcAO7SwZYs8VaIxpx7IoGcEqpjjamHAViHYBdCc9oPjgTQtyiCvjhPbZQgmRUkUP",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: selectedServiceDetails.price.toString(),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order
                        .capture()
                        .then((details) => handlePaymentSuccess(details, data));
                    }}
                    onError={(err) => {
                      console.error("PayPal Checkout onError", err);
                      setPaymentProcessing(false);
                      alert(
                        "An error occurred during payment processing. Please try again."
                      );
                    }}
                    onCancel={() => {
                      setPaymentProcessing(false);
                      alert("Payment cancelled. Please try again.");
                    }}
                  />
                </PayPalScriptProvider>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {paymentSuccess && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-center space-y-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-green-500 flex items-center justify-center text-xl"
              >
                <CheckCircle className="w-8 h-8 mr-2" />
                Payment successful! Booking confirmed.
              </motion.div>
              <p className="text-gray-300">
                Redirecting to your booking confirmation...
              </p>
              <motion.div
                className="w-16 h-16 mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full border-t-4 border-pink-500 rounded-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BookingPage;