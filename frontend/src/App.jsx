import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, FileText, BookOpen, Edit3, HelpCircle, User } from 'lucide-react';

// --- КОМПОНЕНТЫ UI (Кнопки, Шапка) ---

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="w-full py-4 px-8 flex items-center justify-between border-b border-gray-100 bg-white">
      <div className="flex items-center gap-2">
        {/* Логотип-заглушка */}
        <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white font-bold">
          <BookOpen size={18} />
        </div>
      </div>

      <nav className="flex gap-8 text-gray-700 font-medium">
        <Link to="/" className="hover:text-sage-600 transition">Главная</Link>
        <Link to="/dashboard" className="hover:text-sage-600 transition">Мои Карточки</Link>
      </nav>

      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-sage-400 text-white rounded-full hover:bg-sage-500 transition text-sm font-medium">
          Помощь
        </button>
        {isHome ? (
          <button className="px-6 py-2 bg-sage-400 text-white rounded-full hover:bg-sage-500 transition font-medium">
            Войти
          </button>
        ) : (
          <div className="w-10 h-10 bg-sage-200 rounded-full flex items-center justify-center text-sage-600">
            <User size={20} />
          </div>
        )}
      </div>
    </header>
  );
};

// --- СТРАНИЦА 1: ГЛАВНАЯ (Upload) ---
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-16 px-4">
      <h1 className="text-3xl font-medium text-center mb-10 text-gray-800 max-w-2xl">
        Создайте учебные шпаргалки из PDF за считанные секунды
      </h1>

      <div className="w-full max-w-3xl bg-sage-200/50 border-2 border-dashed border-gray-400 rounded-3xl h-80 flex flex-col items-center justify-center gap-4 relative">
        <p className="text-gray-700 text-lg">Перетащите ваш файл сюда</p>
        <span className="text-gray-500">Или</span>
        <button className="px-8 py-3 bg-sage-400 text-gray-800 font-medium rounded-full hover:bg-sage-500 hover:text-white transition shadow-sm">
          Выберите файл
        </button>
      </div>

      <p className="mt-8 text-gray-500 text-sm">
        Для сохранения и управления вашими карточками необходимо войти в систему
      </p>
    </div>
  );
};

// --- СТРАНИЦА 2: ДАШБОРД (Мои Карточки) ---
const Dashboard = () => {
  const decks = [
    { id: 1, title: 'История России', count: 10 },
    { id: 2, title: 'Английские фразы', count: 15 },
    { id: 3, title: 'Формулы по физике', count: 10 },
    { id: 4, title: 'Биология: Клетка', count: 10 },
    { id: 5, title: 'React хуки', count: 25 },
    { id: 6, title: 'SQL запросы', count: 12 },
  ];

  return (
    <div className="px-12 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Добро пожаловать, *пользователь*</h1>
        <div className="flex justify-between items-center mt-2">
          <h2 className="text-xl text-gray-700">Мои шпаргалки</h2>
          <button className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition text-sm">
            Создать шпаргалку
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <div key={deck.id} className="bg-sage-200/70 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-48">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">*{deck.title}*</h3>
              <p className="text-gray-600 text-sm">{deck.count} карточек</p>
            </div>
            
            <div className="flex gap-3 mt-4">
              <Link to={`/study/${deck.id}`} className="flex-1 bg-sage-400 text-white py-2 rounded-full text-center text-sm hover:bg-sage-500 transition">
                Учить
              </Link>
              <Link to={`/edit/${deck.id}`} className="flex-1 bg-sage-400 text-white py-2 rounded-full text-center text-sm hover:bg-sage-500 transition">
                Редактировать
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- СТРАНИЦА 3: РЕЖИМ ОБУЧЕНИЯ ---
const StudyPage = () => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="px-12 py-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-80px)]">
      <div className="mb-4">
        <h2 className="text-lg text-gray-800 mb-2">Шпаргалка: *Название шпаргалки*</h2>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-1.5 bg-gray-400 text-white rounded-full text-sm hover:bg-gray-500 transition"
        >
          Назад
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <h3 className="text-2xl mb-6 text-gray-800">Карточка 1 из 10</h3>

        {/* Карточка */}
        <div 
          className="w-full max-w-4xl aspect-[16/9] bg-gradient-to-br from-sage-200 to-sage-300 rounded-3xl shadow-sm flex items-center justify-center p-10 cursor-pointer mb-8 relative overflow-hidden"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Кружок в углу как на макете */}
          <div className="absolute top-6 left-6 w-8 h-8 bg-white rounded-full opacity-80"></div>
          
          <p className="text-3xl text-gray-800 font-medium text-center">
            {isFlipped ? "Ответ на вопрос" : "Вопрос"}
          </p>
        </div>

        {/* Управление */}
        <div className="flex items-center gap-6">
          <button className="p-4 bg-sage-300 rounded-full text-white hover:bg-sage-400 transition">
            <ArrowLeft size={24} />
          </button>
          
          <button 
            onClick={() => setIsFlipped(true)}
            className="px-8 py-3 bg-sage-400 text-gray-800 font-medium rounded-full hover:bg-sage-500 hover:text-white transition min-w-[200px]"
          >
            Показать ответ
          </button>

          <button className="p-4 bg-sage-300 rounded-full text-white hover:bg-sage-400 transition">
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- СТРАНИЦА 4: РЕДАКТИРОВАНИЕ ---
const EditPage = () => {
  const navigate = useNavigate();
  const cards = [1, 2, 3, 4]; // Заглушки

  return (
    <div className="px-12 py-6 max-w-7xl mx-auto h-[calc(100vh-80px)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg text-gray-800 mb-2">Шпаргалка: *Название шпаргалки*</h2>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-1.5 bg-gray-400 text-white rounded-full text-sm hover:bg-gray-500 transition"
          >
            Назад
          </button>
        </div>
        <h1 className="text-2xl text-gray-800 font-medium pr-20">Редактирование карточек</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex gap-8 h-full pb-10">
        {/* Сайдбар со списком */}
        <div className="w-1/4 flex flex-col gap-4 overflow-y-auto pr-2">
          <h3 className="text-gray-700 font-medium mb-2">Все карточки</h3>
          {cards.map((card, idx) => (
            <button 
              key={idx}
              className={`p-4 rounded-2xl border text-left transition ${
                idx === 0 
                  ? 'bg-sage-400 text-gray-900 font-medium border-sage-400' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-sage-300'
              }`}
            >
              *Название карточки {card}*
            </button>
          ))}
          <button className="p-4 rounded-2xl border border-dashed border-gray-300 text-gray-400 text-center hover:border-sage-400 hover:text-sage-600 transition">
            + Добавить
          </button>
        </div>

        {/* Область редактирования */}
        <div className="w-3/4 border border-gray-200 rounded-2xl p-8 bg-white shadow-sm flex flex-col gap-6">
          <div>
            <label className="block text-xl text-gray-800 mb-3">Вопрос</label>
            <textarea 
              className="w-full h-40 bg-sage-200/50 rounded-2xl p-4 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="Введите вопрос..."
            ></textarea>
          </div>

          <div>
            <label className="block text-xl text-gray-800 mb-3">Ответ</label>
            <textarea 
              className="w-full h-40 bg-sage-200/50 rounded-2xl p-4 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-sage-400"
              placeholder="Введите ответ..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ГЛАВНОЕ ПРИЛОЖЕНИЕ ---
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study/:id" element={<StudyPage />} />
          <Route path="/edit/:id" element={<EditPage />} />
        </Routes>
      </div>
    </Router>
  );
}