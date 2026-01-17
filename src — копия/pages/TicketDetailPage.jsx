import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { HiArrowPath, HiTrash, HiChevronLeft, HiArrowTopRightOnSquare } from 'react-icons/hi2';

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

const TicketSection = styled.div`
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
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #f97316;
  background-color: rgba(249, 115, 22, 0.1);
`;

const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const TicketInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
`;

const TicketLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  font-family: monospace;
  font-size: 12px;
`;

const AdminLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  text-decoration: underline;
`;

const TicketSubsection = styled.div`
  margin-bottom: 20px;

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

const TicketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const TicketItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TicketLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TicketValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
`;

const TagLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  font-family: monospace;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EventTimelineSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  margin-bottom: 24px;
`;

const TimelineSummary = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 16px;
`;

const EventItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const EventIcon = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const EventContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EventType = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: monospace;
`;

const EventDuration = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const EventDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ReceiptsAndTransactionSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReceiptsHeader = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ReceiptCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ReceiptCardIcon = styled.div`
  font-size: 24px;
  color: #3B82F6;
`;

const ReceiptCardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReceiptCardTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const ReceiptCardDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ReceiptSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
`;

const ReceiptSectionTitle = styled.h4`
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};
  padding-bottom: 12px;
`;

const ReceiptGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const ReceiptItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReceiptLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ReceiptValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
`;

const RawFieldsTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 8px;
`;

const RawFieldsData = styled.pre`
  margin: 0 0 16px 0;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
`;

const ViewFileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const ViewDetailsLink = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #3B82F6;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const TransactionHeader = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const TicketDataSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
`;

const TicketDataTitle = styled.h4`
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TicketDataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`;

const TicketDataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TicketDataLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TicketDataValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
  font-family: ${({ $monospace }) => ($monospace ? 'monospace' : 'inherit')};
`;

const TransactionsLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const TransactionLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  font-size: 14px;
  font-family: monospace;

  &:hover {
    opacity: 0.8;
  }
`;

const ReceiptLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
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
`;

const JsonValue = styled.pre`
  margin: 0;
  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: ${({ theme }) => theme.colors.primary};
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
    events: [
      {
        id: 0,
        type: 'message',
        date: '2025-12-05T05:04:22.412000+00:00',
        duration: '13.35s',
      },
      {
        id: 2,
        type: 'ticket_message',
        date: '2025-12-05T05:04:35.744000+00:00',
      },
    ],
  },
];

