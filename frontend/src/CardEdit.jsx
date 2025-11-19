import React, { useState } from 'react';
import Button from "./Button";


const CardEdit = ({ onBack }) => {
    const cards = [1, 2, 3, 4, 5];
    const [selectedCard, setSelectedCard] = useState(1);

    return (
        <div className="mt-4 px-4 md:px-0 animate-fade-in">
            <div className="mb-8">
                <p className="text-lg text-gray-800 mb-4">Шпаргалка: *Название шпаргалки*</p>
                <Button variant="secondary" onClick={onBack} className="bg-gray-500 text-white px-8 w-fit">Назад</Button>
            </div>

            <h2 className="text-3xl font-medium text-gray-900 text-center mb-10">Редактирование карточек</h2>

            <div className="flex flex-col md:flex-row gap-12">
                {/* Сайдбар со списком */}
                <div className="w-full md:w-1/4 flex flex-col gap-4">
                    <h3 className="text-xl font-medium text-gray-800 mb-2 pl-2">Все карточки</h3>
                    {cards.map((num) => (
                        <button
                            key={num}
                            onClick={() => setSelectedCard(num)}
                            className={`w-full text-left px-6 py-4 rounded-[2rem] border transition-all ${
                                selectedCard === num 
                                ? 'bg-[#9CCFB3] border-[#9CCFB3] text-gray-900 shadow-sm' 
                                : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                        >
                            *Название карточки {num}*
                        </button>
                    ))}
                     <button className="w-full text-center px-6 py-4 rounded-[2rem] border-2 border-dashed border-gray-300 text-gray-400 hover:bg-gray-50">
                        + Добавить
                    </button>
                </div>

                {/* Форма редактирования */}
                <div className="w-full md:w-3/4 border border-gray-200 rounded-xl p-8 bg-white shadow-sm h-fit">
                    <div className="mb-8">
                        <label className="block text-2xl font-medium text-gray-800 mb-4">Вопрос</label>
                        <textarea 
                            className="w-full h-40 bg-[#D4EAE0] rounded-[2rem] p-6 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9CCFB3] resize-none placeholder-gray-500"
                            placeholder="Введите вопрос..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-2xl font-medium text-gray-800 mb-4">Ответ</label>
                        <textarea 
                            className="w-full h-40 bg-[#D4EAE0] rounded-[2rem] p-6 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9CCFB3] resize-none placeholder-gray-500"
                            placeholder="Введите ответ..."
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardEdit;