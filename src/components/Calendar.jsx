import React, { useState, useEffect, useRef } from 'react';
import './Calendar.css';

export const Calendar = ({ value, onChange, placeholder = "Select date", isOpen, onOpen, onClose, minDate, maxDate }) => {
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

  const isDateDisabled = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (minDate && date < minDate) {
      return true;
    }
    
    if (maxDate && date > maxDate) {
      return true;
    }
    
    return false;
  };

  const handleDateSelect = (day) => {
    if (isDateDisabled(day)) {
      return; // Не позволяем выбирать заблокированные даты
    }
    
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Используем локальное время для избежания проблем с часовыми поясами
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(newDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayStr}`;
    
    onChange(formattedDate);
    if (onClose) onClose();
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    
    // Проверяем, можно ли перейти к предыдущему месяцу
    if (minDate) {
      const firstDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
      if (firstDayOfNewMonth < minDate) {
        return; // Не позволяем переходить к месяцу раньше minDate
      }
    }
    
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    
    // Проверяем, можно ли перейти к следующему месяцу
    if (maxDate) {
      const lastDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
      if (lastDayOfNewMonth > maxDate) {
        return; // Не позволяем переходить к месяцу позже maxDate
      }
    }
    
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    // Используем локальное время для избежания проблем с часовыми поясами
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const dayStr = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayStr}`;
    
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
      const isDisabled = isDateDisabled(day);

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isDisabled ? 'disabled' : ''}`}
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
