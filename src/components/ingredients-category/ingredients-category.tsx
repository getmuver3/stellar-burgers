import { IngredientsCategoryUI } from '@ui';
import { useMemo } from 'react';

import type { TIngredientsCategoryProps } from './type';
import type { TConstructorIngredients, TIngredient } from '@utils-types';
import { useSelector } from 'react-redux';
import { getConstructorItems } from '@/services/slices/constructorSlice';

export const IngredientsCategory = ({
  title,
  titleRef,
  ingredients,
  ref,
}: TIngredientsCategoryProps): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const burgerConstructor: TConstructorIngredients = useSelector(getConstructorItems);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: Record<string, number> = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
};
