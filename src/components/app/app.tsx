import { Routes, Route } from 'react-router-dom';

import { AppHeader, IngredientDetails, OrderInfo } from '@components';
import { useFetchIngredients } from '@hooks/useFetchIngredients';
import { ConstructorPage, Feed, Login, NotFound404, Profile, ProfileOrders, Register, ResetPassword, ForgotPassword } from '@pages';
import { Preloader } from '@ui';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const { ingredients, isIngredientsLoading, ingredientsError } = useFetchIngredients();
  
  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  console.log('isLoading', isLoading);
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};



const RouteComponent = (): React.JSX.Element => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/orders" element={<ProfileOrders />} />
        <Route path="*" element={<NotFound404 />} />

        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        {/* <Route path="/profile/orders/:number" element={<ProtectedRoute> <OrderInfo /> </ProtectedRoute>} /> */}
      </Routes>
    </>
  );
};
