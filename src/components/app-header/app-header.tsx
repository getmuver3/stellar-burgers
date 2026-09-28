import { getUser, getUserName } from '@/services/slices/userSlice';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

export const AppHeader = (): React.JSX.Element => {
  /* TODO: Получите имя пользователя из хранилища */
  const userName = useSelector(getUserName);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const location = useLocation();

  const handleConstructorClick = () => navigate('/')
  const handleClickFeed = () => navigate('/feed')
  const handleClickProfile = (): void => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
      return;
    }
    navigate('/profile');
  };

  const isFeedPage = location.pathname.startsWith('/feed')
  const isProfilePage = location.pathname.startsWith('/profile')
  const isConstructorPage = location.pathname === '/'

  return <AppHeaderUI
    userName={userName}
    handleConstructorClick={handleConstructorClick}
    handleClickFeed={handleClickFeed}
    handleClickProfile={handleClickProfile}
    isFeedPage={isFeedPage}
    isProfilePage={isProfilePage}
    isConstructorPage={isConstructorPage}
  />;
};
