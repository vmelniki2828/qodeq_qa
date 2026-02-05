import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { HiCheck, HiXMark, HiEye, HiPencil } from 'react-icons/hi2';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
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
  text-align: center;
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

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
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


export const AgentsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [integrations, setIntegrations] = useState([]);
  const [filters, setFilters] = useState({
    lcid: '',
    type: '',
    name: '',
    available: '',
    integration_id: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    lcid: '',
    type: '',
    name: '',
    available: '',
    integration_id: ''
  });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [createForm, setCreateForm] = useState({
    type: 'agent',
    lcid: '',
    name: '',
    available: true,
    integration_id: ''
  });
  const [splitterPosition, setSplitterPosition] = useState(75);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

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
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        // Формируем URL с примененными фильтрами
        const params = new URLSearchParams();
        if (appliedFilters.lcid) params.append('lcid', appliedFilters.lcid);
        if (appliedFilters.type) params.append('type', appliedFilters.type);
        if (appliedFilters.name) params.append('name', appliedFilters.name);
        if (appliedFilters.available !== '') params.append('available', appliedFilters.available);
        if (appliedFilters.integration_id) params.append('integration_id', appliedFilters.integration_id);
        params.append('skip', '0');
        params.append('limit', '10');
        
        const url = `https://209.38.246.190/api/v1/settings/agent/?${params.toString()}`;
        
        const res = await fetch(url, {
          method: 'GET',
          headers
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setAgents(Array.isArray(json) ? json : []);
      } catch (e) {
        setError(e.message);
        setAgents([]);
        // Не показываем уведомление при начальной загрузке, только при явных действиях
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, [appliedFilters]);

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

  const handleRefresh = () => {
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        // Формируем URL с примененными фильтрами
        const params = new URLSearchParams();
        if (appliedFilters.lcid) params.append('lcid', appliedFilters.lcid);
        if (appliedFilters.type) params.append('type', appliedFilters.type);
        if (appliedFilters.name) params.append('name', appliedFilters.name);
        if (appliedFilters.available !== '') params.append('available', appliedFilters.available);
        if (appliedFilters.integration_id) params.append('integration_id', appliedFilters.integration_id);
        params.append('skip', '0');
        params.append('limit', '10');
        
        const url = `https://209.38.246.190/api/v1/settings/agent/?${params.toString()}`;
        
        const res = await fetch(url, {
          method: 'GET',
          headers
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setAgents(Array.isArray(json) ? json : []);
      } catch (e) {
        setError(e.message);
        setAgents([]);
        Notify.failure('Ошибка при обновлении списка агентов');
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    setFilters({
      lcid: '',
      type: '',
      name: '',
      available: '',
      integration_id: ''
    });
    setAppliedFilters({
      lcid: '',
      type: '',
      name: '',
      available: '',
      integration_id: ''
    });
  };

  const handleCreate = () => {
    setIsCreateOpen(true);
    setCreateForm({
      type: 'agent',
      lcid: '',
      name: '',
      available: true,
      integration_id: ''
    });
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingAgent(null);
    setCreateForm({
      type: 'agent',
      lcid: '',
      name: '',
      available: true,
      integration_id: ''
    });
  };

  const handleEdit = (agent, e) => {
    e?.stopPropagation();
    setEditingAgent(agent);
    setIsCreateOpen(true);
    setCreateForm({
      type: agent.type || 'agent',
      lcid: agent.lcid || '',
      name: agent.name || '',
      available: agent.available === true || agent.available === 'true',
      integration_id: agent.integration_id || ''
    });
  };

  const handleSaveCreate = async () => {
    if (!createForm.name || !createForm.name.trim()) {
      Notify.failure('Пожалуйста, заполните поле Name');
      return;
    }

    if (!createForm.lcid || !createForm.lcid.trim()) {
      Notify.failure('Пожалуйста, заполните поле LCID');
      return;
    }

    if (!createForm.integration_id) {
      Notify.failure('Пожалуйста, выберите Integration ID');
      return;
    }

    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const requestBody = {
        type: createForm.type,
        lcid: createForm.lcid.trim(),
        name: createForm.name.trim(),
        available: createForm.available,
        integration_id: createForm.integration_id
      };
      
      const res = await fetch('https://209.38.246.190/api/v1/settings/agent/', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      
      // Обновляем список агентов
      handleRefresh();
      handleCloseCreate();
      Notify.success('Агент успешно создан');
    } catch (e) {
      console.error('Ошибка при создании агента:', e);
      Notify.failure('Ошибка при создании агента');
    }
  };

  const handleSaveEdit = async () => {
    if (!createForm.name || !createForm.name.trim()) {
      Notify.failure('Пожалуйста, заполните поле Name');
      return;
    }

    if (!createForm.lcid || !createForm.lcid.trim()) {
      Notify.failure('Пожалуйста, заполните поле LCID');
      return;
    }

    if (!editingAgent || !editingAgent.id) {
      Notify.failure('Ошибка: агент не найден');
      return;
    }

    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const requestBody = {
        type: createForm.type,
        lcid: createForm.lcid.trim(),
        name: createForm.name.trim(),
        available: createForm.available
      };
      
      const res = await fetch(`https://209.38.246.190/api/v1/settings/agent/${editingAgent.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      
      // Обновляем список агентов
      handleCloseCreate();
      handleRefresh();
      Notify.success('Агент успешно обновлен');
    } catch (e) {
      Notify.failure(`Ошибка при сохранении: ${e.message}`);
    }
  };

  const updateForm = (field, value) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
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

  // Получаем все уникальные ключи из данных для создания заголовков таблицы
  const getTableHeaders = () => {
    if (agents.length === 0) return ['Actions'];
    const allKeys = new Set();
    agents.forEach(agent => {
      Object.keys(agent).forEach(key => {
        if (key !== 'id') {
          allKeys.add(key);
        }
      });
    });
    const sortedKeys = Array.from(allKeys).sort();
    return [...sortedKeys, 'Actions'];
  };

  const headers = getTableHeaders();

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>Agents</Title>
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
              <FilterLabel theme={theme}>LCID</FilterLabel>
              <Input
                theme={theme}
                type="text"
                value={filters.lcid}
                onChange={(e) => setFilters(prev => ({ ...prev, lcid: e.target.value }))}
                placeholder="Введите lcid"
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel theme={theme}>Type</FilterLabel>
              <Select
                theme={theme}
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="">Все</option>
                <option value="agent">Agent</option>
                <option value="bot">Bot</option>
                <option value="supervisor">Supervisor</option>
              </Select>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel theme={theme}>Name</FilterLabel>
              <Input
                theme={theme}
                type="text"
                value={filters.name}
                onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Введите name"
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel theme={theme}>Available</FilterLabel>
              <Select
                theme={theme}
                value={filters.available}
                onChange={(e) => setFilters(prev => ({ ...prev, available: e.target.value }))}
              >
                <option value="">Все</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </Select>
            </FilterGroup>
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
                    {agents.length > 0 ? (
                      <Table theme={theme}>
                        <TableHeader theme={theme}>
                          <TableHeaderRow>
                            {headers.map((header) => (
                              <TableHeaderCell 
                                key={header} 
                                theme={theme}
                                $width={header === 'Actions' ? '132px' : undefined}
                              >
                                {header}
                              </TableHeaderCell>
                            ))}
                          </TableHeaderRow>
                        </TableHeader>
                        <TableBody>
                          {agents.map((agent, index) => (
                            <TableRow key={agent.id || index} theme={theme}>
                              {headers.map((header) => {
                                if (header === 'Actions') {
                                  return (
                                    <ActionsCell key={header} theme={theme}>
                                      <ActionButton
                                        theme={theme}
                                        onClick={() => navigate(`/agents/${agent.id}`)}
                                        title="Просмотр деталей"
                                      >
                                        <HiEye size={16} />
                                      </ActionButton>
                                      <ActionButton
                                        theme={theme}
                                        onClick={(e) => handleEdit(agent, e)}
                                        title="Редактировать"
                                      >
                                        <HiPencil size={16} />
                                      </ActionButton>
                                    </ActionsCell>
                                  );
                                }
                                return (
                                  <TableCell key={header} theme={theme}>
                                    {header === 'available' ? (
                                      agent[header] === true || agent[header] === 'true' ? (
                                        <HiCheck size={18} style={{ color: '#16a34a' }} />
                                      ) : (
                                        <HiXMark size={18} style={{ color: '#dc2626' }} />
                                      )
                                    ) : agent[header] !== null && agent[header] !== undefined
                                      ? typeof agent[header] === 'object'
                                        ? JSON.stringify(agent[header])
                                        : String(agent[header])
                                      : '—'}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <EmptyState theme={theme}>Нет агентов</EmptyState>
                    )}
                  </>
                )}
              </TableContainer>
            </LeftPanel>

            <Divider 
              theme={theme} 
              $isHidden={!isCreateOpen && !editingAgent}
              onMouseDown={handleDividerMouseDown}
            />

            <RightPanel theme={theme} $isVisible={isCreateOpen || editingAgent} $flex={100 - splitterPosition}>
              {(isCreateOpen || editingAgent) && (
                <RightContent theme={theme}>
                  <BackButton theme={theme} onClick={handleCloseCreate}>
                    ← Назад
                  </BackButton>

                  <SettingSection>
                    <SettingLabel theme={theme}>Type:</SettingLabel>
                    <SettingContent>
                      <Select
                        theme={theme}
                        value={createForm.type}
                        onChange={(e) => updateForm('type', e.target.value)}
                      >
                        <option value="agent">Agent</option>
                        <option value="bot">Bot</option>
                        <option value="supervisor">Supervisor</option>
                      </Select>
                    </SettingContent>
                  </SettingSection>

                  <SettingSection>
                    <SettingLabel theme={theme}>LCID:</SettingLabel>
                    <SettingContent>
                      <Input
                        theme={theme}
                        type="text"
                        value={createForm.lcid}
                        onChange={(e) => updateForm('lcid', e.target.value)}
                        placeholder="Айди или почта из интеграции"
                      />
                    </SettingContent>
                  </SettingSection>

                  <SettingSection>
                    <SettingLabel theme={theme}>Name:</SettingLabel>
                    <SettingContent>
                      <Input
                        theme={theme}
                        type="text"
                        value={createForm.name}
                        onChange={(e) => updateForm('name', e.target.value)}
                        placeholder="Имя Агента"
                      />
                    </SettingContent>
                  </SettingSection>

                  <SettingSection>
                    <SettingLabel theme={theme}>Available:</SettingLabel>
                    <SettingContent>
                      <CheckboxLabel theme={theme}>
                        <Checkbox
                          type="checkbox"
                          checked={createForm.available}
                          onChange={(e) => updateForm('available', e.target.checked)}
                          theme={theme}
                        />
                        <span>Доступен</span>
                      </CheckboxLabel>
                    </SettingContent>
                  </SettingSection>

                  {!editingAgent && (
                    <SettingSection>
                      <SettingLabel theme={theme}>Integration ID:</SettingLabel>
                      <SettingContent>
                        <Select
                          theme={theme}
                          value={createForm.integration_id}
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

                  <SaveButton theme={theme} onClick={editingAgent ? handleSaveEdit : handleSaveCreate}>
                    {editingAgent ? 'Сохранить' : 'Создать'}
                  </SaveButton>
                </RightContent>
              )}
            </RightPanel>
          </PageContainer>
        </PageContent>
      </ThemeProvider>
    </Layout>
  );
};

