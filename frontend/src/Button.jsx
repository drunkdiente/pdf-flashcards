import React, { useState } from 'react';
import { BookOpen, User, ArrowLeft, ArrowRight } from 'lucide-react';

const Button = ({ children, variant = 'primary', className = '', onClick }) => {
  const baseStyle = "px-6 py-2 rounded-full font-medium transition-colors duration-200 flex items-center justify-center";
  const variants = {
    primary: "bg-[#A5D6BA] hover:bg-[#8FCFA8] text-gray-800", // Мятный
    secondary: "bg-gray-400 hover:bg-gray-500 text-white",    // Серый (как 'Назад')
    outline: "bg-transparent border-2 border-[#A5D6BA] text-gray-700 hover:bg-[#F0FDF4]",
    ghost: "bg-[#A5D6BA] bg-opacity-50 hover:bg-opacity-70 text-gray-800" // Полупрозрачный
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;