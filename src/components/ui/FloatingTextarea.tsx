'use client';

import React, { useState, useRef, useId } from 'react';

interface FloatingTextareaProps {
  label: string;
  name: string;
  id?: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  icon?: React.ReactNode;
}

export function FloatingTextarea({
  label,
  name,
  id,
  rows = 3,
  placeholder,
  required,
  value,
  defaultValue,
  onChange,
  icon,
}: FloatingTextareaProps) {
  const fallbackId = useId();
  const textareaId = id || fallbackId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [hasValue, setHasValue] = useState(!!value || !!defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0);
    onChange?.(e);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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
      onClick={() => textareaRef.current?.focus()}
    >
      {icon && (
        <span className="fi-icon fi-icon--textarea">{icon}</span>
      )}
      <div className="fi-container fi-container--textarea">
        <div className="fi-field">
          <label
            htmlFor={textareaId}
            className={`fi-label ${isFloating ? 'fi-label--float' : ''}`}
          >
            {label}{required && ' *'}
          </label>
          <textarea
            ref={textareaRef}
            name={name}
            id={textareaId}
            className="fi-input fi-textarea"
            rows={rows}
            required={required}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isFloating ? placeholder : ''}
          />
        </div>
      </div>
    </div>
  );
}
