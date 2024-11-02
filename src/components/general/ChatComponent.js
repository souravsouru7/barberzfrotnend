import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWebSocket, createChatRoom, sendMessage, fetchMessages } from './chatSlice';

const ChatComponent = ({ booking }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { activeChatRoom, messages, loading } = useSelector(state => state.chat);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    dispatch(connectWebSocket());
  }, [dispatch]);

  useEffect(() => {
    if (activeChatRoom) {
      dispatch(fetchMessages(activeChatRoom._id));
    }
  }, [dispatch, activeChatRoom]);

  const handleCreateChatRoom = async () => {
    try {
      await dispatch(createChatRoom({
        bookingId: booking._id,
        userId: user._id,
        shopId: booking.shopId
      })).unwrap();
    } catch (error) {
      console.error("Failed to create chat room:", error);
    }
  };

  const handleSendMessage = async () => {
    if (messageContent.trim() && activeChatRoom) {
      try {
        await dispatch(sendMessage({
          senderId: user._id,
          receiverId: booking.shopId,
          content: messageContent,
          chatRoomId: activeChatRoom._id
        })).unwrap();
        setMessageContent('');
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="chat-component">
      {!activeChatRoom ? (
        <button onClick={handleCreateChatRoom}>Start Chat</button>
      ) : (
        <>
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.senderId === user._id ? 'sent' : 'received'}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatComponent;