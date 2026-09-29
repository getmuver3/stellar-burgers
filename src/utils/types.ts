import type { SerializedError } from '@reduxjs/toolkit';

export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export type TConstructorIngredients = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type TConstructorState = {
  constructorItems: TConstructorIngredients;
};

export type TNewOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: unknown;
};

export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  orders: TOrder[];
  isOrdersLoading: boolean;
  isLoading: boolean;
  error: string | null;
};

export type TOrderState = {
  order: TOrder | null;
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};
