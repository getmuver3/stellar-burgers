import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import type { TOrder } from '@utils-types';
import { getFeeds, getOrders } from '@/services/slices/feedSlice';
import { useDispatch, useSelector } from '@/services/store';
import { useEffect } from 'react';

export const Feed = (): React.JSX.Element => {

  const orders: TOrder[] = useSelector(getOrders);
  const dispatch = useDispatch();

  const handleGetFeeds = (): void => {
    dispatch(getFeeds())
  };


  useEffect(() => {
    dispatch(getFeeds())
  }, [dispatch])

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
