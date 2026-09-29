import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import type { BurgerConstructorElementProps } from './type';
import { moveIngredient, removeIngredient } from '@/services/slices/constructorSlice';
import { useDispatch } from '@/services/store';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {

  const dispatch = useDispatch();

  const handleMoveDown = (): void => {
    dispatch(moveIngredient({ direction: 'down', id: ingredient.id }))
  };

  const handleMoveUp = (): void => {
    dispatch(moveIngredient({ direction: 'up', id: ingredient.id }))
  };

  const handleClose = (): void => {
    dispatch(removeIngredient(ingredient.id))
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
