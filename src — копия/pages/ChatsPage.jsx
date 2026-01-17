import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import { HiPencil, HiTrash, HiArrowUp, HiArrowDown, HiEye, HiChevronLeft } from 'react-icons/hi2';

// Функция для получения токена из куки
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
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
  text-align: left;
`;

const ChatIdCell = styled(TableCell)`
  text-align: left;
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
  width: 120px;
  display: flex;
  gap: 8px;
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


export const ChatsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [newChat, setNewChat] = useState({
    payment: '',
    chatId: '',
    operators: '',
    template: 'with_file',
  });

  // Загрузка данных из API
  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('https://repayment.cat-tools.com/api/v1/admin/chats', {
        method: 'GET',
        headers,
      });
      
      if (response.status === 401) {
        setChats([]);
        setIsLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Обрабатываем ответ API (может быть массив или объект с полями data, items)
      let items = [];
      
      if (Array.isArray(data)) {
        items = data;
      } else if (data.data && Array.isArray(data.data)) {
        items = data.data;
      } else if (data.items && Array.isArray(data.items)) {
        items = data.items;
      }
      
      // Преобразуем данные API в формат, который ожидает компонент
      const formattedChats = items.map((item, index) => ({
        id: item.id || item._id || index + 1,
        _id: item._id || item.id || `chat_${index}`,
        payment: item.payment || item.payment_name || '',
        chatId: item.chat_id || item.chatId || '',
        operators: item.payment_operator_ids || item.operators || [],
        template: item.template || '',
        extraText: item.extra_text || item.extraText || null,
        createdAt: item.created_at || item.createdAt || '',
        updatedAt: item.updated_at || item.updatedAt || '',
      }));
      
      setChats(formattedChats);
    } catch (err) {
      console.error('Ошибка при загрузке chats:', err);
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      !searchQuery ||
      chat.payment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.chatId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.operators.some((op) => op.toString().includes(searchQuery));
    return matchesSearch;
  });

  const sortedChats = [...filteredChats].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    switch (sortField) {
      case 'payment':
        aValue = a.payment.toLowerCase();
        bValue = b.payment.toLowerCase();
        break;
      case 'chat_id':
        aValue = a.chatId.toLowerCase();
        bValue = b.chatId.toLowerCase();
        break;
      case 'operators':
        aValue = a.operators.length;
        bValue = b.operators.length;
        break;
      case 'template':
        aValue = a.template.toLowerCase();
        bValue = b.template.toLowerCase();
        break;
      case 'created_at':
        aValue = a.createdAt || '';
        bValue = b.createdAt || '';
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
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

  const handleCreate = () => {
    setEditingChatId(null);
    setNewChat({
      payment: '',
      chatId: '',
      operators: '',
      template: 'with_file',
    });
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingChatId(null);
    setNewChat({
      payment: '',
      chatId: '',
      operators: '',
      template: 'with_file',
    });
  };

  const handleSaveChat = () => {
    if (editingChatId) {
      // Update existing chat
      const operatorsArray = newChat.operators
        ? newChat.operators.split(',').map((op) => parseInt(op.trim())).filter((op) => !isNaN(op))
        : [];
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === editingChatId
            ? {
                ...chat,
                payment: newChat.payment,
                chatId: newChat.chatId,
                operators: operatorsArray,
                template: newChat.template,
              }
            : chat
        )
      );
      console.log('Update chat:', editingChatId, newChat);
    } else {
      // Create new chat
      const newId = Math.max(...chats.map((c) => c.id), 0) + 1;
      const operatorsArray = newChat.operators
        ? newChat.operators.split(',').map((op) => parseInt(op.trim())).filter((op) => !isNaN(op))
        : [];
      const createdChat = {
        id: newId,
        payment: newChat.payment,
        chatId: newChat.chatId,
        operators: operatorsArray,
        template: newChat.template,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      setChats((prevChats) => [...prevChats, createdChat]);
      console.log('Create new chat', createdChat);
    }
    handleCloseCreate();
  };

  const handleView = (chatId, e) => {
    e?.stopPropagation();
    // Находим элемент по id и используем _id для навигации
    const item = chats.find((c) => c.id === chatId);
    const chatIdToUse = item?._id || chatId;
    navigate(`/models/chats/${chatIdToUse}`);
  };

  const handleEdit = (chatId, e) => {
    e.stopPropagation();
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setEditingChatId(chatId);
      setNewChat({
        payment: chat.payment,
        chatId: chat.chatId,
        operators: chat.operators.join(', '),
        template: chat.template,
      });
      setIsCreateOpen(true);
    }
  };

  const handleDelete = (chatId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
      console.log('Delete chat', chatId);
    }
  };

  const ITEMS_PER_PAGE = 10;
  const totalChats = sortedChats.length;
  const totalPages = Math.ceil(totalChats / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedChats = sortedChats.slice(startIndex, endIndex);

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
              <Button theme={theme} $primary onClick={handleCreate}>
                Create
              </Button>
            </ButtonsGroup>
          </HeaderSection>

          <FiltersSection theme={theme}>
            <FilterLabel theme={theme}>Search:</FilterLabel>
            <SearchInput
              theme={theme}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FilterLabel theme={theme}>Created At:</FilterLabel>
            <SortSelect
              theme={theme}
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="created_at">Created At</option>
              <option value="payment">Payment</option>
              <option value="chat_id">Chat ID</option>
              <option value="operators">Operators</option>
              <option value="template">Template</option>
            </SortSelect>
            <FilterLabel theme={theme}>Desc:</FilterLabel>
            <SortSelect
              theme={theme}
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </SortSelect>
          </FiltersSection>

          <PageContainer>
            <LeftPanel $isFullWidth={!isCreateOpen}>
              <TableContainer>
                <Table theme={theme}>
                  <TableHeader theme={theme}>
                    <TableHeaderRow>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('payment')}
                        $sorted={sortField === 'payment'}
                      >
                        Payment
                        <SortIcon>{getSortIcon('payment')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('chat_id')}
                        $sorted={sortField === 'chat_id'}
                      >
                        Chat ID
                        <SortIcon>{getSortIcon('chat_id')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('operators')}
                        $sorted={sortField === 'operators'}
                      >
                        Operators
                        <SortIcon>{getSortIcon('operators')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('template')}
                        $sorted={sortField === 'template'}
                      >
                        Template
                        <SortIcon>{getSortIcon('template')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('created_at')}
                        $sorted={sortField === 'created_at'}
                      >
                        Created At
                        <SortIcon>{getSortIcon('created_at')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell theme={theme} $width="120px">
                        Actions
                      </TableHeaderCell>
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedChats.map((chat) => (
                      <TableRow key={chat.id} theme={theme}>
                        <PaymentCell theme={theme}>{chat.payment}</PaymentCell>
                        <ChatIdCell theme={theme}>{chat.chatId}</ChatIdCell>
                        <OperatorsCell theme={theme}>
                          [{chat.operators.join(', ')}]
                        </OperatorsCell>
                        <TemplateCell theme={theme}>{chat.template}</TemplateCell>
                        <CreatedAtCell theme={theme}>{chat.createdAt}</CreatedAtCell>
                        <ActionsCell theme={theme}>
                          <ActionButton
                            theme={theme}
                            onClick={(e) => handleView(chat.id, e)}
                            title="View"
                          >
                            <HiEye size={16} />
                          </ActionButton>
                          <ActionButton
                            theme={theme}
                            onClick={(e) => handleEdit(chat.id, e)}
                            title="Edit"
                          >
                            <HiPencil size={16} />
                          </ActionButton>
                          <ActionButton
                            theme={theme}
                            $danger
                            onClick={(e) => handleDelete(chat.id, e)}
                            title="Delete"
                          >
                            <HiTrash size={16} />
                          </ActionButton>
                        </ActionsCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </LeftPanel>

            <Divider $isHidden={!isCreateOpen} theme={theme} />

            <RightPanel $isVisible={isCreateOpen} theme={theme}>
              <RightContent theme={theme}>
                <BackButton theme={theme} onClick={handleCloseCreate}>
                  <HiChevronLeft size={16} />
                  Back
                </BackButton>

                <SettingSection>
                  <SettingLabel theme={theme}>Payment</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newChat.payment}
                      onChange={(e) => setNewChat({ ...newChat, payment: e.target.value })}
                      placeholder="Enter payment name"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Chat ID</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newChat.chatId}
                      onChange={(e) => setNewChat({ ...newChat, chatId: e.target.value })}
                      placeholder="Enter chat ID"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Operators</SettingLabel>
                  <SettingContent>
                    <TextArea
                      theme={theme}
                      value={newChat.operators}
                      onChange={(e) => setNewChat({ ...newChat, operators: e.target.value })}
                      placeholder="Enter operators (comma-separated numbers)"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Template</SettingLabel>
                  <SettingContent>
                    <Select
                      theme={theme}
                      value={newChat.template}
                      onChange={(e) => setNewChat({ ...newChat, template: e.target.value })}
                    >
                      <option value="with_file">with_file</option>
                      <option value="with_url">with_url</option>
                    </Select>
                  </SettingContent>
                </SettingSection>

                <SaveButton theme={theme} onClick={handleSaveChat}>
                  {editingChatId ? 'Save Changes' : 'Create Chat'}
                </SaveButton>
              </RightContent>
            </RightPanel>
          </PageContainer>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalChats}
            onPageChange={setCurrentPage}
            itemsPerPage={10}
          />
        </div>
      </ThemeProvider>
    </Layout>
  );
};

