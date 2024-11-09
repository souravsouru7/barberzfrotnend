import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


axios.defaults.baseURL = 'https://www.barbezz.shop';

// Existing actions
export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (reviewData, { getState, dispatch }) => {
    const { user } = getState().auth;
    const response = await axios.post(`/api/reviews`, { ...reviewData, userId: user._id });
    
    // Refetch reviews after adding
    dispatch(fetchShopReviews(reviewData.shopId));
    
    return response.data;
  }
);

export const fetchShopReviews = createAsyncThunk(
  'reviews/fetchShopReviews',
  async (shopId) => {
    const response = await axios.get(`/api/shops/${shopId}/reviews`);
    return response.data.data;
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData, shopId }, { dispatch }) => {
    const response = await axios.put(`/api/reviews/${reviewId}`, reviewData);
    
    // Refetch reviews after updating
    dispatch(fetchShopReviews(shopId));
    
    return response.data;
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async ({ reviewId, shopId }, { dispatch }) => {
    await axios.delete(`/api/reviews/${reviewId}`);
    
    // Refetch reviews after deleting
    dispatch(fetchShopReviews(shopId));
    
    return reviewId;
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null
  },
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchShopReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchShopReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle update review
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(review => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(review => review._id !== action.payload);
      });
  }
});

export const { setReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
