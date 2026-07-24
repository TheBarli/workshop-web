import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  id,
  name,
  className = '',
  autoComplete,
  icon: Icon = Lock,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      {Icon && (
        <Icon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
      )}
      <input
        {...props}
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full rounded-xl border border-slate-300 bg-slate-50 ${
          Icon ? 'pl-10' : 'pl-3.5'
        } pr-10 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-[#eb6905] focus:outline-none transition-colors ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-2.5 rounded-lg p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none"
        title={showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-slate-500" />
        ) : (
          <Eye className="h-4 w-4 text-slate-400" />
        )}
      </button>
    </div>
  );
}
