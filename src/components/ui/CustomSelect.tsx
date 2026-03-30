'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  label: string;
  name: string;
  id?: string;
  required?: boolean;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
}

export function CustomSelect({
  label,
  name,
  id,
  required,
  options,
  value: controlledValue,
  defaultValue = '',
  onChange,
  icon,
  placeholder = 'Select...',
}: CustomSelectProps) {
  const [selectedValue, setSelectedValue] = useState(controlledValue ?? defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sync controlled value
  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedValue(controlledValue);
    }
  }, [controlledValue]);

  const selectedOption = options.find(o => o.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  const hasValue = !!selectedValue;

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setClosing(false);
      setFocusedIndex(-1);
    }, 180);
  }, []);

  const handleOpen = () => {
    if (isOpen) {
      handleClose();
      return;
    }
    setIsOpen(true);
    // Set focused index to current selection
    const idx = options.findIndex(o => o.value === selectedValue);
    setFocusedIndex(idx >= 0 ? idx : 0);
  };

  const handleSelect = (option: SelectOption) => {
    setSelectedValue(option.value);
    onChange?.(option.value);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleOpen();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelect(options[focusedIndex]);
        }
        break;
    }
  };

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('.cs-option');
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  return (
    <div className="cs-container" ref={containerRef}>
      {/* Hidden native input for form submission */}
      <input type="hidden" name={name} value={selectedValue} />

      {/* Trigger */}
      <button
        type="button"
        id={id}
        className={[
          'cs-trigger',
          isOpen ? 'cs-trigger--active' : '',
          hasValue ? 'cs-trigger--filled' : '',
        ].filter(Boolean).join(' ')}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
      >
        {icon && <span className="cs-trigger-icon">{icon}</span>}
        <div className="cs-trigger-content">
          <span className={`cs-label ${hasValue || isOpen ? 'cs-label--float' : ''}`}>
            {label}{required && ' *'}
          </span>
          {(hasValue || isOpen) && (
            <span className="cs-display-text">{displayText}</span>
          )}
        </div>
        <ChevronDown className={`cs-chevron ${isOpen ? 'cs-chevron--open' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`cs-dropdown ${closing ? 'cs-dropdown--closing' : ''}`}
          role="listbox"
          ref={listRef}
          aria-label={label}
        >
          {options.map((option, i) => {
            const isSelected = option.value === selectedValue;
            const isFocused = i === focusedIndex;
            return (
              <button
                key={option.value}
                type="button"
                className={[
                  'cs-option',
                  isSelected ? 'cs-option--selected' : '',
                  isFocused ? 'cs-option--focused' : '',
                ].filter(Boolean).join(' ')}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setFocusedIndex(i)}
              >
                {option.icon && <span className="cs-option-icon">{option.icon}</span>}
                <span className="cs-option-label">{option.label}</span>
                {isSelected && <Check className="cs-option-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
