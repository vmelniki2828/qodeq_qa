import React, { useState, useEffect, useRef } from 'react';
import './Calendar.css';

export const Calendar = ({ value, onChange, placeholder = "Select date", isOpen, onOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [position, setPosition] = useState({ top: true, left: true });
  const calendarRef = useRef(null);
  
  const selectedDate = value ? new Date(value) : null;

  // Вычисление позиции календаря
  const calculatePosition = () => {
    if (isOpen && calendarRef.current) {
      const rect = calendarRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isMobile = viewportWidth <= 768;
      
      const calendarWidth = isMobile ? 320 : 350;
      const calendarHeight = isMobile ? 350 : 400;
      
      const newPosition = {
        top: isMobile ? false : rect.bottom + calendarHeight <= viewportHeight,
        left: rect.left + calendarWidth <= viewportWidth
      };
      
      setPosition(newPosition);
    }
  };

  useEffect(() => {
    calculatePosition();
  }, [isOpen]);

  // Пересчет позиции при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      calculatePosition();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Закрытие календаря при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && isOpen) {
        if (onClose) onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const formatDate = (date) => {
    if (!date) return placeholder;
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const formattedDate = newDate.toISOString().split('T')[0];
    onChange(formattedDate);
    if (onClose) onClose();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    onChange(formattedDate);
    if (onClose) onClose();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Пустые ячейки для начала месяца
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() && 
        selectedDate.getFullYear() === currentDate.getFullYear();
      
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="calendar-container" ref={calendarRef}>
      <div 
        className="calendar-input"
        onClick={() => {
          if (isOpen) {
            if (onClose) onClose();
          } else {
            if (onOpen) onOpen();
          }
        }}
      >
        <span className="calendar-value">
          {formatDate(selectedDate)}
        </span>
        <span className="calendar-icon">📅</span>
      </div>
      
      {isOpen && (
        <div className={`calendar-dropdown ${!position.top ? 'position-top' : ''} ${!position.left ? 'position-right' : 'position-left'}`}>
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={handlePrevMonth}>
              ‹
            </button>
            <div className="calendar-month-year">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button className="calendar-nav-btn" onClick={handleNextMonth}>
              ›
            </button>
          </div>
          
          <div className="calendar-weekdays">
            {dayNames.map(day => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>
          
          <div className="calendar-days">
            {renderCalendar()}
          </div>
          
          <div className="calendar-footer">
            <button className="calendar-today-btn" onClick={handleToday}>
              Сегодня
            </button>
            <button className="calendar-clear-btn" onClick={() => {
              onChange('');
              if (onClose) onClose();
            }}>
              Очистить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
