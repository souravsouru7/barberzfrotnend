import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
axios.defaults.baseURL = 'https://www.barbezz.shop';
export const fetchAvailableSlots = createAsyncThunk(
  'timeSlots/fetchAvailable',
  async ({ shopId, date }) => {
    const response = await axios.get(`/api/slots/available`, {
      params: { shopId, date: date.toISOString() }
    });
    return response.data;
  }
);

const timeSlotSlice = createSlice({
  name: 'timeSlots',
  initialState: {
    availableSlots: [],
    loading: false,
    error: null
  },
  reducers: {
    clearSlots: (state) => {
      state.availableSlots = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearSlots } = timeSlotSlice.actions;
export default timeSlotSlice.reducer;
