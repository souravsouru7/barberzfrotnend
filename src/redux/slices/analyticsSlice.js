import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
axios.defaults.baseURL = 'https://www.barbezz.shop';

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async ({ shopId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/shops/${shopId}/analytics`, {
        params: { startDate, endDate }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    bookingStats: [],
    revenueStats: [],
    serviceStats: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingStats = action.payload.bookingStats;
        state.revenueStats = action.payload.revenueStats;
        state.serviceStats = action.payload.serviceStats;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch analytics';
      });
  }
});

export default analyticsSlice.reducer;