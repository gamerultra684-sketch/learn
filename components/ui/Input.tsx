import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  wrapperClass?: string;
}

export default function Input({
  label, error, icon, rightElement,
  wrapperClass = '', className = '', id, ...props
}: InputProps) {
  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={id} className="auth-label">
          {label}
        </label>
      )}
      <div className="relative auth-field">
        {icon && <span className="auth-icon">{icon}</span>}
        <input
          id={id}
          className={`auth-input ${icon ? '' : '!pl-[14px]'} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
