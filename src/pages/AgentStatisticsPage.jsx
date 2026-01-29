import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import { DateTimePicker } from '../components/DateTimePicker';
import { HiCheck, HiXMark } from 'react-icons/hi2';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
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
  align-items: center;
  gap: 16px;
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
  flex: 1;
  padding: 20px;
  overflow-x: auto;
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

export const AgentStatisticsPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    checked: '',
    date_start: '',
    date_end: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    checked: '',
    date_start: '',
    date_end: ''
  });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const fetchChats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const params = new URLSearchParams();
      params.append('id', id);
      params.append('page', currentPage.toString());
      params.append('page_size', ITEMS_PER_PAGE.toString());
      if (appliedFilters.checked !== '') params.append('checked', appliedFilters.checked);
      if (appliedFilters.date_start) params.append('date_start', appliedFilters.date_start);
      if (appliedFilters.date_end) params.append('date_end', appliedFilters.date_end);
      
      const url = `https://209.38.246.190/api/v1/chat/statistics/chats?${params.toString()}`;
      
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
  }, [id, currentPage, appliedFilters]);

  useEffect(() => {
    if (id) {
      fetchChats();
    }
  }, [id, currentPage, appliedFilters, fetchChats]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const cleared = {
      checked: '',
      date_start: '',
      date_end: ''
    };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setCurrentPage(1);
  };

  const getScoreLevel = (score) => {
    if (score === null || score === undefined) return null;
    if (score >= 80) return 'good';
    if (score >= 50) return 'warn';
    return 'bad';
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
            <BackButton theme={theme} onClick={() => navigate('/statistics')}>
              ← Назад
            </BackButton>
            <Title theme={theme}>Статистика агента</Title>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <Button 
                theme={theme} 
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                title={isFiltersVisible ? 'Скрыть фильтры' : 'Показать фильтры'}
              >
                Filters
              </Button>
              <Button theme={theme} onClick={fetchChats}>
                Refresh
              </Button>
            </div>
          </HeaderSection>

          <FiltersContainer theme={theme} $isVisible={isFiltersVisible}>
            <FilterGroup>
              <FilterLabel theme={theme}>Checked</FilterLabel>
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
            <FilterGroup>
              <FilterLabel theme={theme}>Date Start</FilterLabel>
              <DateTimePicker
                value={filters.date_start}
                onChange={(e) => setFilters(prev => ({ ...prev, date_start: e.target.value }))}
                placeholder="Выберите дату начала"
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel theme={theme}>Date End</FilterLabel>
              <DateTimePicker
                value={filters.date_end}
                onChange={(e) => setFilters(prev => ({ ...prev, date_end: e.target.value }))}
                placeholder="Выберите дату окончания"
              />
            </FilterGroup>
            <FilterButtons>
              <Button theme={theme} $primary onClick={handleApplyFilters}>
                Применить
              </Button>
              <Button theme={theme} onClick={handleClearFilters}>
                Очистить
              </Button>
            </FilterButtons>
          </FiltersContainer>

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
                    {pagesCount > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={pagesCount}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </>
                ) : (
                  <EmptyState theme={theme}>Нет чатов</EmptyState>
                )}
              </>
            )}
          </TableContainer>
        </PageContent>
      </ThemeProvider>
    </Layout>
  );
};

