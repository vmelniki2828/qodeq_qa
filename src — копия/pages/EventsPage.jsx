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

const TicketIdCell = styled(TableCell)`
  text-align: left;
  font-family: monospace;
  font-size: 11px;
`;

const TicketIdLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  margin-right: 8px;
`;

const AdminLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  text-decoration: underline;
`;

const TypeCell = styled(TableCell)`
  text-align: left;
  font-family: monospace;
  font-size: 11px;
`;

const ErrorCell = styled(TableCell)`
  text-align: left;
  max-width: 400px;
  word-wrap: break-word;
  font-size: 11px;
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


// Моковые данные events
const mockEvents = [
  {
    id: 1,
    _id: '69326bb963ef36403c3ea37e',
    ticketId: '58b85c62-091c-43fb-92eb-f3b2c765ab8c',
    type: 'ticket_message',
    action: { ticket_message: null, support_chat_message: null, status: null },
    context: {
      telegram_context: null,
      support_message_text: null,
      support_message_type: null,
      ticket_context: {
        ID: 0,
        type: 'message',
        source: { type: 'api', detailedSource: 'api', customerID: '4bf24554-2bd7-4b9a-97e3-209733d36b27' },
        date: '2025-12-05T05:20:48.674000+00:00',
        author: { type: 'agent', ID: 'b5845626-b995-4286-8ea8-cc8269b6577c', name: 'Victor Brown' },
        message: {
          isPrivate: true,
          text: 'ChatWoot conversation transcript:\nТимур Якубов 1764911937\nДеп не пришел\nSimon 1764911951\n, меня зовут Simon. Ваш оператор чата.\nSimon 1764911957\nТимур, буду рад помочь. Загрузите, пожалуйста, чек в формате PDF \nТимур Якубов 1764912016\n\nhttps://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWWzc2FnZSI6IkJBaHBBNnZTQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvYl9pZCJ9fQ==---8f681cf547b72d719332e3f21bd5c89889e734bd/AM_1764911904848.pdf\nТимур Якубов 1764912029\nBot\nSimon 1764912042\nСпасибо. Передал запрос в финансовый отдел, он будет обработан в самое ближайшее время, ожидайте, пожалуйста А. Как только запрос будет решен, оповестим вас по почте.',
        },
      },
    },
    usage: '',
    timeTaken: 8.142654,
    error: 'VIP team found for ticket_id=58b85c62-091c-43fb-92eb-f3b2c765ab8c, team_ids=[\'477615d3-b0ef-499d-ab61-b24ba467b32d\']',
    createdAt: '2025-12-05 05:20:57',
    updatedAt: '2025-12-05 05:20:57',
  },
  {
    id: 2,
    _id: '69326bb963ef36403c3ea37f',
    ticketId: '0f6a2703-a808-41f2-8a9c-199783fc7f27',
    type: 'ticket_message',
    action: null,
    context: null,
    usage: '',
    timeTaken: null,
    error: 'VIP team found for ticket_id=0f6a2703-a808-41f2-8a9c-199783fc7f27, team_ids=[022ef254-bf44-4958-affe-3b92b6591149]',
    createdAt: '2025-12-05 05:20:56',
    updatedAt: '2025-12-05 05:20:56',
  },
  {
    id: 3,
    _id: '69326bb963ef36403c3ea380',
    ticketId: '7d180b17-573f-481f-8b9f-e687f4b9a806',
    type: 'ticket_message',
    action: null,
    context: null,
    usage: '',
    timeTaken: null,
    error: '',
    createdAt: '2025-12-05 05:20:55',
    updatedAt: '2025-12-05 05:20:55',
  },
  {
    id: 4,
    _id: '69326bb963ef36403c3ea381',
    ticketId: '8f2f310c-57db-4a56-acf6-e9d2a9094e2c',
    type: 'support_message',
    action: null,
    context: null,
    usage: '',
    timeTaken: null,
    error: '',
    createdAt: '2025-12-05 05:20:54',
    updatedAt: '2025-12-05 05:20:54',
  },
  {
    id: 5,
    _id: '69326bb963ef36403c3ea382',
    ticketId: '36c80ec0-4fb3-43b2-bd50-e31365a29f4a',
    type: 'ticket_message',
    action: null,
    context: null,
    usage: '',
    timeTaken: null,
    error: '',
    createdAt: '2025-12-05 05:20:53',
    updatedAt: '2025-12-05 05:20:53',
  },
  {
    id: 6,
    _id: '69326bb963ef36403c3ea383',
    ticketId: '149c129a-d09e-4750-880c-62a7395be69c',
    type: 'ticket_message',
    action: null,
    context: null,
    usage: '',
    timeTaken: null,
    error: '',
    createdAt: '2025-12-05 05:20:52',
    updatedAt: '2025-12-05 05:20:52',
  },
  {
    id: 7,
    _id: '69326bb963ef36403c3ea384',
    ticketId: '6b003da3-1554-4785-b5d2-6be93dbc9632',
    type: 'support_message',
    action: null,
    context: null,
    usage: '',
    timeTaken: null,
    error: '',
    createdAt: '2025-12-05 05:20:51',
    updatedAt: '2025-12-05 05:20:51',
  },
  {
    id: 8,
    _id: '69326bb963ef36403c3ea385',
    ticketId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    type: 'ticket_message',
    action: null,
    context: null,
    usage: '',
    timeTaken: null,
    error: '',
    createdAt: '2025-12-05 05:20:50',
    updatedAt: '2025-12-05 05:20:50',
  },
  {
    id: 9,
    _id: '69326bb963ef36403c3ea386',
    ticketId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    type: 'ticket_message',
    action: null,
    context: null,
    usage: '',
    timeTaken: null,
    error: '',
    createdAt: '2025-12-05 05:20:49',
    updatedAt: '2025-12-05 05:20:49',
  },
  {
    id: 10,
    _id: '69326bb963ef36403c3ea387',
    ticketId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    type: 'support_message',
    action: null,
    context: null,
    usage: '',
    timeTaken: null,
    error: '',
    createdAt: '2025-12-05 05:20:48',
    updatedAt: '2025-12-05 05:20:48',
  },
  {
    id: 11,
    _id: '69326bb963ef36403c3ea388',
    ticketId: 'd4e5f6a7-b8c9-0123-def0-234567890123',
    type: 'ticket_message',
    action: null,
    context: null,
    usage: '',
    timeTaken: null,
    error: '',
    createdAt: '2025-12-05 05:09:28',
    updatedAt: '2025-12-05 05:09:28',
  },
];

export const EventsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    ticketId: '',
    type: 'ticket_message',
    error: '',
  });

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      !searchQuery ||
      event.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.error.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    switch (sortField) {
      case 'ticket_id':
        aValue = a.ticketId.toLowerCase();
        bValue = b.ticketId.toLowerCase();
        break;
      case 'type':
        aValue = a.type.toLowerCase();
        bValue = b.type.toLowerCase();
        break;
      case 'error':
        aValue = a.error.toLowerCase();
        bValue = b.error.toLowerCase();
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
    console.log('Refresh events');
  };

  const handleCreate = () => {
    setEditingEventId(null);
    setNewEvent({
      ticketId: '',
      type: 'ticket_message',
      error: '',
    });
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingEventId(null);
    setNewEvent({
      ticketId: '',
      type: 'ticket_message',
      error: '',
    });
  };

  const handleSaveEvent = () => {
    if (editingEventId) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editingEventId
            ? {
                ...event,
                ticketId: newEvent.ticketId,
                type: newEvent.type,
                error: newEvent.error,
              }
            : event
        )
      );
      console.log('Update event:', editingEventId, newEvent);
    } else {
      // Create new event
      const newId = Math.max(...events.map((e) => e.id), 0) + 1;
      const createdEvent = {
        id: newId,
        ticketId: newEvent.ticketId,
        type: newEvent.type,
        error: newEvent.error,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      setEvents((prevEvents) => [...prevEvents, createdEvent]);
      console.log('Create new event', createdEvent);
    }
    handleCloseCreate();
  };

  const handleView = (eventId, e) => {
    e?.stopPropagation();
    navigate(`/models/events/${eventId}`);
  };

  const handleEdit = (eventId, e) => {
    e.stopPropagation();
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setEditingEventId(eventId);
      setNewEvent({
        ticketId: event.ticketId,
        type: event.type,
        error: event.error,
      });
      setIsCreateOpen(true);
    }
  };

  const handleDelete = (eventId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      console.log('Delete event', eventId);
    }
  };

  const handleCopyTicketId = (ticketId) => {
    navigator.clipboard.writeText(ticketId);
  };

  const ITEMS_PER_PAGE = 10;
  const totalEvents = sortedEvents.length;
  const totalPages = Math.ceil(totalEvents / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedEvents = sortedEvents.slice(startIndex, endIndex);

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
            <Title theme={theme}>Events</Title>
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
              <option value="type">Type</option>
              <option value="error">Error</option>
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
                        onClick={() => handleSort('type')}
                        $sorted={sortField === 'type'}
                      >
                        Type
                        <SortIcon>{getSortIcon('type')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('error')}
                        $sorted={sortField === 'error'}
                      >
                        Error
                        <SortIcon>{getSortIcon('error')}</SortIcon>
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
                    {paginatedEvents.map((event) => (
                      <TableRow key={event.id} theme={theme}>
                        <TicketIdCell theme={theme}>
                          <TicketIdLink onClick={() => handleCopyTicketId(event.ticketId)}>
                            {event.ticketId}
                          </TicketIdLink>
                          <AdminLink onClick={() => navigate(`/models/tickets/${event.ticketId}`)}>
                            Admin
                          </AdminLink>
                        </TicketIdCell>
                        <TypeCell theme={theme}>{event.type}</TypeCell>
                        <ErrorCell theme={theme}>{event.error || ''}</ErrorCell>
                        <CreatedAtCell theme={theme}>{event.createdAt}</CreatedAtCell>
                        <ActionsCell theme={theme}>
                          <ActionButton
                            theme={theme}
                            onClick={(e) => handleView(event.id, e)}
                            title="View"
                          >
                            <HiEye size={16} />
                          </ActionButton>
                          <ActionButton
                            theme={theme}
                            onClick={(e) => handleEdit(event.id, e)}
                            title="Edit"
                          >
                            <HiPencil size={16} />
                          </ActionButton>
                          <ActionButton
                            theme={theme}
                            $danger
                            onClick={(e) => handleDelete(event.id, e)}
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
                      value={newEvent.ticketId}
                      onChange={(e) => setNewEvent({ ...newEvent, ticketId: e.target.value })}
                      placeholder="Enter ticket ID"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Type</SettingLabel>
                  <SettingContent>
                    <Select
                      theme={theme}
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    >
                      <option value="ticket_message">ticket_message</option>
                      <option value="support_message">support_message</option>
                    </Select>
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Error</SettingLabel>
                  <SettingContent>
                    <TextArea
                      theme={theme}
                      value={newEvent.error}
                      onChange={(e) => setNewEvent({ ...newEvent, error: e.target.value })}
                      placeholder="Enter error message (optional)"
                    />
                  </SettingContent>
                </SettingSection>

                <SaveButton theme={theme} onClick={handleSaveEvent}>
                  {editingEventId ? 'Save Changes' : 'Create Event'}
                </SaveButton>
              </RightContent>
            </RightPanel>
          </PageContainer>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalEvents}
            onPageChange={setCurrentPage}
            itemsPerPage={10}
          />
        </div>
      </ThemeProvider>
    </Layout>
  );
};

