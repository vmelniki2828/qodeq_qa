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

const TextArea = styled.textarea`
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
  resize: none;
  min-height: 150px;

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

const TypeCell = styled(TableCell)`
  text-align: left;
  font-family: monospace;
  font-size: 11px;
`;

const TemplateCell = styled(TableCell)`
  text-align: left;
  max-width: 500px;
  word-wrap: break-word;
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


// Моковые данные message templates
const mockMessageTemplates = [
  {
    id: 1,
    _id: '68c7d438455d4dc634fc8dea',
    type: 'statement',
    template: 'Для решения вопроса по депозиту, который не был зачислен на баланс, пожалуйста, предоставьте «Выписку по счёту»/«Справка о движении средств» по всем транзакциям в формате PDF за {receipt_datetime}, где будет отображена транзакция на сумму {amount} RUB. Ее вы можете запросить в службе поддержки вашего банка. С уважением, команда {project_name} Casino.',
    placeholders: ['amount', 'project_name', 'receipt_datetime'],
    createdAt: '2025-09-15 08:54:16',
    updatedAt: '2025-09-15 08:54:16',
  },
  {
    id: 2,
    _id: '68c7d438455d4dc634fc8deb',
    type: 'wrong_message',
    template: 'Не удалось найти подходящее сообщение.',
    placeholders: [],
    createdAt: '2025-09-15 08:54:16',
    updatedAt: '2025-09-15 08:54:16',
  },
  {
    id: 3,
    _id: '68c7d438455d4dc634fc8dec',
    type: 'recalculated',
    template: 'Здравствуйте! Вопрос касательно вашего депозита решается на стороне платежного провайдера, однако мы зачислили ваш депозит в качестве лояльности. Пожалуйста, предоставьте видео-подтверждение. Пожалуйста, запишите видео, в котором вы показываете транзакцию по переводу средств на наши реквизиты. Убедитесь, что на видео четко видны: - ваш экран с приложением банка; - история ваших транзакций; - транзакция (операция перевода) средств на наши реквизиты; - информация о переводе {amount} RUB за {receipt_datetime). Это поможет нам быстрее рассмотреть ваш запрос. Спасибо за понимание! С уважением, команда {project_name} Casino',
    placeholders: ['amount', 'project_name', 'receipt_datetime'],
    createdAt: '2025-09-15 08:54:16',
    updatedAt: '2025-09-15 08:54:16',
  },
  {
    id: 4,
    _id: '68c7d438455d4dc634fc8ded',
    type: 'refund',
    template: 'Мы провели расследование по вашему обращению касательно депозита, который не был зачислен на баланс. По информации от платежного провайдера, средства по данному чеку нам не поступали. Увы, однако мы вынуждены отказать вам в начислении средств. С уважением, команда {project_name}Casino.',
    placeholders: ['project_name'],
    createdAt: '2025-09-15 08:54:16',
    updatedAt: '2025-09-15 08:54:16',
  },
  {
    id: 5,
    _id: '68c7d438455d4dc634fc8dee',
    type: 'mismatch_req',
    template: 'Хотим обратить ваше внимание на то, что депозит вы совершили на сторонние реквизиты, и, к сожалению, но мы не видим поступлений в сторону нашего казино. С уважением, команда {project_name} Casino.',
    placeholders: ['project_name'],
    createdAt: '2025-09-15 08:54:16',
    updatedAt: '2025-09-15 08:54:16',
  },
  {
    id: 6,
    _id: '68c7d438455d4dc634fc8def',
    type: 'no_req',
    template: 'Платежная система ответила, что по квитанции отсутствует платеж.',
    placeholders: [],
    createdAt: '2025-09-15 08:54:16',
    updatedAt: '2025-09-15 08:54:16',
  },
  {
    id: 7,
    _id: '68c7d438455d4dc634fc8df0',
    type: 'video',
    template: 'Для решения вашей ситуации нам необходимо получить видео-подтверждение. Пожалуйста, запишите видео снятое от 3-го лица, в котором вы показываете транзакцию по переводу средств на наши реквизиты. Убедитесь, что на видео четко видны: ваш экран с приложением банка; история ваших транзакций; транзакция (операция перевода) средств на наши реквизиты; информация о переводе (amount} RUB за {receipt_datetime}. Это поможет нам быстрее рассмотреть ваш запрос. Спасибо за понимание! С уважением, команда {project_name} Casino',
    placeholders: ['amount', 'project_name', 'receipt_datetime'],
    createdAt: '2025-09-15 08:54:16',
    updatedAt: '2025-09-15 08:54:16',
  },
];

