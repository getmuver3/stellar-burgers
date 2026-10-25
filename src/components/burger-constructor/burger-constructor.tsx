import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { TConstructorIngredient, TConstructorIngredients, TOrder } from '@utils-types';
import { useSelector } from '@/services/store';
import { getConstructorItems } from '@/services/slices/constructorSlice';
import { clearOrder, getOrderModalData, getOrderRequest, orderBurger } from '@/services/slices/newOrderSlice';
import { getUser } from '@/services/slices/userSlice';
import { useDispatch } from '@/services/store';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const constructorItems: TConstructorIngredients = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData: TOrder | null = useSelector(getOrderModalData);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    dispatch(orderBurger());
  };

  const closeOrderModal = (): void => {

    dispatch(clearOrder())
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
