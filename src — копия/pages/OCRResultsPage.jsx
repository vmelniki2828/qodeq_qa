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

const TicketIdContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TicketIdLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
`;

const AdminLink = styled.span`
  color: #3B82F6;
  cursor: pointer;
  text-decoration: underline;
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


// Моковые данные OCR results
const mockOCRResults = [
  {
    id: 1,
    _id: '69326c7771754e5e17bc39d0',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d63',
    createdAt: '2025-12-05 05:32:52',
  },
  {
    id: 2,
    _id: '69326c7771754e5e17bc39d1',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d64',
    createdAt: '2025-12-05 05:32:50',
  },
  {
    id: 3,
    _id: '69326c7771754e5e17bc39d2',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d65',
    createdAt: '2025-12-05 05:32:48',
  },
  {
    id: 4,
    _id: '69326c7771754e5e17bc39d3',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d66',
    createdAt: '2025-12-05 05:32:46',
  },
  {
    id: 5,
    _id: '69326c7771754e5e17bc39d4',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d67',
    createdAt: '2025-12-05 05:32:44',
  },
  {
    id: 6,
    _id: '69326c7771754e5e17bc39d5',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d68',
    createdAt: '2025-12-05 05:32:42',
  },
  {
    id: 7,
    _id: '69326c7771754e5e17bc39d6',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d69',
    createdAt: '2025-12-05 05:32:40',
  },
  {
    id: 8,
    _id: '69326c7771754e5e17bc39d7',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d70',
    createdAt: '2025-12-05 05:32:38',
  },
  {
    id: 9,
    _id: '69326c7771754e5e17bc39d8',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d71',
    createdAt: '2025-12-05 05:32:36',
  },
  {
    id: 10,
    _id: '69326c7771754e5e17bc39d9',
    ticketId: 'bf28d02a-1e40-403e-bfd6-3dab08d97d72',
    createdAt: '2025-12-05 05:32:34',
  },
];

export const OCRResultsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [ocrResults, setOcrResults] = useState(mockOCRResults);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOcrResultId, setEditingOcrResultId] = useState(null);
  const [newOcrResult, setNewOcrResult] = useState({
    ticketId: '',
  });

  const filteredOcrResults = ocrResults.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedOcrResults = [...filteredOcrResults].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    switch (sortField) {
      case 'ticket_id':
        aValue = a.ticketId.toLowerCase();
        bValue = b.ticketId.toLowerCase();
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
    console.log('Refresh OCR results');
  };

  const handleCreate = () => {
    setEditingOcrResultId(null);
    setNewOcrResult({
      ticketId: '',
    });
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingOcrResultId(null);
    setNewOcrResult({
      ticketId: '',
    });
  };

  const handleSaveOcrResult = () => {
    if (editingOcrResultId) {
      // Update existing OCR result
      setOcrResults((prevOcrResults) =>
        prevOcrResults.map((item) =>
          item.id === editingOcrResultId
            ? {
                ...item,
                ticketId: newOcrResult.ticketId,
              }
            : item
        )
      );
      console.log('Update OCR result:', editingOcrResultId, newOcrResult);
    } else {
      // Create new OCR result
      const newId = Math.max(...ocrResults.map((t) => t.id), 0) + 1;
      const createdOcrResult = {
        id: newId,
        _id: `69326c7771754e5e17bc39${String(newId).padStart(2, '0')}`,
        ticketId: newOcrResult.ticketId,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      setOcrResults((prevOcrResults) => [...prevOcrResults, createdOcrResult]);
      console.log('Create new OCR result', createdOcrResult);
    }
    handleCloseCreate();
  };

  const handleView = (ocrResultId, e) => {
    e?.stopPropagation();
    const item = ocrResults.find((t) => t.id === ocrResultId);
    if (item && item._id) {
      navigate(`/models/ocr-results/${item._id}`);
    } else {
      navigate(`/models/ocr-results/${ocrResultId}`);
    }
  };

  const handleEdit = (ocrResultId, e) => {
    e.stopPropagation();
    const item = ocrResults.find((t) => t.id === ocrResultId);
    if (item) {
      setEditingOcrResultId(ocrResultId);
      setNewOcrResult({
        ticketId: item.ticketId,
      });
      setIsCreateOpen(true);
    }
  };

  const handleDelete = (ocrResultId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this OCR result?')) {
      setOcrResults((prevOcrResults) => prevOcrResults.filter((item) => item.id !== ocrResultId));
      console.log('Delete OCR result', ocrResultId);
    }
  };

  const handleCopyTicketId = (ticketId) => {
    navigator.clipboard.writeText(ticketId);
  };

  const ITEMS_PER_PAGE = 10;
  const totalOcrResults = sortedOcrResults.length;
  const totalPages = Math.ceil(totalOcrResults / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOcrResults = sortedOcrResults.slice(startIndex, endIndex);

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
            <Title theme={theme}>OCR Results</Title>
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
                    {paginatedOcrResults.map((item) => (
                      <TableRow key={item.id} theme={theme}>
                        <TicketIdCell theme={theme}>
                          <TicketIdContainer>
                            <TicketIdLink onClick={() => handleCopyTicketId(item.ticketId)}>
                              {item.ticketId}
                            </TicketIdLink>
                            <AdminLink onClick={() => navigate(`/models/tickets/${item.ticketId}`)}>
                              Admin
                            </AdminLink>
                          </TicketIdContainer>
                        </TicketIdCell>
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
                      value={newOcrResult.ticketId}
                      onChange={(e) => setNewOcrResult({ ...newOcrResult, ticketId: e.target.value })}
                      placeholder="Enter ticket ID"
                    />
                  </SettingContent>
                </SettingSection>

                <SaveButton theme={theme} onClick={handleSaveOcrResult}>
                  {editingOcrResultId ? 'Save Changes' : 'Create OCR Result'}
                </SaveButton>
              </RightContent>
            </RightPanel>
          </PageContainer>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalOcrResults}
            onPageChange={setCurrentPage}
            itemsPerPage={10}
          />
        </div>
      </ThemeProvider>
    </Layout>
  );
};

