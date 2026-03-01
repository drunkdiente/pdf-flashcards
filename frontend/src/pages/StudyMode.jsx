import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCw, Loader2, Save } from 'lucide-react';
import api from '../api';

export default function StudyMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Получаем данные, переданные через navigate
  
  // Пытаемся взять колоду из state (для гостей) или null
  const [deck, setDeck] = useState(location.state?.deck || null);
  const isPreview = location.state?.preview || false;

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(!deck); // Если деки нет, включаем загрузку

  // Загружаем колоду с сервера ТОЛЬКО если у нас нет данных в state и есть ID
  useEffect(() => {
    if (!deck && id) {
      const fetchDeck = async () => {
        try {
          const response = await api.get(`/api/decks/${id}`);
          setDeck(response.data);
        } catch (error) {
          console.error("Не удалось загрузить колоду", error);
          navigate('/my-decks');
        } finally {
          setLoading(false);
        }
      };
      fetchDeck();
    } else if (!deck && !id) {
      // Если ни данных, ни ID нет — выкидываем на главную
      navigate('/');
    }
  }, [id, deck, navigate]);

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-brand-DEFAULT" size={48} /></div>;
  if (!deck || !deck.cards || deck.cards.length === 0) return <div className="text-center mt-20">В этой колоде нет карточек.</div>;

  const currentCard = deck.cards[currentCardIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Шапка */}
      <div className="w-full flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(isPreview ? '/' : '/my-decks')} 
          className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-200 transition text-sm font-medium"
        >
          {isPreview ? 'На главную' : 'Назад к списку'}
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-700 truncate max-w-[200px] sm:max-w-md">{deck.title || "Новая колода"}</h2>
          <p className="text-xs text-brand-dark font-medium">
            Карточка {currentCardIndex + 1} из {deck.cards.length}
          </p>
        </div>

        {/* Если это превью, показываем кнопку "Сохранить" (которая ведет к регистрации) */}
        {isPreview ? (
          <Link 
            to="/register" 
            className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 rounded-full hover:bg-brand-dark/90 transition text-sm shadow-md animate-pulse"
          >
            <Save size={16} /> Сохранить
          </Link>
        ) : (
           <div className="w-[80px]"></div> // Пустой блок для центровки
        )}
      </div>

      {/* КАРТОЧКА (Flip logic) */}
      <div 
        className="relative w-full max-w-2xl aspect-[16/9] cursor-pointer perspective-1000 group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`
          w-full h-full transition-all duration-500 preserve-3d relative rounded-3xl shadow-xl
          ${isFlipped ? 'rotate-y-180' : ''}
        `}>
          {/* Лицевая сторона (Вопрос) */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#A8D5BA] to-[#8BC4A0] rounded-3xl flex flex-col items-center justify-center p-8 text-center text-white border border-[#97C3AA]">
            <span className="absolute top-6 left-6 text-white/80 text-xs uppercase tracking-wider font-bold bg-white/20 px-3 py-1 rounded-full">Вопрос</span>
            <p className="text-xl md:text-3xl font-semibold leading-relaxed drop-shadow-sm select-none">
              {currentCard.question}
            </p>
            <div className="absolute bottom-6 text-white/70 text-sm flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <RotateCw size={14} /> Нажмите, чтобы перевернуть
            </div>
          </div>

          {/* Обратная сторона (Ответ) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border-2 border-brand-DEFAULT rounded-3xl flex flex-col items-center justify-center p-8 text-center text-gray-800 shadow-inner">
             <span className="absolute top-6 left-6 text-brand-DEFAULT text-xs uppercase tracking-wider font-bold bg-brand-light px-3 py-1 rounded-full">Ответ</span>
             <div className="max-h-full overflow-y-auto w-full flex items-center justify-center">
               <p className="text-lg md:text-2xl leading-relaxed text-gray-700 font-medium">
                 {currentCard.answer}
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Кнопки навигации */}
      <div className="flex gap-4 md:gap-8 mt-10">
        <button 
          onClick={handlePrev}
          disabled={currentCardIndex === 0}
          className={`
            p-4 rounded-full transition shadow-sm border
            ${currentCardIndex === 0 
              ? 'bg-gray-100 text-gray-300 border-transparent cursor-not-allowed' 
              : 'bg-white text-gray-600 border-gray-200 hover:border-brand-DEFAULT hover:text-brand-DEFAULT'}
          `}
        >
          <ArrowLeft size={24} />
        </button>

        <button 
          onClick={handleNext}
          disabled={currentCardIndex === deck.cards.length - 1}
          className={`
            p-4 rounded-full transition shadow-sm border
            ${currentCardIndex === deck.cards.length - 1
              ? 'bg-gray-100 text-gray-300 border-transparent cursor-not-allowed' 
              : 'bg-white text-gray-600 border-gray-200 hover:border-brand-DEFAULT hover:text-brand-DEFAULT'}
          `}
        >
          <ArrowRight size={24} />
        </button>
      </div>

      {isPreview && (
        <p className="mt-8 text-gray-400 text-sm max-w-md text-center">
          Это режим предпросмотра. <Link to="/register" className="text-brand-DEFAULT underline hover:text-brand-dark">Зарегистрируйтесь</Link>, чтобы сохранить эту колоду навсегда.
        </p>
      )}
    </div>
  );
}