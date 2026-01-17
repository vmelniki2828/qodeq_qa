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
`;

const ProjectNameCell = styled(TableCell)`
  text-align: left;
`;

const ProjectNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProjectName = styled.span`
  font-size: 12px;
`;

const AdminLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  text-decoration: underline;
  font-size: 11px;
`;

const GatewayNameCell = styled(TableCell)`
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


// Моковые данные ticket data
const mockTicketData = [
  {
    id: 1,
    _id: '69326c8b618c7daa628727cf',
    ticketId: '0cb7284b-f3d4-42f9-b249-c7b6db98a698',
    projectName: 'kent',
    gatewayName: 'Hgate SBP medium cascading',
    createdAt: '2025-12-05 05:24:27',
  },
  {
    id: 2,
    _id: '69326c8b618c7daa628727ce',
    ticketId: '0cb7284b-f3d4-42f9-b249-c7b6db98a698',
    projectName: 'kent',
    gatewayName: 'Hgate SBP medium cascading',
    createdAt: '2025-12-05 05:24:20',
  },
  {
    id: 3,
    _id: '69326c8b618c7daa628727cd',
    ticketId: '58b85c62-091c-43fb-92eb-f3b2c765ab8c',
    projectName: 'gama',
    gatewayName: '',
    createdAt: '2025-12-05 05:20:57',
  },
  {
    id: 4,
    _id: '69326c8b618c7daa628727cc',
    ticketId: '0f6a2703-a808-41f2-8a9c-199783fc7f27',
    projectName: 'cat',
    gatewayName: '',
    createdAt: '2025-12-05 05:20:40',
  },
  {
    id: 5,
    _id: '69326c8b618c7daa628727cb',
    ticketId: 'f8be692a-a19f-4a0a-a19e-48ef8f5f60d7',
    projectName: 'arkada',
    gatewayName: 'Hgate SBP medium cascading',
    createdAt: '2025-12-05 05:20:24',
  },
  {
    id: 6,
    _id: '69326c8b618c7daa628727ca',
    ticketId: 'b1aa4073-1c81-4f98-b0f0-a2ec1ebe0fba',
    projectName: 'kent',
    gatewayName: 'Hgate Inwizo Tpay Trusted Max Pay-in',
    createdAt: '2025-12-05 05:17:24',
  },
  {
    id: 7,
    _id: '69326c8b618c7daa628727c9',
    ticketId: '4c0c3aad-faf9-4bb5-a85f-a31cecff5f91',
    projectName: 'r7',
    gatewayName: 'Hgate Mobile Cascade STD',
    createdAt: '2025-12-05 05:09:26',
  },
  {
    id: 8,
    _id: '69326c8b618c7daa628727c8',
    ticketId: '0005dde0-bd8b-4eae-9d34-c92d364fe102',
    projectName: 'daddy',
    gatewayName: 'Hgate SBP cascading low dep Trusted',
    createdAt: '2025-12-05 05:09:18',
  },
  {
    id: 9,
    _id: '69326c8b618c7daa628727c7',
    ticketId: '0005dde0-bd8b-4eae-9d34-c92d364fe102',
    projectName: 'daddy',
    gatewayName: 'Hgate SBP cascading low dep Trusted',
    createdAt: '2025-12-05 05:09:09',
  },
];

export const TicketDataPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(mockTicketData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTicketDataId, setEditingTicketDataId] = useState(null);
  const [newTicketData, setNewTicketData] = useState({
    ticketId: '',
    projectName: '',
    gatewayName: '',
  });

  const filteredTicketData = ticketData.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gatewayName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedTicketData = [...filteredTicketData].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    switch (sortField) {
      case 'ticket_id':
        aValue = a.ticketId.toLowerCase();
        bValue = b.ticketId.toLowerCase();
        break;
      case 'project_name':
        aValue = a.projectName.toLowerCase();
        bValue = b.projectName.toLowerCase();
        break;
      case 'gateway_name':
        aValue = a.gatewayName.toLowerCase();
        bValue = b.gatewayName.toLowerCase();
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
    console.log('Refresh ticket data');
  };

  const handleCreate = () => {
    setEditingTicketDataId(null);
    setNewTicketData({
      ticketId: '',
      projectName: '',
      gatewayName: '',
    });
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingTicketDataId(null);
    setNewTicketData({
      ticketId: '',
      projectName: '',
      gatewayName: '',
    });
  };

  const handleSaveTicketData = () => {
    if (editingTicketDataId) {
      // Update existing ticket data
      setTicketData((prevTicketData) =>
        prevTicketData.map((item) =>
          item.id === editingTicketDataId
            ? {
                ...item,
                ticketId: newTicketData.ticketId,
                projectName: newTicketData.projectName,
                gatewayName: newTicketData.gatewayName,
              }
            : item
        )
      );
      console.log('Update ticket data:', editingTicketDataId, newTicketData);
    } else {
      // Create new ticket data
      const newId = Math.max(...ticketData.map((t) => t.id), 0) + 1;
      const createdTicketData = {
        id: newId,
        ticketId: newTicketData.ticketId,
        projectName: newTicketData.projectName,
        gatewayName: newTicketData.gatewayName,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      setTicketData((prevTicketData) => [...prevTicketData, createdTicketData]);
      console.log('Create new ticket data', createdTicketData);
    }
    handleCloseCreate();
  };

  const handleView = (ticketDataId, e) => {
    e?.stopPropagation();
    const item = ticketData.find((t) => t.id === ticketDataId);
    if (item && item._id) {
      navigate(`/models/ticket-data/${item._id}`);
    } else {
      navigate(`/models/ticket-data/${ticketDataId}`);
    }
  };

  const handleEdit = (ticketDataId, e) => {
    e.stopPropagation();
    const item = ticketData.find((t) => t.id === ticketDataId);
    if (item) {
      setEditingTicketDataId(ticketDataId);
      setNewTicketData({
        ticketId: item.ticketId,
        projectName: item.projectName,
        gatewayName: item.gatewayName,
      });
      setIsCreateOpen(true);
    }
  };

  const handleDelete = (ticketDataId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this ticket data?')) {
      setTicketData((prevTicketData) => prevTicketData.filter((item) => item.id !== ticketDataId));
      console.log('Delete ticket data', ticketDataId);
    }
  };

  const handleCopyTicketId = (ticketId) => {
    navigator.clipboard.writeText(ticketId);
  };

  const ITEMS_PER_PAGE = 10;
  const totalTicketData = sortedTicketData.length;
  const totalPages = Math.ceil(totalTicketData / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTicketData = sortedTicketData.slice(startIndex, endIndex);

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
            <Title theme={theme}>Ticket Data</Title>
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
              <option value="project_name">Project Name</option>
              <option value="gateway_name">Gateway Name</option>
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
                        onClick={() => handleSort('project_name')}
                        $sorted={sortField === 'project_name'}
                      >
                        Project Name
                        <SortIcon>{getSortIcon('project_name')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('gateway_name')}
                        $sorted={sortField === 'gateway_name'}
                      >
                        Gateway Name
                        <SortIcon>{getSortIcon('gateway_name')}</SortIcon>
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
                    {paginatedTicketData.map((item) => (
                      <TableRow key={item.id} theme={theme}>
                        <TicketIdCell theme={theme}>
                          <TicketIdLink onClick={() => handleCopyTicketId(item.ticketId)}>
                            {item.ticketId}
                          </TicketIdLink>
                        </TicketIdCell>
                        <ProjectNameCell theme={theme}>
                          <ProjectNameContainer>
                            <ProjectName>{item.projectName}</ProjectName>
                            <AdminLink onClick={() => navigate(`/models/projects/${item.projectName}`)}>
                              Admin
                            </AdminLink>
                          </ProjectNameContainer>
                        </ProjectNameCell>
                        <GatewayNameCell theme={theme}>{item.gatewayName || ''}</GatewayNameCell>
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
                      value={newTicketData.ticketId}
                      onChange={(e) => setNewTicketData({ ...newTicketData, ticketId: e.target.value })}
                      placeholder="Enter ticket ID"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Project Name</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newTicketData.projectName}
                      onChange={(e) => setNewTicketData({ ...newTicketData, projectName: e.target.value })}
                      placeholder="Enter project name"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Gateway Name</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newTicketData.gatewayName}
                      onChange={(e) => setNewTicketData({ ...newTicketData, gatewayName: e.target.value })}
                      placeholder="Enter gateway name (optional)"
                    />
                  </SettingContent>
                </SettingSection>

                <SaveButton theme={theme} onClick={handleSaveTicketData}>
                  {editingTicketDataId ? 'Save Changes' : 'Create Ticket Data'}
                </SaveButton>
              </RightContent>
            </RightPanel>
          </PageContainer>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalTicketData}
            onPageChange={setCurrentPage}
            itemsPerPage={10}
          />
        </div>
      </ThemeProvider>
    </Layout>
  );
};

