import { logout } from '@/services/slices/userSlice';
import { useDispatch } from '@/services/store';
import { Preloader, ProfileMenuUI } from '@ui';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Modal } from '../modal';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = async (): Promise<void> => {
    if (isLogoutLoading) {
      return;
    }

    setIsLogoutLoading(true);

    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLogoutLoading(false);
    }
  };

  return (
    <>
      <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />
      {isLogoutLoading && (
        <Modal title="Выход" onClose={() => undefined}>
          <Preloader />
        </Modal>
      )}
    </>
  );
};
