import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '../../redux/slices/shopSlice';
import { Clock, Search, FileDown, MessageSquare } from 'lucide-react';
import { createChatRoom, sendMessage, fetchMessages, addMessage } from '../../redux/slices/Chat';

const ViewBookings = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(state => state.shop.bookings);
  const loading = useSelector(state => state.shop.loading);
  const error = useSelector(state => state.shop.error);
  const shop = useSelector(state => state.shop.shop);
  const { activeChatRoom, messages } = useSelector(state => state.chat);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    if (shop) {
      dispatch(fetchBookings(shop._id));
    }
  }, [dispatch, shop]);

  useEffect(() => {
    if (activeChatRoom) {
      const intervalId = setInterval(() => {
        dispatch(fetchMessages(activeChatRoom._id));
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [activeChatRoom, dispatch]);

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleCreateChatRoom = async (booking) => {
    try {
      const result = await dispatch(createChatRoom({
        bookingId: booking._id,
        userId: booking.userId._id,
        shopId: shop._id
      })).unwrap();
      setSelectedBooking(booking);
      setShowChat(true);
      dispatch(fetchMessages(result._id));
    } catch (error) {
      console.error("Failed to create chat room:", error);
    }
  };

  const handleSendMessage = async () => {
    if (messageContent.trim() && activeChatRoom) {
      try {
        const result = await dispatch(sendMessage({
          senderId: shop._id,
          receiverId: selectedBooking.userId._id,
          content: messageContent,
          chatRoomId: activeChatRoom._id
        })).unwrap();

        dispatch(addMessage(result));
        setMessageContent("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const getTimeSlot = (booking) => {
    try {
      if (booking && booking.bookingSlot && shop && shop.availableSlots) {
        const slot = shop.availableSlots.find(slot => slot._id.toString() === booking.bookingSlot);
        return slot ? `${slot.startTime} - ${slot.endTime}` : 'N/A';
      }
      return 'N/A';
    } catch (error) {
      console.error('Error getting time slot:', error);
      return 'N/A';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-xl shadow-lg border-l-4 border-red-500">
      <h3 className="text-lg font-bold text-red-500 mb-2">Error</h3>
      <p className="text-gray-300">{error}</p>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen p-6">
      <header className="flex justify-between items-center bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-xl mb-6 shadow-lg">
        <div className="flex items-center">
          <Clock size={28} className="text-pink-500 mr-2" />
          <div className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold">
            View Bookings
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <img src="avatar.png" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-pink-500" />
          <span className="text-gray-100">{shop?.shopName}</span>
        </div>
      </header>

      <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6">
        <div className="flex space-x-4 mb-6">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search Bookings..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border-gray-600 text-gray-100 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <select className="px-4 py-2 bg-gray-700 border-gray-600 text-gray-100 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500">
            <option value="">All Services</option>
          </select>
          <select className="px-4 py-2 bg-gray-700 border-gray-600 text-gray-100 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500">
            <option value="">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
          <button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-pink-500/50 flex items-center">
            <FileDown size={20} className="mr-2" />
            Export Bookings
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800 bg-opacity-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-700 hover:bg-opacity-50 transition-colors duration-300">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{booking.userId.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{booking.service.serviceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{getTimeSlot(booking)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{booking.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{booking.paymentStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => openModal(booking)}
                      className="text-pink-500 hover:text-pink-400 px-4 py-2 rounded-lg border border-pink-500 hover:bg-pink-500 hover:bg-opacity-20 transition-colors duration-300"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleCreateChatRoom(booking)}
                      className="text-purple-500 hover:text-purple-400 px-4 py-2 rounded-lg border border-purple-500 hover:bg-purple-500 hover:bg-opacity-20 transition-colors duration-300 flex items-center"
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showChat && selectedBooking && activeChatRoom && (
        <div className="fixed bottom-0 right-0 w-80 bg-gray-800 rounded-t-lg shadow-lg">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-white">Chat with {selectedBooking.userId.name}</h3>
            <button onClick={() => setShowChat(false)} className="text-white hover:text-gray-200">×</button>
          </div>
          <div className="h-64 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.senderId === shop._id ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${
                  msg.senderId === shop._id 
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-100'
                }`}>
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
              className="w-full bg-gray-700 border-gray-600 text-gray-100 rounded-lg p-2 mb-2 focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-pink-500/50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBookings;