import { combineReducers } from '@reduxjs/toolkit';
import { feedReducer } from './slices/feedSlice';
import { constructorReducer } from './slices/constructorSlice';
import { userReducer } from './slices/userSlice';
import { ingredientsReducer } from './slices/ingredientsSlice';

const rootReducer = combineReducers({
  feed: feedReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  ingredients: ingredientsReducer,
})

export default rootReducer;
  // TODO: Собрать здесь редьюсеры слайсов

