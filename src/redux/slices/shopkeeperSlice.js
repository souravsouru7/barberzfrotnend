import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';

// Thunk for registering shopkeeper
export const registerShopkeeper = createAsyncThunk(
  'shopkeeper/registerShopkeeper',
  async (shopkeeperData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/shopkeepers/register', shopkeeperData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const googleLogin = createAsyncThunk(
  'shopkeeper/googleLogin',
  async (tokenId, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/shopkeepers/auth/google/callback', {
        headers: {
          Authorization: `Bearer ${tokenId}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginShopkeeper = createAsyncThunk(
  'shopkeeper/loginShopkeeper',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/shopkeepers/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchShopkeeperProfile = createAsyncThunk(
  'shopkeeper/fetchShopkeeperProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token, shopkeeper } = getState().shopkeeper;
      
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      if (!shopkeeper?.id) {
        throw new Error('Shopkeeper ID is missing');
      }

      const response = await axios.get(`/api/shopkeepers/${shopkeeper.id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      // If the server returns the data directly
      if (response.data && !response.data.shopkeeper) {
        return response.data;
      }

      return response.data.shopkeeper;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return rejectWithValue(
        error.response?.data || { 
          message: error.message || 'Failed to fetch shopkeeper profile' 
        }
      );
    }
  }
);

export const updateShopkeeper = createAsyncThunk(
  'shopkeeper/updateShopkeeper',
  async ({ id, formData }, { getState, rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('Shopkeeper ID is required');
      }

      const { token } = getState().shopkeeper;
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(`/api/shopkeepers/${id}`, formData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { 
          message: error.message || 'Failed to update shopkeeper profile' 
        }
      );
    }
  }
);

const initialState = {
  shopkeeper: localStorage.getItem('shopkeeper')
    ? JSON.parse(localStorage.getItem('shopkeeper'))
    : null,
  loading: false,
  success: false,
  error: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const shopkeeperSlice = createSlice({
  name: 'shopkeeper',
  initialState,
  reducers: {
    logout: (state) => {
      state.shopkeeper = null;
      state.token = null;
      state.isAuthenticated = false;
      state.success = false;
      state.error = null;
      localStorage.removeItem('shopkeeper');
      localStorage.removeItem('token');
    },
    loginShopkeepers: (state, action) => {
      const { token, shopkeeper } = action.payload;
      state.shopkeeper = {
        id: shopkeeper._id || shopkeeper.id, // Handle both _id and id formats
        name: shopkeeper.name,
        email: shopkeeper.email,
        contactNumber: shopkeeper.contactNumber,
        profileImage: shopkeeper.profileImage,
        shopName: shopkeeper.shopName
      };
      state.token = token;
      state.isAuthenticated = true;
      state.success = true;
      state.error = null;

      localStorage.setItem('shopkeeper', JSON.stringify(state.shopkeeper));
      localStorage.setItem('token', token);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerShopkeeper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerShopkeeper.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.shopkeeper = {
          id: action.payload.shopkeeper._id,
          name: action.payload.shopkeeper.name,
          email: action.payload.shopkeeper.email,
          contactNumber: action.payload.shopkeeper.contactNumber,
          profileImage: action.payload.shopkeeper.profileImage,
          shopName: action.payload.shopkeeper.shopName
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('shopkeeper', JSON.stringify(state.shopkeeper));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerShopkeeper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Login cases
      .addCase(loginShopkeeper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginShopkeeper.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Ensure we store the ID along with other user data
        state.shopkeeper = {
          id: action.payload.shopkeeper._id || action.payload.shopkeeper.id,
          name: action.payload.shopkeeper.name,
          email: action.payload.shopkeeper.email,
          contactNumber: action.payload.shopkeeper.contactNumber,
          profileImage: action.payload.shopkeeper.profileImage || '',
          shopName: action.payload.shopkeeper.shopName || ''
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('shopkeeper', JSON.stringify(state.shopkeeper));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginShopkeeper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.isAuthenticated = false;
      })
      // Profile fetch cases
      .addCase(fetchShopkeeperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopkeeperProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update the stored shopkeeper data with the fresh data
        state.shopkeeper = {
          ...state.shopkeeper,
          ...action.payload,
          id: action.payload._id || action.payload.id
        };
        localStorage.setItem('shopkeeper', JSON.stringify(state.shopkeeper));
      })
      .addCase(fetchShopkeeperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Update cases
      .addCase(updateShopkeeper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShopkeeper.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.shopkeeper = {
          ...state.shopkeeper,
          ...action.payload.shopkeeper,
          id: action.payload.shopkeeper._id || action.payload.shopkeeper.id
        };
        localStorage.setItem('shopkeeper', JSON.stringify(state.shopkeeper));
      })
      .addCase(updateShopkeeper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Google login cases
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.shopkeeper = {
          id: action.payload.shopkeeper._id,
          name: action.payload.shopkeeper.name,
          email: action.payload.shopkeeper.email,
          contactNumber: action.payload.shopkeeper.contactNumber,
          profileImage: action.payload.shopkeeper.profileImage,
          shopName: action.payload.shopkeeper.shopName
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('shopkeeper', JSON.stringify(state.shopkeeper));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Google login failed';
        state.isAuthenticated = false;
      });
  },
});

export const { logout, loginShopkeepers } = shopkeeperSlice.actions;
export default shopkeeperSlice.reducer;