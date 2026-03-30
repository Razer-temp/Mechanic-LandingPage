'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface DatePickerProps {
  name: string;
  id: string;
  required?: boolean;
  defaultValue?: string; // YYYY-MM-DD
  min?: string;          // YYYY-MM-DD
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDisplay(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function DatePicker({ name, id, required, defaultValue, min }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDate = min ? parseDate(min) : today;
  const initialDate = defaultValue ? parseDate(defaultValue) : today;

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLButtonElement>(null);

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
    }, 200);
  }, []);

  const handleOpen = () => {
    if (isOpen) {
      handleClose();
      return;
    }
    // Ensure view month shows the selected date
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
    setIsOpen(true);
  };

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    handleClose();
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  // Check if prev month button should be disabled
  const isPrevDisabled = viewYear < minDate.getFullYear() || 
    (viewYear === minDate.getFullYear() && viewMonth <= minDate.getMonth());

  // Build calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  // getDay() returns 0=Sun. We want Monday=0, so shift
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay < 0) startDay = 6; // Sunday becomes 6

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];

  // Previous month's trailing days
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(viewYear, viewMonth - 1, daysInPrevMonth - i);
    cells.push({ date: d, inMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(viewYear, viewMonth, i), inMonth: true });
  }

  // Next month leading days to fill 6 rows or complete last row
  const remaining = 42 - cells.length; // 6 rows × 7 = 42
  for (let i = 1; i <= remaining; i++) {
    cells.push({ date: new Date(viewYear, viewMonth + 1, i), inMonth: false });
  }

  // If only 5 rows are needed (35 cells), trim
  const totalRows = Math.ceil(cells.length / 7);
  const trimmedCells = totalRows > 6 ? cells.slice(0, 42) : cells.slice(0, Math.max(35, cells.length));

  return (
    <div className="datepicker-container" ref={containerRef}>
      {/* Hidden native input for form submission */}
      <input
        type="hidden"
        name={name}
        value={formatISO(selectedDate)}
      />

      {/* Visual trigger button */}
      <button
        type="button"
        ref={inputRef}
        id={id}
        className={`datepicker-trigger ${isOpen ? 'datepicker-trigger--active' : ''}`}
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Calendar className="datepicker-trigger-icon" />
        <span className="datepicker-trigger-text">{formatDisplay(selectedDate)}</span>
        <ChevronRight className={`datepicker-trigger-chevron ${isOpen ? 'datepicker-trigger-chevron--open' : ''}`} />
      </button>

      {/* Calendar dropdown */}
      {isOpen && (
        <div className={`datepicker-dropdown ${closing ? 'datepicker-dropdown--closing' : ''}`} role="dialog" aria-label="Choose date">
          {/* Header */}
          <div className="datepicker-header">
            <button
              type="button"
              className="datepicker-nav-btn"
              onClick={prevMonth}
              disabled={isPrevDisabled}
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="datepicker-month-label"
              onClick={goToday}
              title="Go to today"
            >
              {MONTHS[viewMonth]} {viewYear}
            </button>
            <button
              type="button"
              className="datepicker-nav-btn"
              onClick={nextMonth}
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day names */}
          <div className="datepicker-weekdays">
            {DAYS_SHORT.map(d => (
              <div key={d} className={`datepicker-weekday ${d === 'Sun' ? 'datepicker-weekday--sun' : ''}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="datepicker-grid">
            {trimmedCells.map((cell, i) => {
              const isPast = cell.date < minDate && !isSameDay(cell.date, minDate);
              const isToday = isSameDay(cell.date, today);
              const isSelected = isSameDay(cell.date, selectedDate);
              const isSunday = cell.date.getDay() === 0;
              const disabled = isPast || !cell.inMonth;

              return (
                <button
                  key={i}
                  type="button"
                  className={[
                    'datepicker-day',
                    !cell.inMonth ? 'datepicker-day--outside' : '',
                    isPast && cell.inMonth ? 'datepicker-day--past' : '',
                    isToday ? 'datepicker-day--today' : '',
                    isSelected ? 'datepicker-day--selected' : '',
                    isSunday && cell.inMonth && !isPast ? 'datepicker-day--sunday' : '',
                  ].filter(Boolean).join(' ')}
                  disabled={disabled}
                  onClick={() => !disabled && handleSelect(cell.date)}
                  aria-label={`${cell.date.toDateString()}${isToday ? ' (today)' : ''}${isSunday ? ' (limited hours)' : ''}`}
                  tabIndex={disabled ? -1 : 0}
                >
                  <span className="datepicker-day-num">{cell.date.getDate()}</span>
                  {isToday && !isSelected && <span className="datepicker-day-dot" />}
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="datepicker-footer">
            <span className="datepicker-footer-hint">
              <span className="datepicker-footer-dot datepicker-footer-dot--today" />
              Today
            </span>
            <span className="datepicker-footer-hint">
              <span className="datepicker-footer-dot datepicker-footer-dot--sunday" />
              Limited hours
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
