import type { TConstructorIngredients, TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: TConstructorIngredients;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