export const MessageTemplatesPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [messageTemplates, setMessageTemplates] = useState(mockMessageTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    type: '',
    template: '',
  });

  const filteredTemplates = messageTemplates.filter((template) => {
    const matchesSearch =
      !searchQuery ||
      template.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.template.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    switch (sortField) {
      case 'type':
        aValue = a.type.toLowerCase();
        bValue = b.type.toLowerCase();
        break;
      case 'template':
        aValue = a.template.toLowerCase();
        bValue = b.template.toLowerCase();
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
    console.log('Refresh message templates');
  };

  const handleCreate = () => {
    setEditingTemplateId(null);
    setNewTemplate({
      type: '',
      template: '',
    });
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingTemplateId(null);
    setNewTemplate({
      type: '',
      template: '',
    });
  };

  const handleSaveTemplate = () => {
    if (editingTemplateId) {
      // Update existing template
      setMessageTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template.id === editingTemplateId
            ? {
                ...template,
                type: newTemplate.type,
                template: newTemplate.template,
              }
            : template
        )
      );
      console.log('Update template:', editingTemplateId, newTemplate);
    } else {
      // Create new template
      const newId = Math.max(...messageTemplates.map((t) => t.id), 0) + 1;
      const createdTemplate = {
        id: newId,
        type: newTemplate.type,
        template: newTemplate.template,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      setMessageTemplates((prevTemplates) => [...prevTemplates, createdTemplate]);
      console.log('Create new template', createdTemplate);
    }
    handleCloseCreate();
  };

  const handleView = (templateId, e) => {
    e?.stopPropagation();
    navigate(`/models/message-templates/${templateId}`);
  };

  const handleEdit = (templateId, e) => {
    e.stopPropagation();
    const template = messageTemplates.find((t) => t.id === templateId);
    if (template) {
      setEditingTemplateId(templateId);
      setNewTemplate({
        type: template.type,
        template: template.template,
      });
      setIsCreateOpen(true);
    }
  };

  const handleDelete = (templateId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this message template?')) {
      setMessageTemplates((prevTemplates) => prevTemplates.filter((template) => template.id !== templateId));
      console.log('Delete template', templateId);
    }
  };

  const ITEMS_PER_PAGE = 10;
  const totalTemplates = sortedTemplates.length;
  const totalPages = Math.ceil(totalTemplates / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTemplates = sortedTemplates.slice(startIndex, endIndex);

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
            <Title theme={theme}>Message Templates</Title>
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
              <option value="type">Type</option>
              <option value="template">Template</option>
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
                        onClick={() => handleSort('type')}
                        $sorted={sortField === 'type'}
                      >
                        Type
                        <SortIcon>{getSortIcon('type')}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        theme={theme}
                        onClick={() => handleSort('template')}
                        $sorted={sortField === 'template'}
                      >
                        Template
                        <SortIcon>{getSortIcon('template')}</SortIcon>
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
                    {paginatedTemplates.map((template) => (
                      <TableRow key={template.id} theme={theme}>
                        <TypeCell theme={theme}>{template.type}</TypeCell>
                        <TemplateCell theme={theme}>{template.template}</TemplateCell>
                        <CreatedAtCell theme={theme}>{template.createdAt}</CreatedAtCell>
                        <ActionsCell theme={theme}>
                          <ActionButton
                            theme={theme}
                            onClick={(e) => handleView(template.id, e)}
                            title="View"
                          >
                            <HiEye size={16} />
                          </ActionButton>
                          <ActionButton
                            theme={theme}
                            onClick={(e) => handleEdit(template.id, e)}
                            title="Edit"
                          >
                            <HiPencil size={16} />
                          </ActionButton>
                          <ActionButton
                            theme={theme}
                            $danger
                            onClick={(e) => handleDelete(template.id, e)}
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
                  <SettingLabel theme={theme}>Type</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newTemplate.type}
                      onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
                      placeholder="Enter template type"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Template</SettingLabel>
                  <SettingContent>
                    <TextArea
                      theme={theme}
                      value={newTemplate.template}
                      onChange={(e) => setNewTemplate({ ...newTemplate, template: e.target.value })}
                      placeholder="Enter template text"
                    />
                  </SettingContent>
                </SettingSection>

                <SaveButton theme={theme} onClick={handleSaveTemplate}>
                  {editingTemplateId ? 'Save Changes' : 'Create Template'}
                </SaveButton>
              </RightContent>
            </RightPanel>
          </PageContainer>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalTemplates}
            onPageChange={setCurrentPage}
            itemsPerPage={10}
          />
        </div>
      </ThemeProvider>
    </Layout>
  );
};

