import { Routes, Route, useLocation, useNavigate, useMatch } from 'react-router-dom';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useFetchIngredients } from '@hooks/useFetchIngredients';
import { ConstructorPage, Feed, Login, NotFound404, Profile, ProfileOrders, Register, ResetPassword, ForgotPassword } from '@pages';
import { Preloader } from '@ui';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';
import { ProtectedRoute } from '../protected-route/protected-route';


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
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const feedMatch = useMatch('/feed/:number');
  const profileMatch = useMatch('/profile/orders/:number');
  const orderNumber = feedMatch?.params.number ?? profileMatch?.params.number;
  const orderTitle = orderNumber ? `#${orderNumber}` : '';

  const closeModal = (): void => {
    navigate(-1);
  };

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<ProtectedRoute onlyUnAuth><Login /></ProtectedRoute>} />
        <Route path="/register" element={<ProtectedRoute onlyUnAuth><Register /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ProtectedRoute onlyUnAuth><ForgotPassword /></ProtectedRoute>} />
        <Route path="/reset-password" element={<ProtectedRoute onlyUnAuth><ResetPassword /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/orders" element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route
          path="/ingredients/:id"
          element={
            <div className={styles.detailPageWrap}>
              <h1 className={`text text_type_main-large ${styles.detailHeader}`}>
                Детали ингредиента
              </h1>
              <IngredientDetails />
            </div>
          }
        />
        <Route path="/profile/orders/:number" element={
          <ProtectedRoute>
            <div className={styles.detailPageWrap}>
              <h1 className={`text text_type_main-large ${styles.detailHeader}`}>
                {orderTitle}
              </h1>
              <OrderInfo />
            </div>
            </ProtectedRoute>} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal title={orderTitle} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal title={orderTitle} onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};