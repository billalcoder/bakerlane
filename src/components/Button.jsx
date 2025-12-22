import React from 'react';

const Button = ({ text, type = "button", disabled, onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 px-6 rounded-lg font-bold text-white shadow-md transition-all duration-300 
        ${disabled 
          ? 'bg-stone-400 cursor-not-allowed' 
          : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:shadow-lg transform hover:-translate-y-0.5'
        }`}
    >
      {disabled ? 'Processing...' : text}
    </button>
  );
};

export default Button;