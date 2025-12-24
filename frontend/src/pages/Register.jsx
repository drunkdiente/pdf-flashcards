import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Отправляем данные как JSON (по умолчанию в api.js)
      await api.post('/api/auth/register', { 
        email, 
        password 
      });

      // Если успешно — алерт и перенаправление на вход
      alert('Регистрация успешна! Теперь войдите в систему.');
      navigate('/login');
      
    } catch (err) {
      // Пытаемся достать текст ошибки от FastAPI (например, "Email already registered")
      const errorMsg = err.response?.data?.detail || 'Ошибка регистрации. Попробуйте другой email.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-white">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-center text-brand-dark mb-2">Создать аккаунт</h2>
        <p className="text-center text-gray-500 mb-6">Начните создавать умные шпаргалки</p>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-DEFAULT outline-none transition"
              placeholder="name@example.com"
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
              placeholder="Придумайте пароль"
              minLength={6}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-brand-DEFAULT hover:bg-brand-dark text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-brand-dark font-semibold hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}