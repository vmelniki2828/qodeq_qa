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

const TicketDataSection = styled.div`
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

const TicketDataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const TicketDataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TicketDataLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TicketDataValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
  font-family: ${({ $monospace }) => ($monospace ? 'monospace' : 'inherit')};
  font-size: ${({ $monospace }) => ($monospace ? '12px' : '14px')};
`;

const TransactionIdBox = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background-color: #3B82F6;
  color: #FFFFFF;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  cursor: pointer;
`;

const ReceiptLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  text-decoration: underline;
`;

const TagLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  text-decoration: underline;
  font-family: monospace;
  font-size: 12px;
`;

const JsonSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  margin-bottom: 24px;
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

const UrlLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  text-decoration: underline;
  word-break: break-all;
`;

// Моковые данные ticket data
const mockTicketData = [
  {
    id: 1,
    _id: '69326c8b618c7daa628727cf',
    ticketId: '0cb7284b-f3d4-42f9-b249-c7b6db98a698',
    ocrResultId: '69326c7771754e5e17bc39d0',
    userId: 3069861528,
    receiptUrl: 'https://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNORTQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvYl9pZCJ9fQ==--4321259d8fa592ae2edfa3886606905521d32618/ozonbank_document_20251205082331.pdf',
    projectName: 'kent',
    gatewayName: 'Hgate SBP medium cascading',
    paymentName: 'hgatewilsonpay',
    transactionIds: [1604944258],
    tagId: '56c1a22a-2422-4a35-a7eb-a9658a174c18',
    usage: {
      input_tokens: 11624,
      cache_write_tokens: 0,
      cache_read_tokens: 10368,
      output_tokens: 500,
      input_audio_tokens: 0,
      cache_audio_read_tokens: 0,
      output_audio_tokens: 0,
      details: {
        accepted_prediction_tokens: 0,
        audio_tokens: 0,
        reasoning_tokens: 0,
        rejected_prediction_tokens: 0,
      },
      requests: 4,
    },
    paycoreRawResponse: [],
    paymentResponse: {
      internal_id: 1604944258,
      external_id: '11934787',
      transaction_reference: 'Deposit for user, UID: 3069861528, Amount: 4300.00 RUB',
    },
    createdAt: '2025-12-05 05:24:27',
    updatedAt: '2025-12-05 05:24:27',
  },
];

