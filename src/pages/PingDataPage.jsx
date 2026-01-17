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

const TicketIdCell = styled(TableCell)`
  text-align: left;
  font-family: monospace;
  font-size: 11px;
`;

const PaymentCell = styled(TableCell)`
  text-align: left;
`;

const ExternalIdCell = styled(TableCell)`
  text-align: left;
  font-family: monospace;
  font-size: 11px;
`;

const ValidCell = styled(TableCell)`
  font-size: 16px;
  color: ${({ $valid, theme }) => ($valid ? '#10A37F' : '#ef4444')};
`;

const ReasonCell = styled(TableCell)`
  text-align: left;
  max-width: 300px;
  word-wrap: break-word;
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


export const PingDataPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [pingData, setPingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPingDataId, setEditingPingDataId] = useState(null);
  const [newPingData, setNewPingData] = useState({
    ticketId: '',
    payment: '',
    externalId: '',
    valid: false,
    reason: '',
  });

  // Загрузка данных из API
  const fetchPingData = async () => {
    setIsLoading(true);
    try {
      const token = getCookie('rb_admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: '20',
        sort_by: sortField,
        sort_dir: sortDirection,
      });
      
      const response = await fetch(`https://repayment.cat-tools.com/api/v1/admin/resources/ping_data?${params}`, {
        method: 'GET',
        headers,
      });
      
      if (response.status === 401) {
        setPingData([]);
        setIsLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Обрабатываем ответ API (может быть объект с полями data, total, pages или массив)
      let items = [];
      let total = 0;
      
      if (Array.isArray(data)) {
        items = data;
        total = data.length;
      } else if (data.data && Array.isArray(data.data)) {
        items = data.data;
        total = data.total || data.count || items.length;
      } else if (data.items && Array.isArray(data.items)) {
        items = data.items;
        total = data.total || data.count || items.length;
      }
      
      // Преобразуем данные API в формат, который ожидает компонент
      const formattedPingData = items.map((item, index) => ({
        id: item.id || item._id || index + 1,
        _id: item._id || item.id || `ping_${index}`,
        ticketId: item.ticket_id || item.ticketId || '',
        payment: item.payment || '',
        externalId: item.external_id || item.externalId || '',
        valid: item.valid !== undefined ? item.valid : false,
        reason: item.reason || '',
        createdAt: item.created_at || item.createdAt || '',
        updatedAt: item.updated_at || item.updatedAt || '',
      }));
      
      setPingData(formattedPingData);
      setTotalPages(Math.ceil(total / 20) || 1);
    } catch (err) {
      console.error('Ошибка при загрузке ping data:', err);
      setPingData([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortField, sortDirection]);

  const filteredPingData = pingData.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.payment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.externalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedPingData = [...filteredPingData].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    switch (sortField) {
      case 'ticket_id':
        aValue = a.ticketId.toLowerCase();
        bValue = b.ticketId.toLowerCase();
        break;
      case 'payment':
        aValue = a.payment.toLowerCase();
        bValue = b.payment.toLowerCase();
        break;
      case 'external_id':
        aValue = a.externalId.toLowerCase();
        bValue = b.externalId.toLowerCase();
        break;
      case 'valid':
        aValue = a.valid ? 1 : 0;
        bValue = b.valid ? 1 : 0;
        break;
      case 'reason':
        aValue = a.reason.toLowerCase();
        bValue = b.reason.toLowerCase();
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
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении сортировки
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <HiArrowUp /> : <HiArrowDown />;
  };

  const handleRefresh = () => {
    fetchPingData();
  };

  const handleCreate = () => {
    setEditingPingDataId(null);
    setNewPingData({
      ticketId: '',
      payment: '',
      externalId: '',
      valid: false,
      reason: '',
    });
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingPingDataId(null);
    setNewPingData({
      ticketId: '',
      payment: '',
      externalId: '',
      valid: false,
      reason: '',
    });
  };

  const handleSavePingData = () => {
    if (editingPingDataId) {
      // Update existing ping data
      setPingData((prevPingData) =>
        prevPingData.map((item) =>
          item.id === editingPingDataId
            ? {
                ...item,
                ticketId: newPingData.ticketId,
                payment: newPingData.payment,
                externalId: newPingData.externalId,
                valid: newPingData.valid,
                reason: newPingData.reason,
              }
            : item
        )
      );
      console.log('Update ping data:', editingPingDataId, newPingData);
    } else {
      // Create new ping data
      const newId = Math.max(...pingData.map((p) => p.id), 0) + 1;
      const createdPingData = {
        id: newId,
        ticketId: newPingData.ticketId,
        payment: newPingData.payment,
        externalId: newPingData.externalId,
        valid: newPingData.valid,
        reason: newPingData.reason,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      setPingData((prevPingData) => [...prevPingData, createdPingData]);
      console.log('Create new ping data', createdPingData);
    }
    handleCloseCreate();
  };

  const handleView = (pingDataId, e) => {
    e?.stopPropagation();
    // Находим элемент по id и используем _id для навигации
    const item = pingData.find((p) => p.id === pingDataId);
    const pingDataIdToUse = item?._id || pingDataId;
    navigate(`/models/ping-data/${pingDataIdToUse}`);
  };

  const handleEdit = (pingDataId, e) => {
    e.stopPropagation();
    const item = pingData.find((p) => p.id === pingDataId);
    if (item) {
      setEditingPingDataId(pingDataId);
      setNewPingData({
        ticketId: item.ticketId,
        payment: item.payment,
        externalId: item.externalId,
        valid: item.valid,
        reason: item.reason,
      });
      setIsCreateOpen(true);
    }
  };

  const handleDelete = (pingDataId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this ping data?')) {
      setPingData((prevPingData) => prevPingData.filter((item) => item.id !== pingDataId));
      console.log('Delete ping data', pingDataId);
    }
  };

  // Используем отфильтрованные данные (поиск работает на клиенте)
  const displayData = filteredPingData;
  const totalDisplayData = filteredPingData.length;

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
            <Title theme={theme}>Ping Data</Title>
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
              <option value="ticket_id">Ticket ID</option>
              <option value="payment">Payment</option>
              <option value="external_id">External ID</option>
              <option value="valid">Valid</option>
              <option value="reason">Reason</option>
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
                        onClick={() => handleSort('ticket_id')}
                        $sorted={sortField === 'ticket_id'}
                      >
                        Ticket ID
                        <SortIcon>{getSortIcon('ticket_id')}</SortIcon>
                      </TableHeaderCell>
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
                        onClick={() => handleSort('external_id')}
                        $sorted={sortField === 'external_id'}
                      >
                        External ID
                        <SortIcon>{getSortIcon('external_id')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('valid')}
                        $sorted={sortField === 'valid'}
                      >
                        Valid
                        <SortIcon>{getSortIcon('valid')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('reason')}
                        $sorted={sortField === 'reason'}
                      >
                        Reason
                        <SortIcon>{getSortIcon('reason')}</SortIcon>
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
                    {displayData.map((item) => (
                      <TableRow key={item.id} theme={theme}>
                        <TicketIdCell theme={theme}>{item.ticketId}</TicketIdCell>
                        <PaymentCell theme={theme}>{item.payment || ''}</PaymentCell>
                        <ExternalIdCell theme={theme}>{item.externalId}</ExternalIdCell>
                        <ValidCell theme={theme} $valid={item.valid}>
                          {item.valid ? '✓' : '✗'}
                        </ValidCell>
                        <ReasonCell theme={theme}>{item.reason}</ReasonCell>
                        <CreatedAtCell theme={theme}>{item.createdAt}</CreatedAtCell>
                        <ActionsCell theme={theme}>
                          <ActionButton
                            theme={theme}
                            onClick={(e) => handleView(item.id, e)}
                            title="View"
                          >
                            <HiEye size={16} />
                          </ActionButton>
                          <ActionButton
                            theme={theme}
                            onClick={(e) => handleEdit(item.id, e)}
                            title="Edit"
                          >
                            <HiPencil size={16} />
                          </ActionButton>
                          <ActionButton
                            theme={theme}
                            $danger
                            onClick={(e) => handleDelete(item.id, e)}
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
                  <SettingLabel theme={theme}>Ticket ID</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newPingData.ticketId}
                      onChange={(e) => setNewPingData({ ...newPingData, ticketId: e.target.value })}
                      placeholder="Enter ticket ID"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Payment</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newPingData.payment}
                      onChange={(e) => setNewPingData({ ...newPingData, payment: e.target.value })}
                      placeholder="Enter payment (optional)"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>External ID</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newPingData.externalId}
                      onChange={(e) => setNewPingData({ ...newPingData, externalId: e.target.value })}
                      placeholder="Enter external ID"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Valid</SettingLabel>
                  <SettingContent>
                    <Checkbox
                      type="checkbox"
                      checked={newPingData.valid}
                      onChange={(e) => setNewPingData({ ...newPingData, valid: e.target.checked })}
                      theme={theme}
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Reason</SettingLabel>
                  <SettingContent>
                    <TextArea
                      theme={theme}
                      value={newPingData.reason}
                      onChange={(e) => setNewPingData({ ...newPingData, reason: e.target.value })}
                      placeholder="Enter reason"
                    />
                  </SettingContent>
                </SettingSection>

                <SaveButton theme={theme} onClick={handleSavePingData}>
                  {editingPingDataId ? 'Save Changes' : 'Create Ping Data'}
                </SaveButton>
              </RightContent>
            </RightPanel>
          </PageContainer>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalDisplayData}
            onPageChange={setCurrentPage}
            itemsPerPage={20}
          />
        </div>
      </ThemeProvider>
    </Layout>
  );
};

