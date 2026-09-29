import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
} from '@/utils/burger-api';
import { deleteCookie, getCookie, setCookie } from '@/utils/cookie';
import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TLoginData, TRegisterData } from '@/utils/burger-api';
import type { TUser, TUserState } from '@/utils/types';

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  orders: [],
  isOrdersLoading: false,
  isLoading: false,
  error: null,
};

const saveAuthTokens = (refreshToken: string, accessToken: string): void => {
  localStorage.setItem('refreshToken', refreshToken);
  setCookie('accessToken', accessToken);
};

export const fetchUserOrders = createAsyncThunk('user/fetchUserOrders', getOrdersApi);

export const logout = createAsyncThunk(
  'user/logout', 
  async () => {
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

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData) => {
    const data = await loginUserApi({ email, password });
    saveAuthTokens(data.refreshToken, data.accessToken);
    return data.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, password, name }: TRegisterData) => {
    const data = await registerUserApi({ email, password, name });
    saveAuthTokens(data.refreshToken, data.accessToken);
    return data.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => {
    const data = await updateUserApi(user);
    return data.user;
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
    resetUserError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    getUser: (state) => state.user,
    getUserName: (state) => state.user?.name,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getUserOrders: (state) => state.orders,
    getIsOrdersLoading: (state) => state.isOrdersLoading,
    getIsUserLoading: (state) => state.isLoading,
    getUserError: (state) => state.error,
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
        state.isLoading = false;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(loginUser.pending, registerUser.pending, updateUser.pending),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(loginUser.fulfilled, registerUser.fulfilled, updateUser.fulfilled),
        (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addMatcher(
        isAnyOf(loginUser.rejected, registerUser.rejected, updateUser.rejected),
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message ?? 'An unknown error occurred';
        }
      );
  },
});

export const {
  getUser,
  getUserName,
  getIsAuthChecked,
  getUserOrders,
  getIsOrdersLoading,
  getIsUserLoading,
  getUserError,
} = userSlice.getSelectors((state: RootState) => state.user);
export const userReducer = userSlice.reducer;
export const { setUser, authChecked, resetUserError } = userSlice.actions;
