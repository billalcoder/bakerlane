import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="mb-4 w-full relative">
      <label
        className="block text-stone-600 text-sm font-semibold mb-2"
        htmlFor={name}
      >
        {label} {required && <span className="text-amber-600">*</span>}
      </label>

      <input
        type={isPassword && showPassword ? "text" : type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border border-stone-300 
          bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 
          focus:ring-amber-500 focus:border-transparent transition 
          placeholder-stone-400
          ${isPassword ? 'pr-11' : ''}
        `}
      />

      {/* 👁 Eye Icon */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute right-3 top-[42px] text-stone-400 hover:text-amber-600"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

export default FormInput;
