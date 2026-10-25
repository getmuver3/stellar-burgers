import { fetchIngredients, ingredientsReducer } from '../ingredientsSlice';

import type { TIngredient, TIngredientsState } from '@utils-types';

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

const createIngredient = (
  overrides: Partial<TIngredient> & Pick<TIngredient, '_id' | 'name'>
): TIngredient => ({
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  ...overrides,
});

const storedIngredient = createIngredient({
  _id: 'ingredient-1',
  name: 'Биокотлета из марсианской Магнолии',
});

const loadedIngredient = createIngredient({
  _id: 'ingredient-2',
  name: 'Соус Spicy-X',
  type: 'sauce',
});

describe('редьюсер ingredients', () => {
  it('возвращает начальное состояние на неизвестный экшен', (): void => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  it('не меняет текущее состояние на неизвестный экшен', (): void => {
    const current: TIngredientsState = {
      ingredients: [storedIngredient],
      isLoading: true,
      error: { message: 'старая ошибка' },
    };

    expect(ingredientsReducer(current, { type: 'UNKNOWN' })).toEqual(current);
  });

  it('fetchIngredients.pending включает загрузку и сбрасывает ошибку', (): void => {
    const current: TIngredientsState = {
      ingredients: [storedIngredient],
      isLoading: false,
      error: { message: 'старая ошибка' },
    };

    const state = ingredientsReducer(
      current,
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state).toEqual({
      ingredients: [storedIngredient],
      isLoading: true,
      error: null,
    });
  });

  it('fetchIngredients.fulfilled записывает ингредиенты и выключает загрузку', (): void => {
    const current: TIngredientsState = {
      ingredients: [storedIngredient],
      isLoading: true,
      error: null,
    };

    const state = ingredientsReducer(
      current,
      fetchIngredients.fulfilled([loadedIngredient], 'request-id', undefined)
    );

    expect(state).toEqual({
      ingredients: [loadedIngredient],
      isLoading: false,
      error: null,
    });
  });

  it('fetchIngredients.rejected сохраняет ошибку и выключает загрузку', (): void => {
    const current: TIngredientsState = {
      ingredients: [storedIngredient],
      isLoading: true,
      error: null,
    };
    const action = fetchIngredients.rejected(
      new Error('Не удалось загрузить ингредиенты'),
      'request-id',
      undefined
    );

    const state = ingredientsReducer(current, action);

    expect(state).toEqual({
      ingredients: [storedIngredient],
      isLoading: false,
      error: action.error,
    });
  });
});
