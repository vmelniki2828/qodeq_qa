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

const GatewaySection = styled.div`
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

const GatewayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const GatewayItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GatewayLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const GatewayValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
  font-weight: 600;
  font-family: ${({ $monospace }) => ($monospace ? 'monospace' : 'inherit')};
  font-size: ${({ $monospace }) => ($monospace ? '12px' : '14px')};
`;

const TagLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  text-decoration: underline;
  font-family: monospace;
  font-size: 12px;
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

// Моковые данные gateways
const mockGateways = [
  {
    id: 1,
    _id: '692ef7951a9b21f5a26a7702',
    name: 'AVE_SBER_TRANSGRAN_PAY_IN_STD',
    payment: '68c981d834af2e47cb02aa3b',
    paymentId: '68c981d834af2e47cb02aa3b',
    tag: 'f55fcb19-de54-4dd4-a2d6-0fccb611e790',
    tagId: 'f55fcb19-de54-4dd4-a2d6-0fccb611e790',
    createdAt: '2025-12-02 14:28:37',
    updatedAt: '2025-12-02 14:28:37',
  },
  {
    id: 2,
    _id: '68ecb9a973e8d822bfac1074',
    name: 'IDM_SBP_PAY_IN_H2H',
    payment: '68ecb9a973e8d822bfac1074',
    paymentId: '68ecb9a973e8d822bfac1074',
    tag: '38b20ddd-aca0-4f32-ab89-eb59ce147e12',
    tagId: '38b20ddd-aca0-4f32-ab89-eb59ce147e12',
    createdAt: '2025-12-02 14:26:39',
    updatedAt: '2025-12-02 14:26:39',
  },
  {
    id: 3,
    _id: '68ecb9a973e8d822bfac1075',
    name: 'IDM_MOBILE_COMMERCE_PAY_IN_H2H',
    payment: '68ecb9a973e8d822bfac1074',
    paymentId: '68ecb9a973e8d822bfac1074',
    tag: '36edfd95-4dc7-463f-886b-daf166c3f31a',
    tagId: '36edfd95-4dc7-463f-886b-daf166c3f31a',
    createdAt: '2025-12-02 14:25:54',
    updatedAt: '2025-12-02 14:25:54',
  },
  {
    id: 4,
    _id: '68ecb9a973e8d822bfac1076',
    name: 'IDM_MOBILE_COMMERCE_PAY_IN_H2H_V2',
    payment: '68ecb9a973e8d822bfac1074',
    paymentId: '68ecb9a973e8d822bfac1074',
    tag: '36edfd95-4dc7-463f-886b-daf166c3f31b',
    tagId: '36edfd95-4dc7-463f-886b-daf166c3f31b',
    createdAt: '2025-12-02 14:24:20',
    updatedAt: '2025-12-02 14:24:20',
  },
  {
    id: 5,
    _id: '68ecb9a973e8d822bfac1077',
    name: 'IDM_SBP_PAY_IN_H2H_V2',
    payment: '68ecb9a973e8d822bfac1074',
    paymentId: '68ecb9a973e8d822bfac1074',
    tag: '38b20ddd-aca0-4f32-ab89-eb59ce147e13',
    tagId: '38b20ddd-aca0-4f32-ab89-eb59ce147e13',
    createdAt: '2025-12-02 14:23:15',
    updatedAt: '2025-12-02 14:23:15',
  },
];

export const GatewayDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [gateway, setGateway] = useState(null);

  useEffect(() => {
    // Находим gateway по ID
    const foundGateway = mockGateways.find(
      (g) => g.id === Number(id) || g._id === id
    );
    setGateway(foundGateway || null);
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh gateway', id);
  };

  const handleEdit = () => {
    navigate(`/models/gateways/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this gateway?')) {
      console.log('Delete gateway', id);
      navigate('/models/gateways');
    }
  };

  const handleBack = () => {
    navigate('/models/gateways');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!gateway) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>Gateway not found</div>
          </ContentWrapper>
        </PageContent>
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

  const fields = [
    { field: '_id', value: gateway._id },
    { field: 'created_at', value: gateway.createdAt },
    { field: 'updated_at', value: gateway.updatedAt },
    { field: 'name', value: gateway.name },
    { field: 'payment_id', value: gateway.paymentId },
    { field: 'tag_id', value: gateway.tagId },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>
              Gateways · {gateway._id}
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
            <GatewaySection theme={theme}>
              <SectionTitle theme={theme}>Gateway</SectionTitle>
              <GatewayGrid>
                <GatewayItem>
                  <GatewayLabel theme={theme}>Name</GatewayLabel>
                  <GatewayValue theme={theme}>{gateway.name}</GatewayValue>
                </GatewayItem>
                <GatewayItem>
                  <GatewayLabel theme={theme}>Tag</GatewayLabel>
                  <GatewayValue theme={theme}>
                    <TagLink onClick={() => navigate(`/models/tags/${gateway.tagId}`)}>
                      {gateway.tagId}
                    </TagLink>
                  </GatewayValue>
                </GatewayItem>
                <GatewayItem>
                  <GatewayLabel theme={theme}>Payment</GatewayLabel>
                  <GatewayValue theme={theme}>
                    <PaymentLink onClick={() => navigate(`/models/payments/${gateway.paymentId}`)}>
                      {gateway.paymentId}
                    </PaymentLink>
                  </GatewayValue>
                </GatewayItem>
              </GatewayGrid>
            </GatewaySection>

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
                      ) : item.field === 'tag_id' ? (
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


