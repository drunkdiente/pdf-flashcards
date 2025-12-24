import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');

  // Если токена нет, перенаправляем на логин
  // replace означает, что пользователь не сможет нажать "Назад" и вернуться на защищенную страницу
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Если токен есть, рендерим дочерние элементы (Outlet)
  return <Outlet />;
};

export default PrivateRoute;