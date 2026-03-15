import axios from 'axios';

// Update to port 8000 to match FastAPI backend
const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // <- Важно для отправки cookies (refresh_token)
});

// 1. Request Interceptor: Добавляет токен в запросы
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Ловит ошибки 401 и обновляет токен
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && originalRequest.url !== '/api/auth/refresh') {
        if (!originalRequest._retry) {
            
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({resolve, reject})
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                })
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Попытка обновить токен
                const response = await api.post('/api/auth/refresh');
                const newToken = response.data.access_token;
                
                localStorage.setItem('token', newToken);
                if (response.data.role) {
                    localStorage.setItem('role', response.data.role);
                }
                
                api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                
                processQueue(null, newToken);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                
                // Если refresh не удался (например истек/невалиден)
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                
                // Чтобы не редиректить бесконечно
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
    }
    
    // Если получаем 401 с самого /login - не редиректим
    if (error.response && error.response.status === 401 && originalRequest.url !== '/api/auth/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        if (window.location.pathname !== '/login') {
             window.location.href = '/login';
        }
    }

    return Promise.reject(error);
  }
);

export default api;