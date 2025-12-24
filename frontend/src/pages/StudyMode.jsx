import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCw, Loader2 } from 'lucide-react';
import api from '../api';

export default function StudyMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await api.get(`/api/decks/${id}`);
        setDeck(response.data);
      } catch (error) {
        console.error("Не удалось загрузить колоду", error);
        alert("Ошибка загрузки колоды");
        navigate('/my-decks');
      } finally {
        setLoading(false);
      }
    };
    fetchDeck();
  }, [id, navigate]);

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin" /></div>;
  if (!deck || !deck.cards || deck.cards.length === 0) return <div>В этой колоде нет карточек.</div>;

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
      {/* Шапка с названием и кнопкой Назад */}
      <div className="w-full flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/my-decks')} 
          className="bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-gray-500 transition text-sm"
        >
          Назад
        </button>
        <h2 className="text-xl font-bold text-gray-700 truncate max-w-md">{deck.title}</h2>
        <div className="text-brand-dark font-medium">
          Карточка {currentCardIndex + 1} из {deck.cards.length}
        </div>
      </div>

      {/* Сама Карточка (Flip logic) */}
      <div 
        className="relative w-full max-w-2xl aspect-[16/9] cursor-pointer perspective-1000 group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`
          w-full h-full transition-all duration-500 preserve-3d relative rounded-3xl shadow-xl
          ${isFlipped ? 'rotate-y-180' : ''}
        `}>
          {/* Лицевая сторона (Вопрос) */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#A8D5BA] to-[#8BC4A0] rounded-3xl flex flex-col items-center justify-center p-8 text-center text-white">
            <span className="absolute top-6 left-6 text-white/70 text-sm uppercase tracking-wider font-bold">Вопрос</span>
            <p className="text-2xl md:text-3xl font-semibold leading-relaxed drop-shadow-sm">
              {currentCard.question}
            </p>
            <div className="absolute bottom-6 text-white/60 text-sm flex items-center gap-2">
              <RotateCw size={14} /> Нажмите, чтобы увидеть ответ
            </div>
          </div>

          {/* Обратная сторона (Ответ) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border-2 border-brand-DEFAULT rounded-3xl flex flex-col items-center justify-center p-8 text-center text-gray-800">
             <span className="absolute top-6 left-6 text-brand-DEFAULT text-sm uppercase tracking-wider font-bold">Ответ</span>
             <p className="text-xl md:text-2xl leading-relaxed">
               {currentCard.answer}
             </p>
          </div>
        </div>
      </div>

      {/* Кнопки навигации */}
      <div className="flex gap-8 mt-10">
        <button 
          onClick={handlePrev}
          disabled={currentCardIndex === 0}
          className={`
            p-4 rounded-full transition shadow-md
            ${currentCardIndex === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-brand-light text-brand-dark hover:bg-brand-DEFAULT hover:text-white'}
          `}
        >
          <ArrowLeft size={24} />
        </button>

        <button 
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-8 py-3 bg-white border-2 border-brand-DEFAULT text-brand-dark rounded-full font-semibold hover:bg-brand-light transition"
        >
          {isFlipped ? 'Показать вопрос' : 'Показать ответ'}
        </button>

        <button 
          onClick={handleNext}
          disabled={currentCardIndex === deck.cards.length - 1}
          className={`
            p-4 rounded-full transition shadow-md
            ${currentCardIndex === deck.cards.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-brand-light text-brand-dark hover:bg-brand-DEFAULT hover:text-white'}
          `}
        >
          <ArrowRight size={24} />
        </button>
      </div>

    </div>
  );
}