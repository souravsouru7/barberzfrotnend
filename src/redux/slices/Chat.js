import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


axios.defaults.baseURL = 'https://www.barbezz.shop';

export const createChatRoom = createAsyncThunk(
  'chat/createChatRoom',
  async ({ bookingId, userId, shopId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/chat/rooms', { bookingId, userId, shopId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ senderId, receiverId, content, chatRoomId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/chat/messages', { senderId, receiverId, content, chatRoomId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/chat/rooms/${roomId}/messages`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    activeChatRoom: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChatRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.activeChatRoom = action.payload;
        state.messages = []; 
      })
      .addCase(createChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Remove this line as we're now handling message addition in the component
        // state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage } = chatSlice.actions;

export default chatSlice.reducer;
