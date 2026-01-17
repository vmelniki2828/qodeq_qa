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

const ReceiptSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ReceiptIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) =>
    theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  border-radius: 8px;
  font-size: 20px;
`;

const ReceiptContent = styled.div`
  flex: 1;
`;

const ReceiptTitle = styled.h3`
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ReceiptDate = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ErrorBanner = styled.div`
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const ErrorIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ef4444;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 2px;
`;

const ErrorContent = styled.div`
  flex: 1;
`;

const ErrorTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ef4444;
  margin-bottom: 4px;
`;

const ErrorMessage = styled.div`
  font-size: 13px;
  color: #ef4444;
  word-break: break-word;
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

// Моковые данные OCR results
const mockOCRResults = [
  {
    id: 1,
    _id: '69326c7771754e5e17bc39d0',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d63',
    sourceFileUrl: 'https://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMkhOQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvY19pZCJ9fQ==-9c4196e2d9277fa110f4337c94193e569e79447e/receipt.pdf',
    text: null,
    hash: null,
    fieldsExtracted: {
      receipt_type: 'invalid',
      phone_number: null,
      card_number: null,
      receipt_datetime: null,
      amount: null,
      currency_code: null,
      payment_method: null,
      receipt_number: null,
    },
    usage: null,
    extra: null,
    error: 'No text extracted for ticket_id=bf28d02a-1e40-403e-bfd6-3dab08d97d63, receipt_url=https://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMkhOQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvY19pZCJ9fQ==-9c4196e2d9277fa110f4337c94193e569e79447e/receipt.pdf',
    createdAt: '2025-12-05 05:32:52',
    updatedAt: '2025-12-05 05:32:52',
  },
  {
    id: 2,
    _id: '69326c7771754e5e17bc39d1',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d64',
    sourceFileUrl: 'https://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMkhOQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvY19pZCJ9fQ==-9c4196e2d9277fa110f4337c94193e569e79447e/receipt2.pdf',
    text: 'Sample receipt text',
    hash: 'abc123def456',
    fieldsExtracted: {
      receipt_type: 'valid',
      phone_number: '+1234567890',
      card_number: null,
      receipt_datetime: '2025-12-05 05:32:50',
      amount: 100.50,
      currency_code: 'USD',
      payment_method: 'card',
      receipt_number: 'R12345',
    },
    usage: { tokens: 100 },
    extra: { processed: true },
    error: null,
    createdAt: '2025-12-05 05:32:50',
    updatedAt: '2025-12-05 05:32:50',
  },
  {
    id: 3,
    _id: '69326c7771754e5e17bc39d2',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d65',
    sourceFileUrl: 'https://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMkhOQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvY19pZCJ9fQ==-9c4196e2d9277fa110f4337c94193e569e79447e/receipt3.pdf',
    text: null,
    hash: null,
    fieldsExtracted: {},
    usage: null,
    extra: null,
    error: null,
    createdAt: '2025-12-05 05:32:48',
    updatedAt: '2025-12-05 05:32:48',
  },
  {
    id: 4,
    _id: '69326c7771754e5e17bc39d3',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d66',
    sourceFileUrl: 'https://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMkhOQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvY19pZCJ9fQ==-9c4196e2d9277fa110f4337c94193e569e79447e/receipt4.pdf',
    text: null,
    hash: null,
    fieldsExtracted: {},
    usage: null,
    extra: null,
    error: null,
    createdAt: '2025-12-05 05:32:46',
    updatedAt: '2025-12-05 05:32:46',
  },
  {
    id: 5,
    _id: '69326c7771754e5e17bc39d4',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d67',
    sourceFileUrl: 'https://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMkhOQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvY19pZCJ9fQ==-9c4196e2d9277fa110f4337c94193e569e79447e/receipt5.pdf',
    text: null,
    hash: null,
    fieldsExtracted: {},
    usage: null,
    extra: null,
    error: null,
    createdAt: '2025-12-05 05:32:44',
    updatedAt: '2025-12-05 05:32:44',
  },
  {
    id: 6,
    _id: '69326c7771754e5e17bc39d5',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d68',
    sourceFileUrl: 'https://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMkhOQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvY19pZCJ9fQ==-9c4196e2d9277fa110f4337c94193e569e79447e/receipt6.pdf',
    text: null,
    hash: null,
    fieldsExtracted: {},
    usage: null,
    extra: null,
    error: null,
    createdAt: '2025-12-05 05:32:42',
    updatedAt: '2025-12-05 05:32:42',
  },
  {
    id: 7,
    _id: '69326c7771754e5e17bc39d6',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d69',
    sourceFileUrl: 'https://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMkhOQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvY19pZCJ9fQ==-9c4196e2d9277fa110f4337c94193e569e79447e/receipt7.pdf',
    text: null,
    hash: null,
    fieldsExtracted: {},
    usage: null,
    extra: null,
    error: null,
    createdAt: '2025-12-05 05:32:40',
    updatedAt: '2025-12-05 05:32:40',
  },
  {
    id: 8,
    _id: '69326c7771754e5e17bc39d7',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d70',
    sourceFileUrl: 'https://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMkhOQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvY19pZCJ9fQ==-9c4196e2d9277fa110f4337c94193e569e79447e/receipt8.pdf',
    text: null,
    hash: null,
    fieldsExtracted: {},
    usage: null,
    extra: null,
    error: null,
    createdAt: '2025-12-05 05:32:38',
    updatedAt: '2025-12-05 05:32:38',
  },
  {
    id: 9,
    _id: '69326c7771754e5e17bc39d8',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d71',
    sourceFileUrl: 'https://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMkhOQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvY19pZCJ9fQ==-9c4196e2d9277fa110f4337c94193e569e79447e/receipt9.pdf',
    text: null,
    hash: null,
    fieldsExtracted: {},
    usage: null,
    extra: null,
    error: null,
    createdAt: '2025-12-05 05:32:36',
    updatedAt: '2025-12-05 05:32:36',
  },
  {
    id: 10,
    _id: '69326c7771754e5e17bc39d9',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d72',
    sourceFileUrl: 'https://sparkmoth.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMkhOQVE9PSIsImV4cCl6bnVsbCwicHVyljoiYmxvY19pZCJ9fQ==-9c4196e2d9277fa110f4337c94193e569e79447e/receipt10.pdf',
    text: null,
    hash: null,
    fieldsExtracted: {},
    usage: null,
    extra: null,
    error: null,
    createdAt: '2025-12-05 05:32:34',
    updatedAt: '2025-12-05 05:32:34',
  },
];

