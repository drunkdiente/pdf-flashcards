import { BookOpen, User, HelpCircle, ArrowLeft, ArrowRight, Upload, FileText, Settings, Edit3, Play, ChevronLeft, Plus } from 'lucide-react';
import Button from "./Button";

const Header = ({ currentPage, isLoggedIn, setCurrentPage, handleLogin }) => {
  return (
    <header className="py-6 px-8 flex justify-between items-center max-w-7xl mx-auto">
        {/* Логотип */}
        <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentPage(isLoggedIn ? 'cardSets' : 'mainPage')}
        >
          <div className="relative">
             <BookOpen size={40} className="text-gray-800 stroke-1" />
             <div className="absolute -top-1 -right-2 w-3 h-5 bg-gray-200 -z-10 rounded-sm border border-gray-400"></div>
          </div>
        </div>

        {/* Навигация */}
        <nav className="hidden md:flex gap-8 text-lg text-gray-800">
          <button 
            onClick={() => setCurrentPage('mainPage')} 
            className={`hover:text-gray-600 ${currentPage === 'mainPage' ? 'font-medium' : ''}`}
          >
            Главная
          </button>
          <button 
            onClick={() => isLoggedIn && setCurrentPage('cardSets')}
            className={`hover:text-gray-600 ${currentPage === 'cardSets' ? 'font-medium' : ''} ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Мои Карточки
          </button>
        </nav>

        {/* Правая часть */}
        <div className="flex items-center gap-4">
          <Button variant="primary" className="bg-[#A5D6BA] hover:bg-[#94C9AA]">Помощь</Button>
          {isLoggedIn ? (
             <div className="w-10 h-10 bg-[#A5D6BA] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#94C9AA]" title="Профиль">
                <User className="text-gray-700" size={20} />
             </div>
          ) : (
            <Button variant="primary" className="bg-[#A5D6BA] hover:bg-[#94C9AA]" onClick={handleLogin}>Войти</Button>
          )}
        </div>
      </header>
  );
};

export default Header;