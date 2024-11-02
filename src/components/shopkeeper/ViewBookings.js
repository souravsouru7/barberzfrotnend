import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '../../redux/slices/shopSlice';
import { Clock, Search, FileDown, MessageSquare  } from 'lucide-react';
import { createChatRoom, sendMessage,fetchMessages ,addMessage } from '../../redux/slices/Chat';
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
      }, 3000); // Fetch messages every 3 seconds

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
  useEffect(() => {
    if (activeChatRoom) {
      dispatch(fetchMessages(activeChatRoom._id));
    }
  }, [activeChatRoom, dispatch]);
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
      // Optimistically update local state
      const optimisticMessage = {
        senderId: shop._id,
        content: messageContent,
        createdAt: new Date().toISOString(),
      };
      dispatch(addMessage(optimisticMessage));
      setMessageContent("");

      try {
        const result = await dispatch(sendMessage({
          senderId: shop._id,
          receiverId: selectedBooking.userId._id,
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
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
      <h3 className="text-lg font-bold text-red-500 mb-2">Error</h3>
      <p className="text-gray-800">{error}</p>
    </div>
  );

  return (
    <div className="bg-gray-100">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl mb-6">
        <div className="flex items-center">
          <Clock size={28} className="text-indigo-600 mr-2" />
          <div className="text-2xl text-gray-800 font-bold">View Bookings</div>
        </div>
        <div className="flex items-center">
          <img
            src="avatar.png"
            alt="User Avatar"
            className="w-10 h-10 rounded-full mr-2"
          />
          <span className="text-gray-700">{shop?.shopName}</span>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex space-x-4 mb-6">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search Bookings..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">All Services</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
          <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/50">
            <FileDown size={20} className="mr-2" />
            Export Bookings
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{booking.userId.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{booking.service.serviceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{getTimeSlot(booking)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{booking.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{booking.paymentStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openModal(booking)}
                      className="text-indigo-600 hover:text-indigo-900 px-4 py-2 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors duration-300"
                    >
                      View Details
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openModal(booking)}
                      className="text-indigo-600 hover:text-indigo-900 px-4 py-2 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors duration-300 mr-2"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleCreateChatRoom(booking)}
                      className="text-green-600 hover:text-green-900 px-4 py-2 rounded-lg border border-green-600 hover:bg-green-50 transition-colors duration-300 flex items-center"
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
        <div className="fixed bottom-0 right-0 w-80 bg-white rounded-t-lg shadow-lg">
          <div className="bg-indigo-600 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-white">Chat with {selectedBooking.userId.name}</h3>
            <button onClick={() => setShowChat(false)} className="text-white">X</button>
          </div>
          <div className="h-64 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.senderId === shop._id ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.senderId === shop._id ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.content}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <input
              type="text"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-2"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
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