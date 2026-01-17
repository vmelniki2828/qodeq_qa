import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { HiArrowPath, HiPencil, HiTrash, HiChevronLeft } from 'react-icons/hi2';

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

const EventSection = styled.div`
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

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const EventItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EventLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const EventValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
  font-family: ${({ $monospace }) => ($monospace ? 'monospace' : 'inherit')};
  font-size: ${({ $monospace }) => ($monospace ? '12px' : '14px')};
`;

const TicketLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  font-family: monospace;
  font-size: 12px;
  margin-right: 8px;
`;

const AdminLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  text-decoration: underline;
`;

const ErrorBox = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
  margin-top: 16px;
  word-wrap: break-word;
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
`;

const JsonValue = styled.pre`
  margin: 0;
  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: ${({ theme }) => theme.colors.primary};
  max-height: 400px;
  overflow-y: auto;
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
];

export const EventDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Находим event по ID
    const foundEvent = mockEvents.find((e) => e.id === Number(id) || e._id === id);
    setEvent(foundEvent || null);
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh event', id);
  };

  const handleEdit = () => {
    navigate(`/models/events/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      console.log('Delete event', id);
      navigate('/models/events');
    }
  };

  const handleBack = () => {
    navigate('/models/events');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!event) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>Event not found</div>
          </ContentWrapper>
        </PageContent>
      </Layout>
    );
  }

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    return String(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
    } catch {
      return dateString;
    }
  };

  const fields = [
    { field: '_id', value: event._id },
    { field: 'created_at', value: event.createdAt },
    { field: 'updated_at', value: event.updatedAt },
    { field: 'ticket_id', value: event.ticketId },
    { field: 'type', value: event.type },
    { field: 'action', value: event.action },
    { field: 'context', value: event.context },
    { field: 'usage', value: event.usage },
    { field: 'time_taken', value: event.timeTaken },
    { field: 'error', value: event.error },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>
              Events · {event._id}
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
            <EventSection theme={theme}>
              <SectionTitle theme={theme}>Event</SectionTitle>
              <EventGrid>
                <EventItem>
                  <EventLabel theme={theme}>Type</EventLabel>
                  <EventValue theme={theme} $monospace>
                    {event.type}
                  </EventValue>
                </EventItem>
                <EventItem>
                  <EventLabel theme={theme}>Created</EventLabel>
                  <EventValue theme={theme}>
                    {formatDate(event.createdAt)}
                  </EventValue>
                </EventItem>
                <EventItem>
                  <EventLabel theme={theme}>Ticket</EventLabel>
                  <EventValue theme={theme}>
                    <TicketLink onClick={() => handleCopyId(event.ticketId)}>
                      {event.ticketId}
                    </TicketLink>
                    <AdminLink onClick={() => navigate(`/models/tickets/${event.ticketId}`)}>
                      Admin
                    </AdminLink>
                  </EventValue>
                </EventItem>
                <EventItem>
                  <EventLabel theme={theme}>Updated</EventLabel>
                  <EventValue theme={theme}>
                    {formatDate(event.updatedAt)}
                  </EventValue>
                </EventItem>
                <EventItem>
                  <EventLabel theme={theme}>Action</EventLabel>
                  <EventValue theme={theme}>
                    {event.action === null || event.action === undefined ? '—' : '—'}
                  </EventValue>
                </EventItem>
                <EventItem>
                  <EventLabel theme={theme}>Context</EventLabel>
                  <EventValue theme={theme}>
                    {event.context === null || event.context === undefined ? '""' : '""'}
                  </EventValue>
                </EventItem>
                <EventItem>
                  <EventLabel theme={theme}>Usage</EventLabel>
                  <EventValue theme={theme}>
                    {event.usage === null || event.usage === undefined || event.usage === '' ? '""' : '""'}
                  </EventValue>
                </EventItem>
                <EventItem>
                  <EventLabel theme={theme}>Time Taken</EventLabel>
                  <EventValue theme={theme}>
                    {event.timeTaken ? `${event.timeTaken.toFixed(2)}s` : '—'}
                  </EventValue>
                </EventItem>
              </EventGrid>
              {event.error && (
                <ErrorBox>
                  {event.error}
                </ErrorBox>
              )}
            </EventSection>

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
                      {item.field === '_id' ? (
                        <IdValue onClick={() => handleCopyId(item.value)}>
                          {formatValue(item.value)}
                        </IdValue>
                      ) : item.field === 'ticket_id' ? (
                        <>
                          <IdValue onClick={() => handleCopyId(item.value)}>
                            {formatValue(item.value)}
                          </IdValue>
                          <AdminLink onClick={() => navigate(`/models/tickets/${item.value}`)}>
                            {' '}Admin
                          </AdminLink>
                        </>
                      ) : (typeof item.value === 'object' && item.value !== null) ? (
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

