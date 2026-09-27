import { useEffect } from 'react';

import type { TIngredient } from '@utils-types';
import { fetchIngredients, getError, getIngredients, getIslodaing } from '@/services/slices/ingredientsSlice';
import { useSelector } from '@/services/store';
import type { SerializedError } from '@reduxjs/toolkit';
import { useDispatch } from '@/services/store';

type UseFetchIngredientsResult = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  ingredientsError: SerializedError | null;
};

export const useFetchIngredients = (): UseFetchIngredientsResult => {
  const ingredients = useSelector(getIngredients);
  const isIngredientsLoading = useSelector(getIslodaing);
  const ingredientsError = useSelector(getError);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  return { ingredients, isIngredientsLoading, ingredientsError };
};