export const TicketDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    // Находим ticket по ID
    const foundTicket = mockTickets.find((t) => t.id === Number(id) || t._id === id || t.uuid === id);
    setTicket(foundTicket || null);
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh ticket', id);
  };

  const handleRefreshFromHelpdesk = () => {
    console.log('Refresh from Helpdesk', id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      console.log('Delete ticket', id);
      navigate('/models/tickets');
    }
  };

  const handleBack = () => {
    navigate('/models/tickets');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!ticket) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>Ticket not found</div>
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
    { field: '_id', value: ticket._id },
    { field: 'created_at', value: ticket.createdAt },
    { field: 'updated_at', value: ticket.updatedAt },
    { field: 'uuid', value: ticket.uuid },
    { field: 'license_id', value: '1801296683' },
    { field: 'short_id', value: ticket.shortId },
    { field: 'ticket_created_at', value: ticket.ticketCreatedAt },
    { field: 'created_by', value: 'b5845626-b995-4286-8ea8-cc8269b6577c' },
    { field: 'created_by_type', value: 'agent' },
    { field: 'ticket_updated_at', value: ticket.ticketUpdatedAt },
    { field: 'updated_by', value: 'b5845626-b995-4286-8ea8-cc8269b6577c' },
    { field: 'last_message_at', value: '2025-12-05T05:04:22.411000+00:00' },
    { field: 'parent_ticket', value: null },
    { field: 'child_tickets', value: [] },
    { field: 'status', value: ticket.status },
    { field: 'priority', value: ticket.priority },
    { field: 'subject', value: ticket.subject },
    { field: 'team_ids', value: ticket.teamId },
    { field: 'requester', value: { email: 'koch.7900@list.ru', name: 'Client' } },
    { field: 'cc', value: [] },
    { field: 'assignment', value: { team: { ID: ticket.teamId, name: ticket.teamName }, agent: null } },
    { field: 'tag_ids', value: ticket.tagId },
    { field: 'followers', value: [] },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>
              Tickets · {ticket._id}
            </Title>
            <ButtonsGroup>
              <Button theme={theme} onClick={handleRefresh}>
                <HiArrowPath size={16} />
                Refresh
              </Button>
              <Button theme={theme} onClick={handleRefreshFromHelpdesk}>
                <HiArrowPath size={16} />
                Refresh from Helpdesk
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
            <TicketSection theme={theme}>
              <SectionTitle theme={theme}>
                {ticket.subject}
                <StatusBadge>{ticket.status}</StatusBadge>
              </SectionTitle>
              
              <TicketInfo>
                <TicketInfoRow theme={theme}>
                  <span>Ticket:</span>
                  <TicketLink onClick={() => handleCopyId(ticket.uuid)}>
                    {ticket.uuid}
                  </TicketLink>
                  <AdminLink onClick={() => navigate(`/models/tickets/${ticket.uuid}/admin`)}>
                    Admin
                  </AdminLink>
                </TicketInfoRow>
                <TicketInfoRow theme={theme}>
                  <span>Created: {formatDate(ticket.ticketCreatedAt)}</span>
                </TicketInfoRow>
                <TicketInfoRow theme={theme}>
                  <span>Updated: {formatDate(ticket.ticketUpdatedAt)}</span>
                </TicketInfoRow>
              </TicketInfo>

              <TicketSubsection>
                <SubsectionTitle theme={theme}>Details</SubsectionTitle>
                <TicketGrid>
                  <TicketItem>
                    <TicketLabel theme={theme}>Priority</TicketLabel>
                    <TicketValue theme={theme}>Normal</TicketValue>
                  </TicketItem>
                  <TicketItem>
                    <TicketLabel theme={theme}>Language</TicketLabel>
                    <TicketValue theme={theme}>{ticket.language}</TicketValue>
                  </TicketItem>
                  <TicketItem>
                    <TicketLabel theme={theme}>Rating</TicketLabel>
                    <TicketValue theme={theme}>Not rated</TicketValue>
                  </TicketItem>
                </TicketGrid>
              </TicketSubsection>

              <TicketSubsection>
                <SubsectionTitle theme={theme}>Assignment</SubsectionTitle>
                <TicketGrid>
                  <TicketItem>
                    <TicketLabel theme={theme}>Team</TicketLabel>
                    <TicketValue theme={theme}>{ticket.teamName || '—'}</TicketValue>
                  </TicketItem>
                  <TicketItem>
                    <TicketLabel theme={theme}>Agent</TicketLabel>
                    <TicketValue theme={theme}>—</TicketValue>
                  </TicketItem>
                </TicketGrid>
              </TicketSubsection>

              <TicketSubsection>
                <SubsectionTitle theme={theme}>Tags</SubsectionTitle>
                <TicketGrid>
                  <TicketItem>
                    <TicketLabel theme={theme}>Cat Payment</TicketLabel>
                    <TicketValue theme={theme}>Unassigned</TicketValue>
                  </TicketItem>
                  <TicketItem>
                    <TicketLabel theme={theme}></TicketLabel>
                    <TicketValue theme={theme}>
                      <TagLink onClick={() => handleCopyId(ticket.tagId)}>
                        #{ticket.tagId}
                        <HiArrowTopRightOnSquare size={12} />
                      </TagLink>
                    </TicketValue>
                  </TicketItem>
                </TicketGrid>
              </TicketSubsection>
            </TicketSection>

            <EventTimelineSection theme={theme}>
              <SectionTitle theme={theme}>Event Timeline</SectionTitle>
              <TimelineSummary theme={theme}>
                {ticket.events.length} events recorded
              </TimelineSummary>
              {ticket.events.map((event) => (
                <EventItem key={event.id} theme={theme}>
                  <EventIcon theme={theme}>⚡</EventIcon>
                  <EventContent>
                    <EventType theme={theme}>{event.type}</EventType>
                    {event.duration && (
                      <EventDuration theme={theme}>{event.duration}</EventDuration>
                    )}
                  </EventContent>
                  <EventDate theme={theme}>{formatDate(event.date)}</EventDate>
                </EventItem>
              ))}
            </EventTimelineSection>

            <ReceiptsAndTransactionSection>
              <LeftPanel>
                <ReceiptsHeader theme={theme}>Receipts</ReceiptsHeader>
                <ReceiptCard theme={theme}>
                  <ReceiptCardIcon>📄</ReceiptCardIcon>
                  <ReceiptCardText>
                    <ReceiptCardTitle>Receipt</ReceiptCardTitle>
                    <ReceiptCardDate>{formatDate(ticket.ticketCreatedAt)}</ReceiptCardDate>
                  </ReceiptCardText>
                </ReceiptCard>
                <ReceiptSection theme={theme}>
                  <ReceiptSectionTitle theme={theme}>Receipt</ReceiptSectionTitle>
                  <ReceiptGrid>
                    <ReceiptItem>
                      <ReceiptLabel theme={theme}>Receipt Type:</ReceiptLabel>
                      <ReceiptValue theme={theme}>receipt</ReceiptValue>
                    </ReceiptItem>
                    <ReceiptItem>
                      <ReceiptLabel theme={theme}>Phone Number:</ReceiptLabel>
                      <ReceiptValue theme={theme}>5877</ReceiptValue>
                    </ReceiptItem>
                    <ReceiptItem>
                      <ReceiptLabel theme={theme}>Receipt Datetime:</ReceiptLabel>
                      <ReceiptValue theme={theme}>2025-12-04T16:53:00+00:00</ReceiptValue>
                    </ReceiptItem>
                    <ReceiptItem>
                      <ReceiptLabel theme={theme}>Amount:</ReceiptLabel>
                      <ReceiptValue theme={theme}>10000.00</ReceiptValue>
                    </ReceiptItem>
                    <ReceiptItem>
                      <ReceiptLabel theme={theme}>Bank Name:</ReceiptLabel>
                      <ReceiptValue theme={theme}>Сбербанк</ReceiptValue>
                    </ReceiptItem>
                  </ReceiptGrid>
                  <RawFieldsTitle theme={theme}>Raw Fields Data:</RawFieldsTitle>
                  <RawFieldsData theme={theme}>
                    {`{
  "receipt_type": "receipt",
  "phone_number": "5877",
  "receipt_datetime": "2025-12-04T16:53:00+00:00",
  "amount": 10000,
  "bank_name": "Сбербанк"
}`}
                  </RawFieldsData>
                  <ViewFileButton theme={theme}>
                    <HiArrowTopRightOnSquare size={16} />
                    View original file
                  </ViewFileButton>
                </ReceiptSection>
                <ViewDetailsLink theme={theme} onClick={() => navigate(`/models/receipts/${ticket.uuid}`)}>
                  View details
                  <HiArrowTopRightOnSquare size={14} />
                </ViewDetailsLink>
              </LeftPanel>

              <RightPanel>
                <TransactionHeader theme={theme}>Transaction Data</TransactionHeader>
                <TicketDataSection theme={theme}>
                  <TicketDataTitle theme={theme}>Ticket Data</TicketDataTitle>
                  <TicketDataGrid>
                    <TicketDataItem>
                      <TicketDataLabel theme={theme}>Project</TicketDataLabel>
                      <TicketDataValue theme={theme}>cat</TicketDataValue>
                    </TicketDataItem>
                    <TicketDataItem>
                      <TicketDataLabel theme={theme}>Gateway</TicketDataLabel>
                      <TicketDataValue theme={theme}>Hgate SBP cascading 1000 FTD</TicketDataValue>
                    </TicketDataItem>
                    <TicketDataItem>
                      <TicketDataLabel theme={theme}>Payment</TicketDataLabel>
                      <TicketDataValue theme={theme}>hgatepaytop</TicketDataValue>
                    </TicketDataItem>
                    <TicketDataItem>
                      <TicketDataLabel theme={theme}>User ID</TicketDataLabel>
                      <TicketDataValue theme={theme}>1611131007</TicketDataValue>
                    </TicketDataItem>
                    <TicketDataItem>
                      <TicketDataLabel theme={theme}>Tag</TicketDataLabel>
                      <TicketDataValue theme={theme}>
                        {ticket.tagId ? `${ticket.tagId.substring(0, 36)} Off` : '—'}
                      </TicketDataValue>
                    </TicketDataItem>
                    <TicketDataItem>
                      <TicketDataLabel theme={theme}>Receipt</TicketDataLabel>
                      <TicketDataValue theme={theme}>
                        <ReceiptLink theme={theme} onClick={() => navigate(`/models/receipts/${ticket.uuid}`)}>
                          Open
                        </ReceiptLink>
                      </TicketDataValue>
                    </TicketDataItem>
                  </TicketDataGrid>
                  <TransactionsLabel theme={theme}>Transactions</TransactionsLabel>
                  <TransactionLink theme={theme} onClick={() => navigate(`/models/transactions/303120771`)}>
                    303120771
                  </TransactionLink>
                </TicketDataSection>
                <ViewDetailsLink theme={theme} onClick={() => navigate(`/models/ticket-data/${ticket.uuid}`)}>
                  View details
                  <HiArrowTopRightOnSquare size={14} />
                </ViewDetailsLink>
              </RightPanel>
            </ReceiptsAndTransactionSection>

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
                      {item.field === '_id' || item.field === 'uuid' || item.field === 'short_id' ? (
                        <IdValue onClick={() => handleCopyId(item.value)}>
                          {formatValue(item.value)}
                        </IdValue>
                      ) : item.field === 'team_ids' || item.field === 'tag_ids' ? (
                        <>
                          <IdValue onClick={() => handleCopyId(item.value)}>
                            {formatValue(item.value)}
                          </IdValue>
                          <HiArrowTopRightOnSquare size={12} style={{ marginLeft: '4px', color: '#3B82F6' }} />
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

