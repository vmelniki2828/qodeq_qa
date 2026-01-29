import { useState, useEffect, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { HiCheck, HiXMark, HiArrowUp, HiArrowDown, HiPencil, HiTrash } from 'react-icons/hi2';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

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
  flex: ${({ $flex }) => $flex || 75} 1 0;
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
  flex: ${({ $isVisible, $flex }) => ($isVisible ? ($flex || 25) : 0)} 1 0;
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

const Input = styled.input`
  width: 100%;
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

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Select = styled.select`
  width: 100%;
  min-width: 0;
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
    width: 100%;
    max-width: 100%;
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
  align-self: flex-end;
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

  &:hover {
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
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
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  user-select: none;
  transition: background-color 0.15s ease;
  position: relative;

  &:hover {
    background-color: ${({ theme, $sortable }) =>
      $sortable
        ? theme.colors.primary === '#0D0D0D'
          ? '#f8f8f8'
          : 'rgba(255,255,255,0.04)'
        : 'transparent'};
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

const ActionsCell = styled(TableCell)`
  width: 88px;
  min-width: 88px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 0 auto;
  text-align: center;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  ${({ $active }) => $active 
    ? 'background: rgba(34, 197, 94, 0.15); color: #16a34a;'
    : 'background: rgba(239, 68, 68, 0.15); color: #dc2626;'
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

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
`;

const FiltersContainer = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
  gap: 16px;
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
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;


export const ProjectsPage = () => {
  const { theme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [editingProject, setEditingProject] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [integrations, setIntegrations] = useState([]);
  const [editForm, setEditForm] = useState({
    title: '',
    code: '',
    url: '',
    is_active: true,
    integration_id: ''
  });
  const [splitterPosition, setSplitterPosition] = useState(75);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [filters, setFilters] = useState({
    integration_id: '',
    code: '',
    is_active: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    integration_id: '',
    code: '',
    is_active: ''
  });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        // Формируем URL с примененными фильтрами
        const params = new URLSearchParams();
        if (appliedFilters.integration_id) params.append('integration_id', appliedFilters.integration_id);
        if (appliedFilters.code) params.append('code', appliedFilters.code);
        if (appliedFilters.is_active !== '') params.append('is_active', appliedFilters.is_active);
        params.append('skip', '0');
        params.append('limit', '100');
        
        const url = `https://209.38.246.190/api/v1/settings/project/?${params.toString()}`;
        
        const res = await fetch(url, {
          method: 'GET',
          headers
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setProjects(Array.isArray(json) ? json : []);
      } catch (e) {
        setError(e.message);
        setProjects([]);
        // Не показываем уведомление при начальной загрузке, только при явных действиях
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [appliedFilters]);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch('https://209.38.246.190/api/v1/settings/integrations/', {
          method: 'GET',
          headers
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setIntegrations(Array.isArray(json) ? json : []);
      } catch (e) {
        console.error('Ошибка при загрузке интеграций:', e);
        setIntegrations([]);
      }
    };
    fetchIntegrations();
  }, []);

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

    const handleMouseUp = () => {
      setIsDragging(false);
    };

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

  const sortedProjects = [...projects].sort((a, b) => {
    if (!sortField) return 0;
    let aVal, bVal;
    switch (sortField) {
      case 'title':
        aVal = (a.title || '').toLowerCase();
        bVal = (b.title || '').toLowerCase();
        break;
      case 'code':
        aVal = (a.code || '').toLowerCase();
        bVal = (b.code || '').toLowerCase();
        break;
      case 'is_active':
        aVal = a.is_active ? 1 : 0;
        bVal = b.is_active ? 1 : 0;
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
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        // Формируем URL с примененными фильтрами
        const params = new URLSearchParams();
        if (appliedFilters.integration_id) params.append('integration_id', appliedFilters.integration_id);
        if (appliedFilters.code) params.append('code', appliedFilters.code);
        if (appliedFilters.is_active !== '') params.append('is_active', appliedFilters.is_active);
        params.append('skip', '0');
        params.append('limit', '100');
        
        const url = `https://209.38.246.190/api/v1/settings/project/?${params.toString()}`;
        
        const res = await fetch(url, {
          method: 'GET',
          headers
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setProjects(Array.isArray(json) ? json : []);
      } catch (e) {
        setError(e.message);
        setProjects([]);
        Notify.failure('Ошибка при обновлении списка проектов');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    setFilters({
      integration_id: '',
      code: '',
      is_active: ''
    });
    setAppliedFilters({
      integration_id: '',
      code: '',
      is_active: ''
    });
  };

  const handleCreate = () => {
    setIsCreateOpen(true);
    setEditingProject(null);
    setEditForm({
      title: '',
      code: '',
      url: '',
      is_active: true,
      integration_id: ''
    });
  };

  const handleEdit = (project, e) => {
    e?.stopPropagation();
    setEditingProject(project);
    setIsCreateOpen(false);
    setEditForm({
      title: project.title || '',
      code: project.code || '',
      url: project.url || '',
      is_active: project.is_active ?? true
    });
  };

  const handleCloseEdit = () => {
    setEditingProject(null);
    setIsCreateOpen(false);
    setEditForm({
      title: '',
      code: '',
      url: '',
      is_active: true,
      integration_id: ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProject) return;
    
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      // Формируем тело запроса с нужными полями
      const requestBody = {
        title: editForm.title,
        url: editForm.url,
        is_active: editForm.is_active,
        code: editForm.code
      };
      
      const res = await fetch(`https://209.38.246.190/api/v1/settings/project/${editingProject.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      
      // Обновляем список проектов
      handleRefresh();
      handleCloseEdit();
      Notify.success('Проект успешно обновлен');
    } catch (e) {
      console.error('Ошибка при сохранении проекта:', e);
      Notify.failure('Ошибка при сохранении проекта');
    }
  };

  const handleDelete = async (project, e) => {
    e?.stopPropagation();
    
    if (!window.confirm(`Вы уверены, что хотите удалить проект "${project.title || project.id}"?`)) {
      return;
    }
    
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`https://209.38.246.190/api/v1/settings/project/${project.id}`, {
        method: 'DELETE',
        headers
      });
      
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      
      // Обновляем список проектов
      handleRefresh();
      Notify.success('Проект успешно удален');
    } catch (e) {
      console.error('Ошибка при удалении проекта:', e);
      Notify.failure('Ошибка при удалении проекта');
    }
  };

  const handleSaveCreate = async () => {
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const requestBody = {
        title: editForm.title,
        is_active: editForm.is_active,
        url: editForm.url,
        code: editForm.code,
        integration_id: editForm.integration_id
      };
      
      const res = await fetch('https://209.38.246.190/api/v1/settings/project/', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      
      // Обновляем список проектов
      handleRefresh();
      handleCloseEdit();
      Notify.success('Проект успешно создан');
    } catch (e) {
      console.error('Ошибка при создании проекта:', e);
      Notify.failure('Ошибка при создании проекта');
    }
  };

  const updateForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

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
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <HeaderSection theme={theme}>
            <Title theme={theme}>Projects</Title>
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
              <Button theme={theme} $primary onClick={handleCreate}>
                Create
              </Button>
            </ButtonsGroup>
          </HeaderSection>

          <PageContainer ref={containerRef}>
            <LeftPanel $flex={splitterPosition}>
              <FiltersContainer theme={theme} $isVisible={isFiltersVisible}>
                <FilterGroup>
                  <FilterLabel theme={theme}>Integration ID</FilterLabel>
                  <Select
                    theme={theme}
                    value={filters.integration_id}
                    onChange={(e) => setFilters(prev => ({ ...prev, integration_id: e.target.value }))}
                  >
                    <option value="">Выберите интеграцию</option>
                    {integrations.map((integration) => (
                      <option key={integration.id} value={integration.id}>
                        {integration.name || integration.id}
                      </option>
                    ))}
                  </Select>
                </FilterGroup>
                <FilterGroup>
                  <FilterLabel theme={theme}>Code</FilterLabel>
                  <Input
                    theme={theme}
                    type="text"
                    value={filters.code}
                    onChange={(e) => setFilters(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="Введите code"
                  />
                </FilterGroup>
                <FilterGroup>
                  <FilterLabel theme={theme}>Is Active</FilterLabel>
                  <Select
                    theme={theme}
                    value={filters.is_active}
                    onChange={(e) => setFilters(prev => ({ ...prev, is_active: e.target.value }))}
                  >
                    <option value="">Все</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Select>
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
              <TableContainer>
                {error && <ErrorBlock>{error}</ErrorBlock>}
                {!error && (
                  <>
                    {projects.length > 0 ? (
                      <Table theme={theme}>
                        <TableHeader theme={theme}>
                          <TableHeaderRow>
                            <TableHeaderCell 
                              theme={theme} 
                              $sortable
                              onClick={() => handleSort('title')} 
                              $sorted={sortField === 'title'}
                            >
                              Title <SortIcon>{getSortIcon('title')}</SortIcon>
                            </TableHeaderCell>
                            <TableHeaderCell 
                              theme={theme} 
                              $sortable
                              onClick={() => handleSort('code')} 
                              $sorted={sortField === 'code'}
                            >
                              Code <SortIcon>{getSortIcon('code')}</SortIcon>
                            </TableHeaderCell>
                            <TableHeaderCell theme={theme}>URL</TableHeaderCell>
                            <TableHeaderCell 
                              theme={theme} 
                              $sortable
                              onClick={() => handleSort('is_active')} 
                              $sorted={sortField === 'is_active'}
                            >
                              Status <SortIcon>{getSortIcon('is_active')}</SortIcon>
                            </TableHeaderCell>
                            <TableHeaderCell theme={theme} $width="88px">Actions</TableHeaderCell>
                          </TableHeaderRow>
                        </TableHeader>
                        <TableBody>
                          {sortedProjects.map((project) => (
                            <TableRow key={project.id} theme={theme}>
                              <TableCell theme={theme}>{project.title || '—'}</TableCell>
                              <TableCell theme={theme}>{project.code || '—'}</TableCell>
                              <TableCell theme={theme}>
                                {project.url ? (
                                  <a 
                                    href={project.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ color: theme.colors.accent, textDecoration: 'underline' }}
                                  >
                                    {project.url}
                                  </a>
                                ) : '—'}
                              </TableCell>
                              <TableCell theme={theme}>
                                <StatusBadge $active={project.is_active}>
                                  {project.is_active ? (
                                    <>
                                      <HiCheck size={14} />
                                      Active
                                    </>
                                  ) : (
                                    <>
                                      <HiXMark size={14} />
                                      Inactive
                                    </>
                                  )}
                                </StatusBadge>
                              </TableCell>
                              <ActionsCell theme={theme}>
                                <ActionButton 
                                  theme={theme} 
                                  onClick={(e) => handleEdit(project, e)} 
                                  title="Редактировать"
                                >
                                  <HiPencil size={16} />
                                </ActionButton>
                                <ActionButton 
                                  theme={theme} 
                                  onClick={(e) => handleDelete(project, e)} 
                                  title="Удалить"
                                  style={{ color: '#ef4444' }}
                                >
                                  <HiTrash size={16} />
                                </ActionButton>
                              </ActionsCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <EmptyState theme={theme}>Нет проектов</EmptyState>
                    )}
                  </>
                )}
              </TableContainer>
            </LeftPanel>

            <Divider 
              theme={theme} 
              $isHidden={!editingProject && !isCreateOpen}
              onMouseDown={handleDividerMouseDown}
            />

            <RightPanel theme={theme} $isVisible={!!editingProject || isCreateOpen} $flex={100 - splitterPosition}>
              {(editingProject || isCreateOpen) && (
                <RightContent theme={theme}>
                  <BackButton theme={theme} onClick={handleCloseEdit}>
                    ← Назад
                  </BackButton>

                  <SettingSection>
                    <SettingLabel theme={theme}>Title:</SettingLabel>
                    <SettingContent>
                      <Input
                        theme={theme}
                        type="text"
                        value={editForm.title}
                        onChange={(e) => updateForm('title', e.target.value)}
                      />
                    </SettingContent>
                  </SettingSection>

                  <SettingSection>
                    <SettingLabel theme={theme}>Code:</SettingLabel>
                    <SettingContent>
                      <Input
                        theme={theme}
                        type="text"
                        value={editForm.code}
                        onChange={(e) => updateForm('code', e.target.value)}
                      />
                    </SettingContent>
                  </SettingSection>

                  <SettingSection>
                    <SettingLabel theme={theme}>URL:</SettingLabel>
                    <SettingContent>
                      <Input
                        theme={theme}
                        type="text"
                        value={editForm.url}
                        onChange={(e) => updateForm('url', e.target.value)}
                      />
                    </SettingContent>
                  </SettingSection>

                  <SettingSection>
                    <SettingLabel theme={theme}>Active:</SettingLabel>
                    <SettingContent>
                      <CheckboxLabel theme={theme}>
                        <Checkbox
                          type="checkbox"
                          checked={editForm.is_active}
                          onChange={(e) => updateForm('is_active', e.target.checked)}
                          theme={theme}
                        />
                        <span>Активен</span>
                      </CheckboxLabel>
                    </SettingContent>
                  </SettingSection>

                  {isCreateOpen && (
                    <SettingSection>
                      <SettingLabel theme={theme}>Integration:</SettingLabel>
                      <SettingContent>
                        <Select
                          theme={theme}
                          value={editForm.integration_id}
                          onChange={(e) => updateForm('integration_id', e.target.value)}
                        >
                          <option value="">Выберите интеграцию</option>
                          {integrations.map((integration) => (
                            <option key={integration.id} value={integration.id}>
                              {integration.name || integration.id}
                            </option>
                          ))}
                        </Select>
                      </SettingContent>
                    </SettingSection>
                  )}

                  <SaveButton theme={theme} onClick={editingProject ? handleSaveEdit : handleSaveCreate}>
                    {editingProject ? 'Сохранить' : 'Создать'}
                  </SaveButton>
                </RightContent>
              )}
            </RightPanel>
          </PageContainer>
        </div>
      </ThemeProvider>
    </Layout>
  );
};
