import {
  getIsUserLoading,
  getUserError,
  loginUser,
  resetUserError,
} from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorText = useSelector(getUserError);
  const isUserLoading = useSelector(getIsUserLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  useEffect(() => {
    return () => {
      dispatch(resetUserError());
    };
  }, [dispatch])

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    if (isUserLoading) {
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap()

      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <LoginUI
      errorText={errorText ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
