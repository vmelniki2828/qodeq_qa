import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { HiCheck, HiXMark } from 'react-icons/hi2';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Функция для получения начала месяца
const getMonthStart = (year, month) => {
  return new Date(year, month, 1);
};

// Функция для получения конца месяца
const getMonthEnd = (year, month) => {
  return new Date(year, month + 1, 0);
};

// Функция для форматирования даты в YYYY-MM-DD
const formatDateForAPI = (date) => {
  // Если это уже строка в формате YYYY-MM-DD, возвращаем как есть
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // Если это объект Date
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Если это строка с датой, пытаемся преобразовать
  if (typeof date === 'string') {
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  
  return date;
};

// Функция для генерации списка месяцев
const generateMonths = () => {
  const months = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Генерируем 12 месяцев назад от текущего
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
    months.push({
      value: `${year}-${String(month + 1).padStart(2, '0')}`,
      label: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      year,
      month
    });
  }
  
  return months;
};

// Функция для получения начального месяца (текущий месяц)
const getInitialMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  return `${year}-${String(month + 1).padStart(2, '0')}`;
};

const formatChatDate = (v) => {
  if (!v) return '—';
  try {
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toLocaleString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (e) { 
    return v; 
  }
};

const PageContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const FilterSelect = styled.select`
  width: auto;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::-ms-expand {
    display: none;
  }

  option {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FiltersContainer = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  background-color: ${({ theme }) => theme.colors.background};
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 150px;
`;

const FilterLabel = styled.label`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Select = styled.select`
  width: 100%;
  min-width: 0;
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
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::-ms-expand {
    display: none;
  }
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }

  ${({ $primary, theme }) =>
    $primary &&
    `
    background-color: ${theme.colors.accent};
    color: #FFFFFF;
    border-color: ${theme.colors.accent};

    &:hover {
      opacity: 0.9;
    }
  `}
`;

const TableContainer = styled.div`
  overflow: visible;
`;

const PaginationWrapper = styled.div`
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const PaginationButton = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme, $active }) => 
    $active ? theme.colors.accent : theme.colors.background};
  color: ${({ theme, $active }) => 
    $active ? '#FFFFFF' : theme.colors.primary};
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: ${({ theme, $active }) =>
      $active 
        ? theme.colors.accent 
        : theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.1)'};
    border-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

const PaginationInfo = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0 8px;
`;

const PaginationEllipsis = styled.span`
  padding: 0 8px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
  user-select: none;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) =>
    theme.colors.surface === '#F9FAFB' ? '#F0F1F3' : theme.colors.surface};
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) =>
    theme.colors.surface === '#F9FAFB' ? '#F0F1F3' : theme.colors.surface};
`;

const TableHeaderRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.15s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f8f8f8' : 'rgba(255,255,255,0.04)'};
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
`;

const ScoreBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  min-width: 36px;
  text-align: center;
  ${({ $level }) =>
    $level === 'good' && 'background: rgba(34, 197, 94, 0.15); color: #16a34a;'}
  ${({ $level }) =>
    $level === 'warn' && 'background: rgba(234, 179, 8, 0.2); color: #ca8a04;'}
  ${({ $level }) =>
    $level === 'bad' && 'background: rgba(239, 68, 68, 0.15); color: #dc2626;'}
  ${({ $level }) =>
    !$level && 'background: rgba(128,128,128,0.15); color: #6b7280;'}
`;

const TagBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  margin-right: 8px;
  margin-bottom: 4px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
`;

const ErrorBlock = styled.div`
  padding: 20px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  color: #dc2626;
  font-size: 14px;
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
`;

const StatsCard = styled.div`
  padding: 20px;
  background-color: ${({ theme }) =>
    theme.colors.surface === '#F9FAFB' ? '#F0F1F3' : theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin-bottom: 20px;
`;

const StatsTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const StatsItem = styled.div`
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
`;

const StatsItemLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 4px;
`;

const StatsItemValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

export const AgentStatisticsPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth());
  const [checked, setChecked] = useState('All');
  const months = generateMonths();
  const hasLoadedRef = useRef(false);
  const previousMonthRef = useRef(null);
  const isFetchingRef = useRef(false);


  const fetchStats = useCallback(async () => {
    if (!id || !selectedMonth) return;
    
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setStatsLoading(true);
    setStatsError(null);
    
    try {
      // Парсим выбранный месяц (формат: YYYY-MM)
      const [year, month] = selectedMonth.split('-').map(Number);
      const monthStart = getMonthStart(year, month - 1);
      const monthEnd = getMonthEnd(year, month - 1);
      
      const formattedStartDate = formatDateForAPI(monthStart);
      const formattedEndDate = formatDateForAPI(monthEnd);
      
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const params = new URLSearchParams();
      params.append('id', id);
      params.append('date_start', formattedStartDate);
      params.append('date_end', formattedEndDate);
      if (checked !== 'All') {
        params.append('checked', checked.toLowerCase());
      }
      
      const url = `https://qa.qodeq.net/api/v1/chat/statistics?${params.toString()}`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers
      });
      
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const json = await res.json();
      setStats(json);
    } catch (e) {
      setStatsError(e.message);
      setStats(null);
      Notify.failure('Ошибка при загрузке статистики агента');
    } finally {
      setStatsLoading(false);
      isFetchingRef.current = false;
    }
  }, [id, selectedMonth, checked]);

  const fetchChats = useCallback(async () => {
    if (!id || !selectedMonth) return;
    
    setLoading(true);
    setError(null);
    try {
      // Парсим выбранный месяц (формат: YYYY-MM)
      const [year, month] = selectedMonth.split('-').map(Number);
      const monthStart = getMonthStart(year, month - 1);
      const monthEnd = getMonthEnd(year, month - 1);
      
      const formattedStartDate = formatDateForAPI(monthStart);
      const formattedEndDate = formatDateForAPI(monthEnd);
      
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const params = new URLSearchParams();
      params.append('id', id);
      params.append('page', currentPage.toString());
      params.append('page_size', pageSize.toString());
      params.append('date_start', formattedStartDate);
      params.append('date_end', formattedEndDate);
      if (checked !== 'All') {
        params.append('checked', checked.toLowerCase());
      }
      
      const url = `https://qa.qodeq.net/api/v1/chat/statistics/chats?${params.toString()}`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers
      });
      
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const json = await res.json();
      
      setChats(Array.isArray(json.chats) ? json.chats : []);
      setPagesCount(json.pages_count || 0);
    } catch (e) {
      setError(e.message);
      setChats([]);
      Notify.failure('Ошибка при загрузке чатов агента');
    } finally {
      setLoading(false);
    }
  }, [id, currentPage, selectedMonth, checked, pageSize]);

  // Автоматическая загрузка данных при монтировании
  useEffect(() => {
    if (id && selectedMonth && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      previousMonthRef.current = selectedMonth;
      fetchStats();
      fetchChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Выполняется только при монтировании

  // Автоматическая загрузка данных при изменении месяца или checked
  useEffect(() => {
    if (id && selectedMonth && hasLoadedRef.current) {
      if (previousMonthRef.current !== selectedMonth) {
        previousMonthRef.current = selectedMonth;
        setCurrentPage(1);
      }
      setCurrentPage(1);
      fetchStats();
      fetchChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, checked]);

  // Автоматическая загрузка данных при изменении pageSize
  useEffect(() => {
    if (id && selectedMonth && hasLoadedRef.current) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  // Автоматическая загрузка данных при изменении страницы или pageSize
  useEffect(() => {
    if (id && selectedMonth && hasLoadedRef.current) {
      fetchChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const getScoreLevel = (score) => {
    if (score === null || score === undefined) return null;
    if (score >= 80) return 'good';
    if (score >= 50) return 'warn';
    return 'bad';
  };

  // Функция для генерации списка страниц с многоточием
  const getPageNumbers = () => {
    const totalPagesNum = Math.max(pagesCount, 1);
    const pages = [];
    const maxVisible = 7; // Максимальное количество видимых страниц
    const sidePages = 2; // Количество страниц с каждой стороны от текущей

    if (totalPagesNum <= maxVisible) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= totalPagesNum; i++) {
        pages.push(i);
      }
    } else {
      // Всегда показываем первую страницу
      pages.push(1);

      let startPage = Math.max(2, currentPage - sidePages);
      let endPage = Math.min(totalPagesNum - 1, currentPage + sidePages);

      // Если текущая страница близко к началу
      if (currentPage <= sidePages + 2) {
        endPage = Math.min(maxVisible - 1, totalPagesNum - 1);
        for (let i = 2; i <= endPage; i++) {
          pages.push(i);
        }
        if (endPage < totalPagesNum - 1) {
          pages.push('ellipsis');
        }
      }
      // Если текущая страница близко к концу
      else if (currentPage >= totalPagesNum - sidePages - 1) {
        if (startPage > 2) {
          pages.push('ellipsis');
        }
        for (let i = Math.max(2, totalPagesNum - maxVisible + 2); i < totalPagesNum; i++) {
          pages.push(i);
        }
      }
      // Если текущая страница в середине
      else {
        if (startPage > 2) {
          pages.push('ellipsis');
        }
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        if (endPage < totalPagesNum - 1) {
          pages.push('ellipsis');
        }
      }

      // Всегда показываем последнюю страницу
      if (totalPagesNum > 1) {
        pages.push(totalPagesNum);
      }
    }

    return pages;
  };

  if (loading && chats.length === 0) {
    return (
      <Layout>
        <ThemeProvider theme={theme}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loader />
          </div>
        </ThemeProvider>
      </Layout>
    );
  }

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <BackButton theme={theme} onClick={() => navigate('/statistics')}>
                ← Назад
              </BackButton>
              <Title theme={theme}>Статистика агента</Title>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <FilterSelect
                theme={theme}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </FilterSelect>
              <FilterSelect
                theme={theme}
                value={checked}
                onChange={(e) => setChecked(e.target.value)}
              >
                <option value="All">All</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </FilterSelect>
            </div>
          </HeaderSection>

          <ContentContainer theme={theme}>
            {statsError && <ErrorBlock>{statsError}</ErrorBlock>}
            {!statsError && stats && stats.aggregate && (
              <StatsCard theme={theme}>
                <StatsTitle theme={theme}>
                  {stats.agents && stats.agents.length > 0 && stats.agents[0] ? (
                    <>
                      {stats.agents[0].agents_name || '—'} / {stats.agents[0].head || '—'}
                    </>
                  ) : (
                    'Общая статистика'
                  )}
                </StatsTitle>
                <StatsGrid>
                  {stats.agents && stats.agents.length > 0 && stats.agents[0] && (
                    <>
                      <StatsItem theme={theme}>
                        <StatsItemLabel theme={theme}>Оценка</StatsItemLabel>
                        <StatsItemValue theme={theme}>
                          {stats.agents[0].grade !== null && stats.agents[0].grade !== undefined ? (
                            <ScoreBadge $level={getScoreLevel(stats.agents[0].grade)}>
                              {stats.agents[0].grade}
                            </ScoreBadge>
                          ) : (
                            '—'
                          )}
                        </StatsItemValue>
                      </StatsItem>
                      <StatsItem theme={theme}>
                        <StatsItemLabel theme={theme}>Всего чатов</StatsItemLabel>
                        <StatsItemValue theme={theme}>
                          {stats.agents[0].total_chats || 0}
                        </StatsItemValue>
                      </StatsItem>
                      <StatsItem theme={theme}>
                        <StatsItemLabel theme={theme}>Проверено</StatsItemLabel>
                        <StatsItemValue theme={theme}>
                          {stats.agents[0].total_checked || 0}
                        </StatsItemValue>
                      </StatsItem>
                    </>
                  )}
                  <StatsItem theme={theme}>
                    <StatsItemLabel theme={theme}>Средний балл</StatsItemLabel>
                    <StatsItemValue theme={theme}>
                      {stats.aggregate.average_score !== null && stats.aggregate.average_score !== undefined
                        ? stats.aggregate.average_score.toFixed(1)
                        : '—'}
                    </StatsItemValue>
                  </StatsItem>
                  <StatsItem theme={theme}>
                    <StatsItemLabel theme={theme}>Количество ошибок</StatsItemLabel>
                    <StatsItemValue theme={theme}>
                      {stats.aggregate.count_errors || 0}
                    </StatsItemValue>
                  </StatsItem>
                </StatsGrid>

                {stats.aggregate.top_questions && stats.aggregate.top_questions.length > 0 && (
                  <>
                    <StatsTitle theme={theme} style={{ marginTop: '24px' }}>
                      Топ вопросов с нарушениями
                    </StatsTitle>
                    <Table theme={theme}>
                      <TableHeader theme={theme}>
                        <TableHeaderRow>
                          <TableHeaderCell theme={theme}>Вопрос</TableHeaderCell>
                          <TableHeaderCell theme={theme}>Нарушений</TableHeaderCell>
                        </TableHeaderRow>
                      </TableHeader>
                      <TableBody>
                        {stats.aggregate.top_questions.map((question, idx) => (
                          <TableRow key={question.id || idx} theme={theme}>
                            <TableCell theme={theme}>{question.text || '—'}</TableCell>
                            <TableCell theme={theme}>{question.violations || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}

                {stats.aggregate.top_tags && stats.aggregate.top_tags.length > 0 && (
                  <>
                    <StatsTitle theme={theme} style={{ marginTop: '24px' }}>
                      Топ тегов
                    </StatsTitle>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {stats.aggregate.top_tags.map((tag, idx) => (
                        <TagBadge
                          key={idx}
                          theme={theme}
                          $color={tag.color || 'rgba(0,0,0,0.08)'}
                        >
                          {tag.tag} ({tag.count})
                        </TagBadge>
                      ))}
                    </div>
                  </>
                )}
              </StatsCard>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '0 4px' }}>
              <span style={{ fontSize: '14px', color: theme.colors.secondary }}>На странице:</span>
              <FilterSelect
                theme={theme}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
                style={{ minWidth: '80px', width: 'auto' }}
              >
                <option value="2">2</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const value = 5 + i * 5;
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </FilterSelect>
            </div>
            <TableContainer theme={theme}>
              {error && <ErrorBlock>{error}</ErrorBlock>}
              {!error && (
                <>
                  {chats.length > 0 ? (
                    <>
                      <Table theme={theme}>
                        <TableHeader theme={theme}>
                          <TableHeaderRow>
                            <TableHeaderCell theme={theme}>Chat ID</TableHeaderCell>
                            <TableHeaderCell theme={theme}>Thread ID</TableHeaderCell>
                            <TableHeaderCell theme={theme}>User Type</TableHeaderCell>
                            <TableHeaderCell theme={theme}>Checked</TableHeaderCell>
                            <TableHeaderCell theme={theme}>Score</TableHeaderCell>
                            <TableHeaderCell theme={theme}>Created At</TableHeaderCell>
                            <TableHeaderCell theme={theme}>Duration</TableHeaderCell>
                            <TableHeaderCell theme={theme}>Project</TableHeaderCell>
                            <TableHeaderCell theme={theme}>Username</TableHeaderCell>
                          </TableHeaderRow>
                        </TableHeader>
                        <TableBody>
                          {chats.map((chat) => (
                            <TableRow 
                              key={chat.id} 
                              theme={theme}
                              onClick={() => navigate(`/chats/${chat.id}`)}
                            >
                              <TableCell theme={theme}>{chat.chat_id || '—'}</TableCell>
                              <TableCell theme={theme}>{chat.thread_id || '—'}</TableCell>
                              <TableCell theme={theme}>{chat.user_type || '—'}</TableCell>
                              <TableCell theme={theme}>
                                {chat.checked ? (
                                  <HiCheck size={18} style={{ color: '#16a34a' }} />
                                ) : (
                                  <HiXMark size={18} style={{ color: '#dc2626' }} />
                                )}
                              </TableCell>
                              <TableCell theme={theme}>
                                {chat.score !== null && chat.score !== undefined ? (
                                  <ScoreBadge $level={getScoreLevel(chat.score)}>
                                    {chat.score}
                                  </ScoreBadge>
                                ) : (
                                  '—'
                                )}
                              </TableCell>
                              <TableCell theme={theme}>
                                {formatChatDate(chat.created_chat_at)}
                              </TableCell>
                              <TableCell theme={theme}>{chat.chat_duration || '—'}</TableCell>
                              <TableCell theme={theme}>{chat.project_title || '—'}</TableCell>
                              <TableCell theme={theme}>
                                {Array.isArray(chat.username) ? chat.username.join(', ') : (chat.username || '—')}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </>
                  ) : (
                    <EmptyState theme={theme}>Нет чатов</EmptyState>
                  )}
                </>
              )}
            </TableContainer>
            <PaginationWrapper theme={theme}>
              <PaginationButton
                theme={theme}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                title="Первая страница"
              >
                ««
              </PaginationButton>
              <PaginationButton
                theme={theme}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                title="Предыдущая страница"
              >
                ‹
              </PaginationButton>
              {getPageNumbers().map((page, index) => {
                if (page === 'ellipsis') {
                  return (
                    <PaginationEllipsis key={`ellipsis-${index}`} theme={theme}>
                      ...
                    </PaginationEllipsis>
                  );
                }
                return (
                  <PaginationButton
                    key={page}
                    theme={theme}
                    $active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationButton>
                );
              })}
              <PaginationButton
                theme={theme}
                disabled={currentPage >= Math.max(pagesCount, 1)}
                onClick={() => setCurrentPage(currentPage + 1)}
                title="Следующая страница"
              >
                ›
              </PaginationButton>
              <PaginationButton
                theme={theme}
                disabled={currentPage >= Math.max(pagesCount, 1)}
                onClick={() => setCurrentPage(Math.max(pagesCount, 1))}
                title="Последняя страница"
              >
                »»
              </PaginationButton>
            </PaginationWrapper>
          </ContentContainer>
        </PageContent>
      </ThemeProvider>
    </Layout>
  );
};

