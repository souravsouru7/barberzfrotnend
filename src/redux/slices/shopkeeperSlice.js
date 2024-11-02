import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


axios.defaults.baseURL = 'https://barbezz.shop';// Replace with your backend URL

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

// Thunk for fetching shopkeeper profile
export const fetchShopkeeperProfile = createAsyncThunk(
  'shopkeeper/fetchShopkeeperProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { shopkeeper, token } = getState().shopkeeper;
      
      const shopkeeperId = shopkeeper?._id || 
                          (localStorage.getItem('shopkeeper') ? 
                            JSON.parse(localStorage.getItem('shopkeeper'))._id : 
                            null);
      const storedToken = token || localStorage.getItem('token');

      if (!shopkeeperId) {
        throw new Error('Shopkeeper ID not found.');
      }

      const response = await axios.get(`/api/shopkeepers/${shopkeeperId}`, {
        headers: { 
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        },
      });

      return response.data.shopkeeper;
    } catch (error) {
      return rejectWithValue(error.response ? 
        error.response.data : 
        { message: error.message }
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


const shopkeeperFromStorage = localStorage.getItem('shopkeeper')
  ? JSON.parse(localStorage.getItem('shopkeeper'))
  : null;

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
      state.shopkeeper = shopkeeper;
      state.token = token;
      state.isAuthenticated = true;
      state.success = true;
      state.error = null;
      

      localStorage.setItem('shopkeeper', JSON.stringify(shopkeeper));
      localStorage.setItem('token', token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerShopkeeper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerShopkeeper.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.shopkeeper = action.payload.shopkeeper;
      })
      .addCase(registerShopkeeper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(loginShopkeeper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginShopkeeper.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.shopkeeper = action.payload.shopkeeper;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        localStorage.setItem('shopkeeper', JSON.stringify(action.payload.shopkeeper));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginShopkeeper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.isAuthenticated = false;
      })
      .addCase(fetchShopkeeperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopkeeperProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.shopkeeper = action.payload;
        state.success = true;
      })
      .addCase(fetchShopkeeperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateShopkeeper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShopkeeper.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.shopkeeper = action.payload.shopkeeper;
        localStorage.setItem('shopkeeper', JSON.stringify(action.payload.shopkeeper));
      })
      .addCase(updateShopkeeper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.shopkeeper = action.payload.shopkeeper;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('shopkeeper', JSON.stringify(action.payload.shopkeeper));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Google login failed';
        state.isAuthenticated = false;
      })
  },
});

export const { logout,loginShopkeepers } = shopkeeperSlice.actions;
export default shopkeeperSlice.reducer;
