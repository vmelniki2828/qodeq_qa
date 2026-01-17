import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const RelationsSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Subsection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SubsectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
`;

const TagDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color || '#3B82F6'};
`;

const GoToChatButton = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background-color: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover || theme.colors.accent};
    opacity: 0.9;
  }
`;

const DetailsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  margin-bottom: 24px;
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
`;

const IdList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const IdItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: monospace;
  font-size: 12px;
  color: ${({ $color, theme }) => $color || theme.colors.primary};
  transition: opacity 0.15s ease;
  
  &:hover {
    opacity: 0.7;
  }
`;

const CopyIcon = styled.span`
  cursor: pointer;
  opacity: 0.6;
  font-size: 14px;

  &:hover {
    opacity: 1;
  }
`;

const JsonSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  margin-bottom: 24px;
`;

const JsonTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const JsonContent = styled.pre`
  margin: 0;
  font-size: 12px;
  font-family: monospace;
  color: ${({ theme }) => theme.colors.primary};
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
`;

export const PaymentDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      setIsLoading(true);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`https://repayment.cat-tools.com/api/v1/admin/resources/payment/${id}`, {
          method: 'GET',
          headers,
        });
        if (response.status === 401) {
          setPayment(null);
          setIsLoading(false);
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Сохраняем все данные из ответа API
        setPayment(data);
      } catch (err) {
        console.error('Ошибка при загрузке платежа:', err);
        setPayment(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPayment();
    }
  }, [id]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`https://repayment.cat-tools.com/api/v1/admin/resources/payment/${id}`, {
        method: 'GET',
        headers,
      });
      if (response.status === 401) {
        setPayment(null);
        setIsLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Сохраняем все данные из ответа API
      setPayment(data);
    } catch (err) {
      console.error('Ошибка при обновлении платежа:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/models/payments/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      console.log('Delete payment', id);
      navigate('/models/payments');
    }
  };

  const handleBack = () => {
    navigate('/models/payments');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <Loader />
          </ContentWrapper>
        </PageContent>
      </Layout>
    );
  }

  if (!payment) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>Payment not found</div>
          </ContentWrapper>
        </PageContent>
      </Layout>
    );
  }

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

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? JSON.stringify(value) : '[]';
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  };

  // Формируем список всех полей из ответа API для отображения
  // Исключаем tags_detail и gateways_detail, так как они выводятся отдельно
  const fields = Object.keys(payment)
    .filter(key => key !== 'tags_detail' && key !== 'tagsDetail' && key !== 'gateways_detail' && key !== 'gatewaysDetail')
    .map((key) => {
      let value = payment[key];
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
              Payments · {payment._id || payment.id || id}
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
            <RelationsSection theme={theme}>
              <SectionTitle theme={theme}>Relations</SectionTitle>
              
              <Subsection>
                <SubsectionTitle theme={theme}>Tags</SubsectionTitle>
                <TagsList>
                  {(payment.tags_detail || payment.tagsDetail || []).map((tag, index) => (
                    <TagItem key={index} theme={theme}>
                      <TagDot $color="#3B82F6" />
                      <span>{tag?.name || tag || '—'}</span>
                    </TagItem>
                  ))}
                </TagsList>
              </Subsection>

              <Subsection>
                <SubsectionTitle theme={theme}>Gateways</SubsectionTitle>
                <TagsList>
                  {(payment.gateways_detail || payment.gatewaysDetail || []).map((gateway, index) => (
                    <TagItem key={index} theme={theme}>
                      <TagDot $color="#10A37F" />
                      <span>{gateway?.name || gateway || '—'}</span>
                    </TagItem>
                  ))}
                </TagsList>
                <GoToChatButton 
                  theme={theme}
                  onClick={async () => {
                    try {
                      // Пытаемся найти чат по payment name или payment ID
                      const paymentName = payment.name || '';
                      const paymentId = payment._id || payment.id || id;
                      
                      // Сначала пробуем использовать payment ID напрямую
                      // Если не найдется, перейдем на страницу Chats с поиском
                      const token = getCookie('rb_admin_token');
                      const headers = { 'Content-Type': 'application/json' };
                      if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                      }
                      
                      // Пробуем найти чат по payment name через API
                      try {
                        const chatsResponse = await fetch('https://repayment.cat-tools.com/api/v1/admin/chats', {
                          method: 'GET',
                          headers,
                        });
                        
                        if (chatsResponse.ok) {
                          const chatsData = await chatsResponse.json();
                          const chats = Array.isArray(chatsData) ? chatsData : [];
                          // Ищем чат по payment name
                          const foundChat = chats.find((chat) => 
                            chat.payment === paymentName || 
                            chat.payment_name === paymentName ||
                            chat.payment_id === paymentId ||
                            chat._id === paymentId ||
                            chat.id === paymentId
                          );
                          
                          if (foundChat) {
                            const chatId = foundChat.id || foundChat._id || foundChat.id;
                            navigate(`/models/chats/${chatId}`);
                            return;
                          }
                        }
                      } catch (err) {
                        console.error('Ошибка при поиске чата:', err);
                      }
                      
                      // Если чат не найден, переходим на страницу Chats с поиском
                      navigate(`/models/chats?search=${encodeURIComponent(paymentName || paymentId)}`);
                    } catch (err) {
                      console.error('Ошибка при переходе к чату:', err);
                      // В случае ошибки переходим на страницу Chats с поиском
                      const paymentName = payment.name || payment._id || payment.id || id;
                      navigate(`/models/chats?search=${encodeURIComponent(paymentName)}`);
                    }
                  }}
                >
                  Go to Chat
                </GoToChatButton>
              </Subsection>
            </RelationsSection>

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
                      {(item.field === '_id' || item.field === 'id') ? (
                        <IdValue onClick={() => handleCopyId(item.value)}>
                          {formatValue(item.value)}
                        </IdValue>
                      ) : (item.field === 'tag_ids' || item.field === 'tagIds') && Array.isArray(item.value) ? (
                        <IdList>
                          {item.value.map((id, idx) => (
                            <IdItem 
                              key={idx} 
                              $color="#3B82F6" 
                              theme={theme}
                              style={{ cursor: 'pointer' }}
                              onClick={() => navigate(`/models/tags?search=${encodeURIComponent(id)}`)}
                              title="Перейти на страницу Tags с поиском"
                            >
                              {id}
                              <CopyIcon 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyId(id);
                                }}
                              >
                                📋
                              </CopyIcon>
                            </IdItem>
                          ))}
                        </IdList>
                      ) : (item.field === 'gateway_ids' || item.field === 'gatewayIds') && Array.isArray(item.value) ? (
                        <IdList>
                          {item.value.map((id, idx) => (
                            <IdItem 
                              key={idx} 
                              $color="#3B82F6" 
                              theme={theme}
                              style={{ cursor: 'pointer' }}
                              onClick={() => navigate(`/models/gateways?search=${encodeURIComponent(id)}`)}
                              title="Перейти на страницу Gateways с поиском"
                            >
                              {id}
                              <CopyIcon 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyId(id);
                                }}
                              >
                                📋
                              </CopyIcon>
                            </IdItem>
                          ))}
                        </IdList>
                      ) : (
                        formatValue(item.value)
                      )}
                    </ValueCell>
                  </TableRow>
                ))}
              </TableBody>
            </DetailsTable>

            {(payment.tags_detail || payment.tagsDetail) && (
              <JsonSection theme={theme}>
                <JsonTitle theme={theme}>tags_detail</JsonTitle>
                <JsonContent theme={theme}>
                  {JSON.stringify(payment.tags_detail || payment.tagsDetail, null, 2)}
                </JsonContent>
              </JsonSection>
            )}

            {(payment.gateways_detail || payment.gatewaysDetail) && (
              <JsonSection theme={theme}>
                <JsonTitle theme={theme}>gateways_detail</JsonTitle>
                <JsonContent theme={theme}>
                  {JSON.stringify(payment.gateways_detail || payment.gatewaysDetail, null, 2)}
                </JsonContent>
              </JsonSection>
            )}
          </ContentWrapper>
        </PageContent>
      </ThemeProvider>
    </Layout>
  );
};

