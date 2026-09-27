import { setUser } from '@/services/slices/userSlice';
import { registerUserApi } from '@/utils/burger-api';
import { setCookie } from '@/utils/cookie';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('')
  const dispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    try {
      const { refreshToken, accessToken, user } = await registerUserApi({ email, password, name: userName });
      localStorage.setItem('refreshToken', refreshToken);
      setCookie('accessToken', accessToken);
      dispatch(setUser(user));
      setErrorText('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorText(error.message)
      } else {
        setErrorText('An unknown error occurred')
      }
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
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

