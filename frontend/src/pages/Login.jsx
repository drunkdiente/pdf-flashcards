import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // FormData нужен, так как FastAPI OAuth2 ожидает form-data, а не JSON
      const formData = new FormData();
      formData.append('username', email); // FastAPI ожидает поле username
      formData.append('password', password);

      const response = await api.post('/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      // Сохраняем токен
      localStorage.setItem('token', response.data.access_token);
      
      // ВАЖНО: Используем это вместо navigate, чтобы Header обновился (перерисовался)
      window.location.href = '/my-decks';
    } catch (err) {
      setError('Ошибка входа. Проверьте почту и пароль.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">Вход в систему</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-DEFAULT outline-none transition"
              placeholder="test@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-DEFAULT outline-none transition"
              placeholder="********"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-brand-DEFAULT hover:bg-brand-dark text-white font-semibold rounded-lg transition duration-200"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}