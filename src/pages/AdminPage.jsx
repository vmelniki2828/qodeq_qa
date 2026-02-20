import { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import { apiFetch } from '../utils/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { HiPencil, HiChevronUp, HiChevronDown } from 'react-icons/hi2';

const USERS_URL = '/api/v1/authorization/management/users';
const USER_UPDATE_URL = '/api/v1/authorization/management';
const REGISTER_URL = '/api/v1/authorization/management/register';

const ROLES = ['head', 'team_lead', 'agent', 'supervisor', 'admin', 'super_admin'];
const DEPARTMENTS = ['support', 'quality_assurance'];

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
      background-color: ${theme.colors.accent};
      color: #FFFFFF;
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
  flex: ${({ $flex }) => $flex ?? 75} 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Divider = styled.div`
  width: ${({ $isHidden }) => ($isHidden ? '0' : '4px')};
  background-color: ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
  position: relative;
  opacity: ${({ $isHidden }) => ($isHidden ? 0 : 1)};
  pointer-events: ${({ $isHidden }) => ($isHidden ? 'none' : 'auto')};
  overflow: hidden;
  transition: opacity 0.3s ease, width 0.3s ease;
  cursor: col-resize;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }

  &::before {
    content: '';
    position: absolute;
    left: -2px;
    right: -2px;
    top: 0;
    bottom: 0;
  }
`;

const RightPanel = styled.div`
  flex: ${({ $isVisible, $flex }) => ($isVisible ? ($flex ?? 25) : 0)} 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible }) => ($isVisible ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
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
  width: 100%;
  max-width: 240px;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.accent};
`;

const SaveButton = styled.button`
  align-self: flex-start;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover:not(:disabled) {
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResetPasswordButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => (theme.colors.primary === '#0D0D0D' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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
  ${({ $width }) => $width && `width: ${$width}; min-width: ${$width};`}
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
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  vertical-align: middle;
  word-break: break-word;
`;

const ActionsCell = styled(TableCell)`
  width: 132px;
  min-width: 132px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 0 auto;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const ErrorBlock = styled.div`
  padding: 20px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  color: #dc2626;
  font-size: 14px;
`;

const JsonBlock = styled.pre`
  margin: 0;
  padding: 20px;
  font-size: 12px;
  overflow-x: auto;
  background-color: ${({ theme }) =>
    theme.colors.surface === '#F9FAFB' ? '#F0F1F3' : theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.primary};
  white-space: pre-wrap;
  word-break: break-all;
`;

const FiltersContainer = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
  background-color: ${({ theme }) => theme.colors.background};
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

const FilterInput = styled.input`
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

const FilterSelect = styled.select`
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

const FilterButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const PageSizeWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
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

export const AdminPage = () => {
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    email: '',
    username: '',
    role: '',
    department: '',
    is_active: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [editError, setEditError] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    username: '',
    role: 'agent',
    department: 'support',
  });
  const [createError, setCreateError] = useState(null);
  const [splitterPosition, setSplitterPosition] = useState(75);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const defaultFilters = { email: '', username: '', department: '', role: '' };
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const handleSort = (key) => {
    if (key === 'Actions') return;
    if (sortBy === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const getSortableValue = (v) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'boolean') return v ? 1 : 0;
    if (typeof v === 'number') return v;
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (appliedFilters.email?.trim()) params.append('email', appliedFilters.email.trim());
      if (appliedFilters.username?.trim()) params.append('username', appliedFilters.username.trim());
      if (appliedFilters.department) params.append('department', appliedFilters.department);
      if (appliedFilters.role) params.append('role', appliedFilters.role);
      const query = params.toString();
      const url = query ? `${USERS_URL}?${query}` : USERS_URL;
      const response = await apiFetch(url);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = Array.isArray(err.detail)
          ? err.detail.map((d) => d.msg || d.message).filter(Boolean).join('. ')
          : err.detail || err.message || `Ошибка ${response.status}`;
        throw new Error(msg);
      }
      const json = await response.json();
      setData(json);
    } catch (e) {
      setError(e.message || 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const clamped = Math.max(30, Math.min(85, percentage));
      setSplitterPosition(clamped);
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const handleDividerMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleCreate = () => {
    setIsCreateOpen(true);
    setEditingUser(null);
    setCreateForm({
      email: '',
      password: '',
      username: '',
      role: 'agent',
      department: 'support',
    });
    setCreateError(null);
    setEditError(null);
  };

  const handleEdit = (item) => {
    setEditingUser(item);
    setIsCreateOpen(false);
    setEditForm({
      email: item.email ?? '',
      username: item.username ?? '',
      role: item.role ?? '',
      department: item.department ?? '',
      is_active: item.is_active ?? true,
    });
    setEditError(null);
    setCreateError(null);
  };

  const handleClosePanel = () => {
    setEditingUser(null);
    setIsCreateOpen(false);
    setEditError(null);
    setCreateError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingUser?.id) return;
    setEditError(null);
    setIsSaving(true);
    try {
      const body = {
        email: editForm.email,
        username: editForm.username,
        role: editForm.role,
        department: editForm.department,
        is_active: Boolean(editForm.is_active),
      };
      const response = await apiFetch(
        `${USER_UPDATE_URL}/${editingUser.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = Array.isArray(err.detail) && err.detail.length
          ? err.detail.map((d) => d.msg || d.message).filter(Boolean).join('. ')
          : err.detail || err.message || `Ошибка ${response.status}`;
        setEditError(msg);
        return;
      }
      Notify.success('Пользователь обновлён');
      handleClosePanel();
      fetchUsers();
    } catch (e) {
      setEditError(e.message || 'Не удалось сохранить');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!editingUser?.id) return;
    setEditError(null);
    setIsResettingPassword(true);
    try {
      const response = await apiFetch(
        `${USER_UPDATE_URL}/${editingUser.id}/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = Array.isArray(err.detail) && err.detail.length
          ? err.detail.map((d) => d.msg || d.message).filter(Boolean).join('. ')
          : err.detail || err.message || `Ошибка ${response.status}`;
        setEditError(msg);
        return;
      }
      Notify.success('Пароль сброшен');
    } catch (e) {
      setEditError(e.message || 'Не удалось сбросить пароль');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSaveCreate = async () => {
    setCreateError(null);
    setIsSaving(true);
    try {
      const body = {
        email: createForm.email,
        password: createForm.password,
        username: createForm.username,
        role: createForm.role,
        department: createForm.department,
      };
      const response = await apiFetch(REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = Array.isArray(err.detail) && err.detail.length
          ? err.detail.map((d) => d.msg || d.message).filter(Boolean).join('. ')
          : err.detail || err.message || `Ошибка ${response.status}`;
        setCreateError(msg);
        return;
      }
      Notify.success('Пользователь создан');
      handleClosePanel();
      fetchUsers();
    } catch (e) {
      setCreateError(e.message || 'Не удалось создать');
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <TableContainer theme={theme} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader />
        </TableContainer>
      );
    }
    if (error) {
      return (
        <TableContainer theme={theme}>
          <ErrorBlock theme={theme}>{error}</ErrorBlock>
        </TableContainer>
      );
    }
    if (data == null) return null;

    const isArray = Array.isArray(data);
    const items = isArray ? data : [data];

    if (items.length === 0) {
      return (
        <TableContainer theme={theme}>
          <JsonBlock theme={theme}>{JSON.stringify(data, null, 2)}</JsonBlock>
        </TableContainer>
      );
    }

    const first = items[0];
    const isObject = first !== null && typeof first === 'object' && !Array.isArray(first);
    const keys = isObject ? Object.keys(first).filter((k) => k !== 'id') : [];

    const sortedItems = [...items].sort((a, b) => {
      if (!sortBy || sortBy === 'Actions') return 0;
      const va = getSortableValue(a[sortBy]);
      const vb = getSortableValue(b[sortBy]);
      const cmp = typeof va === 'number' && typeof vb === 'number'
        ? va - vb
        : String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    const totalCount = sortedItems.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = sortedItems.slice(startIndex, endIndex);

    if (isObject && keys.length > 0) {
      return (
        <TableContainer theme={theme}>
          <Table theme={theme}>
            <TableHeader theme={theme}>
              <TableHeaderRow theme={theme}>
                {keys.map((k) => (
                  <TableHeaderCell
                    key={k}
                    theme={theme}
                    $sortable
                    onClick={() => handleSort(k)}
                  >
                    {k}
                    {sortBy === k && (
                      <SortIconWrap>
                        {sortOrder === 'asc' ? <HiChevronUp size={14} /> : <HiChevronDown size={14} />}
                      </SortIconWrap>
                    )}
                  </TableHeaderCell>
                ))}
                <TableHeaderCell theme={theme} $width="132px">
                  Actions
                </TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item, idx) => (
                <TableRow key={item?.id ?? idx} theme={theme}>
                  {keys.map((k) => (
                    <TableCell key={k} theme={theme}>
                      {item[k] === null || item[k] === undefined
                        ? '—'
                        : typeof item[k] === 'object'
                          ? JSON.stringify(item[k])
                          : String(item[k])}
                    </TableCell>
                  ))}
                  <ActionsCell theme={theme}>
                    <ActionButton
                      theme={theme}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }}
                      title="Редактировать"
                    >
                      <HiPencil size={16} />
                    </ActionButton>
                  </ActionsCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PageSizeWrapper theme={theme}>
            <PageSizeLabel theme={theme}>Записей на странице:</PageSizeLabel>
            <PageSizeSelect
              theme={theme}
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
            totalItems={totalCount}
            onPageChange={setCurrentPage}
            itemsPerPage={pageSize}
          />
        </TableContainer>
      );
    }

    return (
      <TableContainer theme={theme}>
        <JsonBlock theme={theme}>{JSON.stringify(data, null, 2)}</JsonBlock>
      </TableContainer>
    );
  };

  return (
    <Layout>
      <PageContent theme={theme}>
        <HeaderSection theme={theme}>
          <Title theme={theme}>Admin</Title>
          <ButtonsGroup>
            <Button
              theme={theme}
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              title={isFiltersVisible ? 'Скрыть фильтры' : 'Показать фильтры'}
            >
              Filters
            </Button>
            <Button theme={theme} $primary onClick={handleCreate}>
              Create
            </Button>
          </ButtonsGroup>
        </HeaderSection>

        <FiltersContainer theme={theme} $isVisible={isFiltersVisible}>
          <FilterGroup>
            <FilterLabel theme={theme}>Email</FilterLabel>
            <FilterInput
              theme={theme}
              type="text"
              placeholder="Поиск по email"
              value={filters.email}
              onChange={(e) => setFilters((prev) => ({ ...prev, email: e.target.value }))}
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel theme={theme}>Username</FilterLabel>
            <FilterInput
              theme={theme}
              type="text"
              placeholder="Поиск по username"
              value={filters.username}
              onChange={(e) => setFilters((prev) => ({ ...prev, username: e.target.value }))}
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel theme={theme}>Department</FilterLabel>
            <FilterSelect
              theme={theme}
              value={filters.department}
              onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
            >
              <option value="">Все</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel theme={theme}>Role</FilterLabel>
            <FilterSelect
              theme={theme}
              value={filters.role}
              onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}
            >
              <option value="">Все</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterButtons>
            <Button theme={theme} onClick={handleApplyFilters}>
              Применить
            </Button>
            <Button theme={theme} onClick={handleClearFilters}>
              Очистить
            </Button>
          </FilterButtons>
        </FiltersContainer>

        <PageContainer ref={containerRef}>
          <LeftPanel theme={theme} $flex={splitterPosition}>
            {renderContent()}
          </LeftPanel>

          <Divider
            theme={theme}
            $isHidden={!editingUser && !isCreateOpen}
            onMouseDown={handleDividerMouseDown}
          />

          <RightPanel theme={theme} $isVisible={!!editingUser || isCreateOpen} $flex={100 - splitterPosition}>
            {isCreateOpen && (
              <RightContent theme={theme}>
                <div style={{ marginBottom: 20 }}>
                  <BackButton theme={theme} type="button" onClick={handleClosePanel}>
                    ← Назад
                  </BackButton>
                </div>
                {createError && (
                  <ErrorBlock theme={theme} style={{ marginBottom: 16 }}>
                    {createError}
                  </ErrorBlock>
                )}
                <SettingSection>
                  <SettingLabel theme={theme}>Email</SettingLabel>
                  <SettingContent>
                    <Input
                      theme={theme}
                      type="text"
                      value={createForm.email}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="user@example.com"
                    />
                  </SettingContent>
                </SettingSection>
                <SettingSection>
                  <SettingLabel theme={theme}>Password</SettingLabel>
                  <SettingContent>
                    <Input
                      theme={theme}
                      type="password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Пароль"
                    />
                  </SettingContent>
                </SettingSection>
                <SettingSection>
                  <SettingLabel theme={theme}>Username</SettingLabel>
                  <SettingContent>
                    <Input
                      theme={theme}
                      type="text"
                      value={createForm.username}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="string"
                    />
                  </SettingContent>
                </SettingSection>
                <SettingSection>
                  <SettingLabel theme={theme}>Role</SettingLabel>
                  <SettingContent>
                    <Select
                      theme={theme}
                      value={createForm.role}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value }))}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </Select>
                  </SettingContent>
                </SettingSection>
                <SettingSection>
                  <SettingLabel theme={theme}>Department</SettingLabel>
                  <SettingContent>
                    <Select
                      theme={theme}
                      value={createForm.department}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, department: e.target.value }))}
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </SettingContent>
                </SettingSection>
                <SaveButton theme={theme} onClick={handleSaveCreate} disabled={isSaving}>
                  {isSaving ? 'Создание…' : 'Создать'}
                </SaveButton>
              </RightContent>
            )}
            {editingUser && (
              <RightContent theme={theme}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 20 }}>
                  <BackButton theme={theme} type="button" onClick={handleClosePanel}>
                    ← Назад
                  </BackButton>
                  <ResetPasswordButton theme={theme} type="button" onClick={handleResetPassword} disabled={isResettingPassword}>
                    {isResettingPassword ? 'Сброс…' : 'Reset Password'}
                  </ResetPasswordButton>
                </div>
                {editError && (
                  <ErrorBlock theme={theme} style={{ marginBottom: 16 }}>
                    {editError}
                  </ErrorBlock>
                )}
                <SettingSection>
                  <SettingLabel theme={theme}>Email</SettingLabel>
                  <SettingContent>
                    <Input
                      theme={theme}
                      type="text"
                      value={editForm.email}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </SettingContent>
                </SettingSection>
                <SettingSection>
                  <SettingLabel theme={theme}>Username</SettingLabel>
                  <SettingContent>
                    <Input
                      theme={theme}
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, username: e.target.value }))}
                    />
                  </SettingContent>
                </SettingSection>
                <SettingSection>
                  <SettingLabel theme={theme}>Role</SettingLabel>
                  <SettingContent>
                    <Select
                      theme={theme}
                      value={editForm.role}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </Select>
                  </SettingContent>
                </SettingSection>
                <SettingSection>
                  <SettingLabel theme={theme}>Department</SettingLabel>
                  <SettingContent>
                    <Select
                      theme={theme}
                      value={editForm.department}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, department: e.target.value }))}
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </SettingContent>
                </SettingSection>
                <SettingSection>
                  <SettingLabel theme={theme}>Активен</SettingLabel>
                  <SettingContent>
                    <CheckboxLabel theme={theme}>
                      <Checkbox
                        theme={theme}
                        type="checkbox"
                        checked={editForm.is_active}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                      />
                      is_active
                    </CheckboxLabel>
                  </SettingContent>
                </SettingSection>
                <SaveButton theme={theme} onClick={handleSaveEdit} disabled={isSaving}>
                  {isSaving ? 'Сохранение…' : 'Сохранить'}
                </SaveButton>
              </RightContent>
            )}
          </RightPanel>
        </PageContainer>
      </PageContent>
    </Layout>
  );
};
