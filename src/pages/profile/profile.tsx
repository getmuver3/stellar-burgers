import {
  getIsUserLoading,
  getUser,
  getUserError,
  resetUserError,
  updateUser,
} from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

export const Profile = (): React.JSX.Element => {
  /** TODO: Взять переменную из стора */
  const user = useSelector(getUser);
  const updateUserError = useSelector(getUserError);
  const isUserLoading = useSelector(getIsUserLoading);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || '',
    }));
  }, [user]);

  useEffect(() => {
    return () => {
      dispatch(resetUserError());
    };
  }, [dispatch]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    if (isUserLoading) {
      return;
    }

    await dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password ? { password: formValue.password } : {}),
      })
    )
      .unwrap()
      .then((updatedUser) => {
        setFormValue({
          name: updatedUser.name,
          email: updatedUser.email,
          password: '',
        });
      })
      .catch(() => undefined);
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError ?? undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
