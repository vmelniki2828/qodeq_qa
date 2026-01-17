import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Pagination } from '../components/Pagination';
import { HiPencil, HiTrash, HiArrowUp, HiArrowDown, HiEye, HiChevronLeft } from 'react-icons/hi2';

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

const UuidCell = styled(TableCell)`
  text-align: left;
  font-family: monospace;
  font-size: 11px;
  color: #3B82F6;
  cursor: pointer;
`;

const StatusCell = styled(TableCell)`
  text-align: left;
  font-size: 12px;
`;

const SubjectCell = styled(TableCell)`
  text-align: left;
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


// Моковые данные tickets
const mockTickets = [
  {
    id: 1,
    _id: '693267d68b21c817771710f7',
    uuid: '7d180b17-573f-481f-8b9f-e687f4b9a806',
    shortId: 'F2DG7N',
    status: 'pending',
    subject: 'Ticket from chat',
    priority: 0,
    language: 'en',
    rating: null,
    teamId: '022ef254-bf44-4958-affe-3b92b6591149',
    teamName: 'Cat Payment',
    agentId: null,
    tagId: 'f5947cd4-f5b6-4503-be44-ac164ab830ff',
    createdAt: '2025-12-05 05:04:22',
    updatedAt: '2025-12-05 05:04:35',
    ticketCreatedAt: '2025-12-05T05:04:22.412000+00:00',
    ticketUpdatedAt: '2025-12-05T05:04:35.744000+00:00',
  },
  {
    id: 2,
    _id: '693267d68b21c817771710f8',
    uuid: '8f2f310c-57db-4a56-acf6-e9d2a9094e2c',
    shortId: 'F2DG7O',
    status: 'pending',
    subject: 'Ticket from chat',
    priority: 0,
    language: 'en',
    rating: null,
    teamId: null,
    teamName: null,
    agentId: null,
    tagId: null,
    createdAt: '2025-12-05 05:03:22',
    updatedAt: '2025-12-05 05:03:22',
    ticketCreatedAt: '2025-12-05T05:03:22.000000+00:00',
    ticketUpdatedAt: '2025-12-05T05:03:22.000000+00:00',
  },
  {
    id: 3,
    uuid: 'd4505a9b-b533-48ab-8a8a-35b50c1eada3',
    status: 'open',
    subject: 'arkada',
    createdAt: '2025-12-05 04:46:43',
  },
  {
    id: 4,
    uuid: '36c80ec0-4fb3-43b2-bd50-e31365a29f4a',
    status: 'pending',
    subject: 'Ticket from chat',
    createdAt: '2025-12-05 04:45:22',
  },
  {
    id: 5,
    uuid: '149c129a-d09e-4750-880c-62a7395be69c',
    status: 'solved',
    subject: '',
    createdAt: '2025-12-05 04:41:42',
  },
  {
    id: 6,
    uuid: '6b003da3-1554-4785-b5d2-6be93dbc9632',
    status: 'closed',
    subject: 'Ticket from chat SS2IEGEUWA',
    createdAt: '2025-12-05 04:17:51',
  },
  {
    id: 7,
    uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    status: 'pending',
    subject: 'Ticket from chat',
    createdAt: '2025-12-05 04:15:30',
  },
  {
    id: 8,
    uuid: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    status: 'pending',
    subject: 'Arkada',
    createdAt: '2025-12-05 04:12:15',
  },
  {
    id: 9,
    uuid: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    status: 'pending',
    subject: 'Ticket from chat',
    createdAt: '2025-12-05 04:10:00',
  },
  {
    id: 10,
    uuid: 'd4e5f6a7-b8c9-0123-def0-234567890123',
    status: 'open',
    subject: 'Cat',
    createdAt: '2025-12-05 04:08:45',
  },
  {
    id: 11,
    uuid: 'e5f6a7b8-c9d0-1234-ef01-345678901234',
    status: 'pending',
    subject: 'cat',
    createdAt: '2025-12-05 04:06:30',
  },
  {
    id: 12,
    uuid: 'f6a7b8c9-d0e1-2345-f012-456789012345',
    status: 'pending',
    subject: 'Ticket from chat',
    createdAt: '2025-12-05 04:04:15',
  },
  {
    id: 13,
    uuid: 'a7b8c9d0-e1f2-3456-0123-567890123456',
    status: 'pending',
    subject: 'Ticket from chat',
    createdAt: '2025-12-05 04:02:00',
  },
  {
    id: 14,
    uuid: 'b8c9d0e1-f2a3-4567-1234-678901234567',
    status: 'pending',
    subject: 'Ticket from chat',
    createdAt: '2025-12-05 04:00:00',
  },
];

export const TicketsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(mockTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState(null);
  const [newTicket, setNewTicket] = useState({
    uuid: '',
    status: 'pending',
    subject: '',
  });

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      !searchQuery ||
      ticket.uuid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    switch (sortField) {
      case 'uuid':
        aValue = a.uuid.toLowerCase();
        bValue = b.uuid.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'subject':
        aValue = a.subject.toLowerCase();
        bValue = b.subject.toLowerCase();
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
    console.log('Refresh tickets');
  };

  const handleCreate = () => {
    setEditingTicketId(null);
    setNewTicket({
      uuid: '',
      status: 'pending',
      subject: '',
    });
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingTicketId(null);
    setNewTicket({
      uuid: '',
      status: 'pending',
      subject: '',
    });
  };

  const handleSaveTicket = () => {
    if (editingTicketId) {
      // Update existing ticket
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === editingTicketId
            ? {
                ...ticket,
                uuid: newTicket.uuid,
                status: newTicket.status,
                subject: newTicket.subject,
              }
            : ticket
        )
      );
      console.log('Update ticket:', editingTicketId, newTicket);
    } else {
      // Create new ticket
      const newId = Math.max(...tickets.map((t) => t.id), 0) + 1;
      const createdTicket = {
        id: newId,
        uuid: newTicket.uuid,
        status: newTicket.status,
        subject: newTicket.subject,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      setTickets((prevTickets) => [...prevTickets, createdTicket]);
      console.log('Create new ticket', createdTicket);
    }
    handleCloseCreate();
  };

  const handleView = (ticketId, e) => {
    e?.stopPropagation();
    navigate(`/models/tickets/${ticketId}`);
  };

  const handleEdit = (ticketId, e) => {
    e.stopPropagation();
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      setEditingTicketId(ticketId);
      setNewTicket({
        uuid: ticket.uuid,
        status: ticket.status,
        subject: ticket.subject,
      });
      setIsCreateOpen(true);
    }
  };

  const handleDelete = (ticketId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketId));
      console.log('Delete ticket', ticketId);
    }
  };

  const handleCopyUuid = (uuid) => {
    navigator.clipboard.writeText(uuid);
  };

  const ITEMS_PER_PAGE = 10;
  const totalTickets = sortedTickets.length;
  const totalPages = Math.ceil(totalTickets / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTickets = sortedTickets.slice(startIndex, endIndex);

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
            <Title theme={theme}>Tickets</Title>
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
            <FilterLabel theme={theme}>All Statuses:</FilterLabel>
            <SortSelect
              theme={theme}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="open">Open</option>
              <option value="solved">Solved</option>
              <option value="closed">Closed</option>
            </SortSelect>
            <FilterLabel theme={theme}>Created At:</FilterLabel>
            <SortSelect
              theme={theme}
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="created_at">Created At</option>
              <option value="uuid">UUID</option>
              <option value="status">Status</option>
              <option value="subject">Subject</option>
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
                        onClick={() => handleSort('uuid')}
                        $sorted={sortField === 'uuid'}
                      >
                        UUID
                        <SortIcon>{getSortIcon('uuid')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('status')}
                        $sorted={sortField === 'status'}
                      >
                        Status
                        <SortIcon>{getSortIcon('status')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('subject')}
                        $sorted={sortField === 'subject'}
                      >
                        Subject
                        <SortIcon>{getSortIcon('subject')}</SortIcon>
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
                    {paginatedTickets.map((ticket) => (
                      <TableRow key={ticket.id} theme={theme}>
                        <UuidCell
                          theme={theme}
                          onClick={() => handleCopyUuid(ticket.uuid)}
                          title="Click to copy"
                        >
                          {ticket.uuid}
                        </UuidCell>
                        <StatusCell theme={theme}>{ticket.status}</StatusCell>
                        <SubjectCell theme={theme}>{ticket.subject || ''}</SubjectCell>
                        <CreatedAtCell theme={theme}>{ticket.createdAt}</CreatedAtCell>
                        <ActionsCell theme={theme}>
                          <ActionButton
                            theme={theme}
                            onClick={(e) => handleView(ticket.id, e)}
                            title="View"
                          >
                            <HiEye size={16} />
                          </ActionButton>
                          <ActionButton
                            theme={theme}
                            onClick={(e) => handleEdit(ticket.id, e)}
                            title="Edit"
                          >
                            <HiPencil size={16} />
                          </ActionButton>
                          <ActionButton
                            theme={theme}
                            $danger
                            onClick={(e) => handleDelete(ticket.id, e)}
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
                  <SettingLabel theme={theme}>UUID</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newTicket.uuid}
                      onChange={(e) => setNewTicket({ ...newTicket, uuid: e.target.value })}
                      placeholder="Enter UUID"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Status</SettingLabel>
                  <SettingContent>
                    <Select
                      theme={theme}
                      value={newTicket.status}
                      onChange={(e) => setNewTicket({ ...newTicket, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="open">Open</option>
                      <option value="solved">Solved</option>
                      <option value="closed">Closed</option>
                    </Select>
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Subject</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      placeholder="Enter subject"
                    />
                  </SettingContent>
                </SettingSection>

                <SaveButton theme={theme} onClick={handleSaveTicket}>
                  {editingTicketId ? 'Save Changes' : 'Create Ticket'}
                </SaveButton>
              </RightContent>
            </RightPanel>
          </PageContainer>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalTickets}
            onPageChange={setCurrentPage}
            itemsPerPage={10}
          />
        </div>
      </ThemeProvider>
    </Layout>
  );
};