export const TicketDataDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    // Находим ticket data по ID
    const foundTicketData = mockTicketData.find(
      (t) => t.id === Number(id) || t._id === id
    );
    setTicketData(foundTicketData || null);
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh ticket data', id);
  };

  const handleEdit = () => {
    navigate(`/models/ticket-data/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this ticket data?')) {
      console.log('Delete ticket data', id);
      navigate('/models/ticket-data');
    }
  };

  const handleBack = () => {
    navigate('/models/ticket-data');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!ticketData) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>Ticket data not found</div>
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

  const fields = [
    { field: '_id', value: ticketData._id },
    { field: 'created_at', value: ticketData.createdAt },
    { field: 'updated_at', value: ticketData.updatedAt },
    { field: 'ticket_id', value: ticketData.ticketId },
    { field: 'ocr_result_id', value: ticketData.ocrResultId },
    { field: 'user_id', value: ticketData.userId },
    { field: 'receipt_url', value: ticketData.receiptUrl },
    { field: 'project_name', value: ticketData.projectName },
    { field: 'gateway_name', value: ticketData.gatewayName },
    { field: 'payment_name', value: ticketData.paymentName },
    { field: 'transaction_ids', value: ticketData.transactionIds },
    { field: 'tag_id', value: ticketData.tagId },
    { field: 'usage', value: ticketData.usage },
    { field: 'paycore_raw_response', value: ticketData.paycoreRawResponse },
    { field: 'payment_response', value: ticketData.paymentResponse },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>
              Ticket Data · {ticketData._id}
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
            <TicketDataSection theme={theme}>
              <SectionTitle theme={theme}>Ticket Data</SectionTitle>
              <TicketDataGrid>
                <TicketDataItem>
                  <TicketDataLabel theme={theme}>User ID</TicketDataLabel>
                  <TicketDataValue theme={theme}>{ticketData.userId}</TicketDataValue>
                </TicketDataItem>
                <TicketDataItem>
                  <TicketDataLabel theme={theme}>Project</TicketDataLabel>
                  <TicketDataValue theme={theme}>{ticketData.projectName}</TicketDataValue>
                </TicketDataItem>
                <TicketDataItem>
                  <TicketDataLabel theme={theme}>Payment</TicketDataLabel>
                  <TicketDataValue theme={theme}>{ticketData.paymentName}</TicketDataValue>
                </TicketDataItem>
                <TicketDataItem>
                  <TicketDataLabel theme={theme}>Transaction IDs</TicketDataLabel>
                  <TicketDataValue theme={theme}>
                    {ticketData.transactionIds && ticketData.transactionIds.length > 0 ? (
                      <TransactionIdBox onClick={() => handleCopyId(ticketData.transactionIds[0])}>
                        {ticketData.transactionIds[0]}
                      </TransactionIdBox>
                    ) : (
                      '—'
                    )}
                  </TicketDataValue>
                </TicketDataItem>
                <TicketDataItem>
                  <TicketDataLabel theme={theme}>Receipt</TicketDataLabel>
                  <TicketDataValue theme={theme}>
                    {ticketData.receiptUrl ? (
                      <ReceiptLink onClick={() => window.open(ticketData.receiptUrl, '_blank')}>
                        Open
                      </ReceiptLink>
                    ) : (
                      '—'
                    )}
                  </TicketDataValue>
                </TicketDataItem>
                <TicketDataItem>
                  <TicketDataLabel theme={theme}>Gateway</TicketDataLabel>
                  <TicketDataValue theme={theme}>{ticketData.gatewayName}</TicketDataValue>
                </TicketDataItem>
                <TicketDataItem>
                  <TicketDataLabel theme={theme}>Tag</TicketDataLabel>
                  <TicketDataValue theme={theme}>
                    {ticketData.tagId ? (
                      <TagLink onClick={() => navigate(`/models/tags/${ticketData.tagId}`)}>
                        {ticketData.tagId}
                      </TagLink>
                    ) : (
                      '—'
                    )}
                  </TicketDataValue>
                </TicketDataItem>
              </TicketDataGrid>
            </TicketDataSection>

            <JsonSection theme={theme}>
              <SectionTitle theme={theme}>Usage</SectionTitle>
              <JsonValue theme={theme}>{formatValue(ticketData.usage)}</JsonValue>
            </JsonSection>

            <JsonSection theme={theme}>
              <SectionTitle theme={theme}>Paycore Raw Response</SectionTitle>
              <JsonValue theme={theme}>{formatValue(ticketData.paycoreRawResponse)}</JsonValue>
            </JsonSection>

            <JsonSection theme={theme}>
              <SectionTitle theme={theme}>Payment Response</SectionTitle>
              <JsonValue theme={theme}>{formatValue(ticketData.paymentResponse)}</JsonValue>
            </JsonSection>

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
                      ) : item.field === 'ocr_result_id' ? (
                        <IdValue onClick={() => handleCopyId(item.value)}>
                          {formatValue(item.value)}
                        </IdValue>
                      ) : item.field === 'receipt_url' ? (
                        <UrlLink onClick={() => window.open(item.value, '_blank')}>
                          {formatValue(item.value)}
                        </UrlLink>
                      ) : item.field === 'transaction_ids' ? (
                        <IdValue onClick={() => handleCopyId(JSON.stringify(item.value))}>
                          {formatValue(item.value)}
                        </IdValue>
                      ) : item.field === 'tag_id' ? (
                        <TagLink onClick={() => navigate(`/models/tags/${item.value}`)}>
                          {formatValue(item.value)}
                        </TagLink>
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


