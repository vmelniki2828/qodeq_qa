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

const TagSection = styled.div`
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

const TagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const TagItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TagLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TagValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
  font-weight: 600;
  font-family: ${({ $monospace }) => ($monospace ? 'monospace' : 'inherit')};
  font-size: ${({ $monospace }) => ($monospace ? '12px' : '14px')};
`;

const PaymentLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  text-decoration: underline;
  font-family: monospace;
  font-size: 12px;
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

// Моковые данные tags
const mockTags = [
  {
    id: 1,
    _id: '692ef45c1a9b21f5a26a742a',
    uuid: '38ed4e48-40a7-464c-b76d-efce8688312f',
    name: 'GELATO_SBP_ALFA_H2H_PAY_IN_FTD',
    paymentId: '692ef39e1c07e718483352f1',
    excludeInProcess: false,
    gateways: [],
    createdAt: '2025-12-02 14:14:52',
    updatedAt: '2025-12-02 14:14:52',
  },
  {
    id: 2,
    _id: '55a83d98-dc8b-4ffc-aa56-a076ef2620b4',
    uuid: '55a83d98-dc8b-4ffc-aa56-a076ef2620b4',
    name: 'Hgate Sarexpay Mobile commerce pay-in',
    paymentId: '692eea221a9b21f5a26a6c9f',
    excludeInProcess: false,
    gateways: [],
    createdAt: '2025-12-02 13:32:02',
    updatedAt: '2025-12-02 13:32:02',
  },
  {
    id: 3,
    _id: 'd696c06c-2d7a-4b81-8998-be1600f2b912',
    uuid: 'd696c06c-2d7a-4b81-8998-be1600f2b912',
    name: 'Hgate IDM SBP pay-in',
    paymentId: '68ecb9a973e8d822bfac1074',
    excludeInProcess: false,
    gateways: [],
    createdAt: '2025-12-02 12:53:11',
    updatedAt: '2025-12-02 12:53:11',
  },
  {
    id: 4,
    _id: 'e773dab9-bef2-41d7-9ceb-24cd2c177ff5',
    uuid: 'e773dab9-bef2-41d7-9ceb-24cd2c177ff5',
    name: 'Hgate SBP Alfa cascading FTD',
    paymentId: '68ecb9a973e8d822bfac1074',
    excludeInProcess: false,
    gateways: [],
    createdAt: '2025-12-02 12:53:11',
    updatedAt: '2025-12-02 12:53:11',
  },
  {
    id: 5,
    _id: 'd2d105fa-9dbb-4270-a5b8-8120fb28adb0',
    uuid: 'd2d105fa-9dbb-4270-a5b8-8120fb28adb0',
    name: 'Paycos #10.4 Cascad SBP FTD',
    paymentId: '68ecb9a973e8d822bfac1074',
    excludeInProcess: false,
    gateways: [],
    createdAt: '2025-12-02 12:53:11',
    updatedAt: '2025-12-02 12:53:11',
  },
  {
    id: 6,
    _id: 'dca012d2-cb4a-4c2a-9e35-108f82d0b472',
    uuid: 'dca012d2-cb4a-4c2a-9e35-108f82d0b472',
    name: 'Paycos BovaPay 1click Tinkoff RUB FTD',
    paymentId: '68ecb9a973e8d822bfac1074',
    excludeInProcess: false,
    gateways: [],
    createdAt: '2025-12-02 12:53:11',
    updatedAt: '2025-12-02 12:53:11',
  },
  {
    id: 7,
    _id: 'db17e9e3-c59a-45d5-b98c-6c27b74fcf88',
    uuid: 'db17e9e3-c59a-45d5-b98c-6c27b74fcf88',
    name: 'Hgate SBP cascading low dep FTD',
    paymentId: '68ecb9a973e8d822bfac1074',
    excludeInProcess: false,
    gateways: [],
    createdAt: '2025-12-02 12:53:11',
    updatedAt: '2025-12-02 12:53:11',
  },
];

export const TagDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [tag, setTag] = useState(null);

  useEffect(() => {
    // Находим tag по ID
    const foundTag = mockTags.find(
      (t) => t.id === Number(id) || t._id === id || t.uuid === id
    );
    setTag(foundTag || null);
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh tag', id);
  };

  const handleEdit = () => {
    navigate(`/models/tags/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      console.log('Delete tag', id);
      navigate('/models/tags');
    }
  };

  const handleBack = () => {
    navigate('/models/tags');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!tag) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>Tag not found</div>
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
    if (typeof value === 'boolean') {
      return value.toString();
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const fields = [
    { field: '_id', value: tag._id },
    { field: 'created_at', value: tag.createdAt },
    { field: 'updated_at', value: tag.updatedAt },
    { field: 'uuid', value: tag.uuid },
    { field: 'name', value: tag.name },
    { field: 'payment_id', value: tag.paymentId },
    { field: 'exclude_in_process', value: tag.excludeInProcess },
    { field: 'gateways', value: tag.gateways },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>
              Tags · {tag._id}
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
            <TagSection theme={theme}>
              <SectionTitle theme={theme}>Tag</SectionTitle>
              <TagGrid>
                <TagItem>
                  <TagLabel theme={theme}>Name</TagLabel>
                  <TagValue theme={theme}>{tag.name}</TagValue>
                </TagItem>
                <TagItem>
                  <TagLabel theme={theme}>Payment</TagLabel>
                  <TagValue theme={theme}>
                    <PaymentLink onClick={() => navigate(`/models/payments/${tag.paymentId}`)}>
                      {tag.paymentId}
                    </PaymentLink>
                  </TagValue>
                </TagItem>
                <TagItem>
                  <TagLabel theme={theme}>Gateways</TagLabel>
                  <TagValue theme={theme}>
                    {tag.gateways && tag.gateways.length > 0 ? tag.gateways.join(', ') : '—'}
                  </TagValue>
                </TagItem>
                <TagItem>
                  <TagLabel theme={theme}>UUID</TagLabel>
                  <TagValue theme={theme} $monospace>{tag.uuid}</TagValue>
                </TagItem>
                <TagItem>
                  <TagLabel theme={theme}>Exclude In Process</TagLabel>
                  <TagValue theme={theme}>{tag.excludeInProcess ? 'Yes' : 'No'}</TagValue>
                </TagItem>
              </TagGrid>
            </TagSection>

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
                      ) : item.field === 'payment_id' ? (
                        <IdValue onClick={() => handleCopyId(item.value)}>
                          {formatValue(item.value)}
                        </IdValue>
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


