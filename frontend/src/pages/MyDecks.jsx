import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Play, Edit, Trash2, Loader2, Plus, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';

export default function MyDecks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort_by') || 'created_at';
  const sortOrder = searchParams.get('sort_order') || 'desc';
  const minCards = searchParams.get('min_cards') || '';
  const maxCards = searchParams.get('max_cards') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 6; // Show 6 per page for better pagination UX demo

  useEffect(() => {
    fetchDecks();
  }, [search, sortBy, sortOrder, minCards, maxCards, page]);

  const fetchDecks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/decks/', {
        params: {
          search,
          sort_by: sortBy,
          sort_order: sortOrder,
          min_cards: minCards ? parseInt(minCards) : null,
          max_cards: maxCards ? parseInt(maxCards) : null,
          skip: (page - 1) * limit,
          limit
        }
      });
      setDecks(response.data);
    } catch (error) {
      console.error('Ошибка загрузки колод:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 on filter changes
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (window.confirm('Вы уверены, что хотите удалить эту колоду и привязанный файл?')) {
      try {
        await api.delete(`/api/decks/${id}`);
        setDecks(decks.filter(d => d.id !== id));
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const handleDownload = async (e, id) => {
    e.preventDefault();
    try {
      const response = await api.get(`/api/decks/${id}/file`);
      if (response.data && response.data.url) {
        window.open(response.data.url, '_blank');
      }
    } catch (error) {
      alert('Ошибка получения файла. ' + (error.response?.data?.detail || ''));
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Мои шпаргалки</h1>
        <Link 
          to="/" 
          className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition flex items-center gap-2"
        >
          <Plus size={18} /> Создать новую
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-full overflow-x-auto">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-500 mb-1">Поиск</label>
            <input 
              type="text" 
              placeholder="Название или описание..."
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-brand-DEFAULT"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-500 mb-1">Сортировка</label>
            <select 
              value={sortBy} 
              onChange={(e) => updateParam('sort_by', e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-brand-DEFAULT"
            >
              <option value="created_at">Сначала новые</option>
              <option value="title">По названию</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Порядок</label>
            <select 
              value={sortOrder} 
              onChange={(e) => updateParam('sort_order', e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-brand-DEFAULT"
            >
              <option value="desc">Убывание</option>
              <option value="asc">Возрастание</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Мин. карт</label>
              <input 
                type="number" 
                min="0"
                value={minCards}
                onChange={(e) => updateParam('min_cards', e.target.value)}
                className="w-24 px-4 py-2 border rounded-lg focus:outline-brand-DEFAULT"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Макс. карт</label>
              <input 
                type="number" 
                min="0"
                value={maxCards}
                onChange={(e) => updateParam('max_cards', e.target.value)}
                className="w-24 px-4 py-2 border rounded-lg focus:outline-brand-DEFAULT"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-brand-DEFAULT" size={48} /></div>
      ) : decks.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
          <p className="text-xl text-gray-500 mb-4">Колод не найдено</p>
          {(search || minCards || maxCards) ? (
            <button onClick={() => setSearchParams(new URLSearchParams())} className="text-brand-DEFAULT font-semibold hover:underline">Сбросить фильтры</button>
          ) : (
            <Link to="/" className="text-brand-DEFAULT font-semibold hover:underline">Создать первую сейчас</Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {decks.map((deck) => (
              <div key={deck.id} className="bg-brand-light/30 border border-brand-light rounded-3xl p-6 hover:shadow-lg transition duration-200 flex flex-col justify-between min-h-[200px]">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={deck.title}>
                    {deck.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {deck.cards?.length || 0} карточек
                  </p>
                  {deck.file_name && (
                     <p className="text-xs text-gray-400 mb-4 truncate" title={deck.file_name}>
                       📄 {deck.file_name}
                     </p>
                  )}
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <Link 
                    to={`/deck/${deck.id}/study`}
                    className="flex-1 bg-brand-DEFAULT text-white py-2 rounded-lg font-medium hover:bg-brand-dark transition flex items-center justify-center gap-1 text-sm"
                  >
                    <Play size={16} /> Учить
                  </Link>
                  
                  {deck.file_key && (
                    <button 
                      onClick={(e) => handleDownload(e, deck.id)}
                      className="px-3 py-2 bg-white text-blue-500 border border-blue-100 rounded-lg hover:bg-blue-50 transition tooltip"
                      title="Скачать исходный PDF"
                    >
                      <Download size={16} />
                    </button>
                  )}

                  <button 
                    onClick={() => navigate('/deck/edit', { state: { deck } })}
                    className="px-3 py-2 bg-white text-brand-dark border border-brand-DEFAULT/30 rounded-lg hover:bg-brand-light transition"
                  >
                    <Edit size={16} />
                  </button>

                  <button 
                    onClick={(e) => handleDelete(e, deck.id)}
                    className="px-3 py-2 bg-white text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button 
              onClick={() => updateParam('page', (page - 1).toString())}
              disabled={page === 1}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <span className="text-gray-600 font-medium">Страница {page}</span>
            <button 
              onClick={() => updateParam('page', (page + 1).toString())}
              disabled={decks.length < limit}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <ChevronRight size={24} className="text-gray-700" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}