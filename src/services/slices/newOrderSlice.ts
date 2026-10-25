import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TNewOrderState } from '@utils-types';
import type { RootState } from '../store';
import { orderBurgerApi, type TNewOrderResponse } from '@/utils/burger-api';

const initialState: TNewOrderState = {
  orderRequest: false,
  orderModalData: null,
};

export const orderBurger = createAsyncThunk<TNewOrderResponse, void, { state: RootState }>(
  'newOrder/orderBurger',
  (_, { getState }) => {
    const { burgerConstructor: { constructorItems } } = getState();

    const bunId = constructorItems.bun?._id;

    const ingredientIds = [
      ...(bunId ? [bunId] : []),
      ...constructorItems.ingredients.map((item) => item._id),
      ...(bunId ? [bunId] : []),
    ];

    return orderBurgerApi(ingredientIds);
  }
)

const newOrderSlice = createSlice({
  name: 'newOrder',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
    },
  },
  selectors: {
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        console.error(action.error);
      })
  }
})

export const { getOrderRequest, getOrderModalData } = newOrderSlice.getSelectors((state: RootState) => state.newOrder);
export const newOrderReducer = newOrderSlice.reducer;
export const { clearOrder } = newOrderSlice.actions;
