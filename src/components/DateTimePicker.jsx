import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const DateTimePickerContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const DateTimeInput = styled.input`
  width: 100%;
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const CalendarDropdown = styled.div`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 12px;
  z-index: 1000;
  width: 260px;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const MonthYear = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
    border-color: #22c55e;
  }
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 6px;
`;

const WeekDay = styled.div`
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  padding: 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 0;
`;

const DayButton = styled.button`
  aspect-ratio: 1;
  border: 1px solid transparent;
  border-radius: 6px;
  background-color: ${({ theme, $isSelected, $isOtherMonth }) => {
    if ($isSelected) return '#22c55e';
    if ($isOtherMonth) return 'transparent';
    return theme.colors.background;
  }};
  color: ${({ theme, $isSelected, $isOtherMonth }) => {
    if ($isSelected) return '#FFFFFF';
    if ($isOtherMonth) return theme.colors.secondary;
    return theme.colors.primary;
  }};
  font-size: 11px;
  font-weight: ${({ $isSelected }) => ($isSelected ? '600' : '500')};
  cursor: ${({ $isOtherMonth }) => ($isOtherMonth ? 'default' : 'pointer')};
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;

  &:hover {
    ${({ $isOtherMonth, $isSelected }) => {
      if ($isOtherMonth) return '';
      if ($isSelected) return 'background-color: #16a34a;';
      return 'background-color: rgba(34, 197, 94, 0.1); border-color: #22c55e; color: #16a34a;';
    }}
  }

  &:active {
    transform: scale(0.95);
  }
`;


const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const DateTimePicker = ({ value, onChange, placeholder = 'Выберите дату' }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      const date = new Date(value);
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return dateTimeString;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${day}.${month}.${year}`;
    } catch (e) {
      return dateTimeString;
    }
  };

  const formatForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00`;
  };

  const handleInputClick = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const top = rect.bottom + 8;
      const left = rect.left + rect.width / 2;
      
      setCalendarPosition({ top, left });
    }
    setIsOpen(!isOpen);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateTimeString = formatForInput(selectedDate);
    onChange({ target: { value: dateTimeString } });
    setIsOpen(false);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const selectedDate = value ? new Date(value) : null;

    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isOtherMonth: true,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();
      days.push({
        day,
        isSelected,
        isOtherMonth: false,
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isOtherMonth: true,
      });
    }

    return days;
  };

  return (
    <DateTimePickerContainer ref={containerRef}>
      <DateTimeInput
        ref={inputRef}
        theme={theme}
        type="text"
        value={formatDateTime(value)}
        onClick={handleInputClick}
        readOnly
        placeholder={placeholder}
      />
      {isOpen && (
        <CalendarDropdown 
          theme={theme} 
          $top={calendarPosition.top} 
          $left={calendarPosition.left}
        >
          <CalendarHeader>
            <NavButton theme={theme} onClick={handlePrevMonth}>
              <HiChevronLeft size={16} />
            </NavButton>
            <MonthYear theme={theme}>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </MonthYear>
            <NavButton theme={theme} onClick={handleNextMonth}>
              <HiChevronRight size={16} />
            </NavButton>
          </CalendarHeader>
          <WeekDays>
            {weekDays.map((day) => (
              <WeekDay key={day} theme={theme}>
                {day}
              </WeekDay>
            ))}
          </WeekDays>
          <CalendarGrid>
            {renderCalendar().map((item, index) => (
              <DayButton
                key={index}
                theme={theme}
                $isSelected={item.isSelected}
                $isOtherMonth={item.isOtherMonth}
                onClick={() => !item.isOtherMonth && handleDayClick(item.day)}
              >
                {item.day}
              </DayButton>
            ))}
          </CalendarGrid>
        </CalendarDropdown>
      )}
    </DateTimePickerContainer>
  );
};

