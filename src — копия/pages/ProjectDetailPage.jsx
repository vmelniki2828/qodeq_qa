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

const ProjectSection = styled.div`
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

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
`;

const ProjectItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProjectLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProjectValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
  font-weight: 600;
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

// Моковые данные projects
const mockProjects = [
  {
    id: 1,
    _id: '68c317cec9fd0a7063555784',
    name: 'kometa',
    createdAt: '2025-09-11 18:41:18',
    updatedAt: '2025-09-11 18:41:18',
  },
  {
    id: 2,
    _id: '692ef7951a9b21f5a26a7702',
    name: 'mers',
    createdAt: '2025-09-11 18:41:14',
    updatedAt: '2025-09-11 18:41:14',
  },
  {
    id: 3,
    _id: '692ef7951a9b21f5a26a7703',
    name: 'arkada',
    createdAt: '2025-09-11 18:40:39',
    updatedAt: '2025-09-11 18:40:39',
  },
  {
    id: 4,
    _id: '692ef7951a9b21f5a26a7704',
    name: 'r7',
    createdAt: '2025-09-11 18:40:32',
    updatedAt: '2025-09-11 18:40:32',
  },
  {
    id: 5,
    _id: '692ef7951a9b21f5a26a7705',
    name: 'kent',
    createdAt: '2025-09-11 18:40:27',
    updatedAt: '2025-09-11 18:40:27',
  },
  {
    id: 6,
    _id: '692ef7951a9b21f5a26a7706',
    name: 'daddy',
    createdAt: '2025-09-11 18:40:23',
    updatedAt: '2025-09-11 18:40:23',
  },
  {
    id: 7,
    _id: '692ef7951a9b21f5a26a7707',
    name: 'gama',
    createdAt: '2025-09-11 18:40:19',
    updatedAt: '2025-09-11 18:40:19',
  },
  {
    id: 8,
    _id: '692ef7951a9b21f5a26a7708',
    name: 'cat',
    createdAt: '2025-09-11 18:40:16',
    updatedAt: '2025-09-11 18:40:16',
  },
];

export const ProjectDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Находим project по ID
    const foundProject = mockProjects.find(
      (p) => p.id === Number(id) || p._id === id
    );
    setProject(foundProject || null);
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh project', id);
  };

  const handleEdit = () => {
    navigate(`/models/projects/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      console.log('Delete project', id);
      navigate('/models/projects');
    }
  };

  const handleBack = () => {
    navigate('/models/projects');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!project) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>Project not found</div>
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
    { field: '_id', value: project._id },
    { field: 'created_at', value: project.createdAt },
    { field: 'updated_at', value: project.updatedAt },
    { field: 'name', value: project.name },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>
              Projects · {project._id}
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
            <ProjectSection theme={theme}>
              <SectionTitle theme={theme}>Project</SectionTitle>
              <ProjectGrid>
                <ProjectItem>
                  <ProjectLabel theme={theme}>Name</ProjectLabel>
                  <ProjectValue theme={theme}>{project.name}</ProjectValue>
                </ProjectItem>
              </ProjectGrid>
            </ProjectSection>

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


