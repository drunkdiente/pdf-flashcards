import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor (уже был): Добавляет токен в запросы
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor (НОВЫЙ): Ловит ошибки 401
api.interceptors.response.use(
  (response) => response, // Если всё ок, просто возвращаем ответ
  (error) => {
    // Если ошибка 401 (нет доступа), значит токен неверный или истек
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Удаляем плохой токен
      window.location.href = '/login';  // Жестко перекидываем на логин
    }
    return Promise.reject(error);
  }
);

export default api;