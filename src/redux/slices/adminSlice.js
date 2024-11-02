import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';


const initialState = {
   
    shopkeepers: [],
    shopkeepersStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    shopkeepersError: null,
    shopkeeper: null, // New state for a single shopkeeper's details
    shopkeeperStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    shopkeeperError: null // New state for errors related to shopkeeper details
};

// Async thunk for logging in an admin


// Async thunk to fetch shopkeepers
export const fetchShopkeepers = createAsyncThunk('shopkeepers/fetchShopkeepers', async () => {
    const response = await axios.get('/api/admin/shopkeepers');
    return response.data;
});


export const fetchShopkeeperById = createAsyncThunk('shopkeepers/fetchShopkeeperById', async (id) => {
    const response = await axios.get(`/api/admin/shopkeepers/${id}`);
    return response.data;
});

export const verifyShopkeeper = createAsyncThunk('shopkeepers/verifyShopkeeper', async (id) => {
    const response = await axios.patch(`/api/admin/shopkeepers/${id}/verify`);
    return { id, ...response.data };
});

const adminShopkeeperSlice = createSlice({
    name: 'adminShopkeeper',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            // Admin login cases
          
            
            // Fetch shopkeepers cases
            .addCase(fetchShopkeepers.pending, (state) => {
                state.shopkeepersStatus = 'loading';
            })
            .addCase(fetchShopkeepers.fulfilled, (state, action) => {
                state.shopkeepersStatus = 'succeeded';
                state.shopkeepers = action.payload;
            })
            .addCase(fetchShopkeepers.rejected, (state, action) => {
                state.shopkeepersStatus = 'failed';
                state.shopkeepersError = action.error.message;
            })
            
            // Fetch shopkeeper by ID cases
            .addCase(fetchShopkeeperById.pending, (state) => {
                state.shopkeeperStatus = 'loading';
                state.shopkeeperError = null;
            })
            .addCase(fetchShopkeeperById.fulfilled, (state, action) => {
                state.shopkeeperStatus = 'succeeded';
                state.shopkeeper = action.payload;
            })
            .addCase(fetchShopkeeperById.rejected, (state, action) => {
                state.shopkeeperStatus = 'failed';
                state.shopkeeperError = action.error.message;
            })
            
        
            .addCase(verifyShopkeeper.fulfilled, (state, action) => {
                const { id } = action.payload;
                state.shopkeeper = {
                    ...state.shopkeeper,
                    isVerified: true,
                };
                const existingShopkeeper = state.shopkeepers.find(shopkeeper => shopkeeper._id === id);
                if (existingShopkeeper) {
                    existingShopkeeper.isVerified = true; 
                }
            });
    }
});


export const { logoutAdmin } = adminShopkeeperSlice.actions;

export default adminShopkeeperSlice.reducer;
