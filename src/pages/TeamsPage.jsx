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

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
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
`;

const UuidLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
`;

const NameCell = styled(TableCell)`
  text-align: left;
`;

const PaymentTeamCell = styled(TableCell)`
  font-size: 14px;
  font-weight: 600;
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


// Моковые данные teams
const mockTeams = [
  {
    id: 1,
    _id: '68aeeed876d62c0b83f7070e',
    uuid: '772f683e-9991-49f0-9c09-4ffa90d59bd1',
    name: 'Cat Tech',
    paymentTeam: false,
    createdAt: '2025-08-27 11:41:12',
  },
  {
    id: 2,
    _id: '761d7e2a-e884-41cd-8645-244f2d90e5de',
    uuid: '761d7e2a-e884-41cd-8645-244f2d90e5de',
    name: 'Loyalty Cat VIP',
    paymentTeam: true,
    createdAt: '2025-08-27 11:41:12',
  },
  {
    id: 3,
    _id: '771cfe42-cdce-45a5-9d6f-f4121e0c688c',
    uuid: '771cfe42-cdce-45a5-9d6f-f4121e0c688c',
    name: 'Go4Win KYC',
    paymentTeam: true,
    createdAt: '2025-08-27 11:41:12',
  },
  {
    id: 4,
    _id: '7af527c7-d28c-4b89-8620-a1836f6c91b6',
    uuid: '7af527c7-d28c-4b89-8620-a1836f6c91b6',
    name: 'CC Awol Gama',
    paymentTeam: true,
    createdAt: '2025-08-27 11:41:12',
  },
  {
    id: 5,
    _id: '6d346aab-e083-4040-a87c-8c479d56398a',
    uuid: '6d346aab-e083-4040-a87c-8c479d56398a',
    name: 'KYC Gama',
    paymentTeam: true,
    createdAt: '2025-08-27 11:41:12',
  },
  {
    id: 6,
    _id: '7a1ad86a-4fe7-4785-bcc0-76eb58a6f58e',
    uuid: '7a1ad86a-4fe7-4785-bcc0-76eb58a6f58e',
    name: 'RG Mers',
    paymentTeam: true,
    createdAt: '2025-08-27 11:41:12',
  },
  {
    id: 7,
    _id: '7678dfdf-a3ba-4c93-ab5e-1a3ea5fb001e',
    uuid: '7678dfdf-a3ba-4c93-ab5e-1a3ea5fb001e',
    name: 'Call Center (Kometa)',
    paymentTeam: true,
    createdAt: '2025-08-27 11:41:12',
  },
  {
    id: 8,
    _id: '8868cbbf-f44d-4677-905c-2d731c68dae9',
    uuid: '8868cbbf-f44d-4677-905c-2d731c68dae9',
    name: 'Смена данных (Pass/Email change)',
    paymentTeam: true,
    createdAt: '2025-08-27 11:41:12',
  },
  {
    id: 9,
    _id: '6fb6b1ab-4d0b-4783-9169-aca97d743ac0',
    uuid: '6fb6b1ab-4d0b-4783-9169-aca97d743ac0',
    name: 'KYC Mers',
    paymentTeam: true,
    createdAt: '2025-08-27 11:41:12',
  },
];

export const TeamsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [teams, setTeams] = useState(mockTeams);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    paymentTeam: false,
  });

  const filteredTeams = teams.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.uuid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    switch (sortField) {
      case 'uuid':
        aValue = a.uuid.toLowerCase();
        bValue = b.uuid.toLowerCase();
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'payment_team':
        aValue = a.paymentTeam ? '1' : '0';
        bValue = b.paymentTeam ? '1' : '0';
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
    console.log('Refresh teams');
  };

  const handleSyncFromHelpdesk = () => {
    console.log('Sync teams from Helpdesk');
  };

  const handleCreate = () => {
    setEditingTeamId(null);
    setNewTeam({
      name: '',
      paymentTeam: false,
    });
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingTeamId(null);
    setNewTeam({
      name: '',
      paymentTeam: false,
    });
  };

  const handleSaveTeam = () => {
    if (editingTeamId) {
      // Update existing team
      setTeams((prevTeams) =>
        prevTeams.map((item) =>
          item.id === editingTeamId
            ? {
                ...item,
                name: newTeam.name,
                paymentTeam: newTeam.paymentTeam,
              }
            : item
        )
      );
      console.log('Update team:', editingTeamId, newTeam);
    } else {
      // Create new team
      const newId = Math.max(...teams.map((t) => t.id), 0) + 1;
      const uuid = `${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
      const createdTeam = {
        id: newId,
        _id: uuid,
        uuid: uuid,
        name: newTeam.name,
        paymentTeam: newTeam.paymentTeam,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      setTeams((prevTeams) => [...prevTeams, createdTeam]);
      console.log('Create new team', createdTeam);
    }
    handleCloseCreate();
  };

  const handleView = (teamId, e) => {
    e?.stopPropagation();
    const item = teams.find((t) => t.id === teamId);
    if (item && item._id) {
      navigate(`/models/teams/${item._id}`);
    } else {
      navigate(`/models/teams/${teamId}`);
    }
  };

  const handleEdit = (teamId, e) => {
    e.stopPropagation();
    const item = teams.find((t) => t.id === teamId);
    if (item) {
      setEditingTeamId(teamId);
      setNewTeam({
        name: item.name,
        paymentTeam: item.paymentTeam,
      });
      setIsCreateOpen(true);
    }
  };

  const handleDelete = (teamId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this team?')) {
      setTeams((prevTeams) => prevTeams.filter((item) => item.id !== teamId));
      console.log('Delete team', teamId);
    }
  };

  const handleCopyUuid = (uuid) => {
    navigator.clipboard.writeText(uuid);
  };

  const ITEMS_PER_PAGE = 10;
  const totalTeams = sortedTeams.length;
  const totalPages = Math.ceil(totalTeams / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTeams = sortedTeams.slice(startIndex, endIndex);

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
            <Title theme={theme}>Teams</Title>
            <ButtonsGroup>
              <Button theme={theme} onClick={handleRefresh}>
                Refresh
              </Button>
              <Button theme={theme} onClick={handleSyncFromHelpdesk}>
                Sync from Helpdesk
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
              <option value="uuid">UUID</option>
              <option value="name">Name</option>
              <option value="payment_team">Payment Team</option>
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
                        onClick={() => handleSort('name')}
                        $sorted={sortField === 'name'}
                      >
                        Name
                        <SortIcon>{getSortIcon('name')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('payment_team')}
                        $sorted={sortField === 'payment_team'}
                      >
                        Payment Team
                        <SortIcon>{getSortIcon('payment_team')}</SortIcon>
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
                    {paginatedTeams.map((item) => (
                      <TableRow key={item.id} theme={theme}>
                        <UuidCell theme={theme}>
                          <UuidLink onClick={() => handleCopyUuid(item.uuid)}>
                            {item.uuid}
                          </UuidLink>
                        </UuidCell>
                        <NameCell theme={theme}>{item.name}</NameCell>
                        <PaymentTeamCell theme={theme}>
                          {item.paymentTeam ? 'X' : ''}
                        </PaymentTeamCell>
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
                  <SettingLabel theme={theme}>Name</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      placeholder="Enter team name"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Payment Team</SettingLabel>
                  <SettingContent>
                    <CheckboxInput
                      type="checkbox"
                      checked={newTeam.paymentTeam}
                      onChange={(e) => setNewTeam({ ...newTeam, paymentTeam: e.target.checked })}
                    />
                  </SettingContent>
                </SettingSection>

                <SaveButton theme={theme} onClick={handleSaveTeam}>
                  {editingTeamId ? 'Save Changes' : 'Create Team'}
                </SaveButton>
              </RightContent>
            </RightPanel>
          </PageContainer>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalTeams}
            onPageChange={setCurrentPage}
            itemsPerPage={10}
          />
        </div>
      </ThemeProvider>
    </Layout>
  );
};

