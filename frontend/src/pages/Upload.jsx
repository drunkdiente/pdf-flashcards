import { useState, useRef } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, Loader2 } from 'lucide-react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Обработка перетаскивания
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Обработка сброса файла
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Обработка выбора через диалог
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Пожалуйста, загрузите файл формата PDF');
      return;
    }
    setError('');
    setFile(selectedFile);
  };

  // Отправка на сервер
  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Отправляем PDF на ML-обработку
      const response = await api.post('/api/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/deck/edit', { state: { deck: response.data } });
      
      // Сервер вернул готовую колоду (preview). 
      // Мы можем сохранить её в state и перенаправить на предпросмотр.
      // Пока просто выведем в консоль и перейдем на dashboard (или создадим страницу просмотра)
      console.log('Сгенерированная колода:', response.data);
      
      // В реальном приложении здесь мы бы перенаправили на страницу редактирования колоды
      // navigate(`/deck/${response.data.id}/edit`, { state: { deck: response.data } });
      alert("Колода успешно сгенерирована! (Пока просто alert)");
      
    } catch (err) {
      console.error(err);
      setError('Ошибка при обработке файла. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Создайте учебные шпаргалки из PDF за считанные секунды
        </h1>
      </div>

      <div 
        className={`
          relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ease-in-out
          ${dragActive ? 'border-brand-dark bg-brand-light' : 'border-gray-300 bg-brand-light/50'}
          ${file ? 'bg-white border-brand-DEFAULT' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
        />

        {!file ? (
          <div className="flex flex-col items-center justify-center py-8">
             {/* Заглушка, если файл не выбран */}
            <p className="text-gray-600 mb-6 font-medium">Перетащите ваш файл сюда</p>
            <p className="text-gray-500 mb-6 text-sm">Или</p>
            <button
              onClick={() => inputRef.current.click()}
              className="px-8 py-3 bg-brand-dark/20 hover:bg-brand-dark/30 text-brand-dark font-semibold rounded-full transition"
            >
              Выберите файл
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            {/* Если файл выбран */}
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 text-brand-dark">
              <FileText size={32} />
            </div>
            <p className="text-xl font-medium text-gray-800 mb-2">{file.name}</p>
            <p className="text-sm text-gray-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setFile(null)}
                className="px-6 py-2 text-gray-500 hover:text-red-500 font-medium transition"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2 bg-brand-dark text-white font-semibold rounded-full hover:bg-brand-dark/90 transition flex items-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={20} />}
                {loading ? 'Генерируем...' : 'Создать карточки'}
              </button>
            </div>
          </div>
        )}

        {/* Оверлей для Drag-and-Drop */}
        {dragActive && (
          <div className="absolute inset-0 w-full h-full bg-brand-light/90 rounded-3xl flex items-center justify-center z-10">
            <p className="text-2xl font-bold text-brand-dark">Отпустите файл здесь</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-2">
           <span>⚠️</span> {error}
        </div>
      )}

      <p className="text-center text-gray-400 text-xs mt-8">
        Для сохранения и управления вашими карточками необходимо войти в систему
      </p>
    </div>
  );
}