import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import { HiArrowUp, HiArrowDown, HiEye, HiCheck, HiXMark } from 'react-icons/hi2';

// Функция для получения токена из куки
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
    return isNaN(d.getTime()) ? v : d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) { return v; }
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

const FiltersSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 16px;
  align-items: center;
  flex-shrink: 0;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  max-width: 400px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SortSelect = styled.select`
  padding: 8px 32px 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6B6B' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 12px;
  box-sizing: border-box;
  min-width: 150px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  option {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
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

const Divider = styled.div`
  width: ${({ $isHidden }) => ($isHidden ? '0' : '1px')};
  background-color: ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
  position: relative;
  opacity: ${({ $isHidden }) => ($isHidden ? 0 : 1)};
  pointer-events: ${({ $isHidden }) => ($isHidden ? 'none' : 'auto')};
  overflow: hidden;
  transition: opacity 0.3s ease, width 0.3s ease;
`;

const RightPanel = styled.div`
  width: ${({ $isVisible }) => ($isVisible ? '25%' : '0')};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible }) => ($isVisible ? 'auto' : 'none')};
  transition: opacity 0.3s ease, width 0.3s ease;
`;

const RightContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;

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
  align-self: flex-start;
  margin-bottom: 20px;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const SettingSection = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;

const SettingLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  width: 180px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SettingContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  resize: none;
  min-height: 80px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6B6B' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 12px;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  option {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SaveButton = styled.button`
  align-self: flex-end;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
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

  ${({ $sorted }) =>
    $sorted &&
    `
    color: ${({ theme }) => theme.colors.primary};
  `}

  ${({ $width }) =>
    $width &&
    `
    width: ${$width};
  `}
`;

const SortIcon = styled.span`
  margin-left: 8px;
  font-size: 10px;
  opacity: 0.6;
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

const OperatorsCell = styled(TableCell)`
  text-align: left;
  font-family: monospace;
  font-size: 11px;
`;

const TemplateCell = styled(TableCell)`
  text-align: left;
  font-size: 12px;
`;

const CreatedAtCell = styled(TableCell)`
  font-size: 12px;
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

const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
`;

const TagPill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ theme }) =>
    theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.primary};
`;


export const ChatsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pagesCount, setPagesCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_chat_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // Загрузка данных из API
  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const url = `http://68.183.71.165:18100/api/v1/chat/reviewedchat/?page=${currentPage}&page_size=${ITEMS_PER_PAGE}`;
      const response = await fetch(url, {
        method: 'GET',
        headers,
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
    } catch (err) {
      console.error('Ошибка при загрузке chats:', err);
      setChats([]);
      setTotalCount(0);
      setPagesCount(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [currentPage]);

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const un = (chat.username || []).join(' ').toLowerCase();
    return (
      (chat.chat_id || '').toLowerCase().includes(q) ||
      (chat.thread_id || '').toLowerCase().includes(q) ||
      (chat.project_title || '').toLowerCase().includes(q) ||
      un.includes(q) ||
      (chat.tags || []).some((t) => String(t).toLowerCase().includes(q))
    );
  });

  const sortedChats = [...filteredChats].sort((a, b) => {
    if (!sortField) return 0;
    let aVal, bVal;
    switch (sortField) {
      case 'created_chat_at':
        aVal = a.created_chat_at || '';
        bVal = b.created_chat_at || '';
        break;
      case 'score':
        aVal = a.score ?? -1;
        bVal = b.score ?? -1;
        break;
      case 'project_title':
        aVal = (a.project_title || '').toLowerCase();
        bVal = (b.project_title || '').toLowerCase();
        break;
      case 'chat_id':
        aVal = (a.chat_id || '').toLowerCase();
        bVal = (b.chat_id || '').toLowerCase();
        break;
      case 'user_type':
        aVal = (a.user_type || '').toLowerCase();
        bVal = (b.user_type || '').toLowerCase();
        break;
      default:
        return 0;
    }
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <HiArrowUp /> : <HiArrowDown />;
  };

  const handleRefresh = () => {
    fetchChats();
  };

  const handleView = (chat, e) => {
    e?.stopPropagation();
    navigate(`/chats/${chat.id}`);
  };

  const totalPages = (pagesCount != null ? pagesCount : Math.ceil(totalCount / ITEMS_PER_PAGE)) || 1;
  const paginatedChats = sortedChats;

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
            </ButtonsGroup>
          </HeaderSection>

          <FiltersSection theme={theme}>
            <FilterLabel theme={theme}>Поиск:</FilterLabel>
            <SearchInput
              theme={theme}
              type="text"
              placeholder="chat_id, thread, проект, username, теги..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FilterLabel theme={theme}>Сортировка:</FilterLabel>
            <SortSelect
              theme={theme}
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="created_chat_at">Дата</option>
              <option value="score">Оценка</option>
              <option value="project_title">Проект</option>
              <option value="chat_id">Chat ID</option>
              <option value="user_type">Тип</option>
            </SortSelect>
            <FilterLabel theme={theme}>Порядок:</FilterLabel>
            <SortSelect
              theme={theme}
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <option value="desc">↓</option>
              <option value="asc">↑</option>
            </SortSelect>
          </FiltersSection>

          <PageContainer>
            <LeftPanel $isFullWidth>
              <TableContainer>
                <Table theme={theme}>
                  <TableHeader theme={theme}>
                    <TableHeaderRow>
                      <TableHeaderCell theme={theme} onClick={() => handleSort('chat_id')} $sorted={sortField === 'chat_id'}>
                        Chat ID <SortIcon>{getSortIcon('chat_id')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell theme={theme}>Thread ID</TableHeaderCell>
                      <TableHeaderCell theme={theme} onClick={() => handleSort('user_type')} $sorted={sortField === 'user_type'}>
                        Тип <SortIcon>{getSortIcon('user_type')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell theme={theme} $width="56px" title="Проверен">checked</TableHeaderCell>
                      <TableHeaderCell theme={theme} onClick={() => handleSort('score')} $sorted={sortField === 'score'}>
                        Оценка <SortIcon>{getSortIcon('score')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell theme={theme} onClick={() => handleSort('created_chat_at')} $sorted={sortField === 'created_chat_at'}>
                        Дата <SortIcon>{getSortIcon('created_chat_at')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell theme={theme}>Длит.</TableHeaderCell>
                      <TableHeaderCell theme={theme} onClick={() => handleSort('project_title')} $sorted={sortField === 'project_title'}>
                        Проект <SortIcon>{getSortIcon('project_title')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell theme={theme}>Username</TableHeaderCell>
                      <TableHeaderCell theme={theme}>Теги</TableHeaderCell>
                      <TableHeaderCell theme={theme} $width="44px"> </TableHeaderCell>
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedChats.map((chat) => {
                      const scoreLevel = chat.score != null
                        ? (chat.score >= 80 ? 'good' : chat.score >= 50 ? 'warn' : 'bad')
                        : null;
                      return (
                        <TableRow key={chat.id} theme={theme}>
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
                          <TableCell theme={theme}>
                            <TagsWrap>
                              {(chat.tags || []).map((t, i) => (
                                <TagPill key={i} theme={theme}>{String(t)}</TagPill>
                              ))}
                            </TagsWrap>
                          </TableCell>
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
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      </ThemeProvider>
    </Layout>
  );
};

