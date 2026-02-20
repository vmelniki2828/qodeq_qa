import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { HiChevronUp, HiChevronDown } from 'react-icons/hi2';

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

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonsGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 180px;
`;

const FilterLabel = styled.label`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

const Input = styled.input`
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

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
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

  option {
    width: 100%;
    max-width: 100%;
  }
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

const StatsCard = styled.div`
  padding: 20px;
  background-color: ${({ theme }) =>
    theme.colors.surface === '#F9FAFB' ? '#F0F1F3' : theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
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
  text-align: ${({ $align }) => $align || 'left'};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  ${({ $sortable }) => $sortable && `cursor: pointer; user-select: none;`}
  ${({ $sortable }) => $sortable && `&:hover { opacity: 0.85; }`}
`;

const SortIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  vertical-align: middle;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f8f8f8' : 'rgba(255,255,255,0.04)'};
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: ${({ $align }) => $align || 'left'};
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

const AgentNameCell = styled(TableCell)`
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    opacity: 0.8;
  }
`;

const PageSizeWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  margin-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const PageSizeLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-right: 8px;
`;

const PageSizeSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  margin-right: 12px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const StatisticsPage = () => {
  const { theme } = useTheme();
  const { department, role, profile } = useUserProfile();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth());
  const [checked, setChecked] = useState('All');
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [qaGroups, setQAGroups] = useState([]);
  const [selectedQAGroupId, setSelectedQAGroupId] = useState('');
  const [loadingQAGroups, setLoadingQAGroups] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const months = generateMonths();

  const handleAgentSort = (key) => {
    if (sortBy === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const getSortableValue = (v) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'boolean') return v ? 1 : 0;
    if (typeof v === 'number') return v;
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  };
  const hasLoadedRef = useRef(false);
  const previousMonthRef = useRef(null);
  const isFetchingRef = useRef(false);

  // Запрос /me при монтировании, чтобы сразу получить роль (и id для агента)
  const ME_URL = 'https://qa.qodeq.net/api/v1/profile/user/me';
  const [meProfile, setMeProfile] = useState(null);
  const [meLoading, setMeLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    const fetchMe = async () => {
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(ME_URL, { method: 'GET', headers });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setMeProfile(data);
      } catch (e) {
        if (!cancelled) setMeProfile(null);
      } finally {
        if (!cancelled) setMeLoading(false);
      }
    };
    fetchMe();
    return () => { cancelled = true; };
  }, []);

  const effectiveProfile = meProfile ?? profile;
  const effectiveRole = effectiveProfile?.role ?? role;
  const agentId = effectiveProfile?.id ?? effectiveProfile?.agent_id ?? null;
  const skipStatisticsId = effectiveRole === 'agent';

  // Редирект для роли agent на страницу своей статистики
  useEffect(() => {
    if (agentId && effectiveRole === 'agent') {
      navigate(`/statistics/agent/${agentId}`, { replace: true });
    }
  }, [agentId, effectiveRole, navigate]);

  const fetchStats = async () => {
    if (!selectedMonth) {
      Notify.warning('Пожалуйста, выберите месяц');
      return;
    }

    // Предотвращаем множественные одновременные запросы
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
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
      params.append('date_start', formattedStartDate);
      params.append('date_end', formattedEndDate);
      if (checked !== 'All') {
        params.append('checked', checked.toLowerCase());
      }
      // Используем только одну группу: либо Support, либо QA
      if (selectedGroupId) {
        params.append('support_group_id', selectedGroupId);
      } else if (selectedQAGroupId) {
        params.append('qa_group_id', selectedQAGroupId);
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
      setError(e.message);
      setStats(null);
      Notify.failure('Ошибка при загрузке статистики');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Автоматическая загрузка данных при монтировании
  useEffect(() => {
    if (selectedMonth && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      previousMonthRef.current = selectedMonth;
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Выполняется только при монтировании

  // Автоматическая загрузка данных при изменении месяца
  useEffect(() => {
    if (selectedMonth && hasLoadedRef.current && previousMonthRef.current !== selectedMonth) {
      previousMonthRef.current = selectedMonth;
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  // Автоматическая загрузка данных при изменении checked
  useEffect(() => {
    if (hasLoadedRef.current) {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  // Автоматическая загрузка данных при изменении selectedGroupId
  useEffect(() => {
    if (hasLoadedRef.current) {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupId]);

  // Автоматическая загрузка данных при изменении selectedQAGroupId
  useEffect(() => {
    if (hasLoadedRef.current) {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQAGroupId]);

  // Загрузка групп для HEAD и TEAM LEAD (Support)
  useEffect(() => {
    const fetchGroups = async () => {
      if (role !== 'head' && role !== 'team_lead') {
        return;
      }
      
      setLoadingGroups(true);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch('https://qa.qodeq.net/api/v1/group/support/', {
          method: 'GET',
          headers
        });
        
        if (!res.ok) {
          throw new Error(`Ошибка ${res.status}`);
        }
        
        const json = await res.json();
        // Если данные - массив объектов с teamlead и groups, извлекаем все группы
        if (Array.isArray(json)) {
          const allGroups = [];
          json.forEach((teamleadItem) => {
            if (teamleadItem?.groups && Array.isArray(teamleadItem.groups)) {
              teamleadItem.groups.forEach((group) => {
                if (group?.id) {
                  allGroups.push({
                    id: group.id,
                    name: group.supervisor_username || `Группа ${group.id}`
                  });
                }
              });
            }
          });
          setGroups(allGroups);
        } else {
          setGroups([]);
        }
      } catch (e) {
        console.error('Ошибка при загрузке групп:', e);
        setGroups([]);
      } finally {
        setLoadingGroups(false);
      }
    };
    
    fetchGroups();
  }, [role]);

  // Загрузка QA групп для QA TEAM LEAD, HEAD, ADMIN
  useEffect(() => {
    const fetchQAGroups = async () => {
      if (department !== 'quality_assurance' || (role !== 'team_lead' && role !== 'head' && role !== 'admin')) {
        return;
      }
      
      if (!selectedMonth) {
        return;
      }

      setLoadingQAGroups(true);
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
        
        const url = `https://qa.qodeq.net/api/v1/group/qa/?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
        const res = await fetch(url, {
          method: 'GET',
          headers
        });
        
        if (!res.ok) {
          throw new Error(`Ошибка ${res.status}`);
        }
        
        const json = await res.json();
        // Обрабатываем ответ API
        if (Array.isArray(json)) {
          const allGroups = json.map((group) => ({
            id: group.id,
            name: group.name || `Группа ${group.id}`
          }));
          setQAGroups(allGroups);
        } else {
          setQAGroups([]);
        }
      } catch (e) {
        console.error('Ошибка при загрузке QA групп:', e);
        setQAGroups([]);
      } finally {
        setLoadingQAGroups(false);
      }
    };
    
    fetchQAGroups();
  }, [selectedMonth, role, department]);


  const getScoreLevel = (score) => {
    if (score >= 80) return 'good';
    if (score >= 50) return 'warn';
    return 'bad';
  };

  // Сброс страницы и сортировки при изменении данных
  useEffect(() => {
    setCurrentPage(1);
    setSortBy(null);
    setSortOrder('asc');
  }, [stats]);

  // Для роли agent: пока загружается /me — лоадер; есть agentId — редирект в useEffect (кратко лоадер); нет agentId — сообщение
  if (effectiveRole === 'agent') {
    if (meLoading && !effectiveProfile) {
      return (
        <Layout>
          <ThemeProvider theme={theme}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Loader />
            </div>
          </ThemeProvider>
        </Layout>
      );
    }
    if (!agentId) {
      return (
        <Layout>
          <ThemeProvider theme={theme}>
            <PageContent>
              <HeaderSection theme={theme}>
                <Title theme={theme}>Statistics</Title>
              </HeaderSection>
              <div style={{ padding: 24, textAlign: 'center', color: theme.colors.secondary }}>
                Не удалось определить ID агента для отображения статистики.
              </div>
            </PageContent>
          </ThemeProvider>
        </Layout>
      );
    }
    return (
      <Layout>
        <ThemeProvider theme={theme}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Loader />
          </div>
        </ThemeProvider>
      </Layout>
    );
  }

  if (loading) {
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
            <Title theme={theme}>Statistics</Title>
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
                <option value="All">Все</option>
                <option value="True">Проверенные</option>
                <option value="False">Не проверенные</option>
              </FilterSelect>
              {(role === 'head' || role === 'team_lead') && (
                <FilterSelect
                  theme={theme}
                  value={selectedGroupId}
                  onChange={(e) => {
                    setSelectedGroupId(e.target.value);
                    // Сбрасываем QA группу при выборе Support группы
                    if (e.target.value) {
                      setSelectedQAGroupId('');
                    }
                  }}
                  disabled={loadingGroups}
                >
                  <option value="">Все группы</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </FilterSelect>
              )}
              {department === 'quality_assurance' && (role === 'team_lead' || role === 'head' || role === 'admin') && (
                <FilterSelect
                  theme={theme}
                  value={selectedQAGroupId}
                  onChange={(e) => {
                    setSelectedQAGroupId(e.target.value);
                    // Сбрасываем Support группу при выборе QA группы
                    if (e.target.value) {
                      setSelectedGroupId('');
                    }
                  }}
                  disabled={loadingQAGroups}
                >
                  <option value="">Все QA группы</option>
                  {qaGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </FilterSelect>
              )}
            </div>
          </HeaderSection>


          <ContentContainer theme={theme}>
            {error && <ErrorBlock>{error}</ErrorBlock>}
            {!error && stats && (
              <>
                {stats.aggregate && (
                  <StatsCard theme={theme}>
                    <StatsTitle theme={theme}>Общая статистика</StatsTitle>
                    <StatsGrid>
                      <StatsItem theme={theme}>
                        <StatsItemLabel theme={theme}>Всего чатов</StatsItemLabel>
                        <StatsItemValue theme={theme}>
                          {stats.aggregate.count_chats || 0}
                        </StatsItemValue>
                      </StatsItem>
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

                {stats.agents && stats.agents.length > 0 && (() => {
                  const sortedAgents = [...stats.agents].sort((a, b) => {
                    if (!sortBy) return 0;
                    const va = getSortableValue(a[sortBy]);
                    const vb = getSortableValue(b[sortBy]);
                    const cmp = typeof va === 'number' && typeof vb === 'number'
                      ? va - vb
                      : String(va).localeCompare(String(vb), undefined, { numeric: true });
                    return sortOrder === 'asc' ? cmp : -cmp;
                  });
                  
                  const totalAgents = sortedAgents.length;
                  const totalPages = Math.ceil(totalAgents / pageSize) || 1;
                  const startIndex = (currentPage - 1) * pageSize;
                  const endIndex = startIndex + pageSize;
                  const paginatedAgents = sortedAgents.slice(startIndex, endIndex);

                  const columns = [
                    { key: 'agents_name', label: 'Имя агента' },
                    { key: 'head', label: 'Руководитель' },
                    { key: 'total_chats', label: 'Всего чатов' },
                    { key: 'total_checked', label: 'Проверено' },
                    { key: 'grade', label: 'Оценка' },
                  ];
                  
                  return (
                    <StatsCard theme={theme}>
                      <StatsTitle theme={theme}>Статистика по агентам</StatsTitle>
                      <Table theme={theme}>
                        <TableHeader theme={theme}>
                          <TableHeaderRow>
                            {columns.map((col) => (
                              <TableHeaderCell
                                key={col.key}
                                theme={theme}
                                $sortable
                                $align="center"
                                onClick={() => handleAgentSort(col.key)}
                              >
                                {col.label}
                                {sortBy === col.key && (
                                  <SortIconWrap>
                                    {sortOrder === 'asc' ? <HiChevronUp size={14} /> : <HiChevronDown size={14} />}
                                  </SortIconWrap>
                                )}
                              </TableHeaderCell>
                            ))}
                          </TableHeaderRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedAgents.map((agent, idx) => (
                            <TableRow key={agent.agents_id || idx} theme={theme}>
                              <AgentNameCell 
                                theme={theme}
                                $align="center"
                                onClick={() => navigate(`/statistics/agent/${agent.agents_id}`)}
                              >
                                {agent.agents_name || '—'}
                              </AgentNameCell>
                              <TableCell theme={theme} $align="center">{agent.head || '—'}</TableCell>
                              <TableCell theme={theme} $align="center">{agent.total_chats || 0}</TableCell>
                              <TableCell theme={theme} $align="center">{agent.total_checked || 0}</TableCell>
                              <TableCell theme={theme} $align="center">
                                {agent.grade !== null && agent.grade !== undefined ? (
                                  <ScoreBadge $level={getScoreLevel(agent.grade)}>
                                    {agent.grade}
                                  </ScoreBadge>
                                ) : (
                                  '—'
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <PageSizeWrapper theme={theme}>
                        <PageSizeLabel theme={theme}>Записей на странице:</PageSizeLabel>
                        <PageSizeSelect
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </PageSizeSelect>
                      </PageSizeWrapper>
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalAgents}
                        onPageChange={setCurrentPage}
                        itemsPerPage={pageSize}
                      />
                    </StatsCard>
                  );
                })()}

                {(!stats.agents || stats.agents.length === 0) &&
                  (!stats.aggregate || (!stats.aggregate.count_chats && !stats.aggregate.average_score)) && (
                  <EmptyState theme={theme}>Нет данных</EmptyState>
                )}
              </>
            )}
            {!error && !stats && <EmptyState theme={theme}>Нет данных</EmptyState>}
          </ContentContainer>
        </PageContent>
      </ThemeProvider>
    </Layout>
  );
};
