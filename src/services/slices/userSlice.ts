import type { TUser } from "@/utils/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const initialState: { user: TUser | null } = { user: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },
  selectors: {
    getUser: (state) => state.user,
  },
})

export const { getUser } = userSlice.getSelectors((state: RootState) => state.user);
export const userReducer = userSlice.reducer;
export const { setUser } = userSlice.actions;