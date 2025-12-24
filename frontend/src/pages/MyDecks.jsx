import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Edit, Trash2, Loader2, Plus } from 'lucide-react';
import api from '../api';

export default function MyDecks() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const response = await api.get('/api/decks/');
      setDecks(response.data);
    } catch (error) {
      console.error('Ошибка загрузки колод:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault(); // Чтобы не сработал переход по ссылке
    if (window.confirm('Вы уверены, что хотите удалить эту колоду?')) {
      try {
        await api.delete(`/api/decks/${id}`);
        setDecks(decks.filter(d => d.id !== id));
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-brand-DEFAULT" size={48} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Мои шпаргалки</h1>
        <Link 
          to="/" 
          className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition flex items-center gap-2"
        >
          <Plus size={18} /> Создать новую
        </Link>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
          <p className="text-xl text-gray-500 mb-4">У вас пока нет шпаргалок</p>
          <Link to="/" className="text-brand-DEFAULT font-semibold hover:underline">Создать первую сейчас</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div key={deck.id} className="bg-brand-light/30 border border-brand-light rounded-3xl p-6 hover:shadow-lg transition duration-200 flex flex-col justify-between min-h-[200px]">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={deck.title}>
                  {deck.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {deck.cards?.length || 0} карточек
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <Link 
                  to={`/deck/${deck.id}/study`}
                  className="flex-1 bg-brand-DEFAULT text-white py-2 rounded-lg font-medium hover:bg-brand-dark transition flex items-center justify-center gap-2"
                >
                  <Play size={16} /> Учить
                </Link>
                
                {/* Кнопка редактирования ведет на страницу редактирования, загружая данные по ID */}
                <button 
                  onClick={() => navigate('/deck/edit', { state: { deck } })}
                  className="px-4 py-2 bg-white text-brand-dark border border-brand-DEFAULT/30 rounded-lg hover:bg-brand-light transition"
                >
                  <Edit size={16} />
                </button>

                <button 
                  onClick={(e) => handleDelete(e, deck.id)}
                  className="px-4 py-2 bg-white text-red-400 border border-red-100 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}