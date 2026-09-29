import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorIngredient, TConstructorState, TIngredient } from '@utils-types';
import type { RootState } from '../store';
import { orderBurger } from './newOrderSlice';

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: [],
  },
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.bun = action.payload;
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: crypto.randomUUID() },
      }),
    },
    removeBun: (state) => {
      state.constructorItems.bun = null;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: crypto.randomUUID() },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients = state.constructorItems.ingredients.filter(item => item.id !== action.payload);
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
  },
  extraReducers: (builder) => {
    builder.addCase(orderBurger.fulfilled, (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    })
  }
})


export const { getConstructorItems } = constructorSlice.getSelectors((state: RootState) => state.burgerConstructor);
export const constructorReducer = constructorSlice.reducer;
export const { addBun, removeBun, addIngredient, removeIngredient, moveIngredient } = constructorSlice.actions;



