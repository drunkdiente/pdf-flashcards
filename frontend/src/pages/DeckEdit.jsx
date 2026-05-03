import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2 } from 'lucide-react';
import api from '../api';

export default function DeckEdit() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [deck, setDeck] = useState(state?.deck || null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Состояния для словаря
  const [searchWord, setSearchWord] = useState('');
  const [dictResult, setDictResult] = useState(null);
  const [dictLoading, setDictLoading] = useState(false);
  const [dictError, setDictError] = useState('');

  useEffect(() => {
    if (!state?.deck) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!deck) return null;

  const currentCard = deck.cards[selectedIndex];

  const updateCard = (field, value) => {
    const updatedCards = [...deck.cards];
    updatedCards[selectedIndex] = { ...currentCard, [field]: value };
    setDeck({ ...deck, cards: updatedCards });
  };

  const handleSaveDeck = async () => {
    try {
      setLoading(true);
      await api.post('/api/decks/', deck);
      alert('Колода успешно сохранена!');
      navigate('/my-decks');
    } catch (error) {
      console.error(error);
      alert('Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchWord = async (e) => {
    e.preventDefault();
    if (!searchWord.trim()) return;
    
    setDictLoading(true);
    setDictError('');
    setDictResult(null);

    try {
      const response = await api.get(`/api/dictionary/define?word=${searchWord.trim()}`);
      setDictResult(response.data);
    } catch (err) {
      setDictError(err.response?.data?.detail || 'Не удалось связаться со словарем');
    } finally {
      setDictLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
        
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="md:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          
          {/* Блок словаря (Интеграция стороннего API) */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">Быстрый словарь (Только русские и английские слова)</h3>
            <form onSubmit={handleSearchWord} className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder="Введите слово..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-brand-DEFAULT"
              />
              <button 
                type="submit" 
                disabled={dictLoading}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                Найти
              </button>
            </form>

            {dictLoading && <p className="text-sm text-gray-500 animate-pulse">Ищем определение...</p>}
            {dictError && <p className="text-sm text-red-500">{dictError}</p>}
            {dictResult && (
              <div className="text-sm bg-brand-light/30 p-3 rounded-lg border border-brand-light">
                {dictResult.found ? (
                  <>
                    <span className="font-bold block mb-1">{dictResult.word}</span>
                    <span className="text-gray-700">{dictResult.definition}</span>
                  </>
                ) : (
                  <span className="text-gray-500">Слово «{dictResult.word}» не найдено в словаре.</span>
                )}
              </div>
            )}
          </div>

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