import {
  getIsUserLoading,
  getUserError,
  registerUser,
  resetUserError,
} from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorText = useSelector(getUserError);
  const isUserLoading = useSelector(getIsUserLoading);
  const dispatch = useDispatch();

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

    await dispatch(registerUser({ email, password, name: userName }));
  };

  return (
    <RegisterUI
      errorText={errorText ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
