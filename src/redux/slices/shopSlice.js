import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Set the base URL for Axios

axios.defaults.baseURL = 'https://api.barbezz.shop';

// Thunk for fetching all shops
export const fetchAllShops = createAsyncThunk(
  'shop/fetchAllShops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/shops');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);
export const fetchShopById = createAsyncThunk(
  'shop/fetchShopById',
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/shops/details/${shopId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);

const getAuthFromStorage = () => {
  try {
    const shopkeeperData = JSON.parse(localStorage.getItem('shopkeeper'));
    const token = localStorage.getItem('token');
    return { shopkeeper: shopkeeperData, token };
  } catch (error) {
    console.error('Error parsing shopkeeper data:', error);
    return { shopkeeper: null, token: null };
  }
};

// Update the addShop thunk
export const addShop = createAsyncThunk(
  'shop/addShop',
  async (shopData, { rejectWithValue }) => {
    try {

      const { shopkeeper, token } = getAuthFromStorage();

      if (!shopkeeper?._id || !token) {
        throw new Error('Shopkeeper is not authenticated');
      }

      const formData = new FormData();
      formData.append('shopName', shopData.shopName);
      formData.append('address', shopData.address);
      formData.append('contactNumber', shopData.contactNumber);
      formData.append('description', shopData.description);
      formData.append('shopImage', shopData.shopImage);
      formData.append('licenseImage', shopData.licenseImage);
      formData.append('ownerId', shopkeeper._id); // Use _id instead of id

      const response = await axios.post('/api/shops/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchShopDetails = createAsyncThunk(
  'shop/fetchShopDetails',
  async ({ ownerId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/shops/${ownerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);

export const updateShop = createAsyncThunk(
  'shop/updateShop',
  async ({ shopId, shopData, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('shopName', shopData.shopName);
      formData.append('address', shopData.address);
      formData.append('contactNumber', shopData.contactNumber);
      formData.append('description', shopData.description);
      if (shopData.shopImage) formData.append('shopImage', shopData.shopImage);
      if (shopData.licenseImage) formData.append('licenseImage', shopData.licenseImage);

      const response = await axios.put(`/api/shops/update/${shopId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);


export const searchShops = createAsyncThunk(
  'shop/searchShops',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/shops/search?query=${query}`);
      return response.data.shops;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);

// Thunk for adding services to a shop
export const addServices = createAsyncThunk(
  'shop/addServices',
  async (services, { getState, rejectWithValue }) => {
    try {
      const { shop } = getState().shop;
      const shopId = shop?._id;

      if (!shopId) {
        throw new Error('Shop ID not found');
      }

      const response = await axios.post(`/api/shops/services/${shopId}`, { services });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);
export const fetchServices = createAsyncThunk(
  'shop/fetchServices',
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/shops/services/${shopId}`);
      return response.data.services;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);
export const updateService = createAsyncThunk(
  'shop/updateService',
  async ({ shopId, serviceId, serviceData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/shops/services/${shopId}/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// New thunk for deleting a service
export const deleteService = createAsyncThunk(
  'shop/deleteService',
  async ({ shopId, serviceId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/shops/services/${shopId}/${serviceId}`);
      return serviceId; 
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


// Thunk to add a new time slot
export const addTimeSlot = createAsyncThunk(
  'shop/addTimeSlot',
  async ({ shopId, startTime, endTime }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/shops/time-slot/${shopId}`, { startTime, endTime });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTimeSlots = createAsyncThunk(
  'shop/fetchTimeSlots',
  async (shopId, { rejectWithValue }) => {
    try {
      console.log('Fetching time slots for shop:', shopId);
      const response = await axios.get(`/api/shops/time-slot/${shopId}`);
      console.log('Fetched time slots:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);

export const updateTimeSlot = createAsyncThunk(
  'shop/updateTimeSlot',
  async ({ shopId, slotId, startTime, endTime }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/shops/time-slot/${shopId}/${slotId}`, { startTime, endTime });
      return response.data; // Assuming the backend returns the updated time slot
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Delete a time slot
export const deleteTimeSlot = createAsyncThunk(
  'shop/deleteTimeSlot',
  async ({ shopId, slotId }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/shops/time-slot/${shopId}/${slotId}`);
      return slotId; // Return the slotId to identify which slot was deleted
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/shops/${shopId}/bookings`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }

  
);
export const toggleWorkMode = createAsyncThunk(
  'shop/toggleWorkMode',
  async ({ shopId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/shops/${shopId}/toggle-work-mode`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);

// Initial state for shop
const initialState = {
  shops: [],
  services: [],
  shop: null,
  loading: false,
  success: false,
  error: null,
  timeSlots: [],
  bookings: [],
};

// Redux slice for shop
const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    resetShopState: (state) => {
      state.shop = null;
      state.loading = false;
      state.success = false;
      state.error = null;
      state.timeSlots = []; 
    },
    resetShopStatus: (state) => {
      state.success = false;
      state.error = null;
    },
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload;
      })
      .addCase(fetchAllShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchShopById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShop = action.payload;
      })
      .addCase(fetchShopById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addShop.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addShop.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.shop = action.payload.shop;
      })
      .addCase(addShop.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload.message;
      })

      .addCase(fetchShopDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.shop = action.payload;
      })
      .addCase(fetchShopDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(updateShop.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.shop = action.payload.shop;
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload.message;
      })

      .addCase(searchShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload;
      })
      .addCase(searchShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(addServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addServices.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.services = action.payload.services;
      })
      .addCase(addServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add services';
      })
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedService = action.payload;
        state.services = state.services.map(service => 
          service._id === updatedService._id ? updatedService : service
        );
      })
      
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.services = state.services.filter(service => service._id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchTimeSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSlots = action.payload;
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An error occurred while fetching time slots';
      })

      // Add time slot
      .addCase(addTimeSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTimeSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.timeSlots.push(action.payload);
      })
      .addCase(addTimeSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An error occurred while adding the time slot';
      })

      .addCase(updateTimeSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTimeSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedSlot = action.payload;
        const index = state.timeSlots.findIndex(slot => slot._id === updatedSlot._id);
        if (index !== -1) {
          state.timeSlots[index] = updatedSlot;
        }
      })
      .addCase(updateTimeSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An error occurred while updating the time slot';
      })
      .addCase(deleteTimeSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTimeSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.timeSlots = state.timeSlots.filter(slot => slot._id !== action.payload);
      })
     .addCase(deleteTimeSlot.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'An error occurred while deleting the time slot';
    })
    .addCase(fetchBookings.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
    })
    .addCase(fetchBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    })
    .addCase(toggleWorkMode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWorkMode.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.shop = action.payload;
      })
      .addCase(toggleWorkMode.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload.message;
      });
  },
});

export const { resetShopState, resetShopStatus, resetStatus } = shopSlice.actions;
export default shopSlice.reducer;
