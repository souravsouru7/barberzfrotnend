import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../../redux/slices/notificationSlice';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  
  const user = useSelector((state) => state.auth.user);
  const { messages } = useSelector((state) => state.chat);
  const { 
    notifications, 
    unreadCount: notificationUnreadCount,
    loading 
  } = useSelector((state) => state.notifications);

  // Calculate total unread count from both messages and notifications
  const unreadMessagesCount = messages.filter(
    msg => !msg.isRead && msg.receiverId === user?._id
  ).length;
  
  const totalUnreadCount = unreadMessagesCount + notificationUnreadCount;

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchNotifications(user._id));
    }
  }, [dispatch, user?._id]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await dispatch(markNotificationAsRead(notification._id));
    }
    
    // Handle navigation based on notification type
    if (notification.chatRoomId) {
      navigate(`/chat/${notification.chatRoomId}`);
    } else if (notification.bookingId) {
      navigate(`/bookings/${notification.bookingId}`);
    }
    
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
    if (user?._id) {
      dispatch(markAllNotificationsAsRead(user._id));
    }
  };

  return (
    <div className="relative">
      <motion.button
        className="relative p-2 text-gray-300 hover:text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-6 h-6" />
        {totalUnreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full">
            {totalUnreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="p-2 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              {totalUnreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm text-pink-500 hover:text-pink-400"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-400">
                  Loading notifications...
                </div>
              ) : (
                <>
                  {/* Unread Messages Section */}
                  {messages
                    .filter(msg => !msg.isRead && msg.receiverId === user?._id)
                    .map((msg) => (
                      <div
                        key={msg._id}
                        className="p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                        onClick={() => navigate(`/chat/${msg.chatRoomId}`)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-pink-500 font-semibold">New Message</span>
                          <span className="text-xs text-gray-400">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-300 mt-1 text-sm truncate">{msg.content}</p>
                      </div>
                    ))}

                  {/* Notifications Section */}
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${notification.isRead ? 'text-gray-400' : 'text-pink-500'}`}>
                          {notification.title}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`mt-1 text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-300'}`}>
                        {notification.content}
                      </p>
                    </div>
                  ))}

                  {totalUnreadCount === 0 && (
                    <div className="p-4 text-center text-gray-400">
                      No new notifications
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-2 bg-gray-900 border-t border-gray-700">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;