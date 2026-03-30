'use client';

import React, { useState, useRef, useId } from 'react';

interface FloatingInputProps {
  label: string;
  name: string;
  id?: string;
  type?: 'text' | 'tel' | 'email' | 'number';
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  pattern?: string;
  title?: string;
  autoComplete?: string;
}

export function FloatingInput({
  label,
  name,
  id,
  type = 'text',
  placeholder,
  required,
  value,
  defaultValue,
  onChange,
  icon,
  pattern,
  title,
  autoComplete,
}: FloatingInputProps) {
  const fallbackId = useId();
  const inputId = id || fallbackId;
  const inputRef = useRef<HTMLInputElement>(null);

  const [hasValue, setHasValue] = useState(!!value || !!defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    onChange?.(e);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
  };

  const isFloating = isFocused || hasValue;

  return (
    <div
      className={[
        'fi-wrapper',
        isFocused ? 'fi-wrapper--focused' : '',
        hasValue ? 'fi-wrapper--filled' : '',
      ].filter(Boolean).join(' ')}
      onClick={() => inputRef.current?.focus()}
    >
      {icon && (
        <span className="fi-icon">{icon}</span>
      )}
      <div className="fi-container">
        <div className="fi-field">
          <label
            htmlFor={inputId}
            className={`fi-label ${isFloating ? 'fi-label--float' : ''}`}
          >
            {label}{required && ' *'}
          </label>
          <input
            ref={inputRef}
            type={type}
            name={name}
            id={inputId}
            className="fi-input"
            required={required}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isFloating ? placeholder : ''}
            pattern={pattern}
            title={title}
            autoComplete={autoComplete}
          />
        </div>
      </div>
    </div>
  );
}
