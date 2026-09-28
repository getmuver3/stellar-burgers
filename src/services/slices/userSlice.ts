import { getOrdersApi, getUserApi, logoutApi } from '@/utils/burger-api';
import { deleteCookie, getCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TUser, TUserState } from '@/utils/types';

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  orders: [],
  isOrdersLoading: false,
};

export const fetchUserOrders = createAsyncThunk('user/fetchUserOrders', getOrdersApi);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        const { user } = await getUserApi();
        dispatch(setUser(user));
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(authChecked());
      }
    } else {
      dispatch(authChecked());
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
  },
  selectors: {
    getUser: (state) => state.user,
    getUserName: (state) => state.user?.name,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getUserOrders: (state) => state.orders,
    getIsOrdersLoading: (state) => state.isOrdersLoading,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isOrdersLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isOrdersLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.orders = [];
      });
  },
});

export const { getUser, getUserName, getIsAuthChecked, getUserOrders, getIsOrdersLoading } = userSlice.getSelectors((state: RootState) => state.user);
export const userReducer = userSlice.reducer;
export const { setUser, authChecked } = userSlice.actions;


