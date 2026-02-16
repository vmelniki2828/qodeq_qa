import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import { HiEye, HiCheck, HiXMark } from 'react-icons/hi2';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { DateTimePicker } from '../components/DateTimePicker';
import { apiFetch, getCookie } from '../utils/api';

const formatChatDate = (v) => {
  if (!v) return '—';
  try {
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) { return v; }
};

// Функция для форматирования даты в YYYY-MM-DD
const formatDateForAPI = (dateString) => {
  if (!dateString) return '';
  // Если это уже строка в формате YYYY-MM-DD, возвращаем как есть
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Если это строка с датой, пытаемся преобразовать
  try {
    const dateObj = new Date(dateString);
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    // Если не удалось преобразовать, возвращаем пустую строку
  }
  
  return '';
};

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
      background-color: ${theme.colors.accentHover || theme.colors.accent};
      opacity: 0.9;
    }
  `}
`;

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  min-height: 0;
  overflow: hidden;
  height: 100%;
`;

const LeftPanel = styled.div`
  width: ${({ $isFullWidth }) => ($isFullWidth ? '100%' : '75%')};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s ease;
`;


const TableContainer = styled.div`
  flex: 1;
  padding: 20px;
  min-height: 0;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
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
  text-align: center;
  vertical-align: middle;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${({ theme }) =>
    theme.colors.surface === '#F9FAFB' ? '#F0F1F3' : theme.colors.surface};
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;
  position: relative;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f8f8f8' : 'rgba(255,255,255,0.04)'};
  }

  ${({ $width }) =>
    $width &&
    `
    width: ${$width};
  `}
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
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  vertical-align: middle;
`;

const PaymentCell = styled(TableCell)`
  text-align: center;
`;

const ChatIdCell = styled(TableCell)`
  text-align: center;
  font-family: monospace;
  font-size: 11px;
`;


const ActionsCell = styled(TableCell)`
  width: 44px;
  min-width: 44px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $danger }) =>
    $danger &&
    `
    &:hover {
      color: #ef4444;
      background-color: rgba(239,68,68,0.1);
    }
  `}
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

