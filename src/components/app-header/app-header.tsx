import { getUserName } from '@/services/slices/userSlice';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@/services/store';


export const AppHeader = (): React.JSX.Element => {
  /* TODO: Получите имя пользователя из хранилища */
  const userName = useSelector(getUserName);

  return (
  <AppHeaderUI
    userName={userName}
  />);
};
