import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Чтобы обновлять хедер при смене страниц
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Используем жесткую перезагрузку или переход, чтобы сбросить состояние
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
      {/* Логотип */}
      <Link to="/" className="flex items-center gap-2 text-gray-800 hover:text-brand-dark transition group">
        <div className="bg-brand-light p-2 rounded-lg group-hover:bg-brand-DEFAULT transition duration-300">
             <BookOpen className="w-6 h-6 text-brand-dark group-hover:text-white transition" />
        </div>
        <span className="font-bold text-xl hidden sm:block tracking-tight">Flashcards AI</span>
      </Link>

      {/* Навигация */}
      <div className="flex items-center gap-4">
        {token ? (
          // --- ЕСЛИ АВТОРИЗОВАН ---
          <>
            <Link to="/my-decks" className="text-gray-600 hover:text-brand-dark font-medium transition hidden sm:block">
              Мои Шпаргалки
            </Link>
            
            <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition text-sm font-medium"
            >
              <LogOut size={18} /> 
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </>
        ) : (
          // --- ЕСЛИ ГОСТЬ ---
          <>
            <Link 
              to="/login"
              className="px-4 py-2 text-gray-600 hover:text-brand-dark font-medium transition"
            >
              Войти
            </Link>
            
            <Link 
              to="/register"
              className="px-5 py-2 bg-brand-dark text-white rounded-full hover:bg-brand-dark/90 transition font-medium shadow-sm flex items-center gap-2"
            >
              <User size={18} />
              Регистрация
            </Link>
          </>
        )}
      </div>
    </header>
  );
}