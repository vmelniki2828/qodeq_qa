import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { HiCheck, HiXMark, HiEye } from 'react-icons/hi2';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

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
`;

const TableContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-x: auto;
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

const ActionsCell = styled(TableCell)`
  width: 44px;
  min-width: 44px;
  padding: 8px;
  display: flex;
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
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  ${({ $active }) => $active 
    ? 'background: rgba(34, 197, 94, 0.15); color: #16a34a;'
    : 'background: rgba(239, 68, 68, 0.15); color: #dc2626;'
  }
`;

const ErrorBlock = styled.div`
  padding: 20px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  color: #dc2626;
  font-size: 14px;
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
`;

export const IntegrationsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIntegrations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch('http://68.183.71.165:18100/api/v1/settings/integrations/', {
          method: 'GET',
          headers
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setIntegrations(Array.isArray(json) ? json : []);
      } catch (e) {
        setError(e.message);
        setIntegrations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIntegrations();
  }, []);

  const handleRefresh = () => {
    const fetchIntegrations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch('http://68.183.71.165:18100/api/v1/settings/integrations/', {
          method: 'GET',
          headers
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setIntegrations(Array.isArray(json) ? json : []);
      } catch (e) {
        setError(e.message);
        setIntegrations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIntegrations();
  };

  if (loading) {
    return (
      <Layout>
        <ThemeProvider theme={theme}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loader />
          </div>
        </ThemeProvider>
      </Layout>
    );
  }

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>Integrations</Title>
            <ButtonsGroup>
              <Button theme={theme} onClick={handleRefresh}>
                Refresh
              </Button>
            </ButtonsGroup>
          </HeaderSection>

          <TableContainer>
            {error && <ErrorBlock>{error}</ErrorBlock>}
            {!error && (
              <>
                {integrations.length > 0 ? (
                  <Table theme={theme}>
                    <TableHeader theme={theme}>
                      <TableHeaderRow>
                        <TableHeaderCell theme={theme}>ID</TableHeaderCell>
                        <TableHeaderCell theme={theme}>Name</TableHeaderCell>
                        <TableHeaderCell theme={theme}>Type</TableHeaderCell>
                        <TableHeaderCell theme={theme}>Available</TableHeaderCell>
                        <TableHeaderCell theme={theme}>Username</TableHeaderCell>
                        <TableHeaderCell theme={theme}>URL</TableHeaderCell>
                        <TableHeaderCell theme={theme}>Secret Key</TableHeaderCell>
                        <TableHeaderCell theme={theme} $width="44px">Actions</TableHeaderCell>
                      </TableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {integrations.map((integration) => (
                        <TableRow key={integration.id} theme={theme}>
                          <TableCell theme={theme}>{integration.id}</TableCell>
                          <TableCell theme={theme}>{integration.name || '-'}</TableCell>
                          <TableCell theme={theme}>{integration.type || '-'}</TableCell>
                          <TableCell theme={theme}>
                            <StatusBadge $active={integration.available}>
                              {integration.available ? <HiCheck /> : <HiXMark />}
                              {integration.available ? 'Available' : 'Unavailable'}
                            </StatusBadge>
                          </TableCell>
                          <TableCell theme={theme}>{integration.username || '-'}</TableCell>
                          <TableCell theme={theme}>{integration.url || '-'}</TableCell>
                          <TableCell theme={theme}>{integration.secret_key || '-'}</TableCell>
                          <ActionsCell theme={theme}>
                            <ActionButton
                              theme={theme}
                              onClick={() => navigate(`/integrations/${integration.id}`)}
                              title="Просмотр"
                            >
                              <HiEye size={16} />
                            </ActionButton>
                          </ActionsCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState theme={theme}>Нет интеграций</EmptyState>
                )}
              </>
            )}
          </TableContainer>
        </PageContent>
      </ThemeProvider>
    </Layout>
  );
};

