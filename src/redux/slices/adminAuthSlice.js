// src/features/adminAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Load initial authentication state from localStorage
const initialAuthState = {
  otpSent: false,
  loading: false,
  error: null,
  otpVerified: localStorage.getItem('isAuthenticated') === 'true', // Load from localStorage
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true', // Load from localStorage
  phoneNumber: localStorage.getItem('phoneNumber') || '', // Load from localStorage
};

// Thunk to send OTP to phone number
export const sendOtp = createAsyncThunk(
  'adminAuth/sendOtp',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/admin/send-otp', { phoneNumber });
      return { message: response.data.message, phoneNumber }; // Include phone number in the response
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// Thunk to verify OTP (the phone number will be stored in Redux from the previous step)
export const verifyOtp = createAsyncThunk(
  'adminAuth/verifyOtp',
  async ({ otp }, { getState, rejectWithValue }) => {
    const { phoneNumber } = getState().adminAuth;
    try {
      const response = await axios.post('/api/admin/verify-otp', { phoneNumber, otp });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: initialAuthState,
  reducers: {
    logoutAdmin: (state) => {
      state.isAuthenticated = false;
      state.otpVerified = false;
      state.phoneNumber = '';
      localStorage.removeItem('isAuthenticated'); // Remove from localStorage on logout
      localStorage.removeItem('phoneNumber');
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.phoneNumber = action.payload.phoneNumber;
        localStorage.setItem('phoneNumber', action.payload.phoneNumber); // Save phone number to localStorage
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
        state.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true'); // Store isAuthenticated in localStorage
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
