import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserBookings } from "../../redux/slices/bookingSlice";
import { fetchShopById } from "../../redux/slices/shopSlice";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import { createChatRoom, sendMessage,fetchMessages, addMessage  } from "../../redux/slices/Chat";

const UserBookings = () => {
  const dispatch = useDispatch();
  const { userBookings, loading, error } = useSelector(
    (state) => state.booking
  );


  const { user } = useSelector((state) => state.auth);
  const { activeChatShop, activeRoom } = useSelector((state) => state.chat);
  const [shopDetails, setShopDetails] = useState({});
  const [filterDate, setFilterDate] = useState({ start: "", end: "" });
  const [sortOption, setSortOption] = useState("date");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const { activeChatRoom, messages } = useSelector((state) => state.chat);
  const [showChat, setShowChat] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const bookingsPerPage = 5;
  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchUserBookings(user._id));
    }
  }, [dispatch, user]);
  useEffect(() => {
    if (activeChatRoom) {
      dispatch(fetchMessages(activeChatRoom._id));
    }
  }, [activeChatRoom, dispatch]);
  useEffect(() => {
    if (activeChatRoom) {
      const intervalId = setInterval(() => {
        dispatch(fetchMessages(activeChatRoom._id));
      }, 3000); // Fetch messages every 3 seconds

      return () => clearInterval(intervalId);
    }
  }, [activeChatRoom, dispatch]);

  useEffect(() => {
    const fetchShopDetails = async () => {
      const uniqueShopIds = [
        ...new Set(userBookings.map((booking) => booking.shopId)),
      ];
      const shopDetailsPromises = uniqueShopIds.map((shopId) =>
        dispatch(fetchShopById(shopId))
      );
      const shopDetailsResults = await Promise.all(shopDetailsPromises);
      const shopDetailsMap = {};
      shopDetailsResults.forEach((result) => {
        if (result.payload) {
          shopDetailsMap[result.payload._id] = result.payload;
        }
      });
      setShopDetails(shopDetailsMap);
    };

    if (userBookings.length > 0) {
      fetchShopDetails();
    }
  }, [dispatch, userBookings]);

  const getTimeSlotString = (booking) => {
    const shop = shopDetails[booking.shopId];
    if (shop && shop.availableSlots) {
      const slot = shop.availableSlots.find(
        (slot) => slot._id === booking.bookingSlot
      );
      if (slot) {
        return `${slot.startTime} - ${slot.endTime}`;
      }
    }
    return "Time not available";
  };
  useEffect(() => {
    console.log("activeChatShop changed:", activeChatShop);
  }, [activeChatShop]);

  
  useEffect(() => {
    console.log("UserBookings rendered. activeChatShop:", activeChatShop);
    console.log("UserBookings rendered. activeRoom:", activeRoom);
  }, [activeChatShop, activeRoom]);
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  const currentDate = new Date();

  const upcomingBookings = userBookings.filter(
    (booking) =>
      booking.status === "confirmed" &&
      new Date(booking.bookingDate) >= currentDate
  );

  const pastBookings = userBookings.filter(
    (booking) =>
      booking.status === "done" ||
      (booking.status === "confirmed" &&
        new Date(booking.bookingDate) < currentDate)
  );
  const handleCreateChatRoom = async (booking) => {
    try {
      const result = await dispatch(createChatRoom({
        bookingId: booking._id,
        userId: user._id,
        shopId: booking.shopId
      })).unwrap();
      setShowChat(true);
      dispatch(fetchMessages(result._id));
    } catch (error) {
      console.error("Failed to create chat room:", error);
    }
  };

  const handleSendMessage = async () => {
    if (messageContent.trim() && activeChatRoom) {
      // Optimistically update local state
      const optimisticMessage = {
        senderId: user._id,
        content: messageContent,
        createdAt: new Date().toISOString(),
      };
      dispatch(addMessage(optimisticMessage));
      setMessageContent("");

      try {
        const result = await dispatch(sendMessage({
          senderId: user._id,
          receiverId: activeChatRoom.shopId,
          content: messageContent,
          chatRoomId: activeChatRoom._id
        })).unwrap();
        
        // Replace optimistic message with actual message from server
        dispatch(addMessage(result));
      } catch (error) {
        console.error("Failed to send message:", error);
        // You might want to implement a way to remove the optimistic message if sending failed
      }
    }
  };

  
  const renderBookingCard = (booking) => (
    <motion.div
      key={booking._id}
      className="booking-card bg-gray-800 rounded-lg shadow-lg p-6 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="barbershop-details mb-4">
        <h3 className="text-xl font-bold text-blue-400">
          {shopDetails[booking.shopId]?.shopName || "Shop Name Not Available"}
        </h3>
        <p className="text-gray-300">
          Location:{" "}
          {shopDetails[booking.shopId]?.address || "Address Not Available"}
        </p>
        <p className="text-gray-300">
          Contact: {shopDetails[booking.shopId]?.contactNumber || "N/A"}
        </p>
      </div>
      <div className="appointment-details mb-4">
        <p className="text-gray-200">
          Date: {new Date(booking.bookingDate).toLocaleDateString()}
        </p>
        <p className="text-gray-200">Time: {getTimeSlotString(booking)}</p>
        <p className="text-gray-200">Services: {booking.service.serviceName}</p>
        <p className="text-gray-200">Price: ${booking.service.price}</p>
        <p className="text-gray-200">
          Duration: {booking.service.duration} minutes
        </p>
      </div>
      <div className="actions flex justify-between items-center mt-4">
        {booking.status === "confirmed" &&
        new Date(booking.bookingDate) >= currentDate ? (
          <>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Reschedule
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Cancel
            </button>
            <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center"
          onClick={() => handleCreateChatRoom(booking)}
        >
          <MessageSquare className="mr-2" />
          Chat
        </button>
            
          
          </>
        ) : (
          <>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Rebook
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Review
            </button>
          </>
        )}
      </div>
      <div
        className={`status-indicator mt-4 px-3 py-1 rounded-full text-center text-sm font-semibold ${
          booking.status === "confirmed"
            ? "bg-green-500 text-white"
            : booking.status === "done"
            ? "bg-blue-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
      </div>
    </motion.div>
  );

  const filteredBookings = userBookings.filter((booking) => {
    const matchesKeyword =
      searchKeyword === "" ||
      booking.service.serviceName
        .toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      shopDetails[booking.shopId]?.shopName
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status.toLowerCase() === statusFilter;

    const bookingDate = new Date(booking.bookingDate);
    const matchesDateRange =
      (!filterDate.start || bookingDate >= new Date(filterDate.start)) &&
      (!filterDate.end || bookingDate <= new Date(filterDate.end));

    return matchesKeyword && matchesStatus && matchesDateRange;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortOption === "date") {
      return new Date(b.bookingDate) - new Date(a.bookingDate);
    } else if (sortOption === "barbershop") {
      return (shopDetails[a.shopId]?.shopName || "").localeCompare(
        shopDetails[b.shopId]?.shopName || ""
      );
    } else if (sortOption === "service") {
      return a.service.serviceName.localeCompare(b.service.serviceName);
    }
    return 0;
  });

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
               {showChat && activeChatRoom && (
          <motion.div
            className="fixed bottom-0 right-0 w-80 bg-gray-800 rounded-t-lg shadow-lg"
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
          >
            <div className="bg-gray-700 p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-bold">Chat with Shop</h3>
              <button onClick={() => setShowChat(false)}>X</button>
            </div>
            <div className="h-64 overflow-y-auto p-4">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.senderId === user._id ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${msg.senderId === user._id ? 'bg-blue-500' : 'bg-gray-600'}`}>
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full bg-gray-700 text-white rounded p-2"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
          <h2 className="text-3xl font-bold mb-6 text-blue-400">
            Your Upcoming Appointments
          </h2>
          <AnimatePresence>
            {upcomingBookings.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                You have no upcoming bookings.
              </motion.p>
            ) : (
              upcomingBookings.map((booking) => renderBookingCard(booking))
            )}
          </AnimatePresence>
        </motion.section>

        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-400">
            Past Appointments
          </h2>
          <div className="mb-6">
            <button
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
              <Filter className="mr-2" />
              {isFilterVisible ? "Hide Filters" : "Show Filters"}
              {isFilterVisible ? (
                <ChevronUp className="ml-2" />
              ) : (
                <ChevronDown className="ml-2" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {isFilterVisible && (
              <motion.div
                className="filter-sort-container bg-gray-800 p-4 rounded-lg mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label
                      htmlFor="start-date"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Start Date:
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      value={filterDate.start}
                      onChange={(e) =>
                        setFilterDate({ ...filterDate, start: e.target.value })
                      }
                      className="w-full bg-gray-700 text-white rounded p-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="end-date"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      End Date:
                    </label>
                    <input
                      type="date"
                      id="end-date"
                      value={filterDate.end}
                      onChange={(e) =>
                        setFilterDate({ ...filterDate, end: e.target.value })
                      }
                      className="w-full bg-gray-700 text-white rounded p-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="sort-options"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Sort By:
                    </label>
                    <select
                      id="sort-options"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded p-2"
                    >
                      <option value="date">Date</option>
                      <option value="barbershop">Barbershop</option>
                      <option value="service">Service</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="status-filter"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Filter by Status:
                    </label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded p-2"
                    >
                      <option value="all">All</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {pastBookings.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                You have no past bookings.
              </motion.p>
            ) : (
              pastBookings.map((booking) => renderBookingCard(booking, true))
            )}
          </AnimatePresence>
        </motion.section>

        <motion.section
          className="booking-history"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-400">
            Complete Booking History
          </h2>
          <div className="search-container mb-6 relative">
            <input
              type="text"
              id="search"
              placeholder="Search by keywords..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-3">Date</th>
                  <th className="p-3">Barbershop</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => (
                  <motion.tr
                    key={booking._id}
                    className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="p-3">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {shopDetails[booking.shopId]?.shopName || "N/A"}
                    </td>
                    <td className="p-3">{booking.service.serviceName}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          booking.status.toLowerCase() === "confirmed"
                            ? "bg-green-500 text-white"
                            : booking.status.toLowerCase() === "pending"
                            ? "bg-yellow-500 text-black"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm mr-2 transition duration-300">
                        Rebook
                      </button>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm transition duration-300">
                        Review
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedBookings.length > bookingsPerPage && (
            <div className="pagination flex justify-center items-center mt-6">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-gray-300 mx-4">
                Page {currentPage} of{" "}
                {Math.ceil(sortedBookings.length / bookingsPerPage)}
              </span>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(sortedBookings.length / bookingsPerPage)
                    )
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(sortedBookings.length / bookingsPerPage)
                }
              >
                Next
              </button>
            </div>
          )}
        </motion.section>
      </main>

      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 Barbershop Booking. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-blue-400 transition duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default UserBookings;
