import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'https://www.barbezz.shop';

export const saveBooking = createAsyncThunk(
  'booking/saveBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/bookings/create', bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
  }
);

export const savePayment = createAsyncThunk(
  'booking/savePayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/payments', paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
  }
);

export const fetchBookingConfirmation = createAsyncThunk(
  'booking/fetchBookingConfirmation',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/bookings/confirmation/${bookingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/bookings/user-bookings/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
  }
);
const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    currentBooking: null,
    currentPayment: null,
    shopDetails: null,
    userBookings: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetBookingState: (state) => {
      state.currentBooking = null;
      state.currentPayment = null;
      state.shopDetails = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.success = true;
      })
      .addCase(saveBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(savePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
        state.success = true;
      })
      .addCase(savePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBookingConfirmation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingConfirmation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.booking;
        state.currentPayment = action.payload.payment;
        state.shopDetails = action.payload.shop;
        state.success = true;
      })
      .addCase(fetchBookingConfirmation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
