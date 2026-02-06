import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { HiCheck, HiXMark, HiEye, HiTrash, HiPencil, HiSignal } from 'react-icons/hi2';
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
  width: 168px;
  min-width: 168px;
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

export const IntegrationsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [integrationType, setIntegrationType] = useState('');
  const [createForm, setCreateForm] = useState({
    name: '',
    username: '',
    url: '',
    secret_key: ''
  });
  const [splitterPosition, setSplitterPosition] = useState(75);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchIntegrations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch('https://qa.qodeq.net/api/v1/settings/integrations/', {
          method: 'GET',
          headers
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setIntegrations(Array.isArray(json) ? json : []);
      } catch (e) {
        setError(e.message);
        setIntegrations([]);
        // Не показываем уведомление при начальной загрузке, только при явных действиях
      } finally {
        setLoading(false);
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

  const handleRefresh = () => {
    const fetchIntegrations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch('https://qa.qodeq.net/api/v1/settings/integrations/', {
          method: 'GET',
          headers
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setIntegrations(Array.isArray(json) ? json : []);
      } catch (e) {
        setError(e.message);
        setIntegrations([]);
        Notify.failure('Ошибка при обновлении списка интеграций');
      } finally {
        setLoading(false);
      }
    };
    fetchIntegrations();
  };

  const handleCreate = () => {
    setIsCreateOpen(true);
    setEditingIntegration(null);
    setIntegrationType('');
    setCreateForm({
      name: '',
      username: '',
      url: '',
      secret_key: ''
    });
  };

  const handleEdit = (integration, e) => {
    e?.stopPropagation();
    setEditingIntegration(integration);
    setIsCreateOpen(false);
    setIntegrationType(integration.type || '');
    setCreateForm({
      name: integration.name || '',
      username: integration.username || '',
      url: integration.url || '',
      secret_key: integration.secret_key || ''
    });
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingIntegration(null);
    setIntegrationType('');
    setCreateForm({
      name: '',
      username: '',
      url: '',
      secret_key: ''
    });
  };

  const handleSaveCreate = async () => {
    if (!integrationType) {
      Notify.failure('Пожалуйста, выберите тип интеграции');
      return;
    }

    // Валидация полей в зависимости от типа интеграции
    if (!createForm.name || !createForm.name.trim()) {
      Notify.failure('Пожалуйста, заполните поле Name');
      return;
    }

    if (!createForm.secret_key || !createForm.secret_key.trim()) {
      Notify.failure('Пожалуйста, заполните поле Secret Key');
      return;
    }

    if (integrationType === 'livechat') {
      if (!createForm.username || !createForm.username.trim()) {
        Notify.failure('Пожалуйста, заполните поле Username');
        return;
      }
    } else if (integrationType === 'chatwoot') {
      if (!createForm.url || !createForm.url.trim()) {
        Notify.failure('Пожалуйста, заполните поле URL');
        return;
      }
    }

    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      let requestBody;
      let url;
      
      if (integrationType === 'livechat') {
        url = 'https://qa.qodeq.net/api/v1/settings/integrations/livechat';
        requestBody = {
          name: createForm.name.trim(),
          type: 'livechat',
          username: createForm.username.trim(),
          secret_key: createForm.secret_key.trim()
        };
      } else if (integrationType === 'chatwoot') {
        url = 'https://qa.qodeq.net/api/v1/settings/integrations/chatwoot';
        requestBody = {
          name: createForm.name.trim(),
          type: 'chatwoot',
          url: createForm.url.trim(),
          secret_key: createForm.secret_key.trim()
        };
      } else {
        Notify.failure('Неверный тип интеграции');
        return;
      }
      
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      
      // Обновляем список интеграций
      handleRefresh();
      handleCloseCreate();
      Notify.success('Интеграция успешно создана');
    } catch (e) {
      console.error('Ошибка при создании интеграции:', e);
      Notify.failure('Ошибка при создании интеграции');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingIntegration) return;

    if (!integrationType) {
      Notify.failure('Пожалуйста, выберите тип интеграции');
      return;
    }

    // Валидация полей в зависимости от типа интеграции
    if (!createForm.name || !createForm.name.trim()) {
      Notify.failure('Пожалуйста, заполните поле Name');
      return;
    }

    if (!createForm.secret_key || !createForm.secret_key.trim()) {
      Notify.failure('Пожалуйста, заполните поле Secret Key');
      return;
    }

    if (integrationType === 'livechat') {
      if (!createForm.username || !createForm.username.trim()) {
        Notify.failure('Пожалуйста, заполните поле Username');
        return;
      }
    } else if (integrationType === 'chatwoot') {
      if (!createForm.url || !createForm.url.trim()) {
        Notify.failure('Пожалуйста, заполните поле URL');
        return;
      }
    }

    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      let requestBody;
      const url = `https://qa.qodeq.net/api/v1/settings/integrations/${editingIntegration.id}`;
      
      if (integrationType === 'livechat') {
        requestBody = {
          name: createForm.name.trim(),
          type: 'livechat',
          username: createForm.username.trim(),
          secret_key: createForm.secret_key.trim()
        };
      } else if (integrationType === 'chatwoot') {
        requestBody = {
          name: createForm.name.trim(),
          type: 'chatwoot',
          url: createForm.url.trim(),
          secret_key: createForm.secret_key.trim()
        };
      } else {
        Notify.failure('Неверный тип интеграции');
        return;
      }
      
      const res = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      
      // Обновляем список интеграций
      handleRefresh();
      handleCloseCreate();
      Notify.success('Интеграция успешно обновлена');
    } catch (e) {
      console.error('Ошибка при сохранении интеграции:', e);
      Notify.failure('Ошибка при сохранении интеграции');
    }
  };

  const handleDelete = async (integration, e) => {
    e?.stopPropagation();
    
    if (!window.confirm(`Вы уверены, что хотите удалить интеграцию "${integration.name || integration.id}"?`)) {
      return;
    }
    
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`https://qa.qodeq.net/api/v1/settings/integrations/${integration.id}`, {
        method: 'DELETE',
        headers
      });
      
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      
      // Обновляем список интеграций
      handleRefresh();
      Notify.success('Интеграция успешно удалена');
    } catch (e) {
      console.error('Ошибка при удалении интеграции:', e);
      Notify.failure('Ошибка при удалении интеграции');
    }
  };

  const handleCheckConnection = async (integration, e) => {
    e?.stopPropagation();
    
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`https://qa.qodeq.net/api/v1/settings/integrations/connection/${integration.id}`, {
        method: 'POST',
        headers
      });
      
      if (res.ok && res.status === 200) {
        Notify.success('Запрос успешен');
        return;
      }
      
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      
      const data = await res.json();
      const isConnected = data === true || data === 'true' || (typeof data === 'object' && data.connected === true);
      
      if (isConnected) {
        Notify.success('Соединение успешно установлено');
      } else {
        Notify.failure('Не удалось установить соединение');
      }
    } catch (e) {
      console.error('Ошибка при проверке соединения:', e);
      Notify.failure('Ошибка при проверке соединения');
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

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>Integrations</Title>
            <ButtonsGroup>
              <Button theme={theme} onClick={handleRefresh}>
                Refresh
              </Button>
              <Button theme={theme} $primary onClick={handleCreate}>
                Create
              </Button>
            </ButtonsGroup>
          </HeaderSection>

          <PageContainer ref={containerRef}>
            <LeftPanel $flex={splitterPosition}>
              <TableContainer>
            {error && <ErrorBlock>{error}</ErrorBlock>}
            {!error && (
              <>
                {integrations.length > 0 ? (
                  <Table theme={theme}>
                    <TableHeader theme={theme}>
                      <TableHeaderRow>
                        <TableHeaderCell theme={theme}>Name</TableHeaderCell>
                        <TableHeaderCell theme={theme}>Type</TableHeaderCell>
                        <TableHeaderCell theme={theme}>Available</TableHeaderCell>
                        <TableHeaderCell theme={theme}>Username</TableHeaderCell>
                        <TableHeaderCell theme={theme}>URL</TableHeaderCell>
                        <TableHeaderCell theme={theme}>Secret Key</TableHeaderCell>
                        <TableHeaderCell theme={theme} $width="168px">Actions</TableHeaderCell>
                      </TableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {integrations.map((integration) => (
                        <TableRow key={integration.id} theme={theme}>
                          <TableCell theme={theme}>{integration.name || '-'}</TableCell>
                          <TableCell theme={theme}>{integration.type || '-'}</TableCell>
                          <TableCell theme={theme}>
                            <StatusBadge $active={integration.available}>
                              {integration.available ? <HiCheck /> : <HiXMark />}
                              {integration.available ? 'Available' : 'Unavailable'}
                            </StatusBadge>
                          </TableCell>
                          <TableCell theme={theme}>{integration.username || '-'}</TableCell>
                          <TableCell theme={theme}>{integration.url || '-'}</TableCell>
                          <TableCell theme={theme}>{integration.secret_key || '-'}</TableCell>
                          <ActionsCell theme={theme}>
                            <ActionButton
                              theme={theme}
                              onClick={() => navigate(`/integrations/${integration.id}`)}
                              title="Просмотр"
                            >
                              <HiEye size={16} />
                            </ActionButton>
                            <ActionButton
                              theme={theme}
                              onClick={(e) => handleEdit(integration, e)}
                              title="Редактировать"
                            >
                              <HiPencil size={16} />
                            </ActionButton>
                            <ActionButton
                              theme={theme}
                              onClick={(e) => handleCheckConnection(integration, e)}
                              title="Проверить соединение"
                            >
                              <HiSignal size={16} />
                            </ActionButton>
                            <ActionButton
                              theme={theme}
                              onClick={(e) => handleDelete(integration, e)}
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
                  <EmptyState theme={theme}>Нет интеграций</EmptyState>
                )}
              </>
            )}
              </TableContainer>
            </LeftPanel>

            <Divider 
              theme={theme} 
              $isHidden={!editingIntegration && !isCreateOpen}
              onMouseDown={handleDividerMouseDown}
            />

            <RightPanel theme={theme} $isVisible={!!editingIntegration || isCreateOpen} $flex={100 - splitterPosition}>
              {(editingIntegration || isCreateOpen) && (
                <RightContent theme={theme}>
                  <BackButton theme={theme} onClick={handleCloseCreate}>
                    ← Назад
                  </BackButton>

                  <SettingSection>
                    <SettingLabel theme={theme}>Type:</SettingLabel>
                    <SettingContent>
                      <Select
                        theme={theme}
                        value={integrationType}
                        onChange={(e) => setIntegrationType(e.target.value)}
                        disabled={!!editingIntegration}
                      >
                        <option value="">Выберите тип интеграции</option>
                        <option value="livechat">Livechat</option>
                        <option value="chatwoot">Chatwoot</option>
                      </Select>
                    </SettingContent>
                  </SettingSection>

                  {integrationType && (
                    <>
                      <SettingSection>
                        <SettingLabel theme={theme}>Name:</SettingLabel>
                        <SettingContent>
                          <Input
                            theme={theme}
                            type="text"
                            value={createForm.name}
                            onChange={(e) => updateForm('name', e.target.value)}
                          />
                        </SettingContent>
                      </SettingSection>

                      {integrationType === 'livechat' && (
                        <SettingSection>
                          <SettingLabel theme={theme}>Username:</SettingLabel>
                          <SettingContent>
                            <Input
                              theme={theme}
                              type="text"
                              value={createForm.username}
                              onChange={(e) => updateForm('username', e.target.value)}
                              placeholder="bot@example.com"
                            />
                          </SettingContent>
                        </SettingSection>
                      )}

                      {integrationType === 'chatwoot' && (
                        <SettingSection>
                          <SettingLabel theme={theme}>URL:</SettingLabel>
                          <SettingContent>
                            <Input
                              theme={theme}
                              type="text"
                              value={createForm.url}
                              onChange={(e) => updateForm('url', e.target.value)}
                              placeholder="https://chatwoot.example.com"
                            />
                          </SettingContent>
                        </SettingSection>
                      )}

                      <SettingSection>
                        <SettingLabel theme={theme}>Secret Key:</SettingLabel>
                        <SettingContent>
                          <Input
                            theme={theme}
                            type="text"
                            value={createForm.secret_key}
                            onChange={(e) => updateForm('secret_key', e.target.value)}
                            placeholder="sk-123abc"
                          />
                        </SettingContent>
                      </SettingSection>
                    </>
                  )}

                  <SaveButton theme={theme} onClick={editingIntegration ? handleSaveEdit : handleSaveCreate}>
                    {editingIntegration ? 'Сохранить' : 'Создать'}
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

