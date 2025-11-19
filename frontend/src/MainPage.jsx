import Button from "./Button";

const MainPage = ({ onLogin }) => (
  <div className="flex flex-col items-center justify-center mt-20 text-center animate-fade-in">
    <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-12 max-w-2xl">
      Создайте учебные шпаргалки из <br /> PDF за считанные секунды
    </h1>

    <div className="w-full max-w-3xl h-96 bg-[#C1E1D2] bg-opacity-60 rounded-[3rem] border-2 border-dashed border-gray-500 flex flex-col items-center justify-center relative p-10">
      <p className="text-gray-800 text-lg mb-4">Перетащите ваш файл сюда</p>
      <p className="text-gray-600 mb-6">Или</p>
      <Button variant="primary" className="bg-[#8FBCA2] text-white px-8 py-3 shadow-sm">
        Выберите файл
      </Button>
    </div>

    <p className="mt-8 text-sm text-gray-500">
      Для сохранения и управления вашими карточками необходимо войти в систему
    </p>
    
    <div className="mt-10">
        <span className="text-xs text-gray-400 block mb-2">Для демо:</span>
        <Button onClick={onLogin} variant="secondary">Войти в систему (Демо)</Button>
    </div>
  </div>
);

export default MainPage;