import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center mt-10">Загрузка...</div>;
  }

  // 1. Если пользователя нет, перенаправляем на логин
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Если указаны разрешенные роли, и роль пользователя не подходит
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. Доступ разрешен
  return <Outlet />;
};

export default PrivateRoute;