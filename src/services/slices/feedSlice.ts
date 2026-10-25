import { getFeedsApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TFeedState, TOrder } from '@utils-types';
import type { RootState } from '../store';


const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
}

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  getFeedsApi,
)


const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload
    },
    setTotalToday: (state, action: PayloadAction<number>) => {
      state.totalToday = action.payload
    },
    setError: (state, action: PayloadAction<unknown>) => {
      state.error = action.payload
    },
  },
  selectors: {
    getOrders: (state) => state.orders,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'An unknown error occurred';
      })
  }
})

export const { getOrders, getTotal, getTotalToday, getIsLoading, getError } = feedSlice.getSelectors((state: RootState) => state.feed);
export const feedReducer = feedSlice.reducer;



