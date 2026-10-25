import { fetchUserOrders, getIsOrdersLoading, getUserOrders } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import type { TOrder } from '@/utils/types';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

export const ProfileOrders = (): React.JSX.Element => {
  const orders: TOrder[] = useSelector(getUserOrders);
  const isOrdersLoading = useSelector(getIsOrdersLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isOrdersLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
