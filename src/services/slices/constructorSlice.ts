import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorState, TIngredient } from '@utils-types';
import type { RootState } from '../store';
import { orderBurgerApi, type TNewOrderResponse } from '@/utils/burger-api';

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: [],
  },
  orderRequest: false,
  orderModalData: null,
};

export const orderBurger = createAsyncThunk<TNewOrderResponse, void, { state: RootState }>(
  'constructor/OrderBurger',
  (_, { getState }) => {
    const { burgerConstructor: { constructorItems } } = getState();

    const ingredientsList = [
      ...constructorItems.ingredients,
      ...(constructorItems.bun ? [constructorItems.bun] : [])
    ].map(item => item._id)

    return orderBurgerApi(ingredientsList);
  }
)

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.bun = { ...action.payload, id: crypto.randomUUID() };
    },
    removeBun: (state) => {
      state.constructorItems.bun = null;
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.ingredients.push({ ...action.payload, id: crypto.randomUUID() });
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients = state.constructorItems.ingredients.filter(item => item.id !== action.payload);
    },
    clearOrder: (state) => {
      state.orderModalData = null;
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    },
    moveIngredient: (state, action: PayloadAction<{ direction: 'up' | 'down', id: string }>) => {
      const newIngredients = [...state.constructorItems.ingredients];
      const { id, direction } = action.payload

      const index = newIngredients.findIndex(item => item.id === id);

      if (index === -1
        || index === 0 && direction === 'up'
        || index === newIngredients.length - 1 && direction === 'down')
        return;

      const target = newIngredients[index];

      if (direction === 'up') {
        newIngredients[index] = newIngredients[index - 1];
        newIngredients[index - 1] = target;
      }
      if (direction === 'down') {
        newIngredients[index] = newIngredients[index + 1];
        newIngredients[index + 1] = target;
      }

      state.constructorItems.ingredients = newIngredients;
    },
  },
  selectors: {
    getConstructorItems: (state) => state.constructorItems,
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
        state.constructorItems.bun = null;
        state.constructorItems.ingredients = [];
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        console.error(action.error);
      })
  }
})


export const { getConstructorItems, getOrderRequest, getOrderModalData } = constructorSlice.getSelectors((state: RootState) => state.burgerConstructor);
export const constructorReducer = constructorSlice.reducer;
export const { addBun, removeBun, addIngredient, removeIngredient, clearOrder, moveIngredient } = constructorSlice.actions;



