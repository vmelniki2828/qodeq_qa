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

const TeamSection = styled.div`
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

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const TeamItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TeamLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TeamValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
  font-weight: 600;
  font-family: ${({ $monospace }) => ($monospace ? 'monospace' : 'inherit')};
  font-size: ${({ $monospace }) => ($monospace ? '12px' : '14px')};
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

// Моковые данные teams
const mockTeams = [
  {
    id: 1,
    _id: '68aeeed876d62c0b83f7070e',
    uuid: '772f683e-9991-49f0-9c09-4ffa90d59bd1',
    name: 'Cat Tech',
    paymentTeam: false,
    isPayment: false,
    isVip: false,
    vipActive: false,
    createdAt: '2025-08-27 11:41:12',
    updatedAt: '2025-08-27 11:41:12',
  },
  {
    id: 2,
    _id: '761d7e2a-e884-41cd-8645-244f2d90e5de',
    uuid: '761d7e2a-e884-41cd-8645-244f2d90e5de',
    name: 'Loyalty Cat VIP',
    paymentTeam: true,
    isPayment: true,
    isVip: true,
    vipActive: true,
    createdAt: '2025-08-27 11:41:12',
    updatedAt: '2025-08-27 11:41:12',
  },
  {
    id: 3,
    _id: '771cfe42-cdce-45a5-9d6f-f4121e0c688c',
    uuid: '771cfe42-cdce-45a5-9d6f-f4121e0c688c',
    name: 'Go4Win KYC',
    paymentTeam: true,
    isPayment: true,
    isVip: false,
    vipActive: false,
    createdAt: '2025-08-27 11:41:12',
    updatedAt: '2025-08-27 11:41:12',
  },
  {
    id: 4,
    _id: '7af527c7-d28c-4b89-8620-a1836f6c91b6',
    uuid: '7af527c7-d28c-4b89-8620-a1836f6c91b6',
    name: 'CC Awol Gama',
    paymentTeam: true,
    isPayment: true,
    isVip: false,
    vipActive: false,
    createdAt: '2025-08-27 11:41:12',
    updatedAt: '2025-08-27 11:41:12',
  },
  {
    id: 5,
    _id: '6d346aab-e083-4040-a87c-8c479d56398a',
    uuid: '6d346aab-e083-4040-a87c-8c479d56398a',
    name: 'KYC Gama',
    paymentTeam: true,
    isPayment: true,
    isVip: false,
    vipActive: false,
    createdAt: '2025-08-27 11:41:12',
    updatedAt: '2025-08-27 11:41:12',
  },
  {
    id: 6,
    _id: '7a1ad86a-4fe7-4785-bcc0-76eb58a6f58e',
    uuid: '7a1ad86a-4fe7-4785-bcc0-76eb58a6f58e',
    name: 'RG Mers',
    paymentTeam: true,
    isPayment: true,
    isVip: false,
    vipActive: false,
    createdAt: '2025-08-27 11:41:12',
    updatedAt: '2025-08-27 11:41:12',
  },
  {
    id: 7,
    _id: '7678dfdf-a3ba-4c93-ab5e-1a3ea5fb001e',
    uuid: '7678dfdf-a3ba-4c93-ab5e-1a3ea5fb001e',
    name: 'Call Center (Kometa)',
    paymentTeam: true,
    isPayment: true,
    isVip: false,
    vipActive: false,
    createdAt: '2025-08-27 11:41:12',
    updatedAt: '2025-08-27 11:41:12',
  },
  {
    id: 8,
    _id: '8868cbbf-f44d-4677-905c-2d731c68dae9',
    uuid: '8868cbbf-f44d-4677-905c-2d731c68dae9',
    name: 'Смена данных (Pass/Email change)',
    paymentTeam: true,
    isPayment: true,
    isVip: false,
    vipActive: false,
    createdAt: '2025-08-27 11:41:12',
    updatedAt: '2025-08-27 11:41:12',
  },
  {
    id: 9,
    _id: '6fb6b1ab-4d0b-4783-9169-aca97d743ac0',
    uuid: '6fb6b1ab-4d0b-4783-9169-aca97d743ac0',
    name: 'KYC Mers',
    paymentTeam: true,
    isPayment: true,
    isVip: false,
    vipActive: false,
    createdAt: '2025-08-27 11:41:12',
    updatedAt: '2025-08-27 11:41:12',
  },
];

export const TeamDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    // Находим team по ID
    const foundTeam = mockTeams.find(
      (t) => t.id === Number(id) || t._id === id || t.uuid === id
    );
    setTeam(foundTeam || null);
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh team', id);
  };

  const handleEdit = () => {
    navigate(`/models/teams/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      console.log('Delete team', id);
      navigate('/models/teams');
    }
  };

  const handleBack = () => {
    navigate('/models/teams');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!team) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>Team not found</div>
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
    { field: '_id', value: team._id },
    { field: 'created_at', value: team.createdAt },
    { field: 'updated_at', value: team.updatedAt },
    { field: 'uuid', value: team.uuid },
    { field: 'name', value: team.name },
    { field: 'is_payment', value: team.isPayment },
    { field: 'is_vip', value: team.isVip },
    { field: 'vip_active', value: team.vipActive },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>
              Teams · {team._id}
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
            <TeamSection theme={theme}>
              <SectionTitle theme={theme}>Team</SectionTitle>
              <TeamGrid>
                <TeamItem>
                  <TeamLabel theme={theme}>Name</TeamLabel>
                  <TeamValue theme={theme}>{team.name}</TeamValue>
                </TeamItem>
                <TeamItem>
                  <TeamLabel theme={theme}>UUID</TeamLabel>
                  <TeamValue theme={theme} $monospace>{team.uuid}</TeamValue>
                </TeamItem>
                <TeamItem>
                  <TeamLabel theme={theme}>Payment Team</TeamLabel>
                  <TeamValue theme={theme}>{team.isPayment ? 'Yes' : 'No'}</TeamValue>
                </TeamItem>
                <TeamItem>
                  <TeamLabel theme={theme}>VIP</TeamLabel>
                  <TeamValue theme={theme}>{team.isVip ? 'Yes' : 'No'}</TeamValue>
                </TeamItem>
                <TeamItem>
                  <TeamLabel theme={theme}>VIP Active</TeamLabel>
                  <TeamValue theme={theme}>{team.vipActive ? 'Yes' : 'No'}</TeamValue>
                </TeamItem>
              </TeamGrid>
            </TeamSection>

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


