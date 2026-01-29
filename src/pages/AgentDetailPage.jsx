import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { Loader } from '../components/Loader';
import { HiArrowLeft, HiCheck, HiXMark } from 'react-icons/hi2';

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
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
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

const InfoCard = styled.div`
  background-color: ${({ theme }) =>
    theme.colors.surface === '#F9FAFB' ? '#F0F1F3' : theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  min-width: 150px;
  flex-shrink: 0;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
  flex: 1;
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

export const AgentDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch(`https://209.38.246.190/api/v1/settings/agent/${id}`, {
          method: 'GET',
          headers
        });
        
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const json = await res.json();
        setAgent(json);
      } catch (e) {
        setError(e.message);
        setAgent(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchAgent();
    }
  }, [id]);

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

  if (error) {
    return (
      <Layout>
        <ThemeProvider theme={theme}>
          <PageContent>
            <HeaderSection theme={theme}>
              <BackButton theme={theme} onClick={() => navigate('/agents')}>
                <HiArrowLeft size={16} />
                Назад
              </BackButton>
              <Title theme={theme}>Агент</Title>
            </HeaderSection>
            <ContentWrapper theme={theme}>
              <ErrorBlock>{error}</ErrorBlock>
            </ContentWrapper>
          </PageContent>
        </ThemeProvider>
      </Layout>
    );
  }

  if (!agent) {
    return (
      <Layout>
        <ThemeProvider theme={theme}>
          <PageContent>
            <HeaderSection theme={theme}>
              <BackButton theme={theme} onClick={() => navigate('/agents')}>
                <HiArrowLeft size={16} />
                Назад
              </BackButton>
              <Title theme={theme}>Агент</Title>
            </HeaderSection>
            <ContentWrapper theme={theme}>
              <ErrorBlock>Агент не найден</ErrorBlock>
            </ContentWrapper>
          </PageContent>
        </ThemeProvider>
      </Layout>
    );
  }

  const renderValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <BackButton theme={theme} onClick={() => navigate('/agents')}>
              <HiArrowLeft size={16} />
              Назад
            </BackButton>
            <Title theme={theme}>Агент: {agent.name || agent.id || 'Без названия'}</Title>
          </HeaderSection>

          <ContentWrapper theme={theme}>
            <InfoCard theme={theme}>
              {Object.keys(agent).map((key) => (
                <InfoItem key={key} theme={theme}>
                  <InfoLabel theme={theme}>{key}:</InfoLabel>
                  <InfoValue theme={theme}>
                    {key === 'available' ? (
                      <StatusBadge $active={agent[key] === true || agent[key] === 'true'}>
                        {agent[key] === true || agent[key] === 'true' ? <HiCheck /> : <HiXMark />}
                        {agent[key] === true || agent[key] === 'true' ? 'Available' : 'Unavailable'}
                      </StatusBadge>
                    ) : (
                      renderValue(agent[key])
                    )}
                  </InfoValue>
                </InfoItem>
              ))}
            </InfoCard>
          </ContentWrapper>
        </PageContent>
      </ThemeProvider>
    </Layout>
  );
};






