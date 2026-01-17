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

const MessageTemplateSection = styled.div`
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

const TemplateItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TemplateLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TemplateValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
  font-family: ${({ $monospace }) => ($monospace ? 'monospace' : 'inherit')};
  font-size: ${({ $monospace }) => ($monospace ? '12px' : '14px')};
`;

const PlaceholdersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const PlaceholderTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-family: monospace;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const ConsistencyBanner = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background-color: rgba(16, 163, 127, 0.1);
  border: 1px solid rgba(16, 163, 127, 0.3);
  color: #10A37F;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
`;

const TemplateTextArea = styled.div`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-family: inherit;
  white-space: pre-wrap;
  word-wrap: break-word;
  width: 100%;
  box-sizing: border-box;
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
];

// Функция для извлечения плейсхолдеров из текста шаблона
const extractPlaceholders = (template) => {
  const regex = /\{([^}]+)\}/g;
  const matches = [];
  let match;
  while ((match = regex.exec(template)) !== null) {
    matches.push(match[1]);
  }
  return [...new Set(matches)]; // Убираем дубликаты
};

// Функция для проверки консистентности плейсхолдеров
const checkPlaceholdersConsistency = (template, placeholders) => {
  const extracted = extractPlaceholders(template);
  const provided = placeholders || [];
  
  if (extracted.length !== provided.length) return false;
  
  const extractedSorted = [...extracted].sort();
  const providedSorted = [...provided].sort();
  
  return extractedSorted.every((val, idx) => val === providedSorted[idx]);
};

export const MessageTemplateDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    // Находим template по ID
    const foundTemplate = mockMessageTemplates.find((t) => t.id === Number(id) || t._id === id);
    setTemplate(foundTemplate || null);
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh message template', id);
  };

  const handleEdit = () => {
    navigate(`/models/message-templates/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message template?')) {
      console.log('Delete message template', id);
      navigate('/models/message-templates');
    }
  };

  const handleBack = () => {
    navigate('/models/message-templates');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleCopyPlaceholder = (placeholder) => {
    navigator.clipboard.writeText(`{${placeholder}}`);
  };

  if (!template) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>Message template not found</div>
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
    return String(value);
  };

  const isConsistent = checkPlaceholdersConsistency(template.template, template.placeholders);
  const extractedPlaceholders = extractPlaceholders(template.template);

  const fields = [
    { field: '_id', value: template._id },
    { field: 'created_at', value: template.createdAt },
    { field: 'updated_at', value: template.updatedAt },
    { field: 'type', value: template.type },
    { field: 'template', value: template.template },
    { field: 'placeholders', value: template.placeholders },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>
              Message Templates · {template._id}
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
            <MessageTemplateSection theme={theme}>
              <SectionTitle theme={theme}>Message Template</SectionTitle>
              
              <TemplateItem>
                <TemplateLabel theme={theme}>Type</TemplateLabel>
                <TemplateValue theme={theme} $monospace>
                  {template.type}
                </TemplateValue>
              </TemplateItem>

              <TemplateItem>
                <TemplateLabel theme={theme}>Placeholders</TemplateLabel>
                <PlaceholdersList>
                  {extractedPlaceholders.map((placeholder, index) => (
                    <PlaceholderTag
                      key={index}
                      theme={theme}
                      onClick={() => handleCopyPlaceholder(placeholder)}
                      title="Click to copy"
                    >
                      {`{${placeholder}}`}
                    </PlaceholderTag>
                  ))}
                </PlaceholdersList>
              </TemplateItem>

              {isConsistent && (
                <ConsistencyBanner>
                  Template and placeholders are consistent.
                </ConsistencyBanner>
              )}

              <TemplateItem>
                <TemplateLabel theme={theme}>Template</TemplateLabel>
                <TemplateTextArea theme={theme}>
                  {template.template}
                </TemplateTextArea>
              </TemplateItem>
            </MessageTemplateSection>

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
                      ) : item.field === 'placeholders' && Array.isArray(item.value) ? (
                        <JsonValue theme={theme}>{formatValue(item.value)}</JsonValue>
                      ) : item.field === 'template' ? (
                        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                          {formatValue(item.value)}
                        </div>
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