const FilterLabelStyled = styled.label`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
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


export const ChatsPage = () => {
  const { theme } = useTheme();
  const { department, role } = useUserProfile();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pagesCount, setPagesCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [qaGroups, setQAGroups] = useState([]);
  const [selectedQAGroupId, setSelectedQAGroupId] = useState('');
  const [loadingQAGroups, setLoadingQAGroups] = useState(false);
  const [filters, setFilters] = useState({
    chat_id: '',
    user_type: '',
    chat_color: '',
    project_id: '',
    username: '',
    created_from: '',
    created_to: '',
    checked: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    chat_id: '',
    user_type: '',
    chat_color: '',
    project_id: '',
    username: '',
    created_from: '',
    created_to: '',
    checked: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  // Загрузка данных из API
  const fetchChats = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Формируем URL с примененными фильтрами
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('page_size', pageSize.toString());
      if (appliedFilters.chat_id) params.append('chat_id', appliedFilters.chat_id.trim());
      if (appliedFilters.user_type) params.append('user_type', appliedFilters.user_type);
      if (appliedFilters.chat_color) params.append('chat_color', appliedFilters.chat_color);
      if (appliedFilters.project_id) params.append('project_id', appliedFilters.project_id);
      if (appliedFilters.username) params.append('username', appliedFilters.username);
      if (appliedFilters.created_from) params.append('created_from', appliedFilters.created_from);
      if (appliedFilters.created_to) params.append('created_to', appliedFilters.created_to);
      if (appliedFilters.checked !== '') params.append('checked', appliedFilters.checked);
      if (selectedGroupId) {
        params.append('support_group_id', selectedGroupId);
      }
      if (selectedQAGroupId) {
        params.append('qa_group_id', selectedQAGroupId);
      }
      
      const url = `/api/v1/chat/reviewedchat/?${params.toString()}`;
      const response = await apiFetch(url, {
        method: 'GET',
      });

      if (response.status === 401) {
        setChats([]);
        setTotalCount(0);
        setPagesCount(null);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Формат: { chats: [...], total, current_page, pages_count }
      let items = [];
      if (data.chats && Array.isArray(data.chats)) {
        items = data.chats;
      } else if (Array.isArray(data)) {
        items = data;
      } else if (data.results && Array.isArray(data.results)) {
        items = data.results;
      } else if (data.data && Array.isArray(data.data)) {
        items = data.data;
      } else if (data.items && Array.isArray(data.items)) {
        items = data.items;
      }

      setTotalCount(data.total ?? data.count ?? 0);
      setPagesCount(typeof data.pages_count === 'number' ? data.pages_count : null);

      const formattedChats = items.map((item) => ({
        id: item.id,
        chat_id: item.chat_id ?? '',
        thread_id: item.thread_id ?? '',
        user_type: item.user_type ?? '',
        checked: Boolean(item.checked),
        score: item.score ?? null,
        created_chat_at: item.created_chat_at ?? '',
        chat_duration: item.chat_duration ?? '',
        project_title: item.project_title ?? '',
        username: Array.isArray(item.username) ? item.username : [],
        tags: Array.isArray(item.tags) ? item.tags : [],
        color: item.color ?? null,
      }));

      setChats(formattedChats);
      try {
        sessionStorage.setItem('chatsNavigationIds', JSON.stringify(formattedChats.map((c) => c.id)));
      } catch (_) {}
    } catch (err) {
      console.error('Ошибка при загрузке chats:', err);
      setChats([]);
      setTotalCount(0);
      setPagesCount(null);
      Notify.failure('Ошибка при загрузке чатов');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, appliedFilters, pageSize, selectedGroupId, selectedQAGroupId]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await apiFetch('/api/v1/settings/project/?skip=0&limit=100', {
          method: 'GET',
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setProjects(Array.isArray(json) ? json : []);
      } catch (e) {
        console.error('Ошибка при загрузке проектов:', e);
    }
  };
    fetchProjects();
  }, []);

  // Загрузка групп для HEAD и TEAM LEAD
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
      
      // Используем даты из текущих фильтров (до применения) или примененных фильтров, или текущую дату
      const startDate = formatDateForAPI(filters.created_from) || formatDateForAPI(appliedFilters.created_from) || new Date().toISOString().split('T')[0];
      const endDate = formatDateForAPI(filters.created_to) || formatDateForAPI(appliedFilters.created_to) || new Date().toISOString().split('T')[0];

      setLoadingQAGroups(true);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const url = `https://qa.qodeq.net/api/v1/group/qa/?start_date=${startDate}&end_date=${endDate}`;
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
  }, [filters.created_from, filters.created_to, appliedFilters.created_from, appliedFilters.created_to, role, department]);

  const handleRefresh = () => {
    fetchChats();
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1); // Сбрасываем на первую страницу при применении фильтров
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      chat_id: '',
      user_type: '',
      chat_color: '',
      project_id: '',
      username: '',
      created_from: '',
      created_to: '',
      checked: ''
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setCurrentPage(1);
  };

  const handleView = (chat, e) => {
    e?.stopPropagation();
    navigate(`/chats/${chat.id}`);
  };

  const totalPages = (pagesCount != null ? pagesCount : Math.ceil(totalCount / pageSize)) || 1;
  const paginatedChats = chats;

  if (isLoading) {
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
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <HeaderSection theme={theme}>
            <Title theme={theme}>Chats</Title>
            <ButtonsGroup>
              <Button theme={theme} onClick={handleRefresh}>
                Refresh
              </Button>
              <Button 
                theme={theme} 
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                title={isFiltersVisible ? 'Скрыть фильтры' : 'Показать фильтры'}
              >
                Filters
              </Button>
              {department === 'quality_assurance' && (
                <Button theme={theme} $primary onClick={() => navigate('/manual-check')}>
                  Manual
                </Button>
              )}
            </ButtonsGroup>
          </HeaderSection>

          <FiltersContainer theme={theme} $isVisible={isFiltersVisible}>
            <FilterGroup>
              <FilterLabelStyled theme={theme}>Chat ID</FilterLabelStyled>
              <Input
                theme={theme}
                type="text"
                placeholder="Поиск по chat_id"
                value={filters.chat_id}
                onChange={(e) => setFilters(prev => ({ ...prev, chat_id: e.target.value }))}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabelStyled theme={theme}>User Type</FilterLabelStyled>
              <Select
                theme={theme}
                value={filters.user_type}
                onChange={(e) => setFilters(prev => ({ ...prev, user_type: e.target.value }))}
              >
                <option value="">Все</option>
                <option value="other">Other</option>
                <option value="vip">VIP</option>
              </Select>
            </FilterGroup>
            <FilterGroup>
              <FilterLabelStyled theme={theme}>Chat Color</FilterLabelStyled>
              <Select
                theme={theme}
                value={filters.chat_color}
                onChange={(e) => setFilters(prev => ({ ...prev, chat_color: e.target.value }))}
              >
                <option value="">Все</option>
                <option value="red">Red</option>
                <option value="yellow">Yellow</option>
                <option value="green">Green</option>
              </Select>
            </FilterGroup>
            <FilterGroup>
              <FilterLabelStyled theme={theme}>Project ID</FilterLabelStyled>
              <Select
                theme={theme}
                value={filters.project_id}
                onChange={(e) => setFilters(prev => ({ ...prev, project_id: e.target.value }))}
              >
                <option value="">Все проекты</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title || project.id}
                  </option>
                ))}
              </Select>
            </FilterGroup>
            <FilterGroup>
              <FilterLabelStyled theme={theme}>Username</FilterLabelStyled>
              <Input
              theme={theme}
              type="text"
                placeholder="Введите username"
                value={filters.username}
                onChange={(e) => setFilters(prev => ({ ...prev, username: e.target.value }))}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabelStyled theme={theme}>Created From</FilterLabelStyled>
              <DateTimePicker
                value={filters.created_from}
                onChange={(e) => setFilters(prev => ({ ...prev, created_from: e.target.value }))}
                placeholder="Выберите дату начала"
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabelStyled theme={theme}>Created To</FilterLabelStyled>
              <DateTimePicker
                value={filters.created_to}
                onChange={(e) => setFilters(prev => ({ ...prev, created_to: e.target.value }))}
                placeholder="Выберите дату окончания"
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabelStyled theme={theme}>Checked</FilterLabelStyled>
              <Select
              theme={theme}
                value={filters.checked}
                onChange={(e) => setFilters(prev => ({ ...prev, checked: e.target.value }))}
            >
                <option value="">Все</option>
                <option value="true">Checked</option>
                <option value="false">Not Checked</option>
              </Select>
            </FilterGroup>
            {(role === 'head' || role === 'team_lead') && (
              <FilterGroup>
                <FilterLabelStyled theme={theme}>Группа</FilterLabelStyled>
                <Select
                  theme={theme}
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  disabled={loadingGroups}
                >
                  <option value="">Все группы</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </Select>
              </FilterGroup>
            )}
            {department === 'quality_assurance' && (role === 'team_lead' || role === 'head' || role === 'admin') && (
              <FilterGroup>
                <FilterLabelStyled theme={theme}>QA Группа</FilterLabelStyled>
                <Select
                  theme={theme}
                  value={selectedQAGroupId}
                  onChange={(e) => setSelectedQAGroupId(e.target.value)}
                  disabled={loadingQAGroups}
                >
                  <option value="">Все QA группы</option>
                  {qaGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </Select>
              </FilterGroup>
            )}
            <FilterButtons>
              <Button theme={theme} onClick={handleApplyFilters}>
                Применить
              </Button>
              <Button theme={theme} onClick={handleClearFilters}>
                Очистить
              </Button>
            </FilterButtons>
          </FiltersContainer>

          <PageContainer>
            <LeftPanel $isFullWidth>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '20px 20px 0 20px' }}>
                <span style={{ fontSize: '14px', color: theme.colors.secondary }}>На странице:</span>
                <Select
                  theme={theme}
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
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
                </Select>
              </div>
              <TableContainer>
                <Table theme={theme}>
                  <TableHeader theme={theme}>
                    <TableHeaderRow>
                      <TableHeaderCell theme={theme}>Chat ID</TableHeaderCell>
                      <TableHeaderCell theme={theme}>Thread ID</TableHeaderCell>
                      <TableHeaderCell theme={theme}>Тип</TableHeaderCell>
                      <TableHeaderCell theme={theme} $width="56px" title="Проверен">checked</TableHeaderCell>
                      <TableHeaderCell theme={theme}>Оценка</TableHeaderCell>
                      <TableHeaderCell theme={theme}>Дата</TableHeaderCell>
                      <TableHeaderCell theme={theme}>Длит.</TableHeaderCell>
                      <TableHeaderCell theme={theme}>Проект</TableHeaderCell>
                      <TableHeaderCell theme={theme}>Username</TableHeaderCell>
                      <TableHeaderCell theme={theme} $width="44px"> </TableHeaderCell>
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedChats.map((chat) => {
                      const scoreLevel = chat.score != null
                        ? (chat.score >= 80 ? 'good' : chat.score >= 50 ? 'warn' : 'bad')
                        : null;
                      return (
                        <TableRow 
                          key={chat.id} 
                          theme={theme}
                          onClick={() => handleView(chat)}
                        >
                          <ChatIdCell theme={theme}>{chat.chat_id || '—'}</ChatIdCell>
                          <ChatIdCell theme={theme}>{chat.thread_id || '—'}</ChatIdCell>
                          <TableCell theme={theme}>{chat.user_type || '—'}</TableCell>
                          <TableCell theme={theme}>
                            {chat.checked ? (
                              <HiCheck size={20} style={{ color: '#16a34a' }} title="Проверен" />
                            ) : (
                              <HiXMark size={20} style={{ color: '#dc2626' }} title="Не проверен" />
                            )}
                          </TableCell>
                          <TableCell theme={theme}>
                            {chat.score != null ? (
                              <ScoreBadge $level={scoreLevel}>{chat.score}</ScoreBadge>
                            ) : '—'}
                          </TableCell>
                          <TableCell theme={theme}>{formatChatDate(chat.created_chat_at)}</TableCell>
                          <TableCell theme={theme}>{chat.chat_duration || '—'}</TableCell>
                          <PaymentCell theme={theme}>{chat.project_title || '—'}</PaymentCell>
                          <PaymentCell theme={theme}>{(chat.username || []).join(', ') || '—'}</PaymentCell>
                          <ActionsCell theme={theme}>
                            <ActionButton theme={theme} onClick={(e) => handleView(chat, e)} title="Открыть">
                              <HiEye size={16} />
                            </ActionButton>
                          </ActionsCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </LeftPanel>
          </PageContainer>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            onPageChange={setCurrentPage}
            itemsPerPage={pageSize}
          />
        </div>
      </ThemeProvider>
    </Layout>
  );
};