export const OCRResultsDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [ocrResult, setOcrResult] = useState(null);

  useEffect(() => {
    // Находим OCR result по ID
    const foundOcrResult = mockOCRResults.find(
      (o) => o.id === Number(id) || o._id === id
    );
    setOcrResult(foundOcrResult || null);
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh OCR result', id);
  };

  const handleEdit = () => {
    navigate(`/models/ocr-results/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this OCR result?')) {
      console.log('Delete OCR result', id);
      navigate('/models/ocr-results');
    }
  };

  const handleBack = () => {
    navigate('/models/ocr-results');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString.replace(' ', 'T'));
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

  if (!ocrResult) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>OCR result not found</div>
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
    { field: '_id', value: ocrResult._id },
    { field: 'created_at', value: ocrResult.createdAt },
    { field: 'updated_at', value: ocrResult.updatedAt },
    { field: 'ticket_id', value: ocrResult.ticketId },
    { field: 'source_file_url', value: ocrResult.sourceFileUrl },
    { field: 'text', value: ocrResult.text },
    { field: 'hash', value: ocrResult.hash },
    { field: 'fields_extracted', value: ocrResult.fieldsExtracted },
    { field: 'usage', value: ocrResult.usage },
    { field: 'extra', value: ocrResult.extra },
    { field: 'error', value: ocrResult.error },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>
              OCR Results · {ocrResult._id}
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
            <ReceiptSection theme={theme}>
              <ReceiptIcon theme={theme}>📄</ReceiptIcon>
              <ReceiptContent>
                <ReceiptTitle theme={theme}>Receipt</ReceiptTitle>
                <ReceiptDate theme={theme}>{formatDate(ocrResult.createdAt)}</ReceiptDate>
              </ReceiptContent>
            </ReceiptSection>

            {ocrResult.error && (
              <ErrorBanner>
                <ErrorIcon>i</ErrorIcon>
                <ErrorContent>
                  <ErrorTitle>OCR Error</ErrorTitle>
                  <ErrorMessage>{ocrResult.error}</ErrorMessage>
                </ErrorContent>
              </ErrorBanner>
            )}

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
                      ) : item.field === 'source_file_url' ? (
                        <UrlLink onClick={() => window.open(item.value, '_blank')}>
                          {formatValue(item.value)}
                        </UrlLink>
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

