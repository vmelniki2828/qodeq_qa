import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { apiFetch } from '../utils/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

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
  gap: 16px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
`;

const DataContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const DataCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const CardContent = styled.div`
  flex: 1;
`;

const GroupName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const GroupHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const HeadLabel = styled.span`
  font-weight: 500;
`;

const HeadValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonsGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const CreateButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  max-width: ${({ $isCreateModal }) => ($isCreateModal ? '800px' : '600px')};
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

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

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormSection = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const FormInput = styled.input`
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

const FormSelect = styled.select`
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

const FormTextarea = styled.textarea`
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
  resize: none;
  min-height: 120px;
  height: 120px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const AgentsInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AgentInputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RemoveAgentButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const AddAgentButton = styled.button`
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

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const CreateSaveButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

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
  
  return '';
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
    
    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    months.push({
      value: `${year}-${String(month + 1).padStart(2, '0')}`,
      label: `${monthNames[month]} ${year}`
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

export const GroupSupportsPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const hasLoadedRef = useRef(false);
  const isFetchingRef = useRef(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [heads, setHeads] = useState([]);
  const [isLoadingHeads, setIsLoadingHeads] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [isLoadingSupervisors, setIsLoadingSupervisors] = useState(false);
  const headsLoadedRef = useRef(false);
  const supervisorsLoadedRef = useRef(false);
  const months = generateMonths();
  const [createForm, setCreateForm] = useState({
    supervisor_id: '',
    supervisor_username: '',
    head_id: '',
    head_username: ''
  });

  const fetchData = async () => {
    // Предотвращаем множественные одновременные запросы
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const url = `https://209.38.246.190/api/v1/group/support/`;
      
      const response = await apiFetch(url, {
        method: 'GET',
      });
      
      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          if (response.status === 400) {
            errorMessage = 'Неверные параметры запроса';
          } else if (response.status === 401) {
            errorMessage = 'Необходима авторизация';
          } else if (response.status === 500) {
            errorMessage = 'Ошибка сервера';
          }
        }
        throw new Error(errorMessage);
      }
      
      const json = await response.json();
      setData(json);
      Notify.success('Данные успешно загружены');
    } catch (e) {
      const errorMessage = e.message || 'Произошла ошибка при загрузке данных';
      setError(errorMessage);
      setData(null);
      Notify.failure(errorMessage);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Автоматическая загрузка данных при монтировании
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHeads = async () => {
    if (headsLoadedRef.current && heads.length > 0) {
      return;
    }
    
    setIsLoadingHeads(true);
    try {
      const response = await apiFetch('https://209.38.246.190/api/v1/group/support/heads/', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`);
      }
      
      const json = await response.json();
      setHeads(Array.isArray(json) ? json : []);
      headsLoadedRef.current = true;
    } catch (e) {
      console.error('Ошибка при загрузке heads:', e);
      Notify.failure('Не удалось загрузить список руководителей');
      setHeads([]);
    } finally {
      setIsLoadingHeads(false);
    }
  };

  const fetchSupervisors = async () => {
    if (supervisorsLoadedRef.current && supervisors.length > 0) {
      return;
    }
    
    setIsLoadingSupervisors(true);
    try {
      const response = await apiFetch('https://209.38.246.190/api/v1/group/support/supervisors/', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`);
      }
      
      const json = await response.json();
      setSupervisors(Array.isArray(json) ? json : []);
      supervisorsLoadedRef.current = true;
    } catch (e) {
      console.error('Ошибка при загрузке supervisors:', e);
      Notify.failure('Не удалось загрузить список супервайзеров');
      setSupervisors([]);
    } finally {
      setIsLoadingSupervisors(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateForm({
      supervisor_id: '',
      supervisor_username: '',
      head_id: '',
      head_username: ''
    });
    if (!headsLoadedRef.current) {
      fetchHeads();
    }
    if (!supervisorsLoadedRef.current) {
      fetchSupervisors();
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateGroup = async () => {
    if (!createForm.head_id || !createForm.head_id.trim()) {
      Notify.failure('Пожалуйста, заполните поле Head');
      return;
    }

    setIsCreating(true);
    
    try {
      const requestBody = {
        supervisor_id: createForm.supervisor_id.trim() || '',
        supervisor_username: createForm.supervisor_username.trim() || '',
        head_id: createForm.head_id.trim(),
        head_username: createForm.head_username.trim() || ''
      };

      const response = await apiFetch('https://209.38.246.190/api/v1/group/support/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          if (response.status === 400) {
            errorMessage = 'Неверные параметры запроса';
          } else if (response.status === 401) {
            errorMessage = 'Необходима авторизация';
          } else if (response.status === 500) {
            errorMessage = 'Ошибка сервера';
          }
        }
        throw new Error(errorMessage);
      }
      
      Notify.success('Группа успешно создана');
      handleCloseCreateModal();
      
      // Обновляем данные
      fetchData();
    } catch (e) {
      const errorMessage = e.message || 'Произошла ошибка при создании группы';
      Notify.failure(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const renderGroups = (data, theme) => {
    if (!data) return null;

    // Если данные - массив
    if (Array.isArray(data)) {
      return data.map((item, index) => {
        const name = item?.name || '—';
        const headUsername = item?.head_username || '—';
        
        return (
          <DataCard key={index} theme={theme}>
            <CardContent>
              <GroupName theme={theme}>{name}</GroupName>
              <GroupHead theme={theme}>
                <HeadLabel theme={theme}>Head:</HeadLabel>
                <HeadValue theme={theme}>{headUsername}</HeadValue>
              </GroupHead>
            </CardContent>
          </DataCard>
        );
      });
    }

    // Если данные - объект с массивом групп
    if (typeof data === 'object' && data !== null) {
      const groups = data.groups || data.items || data.results || (Array.isArray(data) ? data : [data]);
      
      if (Array.isArray(groups)) {
        return groups.map((item, index) => {
          const name = item?.name || '—';
          const headUsername = item?.head_username || '—';
          
          return (
            <DataCard key={index} theme={theme}>
              <CardContent>
                <GroupName theme={theme}>{name}</GroupName>
                <GroupHead theme={theme}>
                  <HeadLabel theme={theme}>Head:</HeadLabel>
                  <HeadValue theme={theme}>{headUsername}</HeadValue>
                </GroupHead>
              </CardContent>
            </DataCard>
          );
        });
      }
      
      // Если это один объект группы
      const name = data?.name || '—';
      const headUsername = data?.head_username || '—';
      
      return (
        <DataCard theme={theme}>
          <CardContent>
            <GroupName theme={theme}>{name}</GroupName>
            <GroupHead theme={theme}>
              <HeadLabel theme={theme}>Head:</HeadLabel>
              <HeadValue theme={theme}>{headUsername}</HeadValue>
            </GroupHead>
          </CardContent>
        </DataCard>
      );
    }

    return null;
  };

  return (
    <Layout>
      <PageContent theme={theme}>
        <HeaderSection theme={theme}>
          <Title theme={theme}>Group Supports</Title>
          <ButtonsGroup>
            <CreateButton theme={theme} onClick={handleOpenCreateModal}>
              Create Group
            </CreateButton>
          </ButtonsGroup>
        </HeaderSection>
        <ContentWrapper theme={theme}>
          {loading ? (
            <Loader />
          ) : error ? (
            <EmptyState theme={theme}>Ошибка: {error}</EmptyState>
          ) : data ? (
            <DataContainer>
              {renderGroups(data, theme)}
            </DataContainer>
          ) : (
            <EmptyState theme={theme}>Нет данных</EmptyState>
          )}
        </ContentWrapper>
      </PageContent>

      {isCreateModalOpen && (
        <ModalOverlay onClick={handleCloseCreateModal}>
          <ModalContent theme={theme} $isCreateModal={true} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle theme={theme}>Create Group</ModalTitle>
              <CloseButton theme={theme} onClick={handleCloseCreateModal}>
                ×
              </CloseButton>
            </ModalHeader>

            <FormSection>
              <FormLabel theme={theme}>Supervisor</FormLabel>
              {isLoadingSupervisors ? (
                <FormInput
                  theme={theme}
                  type="text"
                  value="Загрузка..."
                  disabled
                />
              ) : (
                <FormSelect
                  theme={theme}
                  value={createForm.supervisor_id}
                  onChange={(e) => {
                    const selectedSupervisor = supervisors.find(supervisor => {
                      // Если supervisor - это объект с полем id
                      if (typeof supervisor === 'object' && supervisor !== null) {
                        return supervisor.id === e.target.value || supervisor.supervisor_id === e.target.value || supervisor.uuid === e.target.value;
                      }
                      // Если supervisor - это строка (UUID)
                      return supervisor === e.target.value;
                    });
                    
                    setCreateForm({
                      ...createForm,
                      supervisor_id: e.target.value,
                      supervisor_username: selectedSupervisor ? (selectedSupervisor.username || selectedSupervisor.supervisor_username || selectedSupervisor.name || '') : ''
                    });
                  }}
                >
                  <option value="">Выберите супервайзера</option>
                  {supervisors.map((supervisor, index) => {
                    // Обрабатываем разные форматы данных
                    const supervisorId = typeof supervisor === 'object' && supervisor !== null 
                      ? (supervisor.id || supervisor.supervisor_id || supervisor.uuid || '')
                      : supervisor;
                    const supervisorLabel = typeof supervisor === 'object' && supervisor !== null
                      ? (supervisor.name || supervisor.username || supervisor.supervisor_username || supervisorId)
                      : supervisorId;
                    
                    return (
                      <option key={supervisorId || index} value={supervisorId}>
                        {supervisorLabel}
                      </option>
                    );
                  })}
                </FormSelect>
              )}
            </FormSection>

            <FormSection>
              <FormLabel theme={theme}>Head *</FormLabel>
              {isLoadingHeads ? (
                <FormInput
                  theme={theme}
                  type="text"
                  value="Загрузка..."
                  disabled
                />
              ) : (
                <FormSelect
                  theme={theme}
                  value={createForm.head_id}
                  onChange={(e) => {
                    const selectedHead = heads.find(head => {
                      // Если head - это объект с полем id
                      if (typeof head === 'object' && head !== null) {
                        return head.id === e.target.value || head.head_id === e.target.value || head.uuid === e.target.value;
                      }
                      // Если head - это строка (UUID)
                      return head === e.target.value;
                    });
                    
                    setCreateForm({
                      ...createForm,
                      head_id: e.target.value,
                      head_username: selectedHead ? (selectedHead.username || selectedHead.head_username || selectedHead.name || '') : ''
                    });
                  }}
                >
                  <option value="">Выберите руководителя</option>
                  {heads.map((head, index) => {
                    // Обрабатываем разные форматы данных
                    const headId = typeof head === 'object' && head !== null 
                      ? (head.id || head.head_id || head.uuid || '')
                      : head;
                    const headLabel = typeof head === 'object' && head !== null
                      ? (head.name || head.username || head.head_username || headId)
                      : headId;
                    
                    return (
                      <option key={headId || index} value={headId}>
                        {headLabel}
                      </option>
                    );
                  })}
                </FormSelect>
              )}
            </FormSection>

            <ModalFooter>
              <CancelButton theme={theme} onClick={handleCloseCreateModal}>
                Отмена
              </CancelButton>
              <CreateSaveButton theme={theme} onClick={handleCreateGroup} disabled={isCreating}>
                {isCreating ? 'Создание...' : 'Создать'}
              </CreateSaveButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

