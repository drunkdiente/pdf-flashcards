import React, { useState } from 'react';
import { BookOpen, User, HelpCircle, ArrowLeft, ArrowRight, Upload, FileText, Settings, Edit3, Play, ChevronLeft, Plus } from 'lucide-react';
import Button from "./Button";

const CardStudy = ({ onBack }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCard, setCurrentCard] = useState(1);
  const totalCards = 10;

  return (
    <div className="mt-4 px-4 md:px-0 max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
         <div>
            <p className="text-lg text-gray-800">Шпаргалка: *Название шпаргалки*</p>
            <Button variant="secondary" onClick={onBack} className="mt-4 bg-gray-500 text-white px-8">Назад</Button>
         </div>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-medium text-gray-900 mb-6">Карточка {currentCard} из {totalCards}</h2>

        {/* Сама карточка */}
        <div className="w-full h-96 bg-[#B5DBC8] rounded-[2rem] shadow-sm flex items-center justify-center relative cursor-pointer transition-all" onClick={() => setShowAnswer(!showAnswer)}>
           {/* Индикатор в углу */}
           <div className="absolute top-6 left-6 w-6 h-6 bg-white rounded-full opacity-80"></div>
           
           <div className="text-center p-8">
             <span className="text-3xl text-gray-800 font-medium">
                {showAnswer ? "Ответ на вопрос" : "Вопрос"}
             </span>
             {showAnswer && <p className="mt-4 text-gray-600">(Нажмите, чтобы скрыть)</p>}
           </div>
        </div>

        {/* Контролы */}
        <div className="flex items-center justify-center gap-8 mt-10">
            <button 
                onClick={() => setCurrentCard(Math.max(1, currentCard - 1))}
                className="w-14 h-14 bg-[#9CCFB3] hover:bg-[#8ABFA4] rounded-full flex items-center justify-center transition"
            >
                <ArrowLeft className="text-gray-800" size={28} />
            </button>

            <button 
                onClick={() => setShowAnswer(!showAnswer)}
                className="bg-[#9CCFB3] hover:bg-[#8ABFA4] text-gray-800 px-10 py-3 rounded-full text-lg font-medium transition"
            >
                {showAnswer ? "Скрыть ответ" : "Показать ответ"}
            </button>

            <button 
                onClick={() => setCurrentCard(Math.min(totalCards, currentCard + 1))}
                className="w-14 h-14 bg-[#9CCFB3] hover:bg-[#8ABFA4] rounded-full flex items-center justify-center transition"
            >
                <ArrowRight className="text-gray-800" size={28} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default CardStudy;