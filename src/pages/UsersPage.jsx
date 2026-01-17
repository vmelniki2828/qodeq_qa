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

// Функция для форматирования даты
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Если дата невалидна, возвращаем исходную строку
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(',', '');
  } catch (e) {
    return dateString;
  }
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
  width: ${({ $isFullWidth }) => ($isFullWidth ? '100%' : '65%')};
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
  width: ${({ $isVisible }) => ($isVisible ? '35%' : '0')};
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

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
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
  overflow-y: auto;
  position: relative;
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

const UsernameCell = styled(TableCell)`
  text-align: left;
`;

const TelegramCell = styled(TableCell)`
  text-align: left;
`;

const EmailCell = styled(TableCell)`
  text-align: left;
`;

const RolesCell = styled(TableCell)`
  font-size: 12px;
`;

const ActiveCell = styled(TableCell)`
  color: #10A37F;
  font-size: 16px;
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


export const UsersPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    username: '',
    telegramChatId: '',
    email: '',
    password: '',
    roles: '[VIEWER]',
    permissions: '',
    ip_whitelist: '',
    resource_whitelist: '',
    allowed_payment_names: '',
    active: true,
  });

  // Загрузка данных пользователей с API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch('https://repayment.cat-tools.com/api/v1/admin/users', {
        method: 'GET',
        headers,
      });
      if (response.status === 401) {
        setUsers([]);
        setIsLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Преобразуем данные API в формат, который ожидает компонент
      const formattedUsers = Array.isArray(data) ? data.map((user, index) => ({
        id: user.id || user._id || index + 1,
        _id: user._id || user.id,
        username: user.username || '',
        telegramChatId: user.telegram_chat_id || user.telegramChatId || '',
        email: user.email || '',
        roles: Array.isArray(user.roles) ? `[${user.roles.join(', ')}]` : (user.roles || '[VIEWER]'),
        active: user.is_active !== undefined ? user.is_active : (user.active !== undefined ? user.active : true),
        createdAt: user.created_at || user.createdAt || '',
      })) : [];
      setUsers(formattedUsers);
    } catch (err) {
      console.error('Ошибка при загрузке пользователей:', err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.telegramChatId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    switch (sortField) {
      case 'username':
        aValue = a.username.toLowerCase();
        bValue = b.username.toLowerCase();
        break;
      case 'telegram_chat_id':
        aValue = a.telegramChatId.toLowerCase();
        bValue = b.telegramChatId.toLowerCase();
        break;
      case 'email':
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case 'roles':
        aValue = a.roles.toLowerCase();
        bValue = b.roles.toLowerCase();
        break;
      case 'active':
        aValue = a.active ? 1 : 0;
        bValue = b.active ? 1 : 0;
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
    fetchUsers();
  };

  const handleCreate = () => {
    setEditingUserId(null);
    setNewUser({
      username: '',
      telegramChatId: '',
      email: '',
      password: '',
      roles: '[VIEWER]',
      permissions: '',
      ip_whitelist: '',
      resource_whitelist: '',
      allowed_payment_names: '',
      active: true,
    });
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingUserId(null);
    setNewUser({
      username: '',
      telegramChatId: '',
      email: '',
      password: '',
      roles: '[VIEWER]',
      permissions: '',
      ip_whitelist: '',
      resource_whitelist: '',
      allowed_payment_names: '',
      active: true,
    });
  };

  const handleSave = async () => {
    if (editingUserId) {
      // Обновление существующего пользователя
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUserId
            ? {
                ...user,
                username: newUser.username,
                telegramChatId: newUser.telegramChatId,
                email: newUser.email,
                roles: newUser.roles,
                active: newUser.active,
              }
            : user
        )
      );
      console.log('Update user', editingUserId, newUser);
      handleCloseCreate();
    } else {
      // Создание нового пользователя через API
      try {
        const token = getCookie('rb_admin_token');
        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Преобразуем roles из строки [VIEWER] в массив ["VIEWER"]
        const rolesArray = newUser.roles
          .replace(/[\[\]]/g, '')
          .split(',')
          .map(role => role.trim())
          .filter(role => role);

        // Преобразуем строки с запятыми в массивы
        const parseArray = (str) => {
          if (!str || !str.trim()) return [];
          return str.split(',').map(item => item.trim()).filter(item => item);
        };

        const requestBody = {
          username: newUser.username,
          email: newUser.email,
          password: newUser.password || 'defaultPassword123', // Если пароль не указан, используем дефолтный
          roles: rolesArray,
          permissions: parseArray(newUser.permissions),
          ip_whitelist: parseArray(newUser.ip_whitelist),
          resource_whitelist: parseArray(newUser.resource_whitelist),
          allowed_payment_names: parseArray(newUser.allowed_payment_names),
        };

        const response = await fetch('https://repayment.cat-tools.com/api/v1/admin/users', {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        });

        if (response.status === 401) {
          alert('Ошибка авторизации');
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const createdUser = await response.json();
        console.log('User created successfully', createdUser);
        
        // Обновляем список пользователей
        await fetchUsers();
        handleCloseCreate();
      } catch (err) {
        console.error('Ошибка при создании пользователя:', err);
        alert(`Ошибка при создании пользователя: ${err.message}`);
      }
    }
  };

  const handleView = (user, e) => {
    e?.stopPropagation();
    const userId = user._id || user.id;
    navigate(`/models/users/${userId}`, { state: { userData: user } });
  };

  const handleEdit = (userId, e) => {
    e.stopPropagation();
    const user = users.find((u) => u.id === userId);
    if (user) {
      setEditingUserId(userId);
      setNewUser({
        username: user.username,
        telegramChatId: user.telegramChatId,
        email: user.email,
        roles: user.roles,
        active: user.active,
      });
      setIsCreateOpen(true);
    }
  };

  const handleDelete = async (userId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = getCookie('rb_admin_token');
        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Получаем _id пользователя для API запроса
        const user = users.find((u) => u.id === userId);
        const userApiId = user?._id || user?.id || userId;

        const response = await fetch(`https://repayment.cat-tools.com/api/v1/admin/users/${userApiId}`, {
          method: 'DELETE',
          headers,
        });

        if (response.status === 401) {
          alert('Ошибка авторизации');
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        console.log('User deleted successfully', userApiId);
        
        // Обновляем список пользователей
        await fetchUsers();
      } catch (err) {
        console.error('Ошибка при удалении пользователя:', err);
        alert(`Ошибка при удалении пользователя: ${err.message}`);
      }
    }
  };

  const ITEMS_PER_PAGE = 10;
  const totalUsers = sortedUsers.length;
  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

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
            <Title theme={theme}>Users</Title>
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
            <FilterLabel theme={theme}>Created At:</FilterLabel>
            <SortSelect
              theme={theme}
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="created_at">Created At</option>
              <option value="username">Username</option>
              <option value="telegram_chat_id">Telegram Chat ID</option>
              <option value="email">Email</option>
              <option value="roles">Roles</option>
              <option value="active">Active</option>
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
            <FilterLabel theme={theme}>Search:</FilterLabel>
            <SearchInput
              theme={theme}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </FiltersSection>

          <PageContainer>
            <LeftPanel $isFullWidth={!isCreateOpen}>
              <TableContainer>
                {isLoading ? (
                  <Loader />
                ) : (
                  <Table theme={theme}>
                    <TableHeader theme={theme}>
                      <TableHeaderRow>
                        <TableHeaderCell
                          theme={theme}
                          onClick={() => handleSort('username')}
                          $sorted={sortField === 'username'}
                        >
                          Username
                          <SortIcon>{getSortIcon('username')}</SortIcon>
                        </TableHeaderCell>
                        <TableHeaderCell theme={theme}>Telegram Chat ID</TableHeaderCell>
                        <TableHeaderCell theme={theme}>Email</TableHeaderCell>
                        <TableHeaderCell theme={theme}>Roles</TableHeaderCell>
                        <TableHeaderCell theme={theme}>Active</TableHeaderCell>
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
                      {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user) => (
                          <TableRow key={user.id} theme={theme}>
                            <UsernameCell theme={theme}>{user.username}</UsernameCell>
                            <TelegramCell theme={theme}>{user.telegramChatId}</TelegramCell>
                            <EmailCell theme={theme}>{user.email || ''}</EmailCell>
                            <RolesCell theme={theme}>{user.roles}</RolesCell>
                            <ActiveCell theme={theme}>
                              {user.active ? '✓' : ''}
                            </ActiveCell>
                            <CreatedAtCell theme={theme}>{formatDate(user.createdAt)}</CreatedAtCell>
                            <ActionsCell theme={theme}>
                          <ActionButton
                            theme={theme}
                            onClick={(e) => handleView(user, e)}
                            title="View"
                          >
                            <HiEye size={16} />
                          </ActionButton>
                              <ActionButton
                                theme={theme}
                                onClick={(e) => handleEdit(user.id, e)}
                                title="Edit"
                              >
                                <HiPencil size={16} />
                              </ActionButton>
                              <ActionButton
                                theme={theme}
                                $danger
                                onClick={(e) => handleDelete(user.id, e)}
                                title="Delete"
                              >
                                <HiTrash size={16} />
                              </ActionButton>
                            </ActionsCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow theme={theme}>
                          <TableCell theme={theme} colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                            Нет данных
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>
            </LeftPanel>

            <Divider $isHidden={!isCreateOpen} theme={theme} />

            <RightPanel $isVisible={isCreateOpen} theme={theme}>
              <RightContent theme={theme}>
                <BackButton onClick={handleCloseCreate} theme={theme}>
                  <HiChevronLeft size={16} />
                  Back
                </BackButton>

                <SettingSection>
                  <SettingLabel theme={theme}>Username</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                      placeholder="Enter username..."
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Telegram Chat ID</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newUser.telegramChatId}
                      onChange={(e) =>
                        setNewUser({ ...newUser, telegramChatId: e.target.value })
                      }
                      placeholder="Enter Telegram Chat ID..."
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Email</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      placeholder="Enter email..."
                    />
                  </SettingContent>
                </SettingSection>

                {!editingUserId && (
                  <SettingSection>
                    <SettingLabel theme={theme}>Password</SettingLabel>
                    <SettingContent>
                      <TextInput
                        theme={theme}
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        placeholder="Enter password..."
                      />
                    </SettingContent>
                  </SettingSection>
                )}

                <SettingSection>
                  <SettingLabel theme={theme}>Roles</SettingLabel>
                  <SettingContent>
                    <Select
                      theme={theme}
                      value={newUser.roles}
                      onChange={(e) =>
                        setNewUser({ ...newUser, roles: e.target.value })
                      }
                    >
                      <option value="[VIEWER]">[VIEWER]</option>
                      <option value="[ADMIN]">[ADMIN]</option>
                      <option value="[SUPERUSER]">[SUPERUSER]</option>
                    </Select>
                  </SettingContent>
                </SettingSection>

                {!editingUserId && (
                  <>
                    <SettingSection>
                      <SettingLabel theme={theme}>Permissions</SettingLabel>
                      <SettingContent>
                        <TextInput
                          theme={theme}
                          type="text"
                          value={newUser.permissions}
                          onChange={(e) =>
                            setNewUser({ ...newUser, permissions: e.target.value })
                          }
                          placeholder="Comma-separated permissions..."
                        />
                      </SettingContent>
                    </SettingSection>

                    <SettingSection>
                      <SettingLabel theme={theme}>IP Whitelist</SettingLabel>
                      <SettingContent>
                        <TextInput
                          theme={theme}
                          type="text"
                          value={newUser.ip_whitelist}
                          onChange={(e) =>
                            setNewUser({ ...newUser, ip_whitelist: e.target.value })
                          }
                          placeholder="Comma-separated IP addresses..."
                        />
                      </SettingContent>
                    </SettingSection>

                    <SettingSection>
                      <SettingLabel theme={theme}>Resource Whitelist</SettingLabel>
                      <SettingContent>
                        <TextInput
                          theme={theme}
                          type="text"
                          value={newUser.resource_whitelist}
                          onChange={(e) =>
                            setNewUser({ ...newUser, resource_whitelist: e.target.value })
                          }
                          placeholder="Comma-separated resources..."
                        />
                      </SettingContent>
                    </SettingSection>

                    <SettingSection>
                      <SettingLabel theme={theme}>Allowed Payment Names</SettingLabel>
                      <SettingContent>
                        <TextInput
                          theme={theme}
                          type="text"
                          value={newUser.allowed_payment_names}
                          onChange={(e) =>
                            setNewUser({ ...newUser, allowed_payment_names: e.target.value })
                          }
                          placeholder="Comma-separated payment names..."
                        />
                      </SettingContent>
                    </SettingSection>
                  </>
                )}

                <SettingSection>
                  <SettingLabel theme={theme}>Active</SettingLabel>
                  <SettingContent>
                    <Checkbox
                      type="checkbox"
                      checked={newUser.active}
                      onChange={(e) =>
                        setNewUser({ ...newUser, active: e.target.checked })
                      }
                      theme={theme}
                    />
                  </SettingContent>
                </SettingSection>

                <SaveButton theme={theme} onClick={handleSave}>
                  {editingUserId ? 'Save Changes' : 'Create User'}
                </SaveButton>
              </RightContent>
            </RightPanel>
          </PageContainer>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalUsers}
            onPageChange={setCurrentPage}
            itemsPerPage={10}
          />
        </div>
      </ThemeProvider>
    </Layout>
  );
};
