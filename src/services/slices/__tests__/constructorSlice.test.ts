import {
  addBun,
  addIngredient,
  constructorReducer,
  moveIngredient,
  removeBun,
  removeIngredient,
} from '../constructorSlice';
import { orderBurger } from '../newOrderSlice';

import type { TConstructorState, TIngredient, TOrder } from '@utils-types';

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: [],
  },
};

const createIngredient = (
  overrides: Partial<TIngredient> & Pick<TIngredient, '_id' | 'name' | 'type'>
): TIngredient => ({
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  ...overrides,
});

const bun = createIngredient({
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
});

const anotherBun = createIngredient({
  _id: 'bun-2',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  price: 988,
});

const fillingA = createIngredient({
  _id: 'filling-a',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
});

const fillingB = createIngredient({
  _id: 'filling-b',
  name: 'Соус Spicy-X',
  type: 'sauce',
  price: 90,
});

const fillingC = createIngredient({
  _id: 'filling-c',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  price: 424,
});

const filledState: TConstructorState = {
  constructorItems: {
    bun: { ...bun, id: 'bun-id' },
    ingredients: [
      { ...fillingA, id: 'id-a' },
      { ...fillingB, id: 'id-b' },
      { ...fillingC, id: 'id-c' },
    ],
  },
};

const order: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Space бургер',
  createdAt: '2026-10-25T12:00:00.000Z',
  updatedAt: '2026-10-25T12:00:00.000Z',
  number: 12345,
  ingredients: ['bun-1', 'filling-a', 'filling-b', 'bun-1'],
};

describe('редьюсер burgerConstructor', () => {
  it('возвращает начальное состояние на неизвестный экшен', (): void => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  it('не меняет текущее состояние на неизвестный экшен', (): void => {
    expect(constructorReducer(filledState, { type: 'UNKNOWN' })).toEqual(filledState);
  });

  it('addBun кладёт булку в конструктор', (): void => {
    const action = addBun(bun);
    const state = constructorReducer(initialState, action);

    expect(state).toEqual({
      constructorItems: {
        bun: { ...bun, id: action.payload.id },
        ingredients: [],
      },
    });
  });

  it('addBun заменяет уже выбранную булку', (): void => {
    const action = addBun(anotherBun);
    const state = constructorReducer(filledState, action);

    expect(state.constructorItems.bun).toEqual({
      ...anotherBun,
      id: action.payload.id,
    });
    expect(state.constructorItems.ingredients).toEqual(
      filledState.constructorItems.ingredients
    );
  });

  it('removeBun убирает булку и оставляет начинки', (): void => {
    const state = constructorReducer(filledState, removeBun());

    expect(state).toEqual({
      constructorItems: {
        bun: null,
        ingredients: filledState.constructorItems.ingredients,
      },
    });
  });

  it('addIngredient добавляет начинку в конец списка', (): void => {
    const first = addIngredient(fillingA);
    const withFirst = constructorReducer(initialState, first);
    const second = addIngredient(fillingB);
    const state = constructorReducer(withFirst, second);

    expect(state).toEqual({
      constructorItems: {
        bun: null,
        ingredients: [
          { ...fillingA, id: first.payload.id },
          { ...fillingB, id: second.payload.id },
        ],
      },
    });
  });

  it('removeIngredient удаляет начинку по id', (): void => {
    const state = constructorReducer(filledState, removeIngredient('id-b'));

    expect(state.constructorItems.bun).toEqual(filledState.constructorItems.bun);
    expect(state.constructorItems.ingredients).toEqual([
      { ...fillingA, id: 'id-a' },
      { ...fillingC, id: 'id-c' },
    ]);
  });

  it('removeIngredient не меняет список, если id не найден', (): void => {
    const state = constructorReducer(filledState, removeIngredient('missing'));

    expect(state).toEqual(filledState);
  });

  it('moveIngredient перемещает начинку вверх', (): void => {
    const state = constructorReducer(
      filledState,
      moveIngredient({ direction: 'up', id: 'id-b' })
    );

    expect(state.constructorItems.ingredients.map((item) => item.id)).toEqual([
      'id-b',
      'id-a',
      'id-c',
    ]);
    expect(state.constructorItems.bun).toEqual(filledState.constructorItems.bun);
  });

  it('moveIngredient перемещает начинку вниз', (): void => {
    const state = constructorReducer(
      filledState,
      moveIngredient({ direction: 'down', id: 'id-b' })
    );

    expect(state.constructorItems.ingredients.map((item) => item.id)).toEqual([
      'id-a',
      'id-c',
      'id-b',
    ]);
  });

  it('moveIngredient не двигает первую начинку вверх', (): void => {
    const state = constructorReducer(
      filledState,
      moveIngredient({ direction: 'up', id: 'id-a' })
    );

    expect(state).toEqual(filledState);
  });

  it('moveIngredient не двигает последнюю начинку вниз', (): void => {
    const state = constructorReducer(
      filledState,
      moveIngredient({ direction: 'down', id: 'id-c' })
    );

    expect(state).toEqual(filledState);
  });

  it('moveIngredient не меняет список, если id не найден', (): void => {
    const state = constructorReducer(
      filledState,
      moveIngredient({ direction: 'up', id: 'missing' })
    );

    expect(state).toEqual(filledState);
  });

  it('orderBurger.fulfilled очищает конструктор', (): void => {
    const state = constructorReducer(
      filledState,
      orderBurger.fulfilled(
        { success: true, name: order.name, order },
        'request-id',
        undefined
      )
    );

    expect(state).toEqual(initialState);
  });
});
