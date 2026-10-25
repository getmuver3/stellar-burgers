import { FeedInfoUI } from '@ui';

import type { TOrder } from '@utils-types';
import { getOrders, getTotal, getTotalToday } from '@/services/slices/feedSlice';
import { useSelector } from '@/services/store';

const getOrderNumbersByStatus = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const orders = useSelector(getOrders);
  const total = useSelector(getTotal);
  const totalToday = useSelector(getTotalToday);

  const readyOrders = getOrderNumbersByStatus(orders, 'done');
  const pendingOrders = getOrderNumbersByStatus(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ orders, total, totalToday, isLoading: false, error: null }}
    />
  );
};
