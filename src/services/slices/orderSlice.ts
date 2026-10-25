import type { TIngredient, TOrder, TOrderState } from "@/utils/types";
import { createAsyncThunk, createSlice, type PayloadAction, type SerializedError } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { getOrderByNumberApi } from "@/utils/burger-api";

const initialState: TOrderState = {
  order: null,
  ingredients: [],
  isLoading: false,
  error: null,
};

export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  async (number: number) => {
    const { orders } = await getOrderByNumberApi(number);
    const order = orders[0];

    if (!order) {
      throw new Error('Заказ не найден');
    }

    return order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<TOrder>) => {
      state.order = action.payload;
    },
    setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.ingredients = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<SerializedError>) => {
      state.error = action.payload;
    },
  },
  selectors: {
    getOrder: (state) => state.order,
    getIngredients: (state) => state.ingredients,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
  }
})

export const { getOrder, getIngredients, getIsLoading, getError } = orderSlice.getSelectors((state: RootState) => state.order);
export const orderReducer = orderSlice.reducer;
export const { setOrder, setIngredients, setIsLoading, setError } = orderSlice.actions;

