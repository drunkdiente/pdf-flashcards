import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import api from '../api';

export default function DeckEdit() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Состояние колоды
  const [deck, setDeck] = useState(state?.deck || null);
  // Индекс выбранной карточки для редактирования
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Если пришли на страницу без данных (например, обновили страницу), возвращаем назад
  useEffect(() => {
    if (!state?.deck) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!deck) return null;

  const currentCard = deck.cards[selectedIndex];

  // Обновление текста вопроса/ответа
  const updateCard = (field, value) => {
    const updatedCards = [...deck.cards];
    updatedCards[selectedIndex] = { ...currentCard, [field]: value };
    setDeck({ ...deck, cards: updatedCards });
  };

  // Сохранение колоды в базу данных
  const handleSaveDeck = async () => {
    try {
      setLoading(true);
      // Если у колоды уже есть ID в базе, делаем PUT, если новая - POST
      // Но пока API у нас простой, предположим создание новой
      await api.post('/api/decks/', deck);
      alert('Колода успешно сохранена!');
      navigate('/my-decks'); // Позже создадим эту страницу
    } catch (error) {
      console.error(error);
      alert('Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Верхняя панель */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition text-sm">
            Назад
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Шпаргалка: {deck.title}</h1>
        </div>
        <button 
          onClick={handleSaveDeck}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-brand-dark text-white rounded-full hover:bg-brand-dark/90 transition font-semibold shadow-lg"
        >
          <Save size={18} /> {loading ? 'Сохранение...' : 'Сохранить колоду'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ЛЕВАЯ КОЛОНКА: Список карточек */}
        <div className="md:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          <h3 className="font-semibold text-gray-500 mb-2">Все карточки ({deck.cards.length})</h3>
          
          {deck.cards.map((card, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`
                p-4 rounded-2xl cursor-pointer border transition-all duration-200
                ${idx === selectedIndex 
                  ? 'bg-brand-dark text-white border-brand-dark shadow-md' 
                  : 'bg-white border-gray-200 hover:border-brand-DEFAULT text-gray-700 hover:bg-gray-50'}
              `}
            >
              <p className="font-medium truncate text-sm">
                {idx + 1}. {card.question || "Новый вопрос"}
              </p>
            </div>
          ))}

          <button 
            onClick={() => {
              const newCard = { question: "", answer: "" };
              setDeck({ ...deck, cards: [...deck.cards, newCard] });
              setSelectedIndex(deck.cards.length);
            }}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 hover:border-brand-DEFAULT hover:text-brand-DEFAULT transition flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Добавить карточку
          </button>
        </div>

        {/* ПРАВАЯ КОЛОНКА: Редактор */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm h-fit">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Редактирование карточки</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Вопрос</label>
              <textarea
                value={currentCard?.question}
                onChange={(e) => updateCard('question', e.target.value)}
                className="w-full h-32 p-4 bg-brand-light/50 border-none rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-DEFAULT resize-none text-lg"
                placeholder="Введите вопрос..."
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Ответ</label>
              <textarea
                value={currentCard?.answer}
                onChange={(e) => updateCard('answer', e.target.value)}
                className="w-full h-32 p-4 bg-brand-light/50 border-none rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-DEFAULT resize-none text-lg"
                placeholder="Введите ответ..."
              />
            </div>
            
            <div className="flex justify-end pt-4">
               <button 
                 onClick={() => {
                   const newCards = deck.cards.filter((_, i) => i !== selectedIndex);
                   setDeck({...deck, cards: newCards});
                   if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
                 }}
                 className="text-red-500 hover:text-red-700 flex items-center gap-2 text-sm font-medium"
               >
                 <Trash2 size={16} /> Удалить эту карточку
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}