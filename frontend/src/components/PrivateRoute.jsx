import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Получаем роль

  // 1. Если токена нет, перенаправляем на логин
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Если указаны разрешенные роли, и роль пользователя не подходит
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Можно перенаправить на главную или страницу "Доступ запрещен"
    return <Navigate to="/" replace />;
  }

  // 3. Доступ разрешен
  return <Outlet />;
};

export default PrivateRoute;