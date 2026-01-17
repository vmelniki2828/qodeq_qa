import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { HiArrowPath, HiPencil, HiTrash, HiChevronLeft } from 'react-icons/hi2';

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
    if (isNaN(date.getTime())) return dateString;
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

  ${({ $danger }) =>
    $danger &&
    `
    &:hover {
      color: #ef4444;
      border-color: #ef4444;
      background-color: rgba(239,68,68,0.1);
    }
  `}
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

const DetailsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.surface};
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
  background-color: ${({ theme }) => theme.colors.surface};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f8f8f8' : 'rgba(255,255,255,0.04)'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
`;

const FieldCell = styled(TableCell)`
  font-weight: 500;
  width: 200px;
`;

const ValueCell = styled(TableCell)`
  word-break: break-word;
  font-family: monospace;
  font-size: 12px;
`;

const IdValue = styled.span`
  color: #3B82F6;
  cursor: pointer;
  margin-right: 8px;
`;

const AdminLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  text-decoration: underline;
`;

const JsonValue = styled.pre`
  margin: 0;
  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: ${({ theme }) => theme.colors.primary};
`;

export const PingDataDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [pingData, setPingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPingData = async (pingDataId) => {
    setIsLoading(true);
    try {
      const token = getCookie('rb_admin_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`https://repayment.cat-tools.com/api/v1/admin/resources/ping_data/${pingDataId}`, {
        method: 'GET',
        headers,
      });

      if (response.status === 401) {
        setPingData(null);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPingData(data);
    } catch (err) {
      console.error('Ошибка при загрузке данных ping data:', err);
      // Если запрос не удался, используем данные из location.state как fallback
      if (location.state?.pingData) {
        setPingData(location.state.pingData);
      } else {
        setPingData(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Определяем ID для запроса: используем _id из location.state или ID из URL
    const pingDataId = location.state?.pingData?._id || id;
    
    if (pingDataId) {
      fetchPingData(pingDataId);
    } else {
      // Если нет ID, используем данные из location.state
      if (location.state?.pingData) {
        setPingData(location.state.pingData);
      } else {
        setPingData(null);
      }
      setIsLoading(false);
    }
  }, [id, location.state]);

  const handleRefresh = () => {
    const pingDataId = pingData?._id || id;
    if (pingDataId) {
      fetchPingData(pingDataId);
    }
  };

  const handleEdit = () => {
    navigate(`/models/ping-data/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this ping data?')) {
      console.log('Delete ping data', id);
      navigate('/models/ping-data');
    }
  };

  const handleBack = () => {
    navigate('/models/ping-data');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <Layout>
        <ThemeProvider theme={theme}>
          <PageContent>
            <ContentWrapper>
              <Loader />
            </ContentWrapper>
          </PageContent>
        </ThemeProvider>
      </Layout>
    );
  }

  if (!pingData) {
    return (
      <Layout>
        <ThemeProvider theme={theme}>
          <PageContent>
            <ContentWrapper>
              <div style={{ padding: '20px', textAlign: 'center', color: theme.colors.secondary }}>
                Ping data не найдено
              </div>
            </ContentWrapper>
          </PageContent>
        </ThemeProvider>
      </Layout>
    );
  }

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  // Формируем список всех полей ping data для отображения
  const fields = Object.keys(pingData).map((key) => {
    let value = pingData[key];
    // Форматируем даты
    if (key === 'created_at' || key === 'updated_at' || key === 'createdAt' || key === 'updatedAt') {
      value = formatDate(value);
    }
    return { field: key, value };
  });

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>
              Ping Data · {pingData._id || pingData.id || id}
            </Title>
            <ButtonsGroup>
              <Button theme={theme} onClick={handleRefresh}>
                <HiArrowPath size={16} />
                Refresh
              </Button>
              <Button theme={theme} onClick={handleEdit}>
                <HiPencil size={16} />
                Edit
              </Button>
              <Button theme={theme} $danger onClick={handleDelete}>
                <HiTrash size={16} />
                Delete
              </Button>
              <Button theme={theme} onClick={handleBack}>
                <HiChevronLeft size={16} />
                Back
              </Button>
            </ButtonsGroup>
          </HeaderSection>

          <ContentWrapper>
            <DetailsTable theme={theme}>
              <TableHeader theme={theme}>
                <TableHeaderRow>
                  <TableHeaderCell theme={theme}>Field</TableHeaderCell>
                  <TableHeaderCell theme={theme}>Value</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {fields.map((item, index) => (
                  <TableRow key={index} theme={theme}>
                    <FieldCell theme={theme}>{item.field}</FieldCell>
                    <ValueCell theme={theme}>
                      {item.field === '_id' || item.field === 'id' ? (
                        <IdValue onClick={() => handleCopyId(item.value)}>
                          {formatValue(item.value)}
                        </IdValue>
                      ) : (item.field === 'ticket_id' || item.field === 'ticketId') && item.value ? (
                        <>
                          <IdValue onClick={() => handleCopyId(item.value)}>
                            {formatValue(item.value)}
                          </IdValue>
                          <AdminLink onClick={() => navigate(`/models/tickets/${item.value}`)}>
                            Admin
                          </AdminLink>
                        </>
                      ) : (item.field === 'external_id' || item.field === 'externalId') && item.value ? (
                        <IdValue onClick={() => handleCopyId(item.value)}>
                          {formatValue(item.value)}
                        </IdValue>
                      ) : typeof item.value === 'object' && item.value !== null ? (
                        <JsonValue theme={theme}>{formatValue(item.value)}</JsonValue>
                      ) : (
                        formatValue(item.value)
                      )}
                    </ValueCell>
                  </TableRow>
                ))}
              </TableBody>
            </DetailsTable>
          </ContentWrapper>
        </PageContent>
      </ThemeProvider>
    </Layout>
  );
};


