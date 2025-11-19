import Button from "./Button";

const CardSets = ({ onNavigate }) => {
  const decks = [
    { id: 1, title: "История России", count: 10 },
    { id: 2, title: "Английский B2", count: 15 },
    { id: 3, title: "Физика формулы", count: 10 },
    { id: 4, title: "React Хуки", count: 10 },
    { id: 5, title: "Химия", count: 25 },
    { id: 6, title: "Литература", count: 12 },
  ];

  return (
    <div className="mt-8 px-4 md:px-0 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
            <h2 className="text-2xl font-medium text-gray-900 mb-1">Добро пожаловать, *пользователь*</h2>
            <h3 className="text-xl text-gray-800 mt-4">Мои шпаргалки</h3>
        </div>
        <Button variant="secondary" className="bg-gray-500 text-white">Создать шпаргалку</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {decks.map((deck) => (
          <div key={deck.id} className="bg-[#C1E1D2] bg-opacity-60 rounded-[2rem] p-8 flex flex-col justify-between h-64">
            <div>
              <h4 className="text-xl font-medium text-gray-800 mb-2">*{deck.title}*</h4>
              <p className="text-gray-600">{deck.count} карточек</p>
            </div>
            
            <div className="flex gap-4 mt-auto">
              <button 
                onClick={() => onNavigate('cardStudy')}
                className="bg-[#9CCFB3] hover:bg-[#8ABFA4] text-white px-6 py-2 rounded-full text-sm font-medium transition"
              >
                Учить
              </button>
              <button 
                onClick={() => onNavigate('cardEdit')}
                className="bg-[#9CCFB3] hover:bg-[#8ABFA4] text-white px-6 py-2 rounded-full text-sm font-medium transition"
              >
                Редактировать
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSets;