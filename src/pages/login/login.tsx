import { setUser } from '@/services/slices/userSlice';
import { loginUserApi } from '@/utils/burger-api';
import { setCookie } from '@/utils/cookie';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('')
  const dispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    try {
      const { refreshToken, accessToken, user } = await loginUserApi({ email, password })
        localStorage.setItem('refreshToken', refreshToken);
        setCookie('accessToken', accessToken);
        dispatch(setUser(user));
        setErrorText('');
    } catch(error: unknown) {
      if (error instanceof Error) {
        setErrorText(error.message)
      } else {
        setErrorText('An unknown error occurred')
      }
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
