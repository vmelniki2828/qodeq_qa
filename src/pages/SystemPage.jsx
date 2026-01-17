import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { HiArrowPath, HiCube, HiChartBar, HiClock } from 'react-icons/hi2';
import { Loader } from '../components/Loader';

// Функция для получения токена из куки
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const PageContent = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const OverviewSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 20px;
`;

const OverviewHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const OverviewTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const OverviewSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;

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

const StatsCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StatCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatCardIcon = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 20px;
  display: flex;
  align-items: center;
`;

const StatCardLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const StatCardValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatCardSubtext = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const SectionTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const SectionSubtitle = styled.p`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ContainerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ContainerCard = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ContainerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
`;

const ContainerName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const ContainerId = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  font-family: monospace;
  word-break: break-all;
  text-align: right;
  flex-shrink: 1;
`;

const ContainerStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  width: 100%;
`;

const ContainerStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  &:first-child {
    align-items: flex-start;
  }
  
  &:nth-child(2) {
    align-items: center;
  }
  
  &:last-child {
    align-items: flex-end;
  }
`;

const ContainerStatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: inherit;
`;

const ContainerStatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-align: inherit;
`;

const ShowLogButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accent || '#3B82F6'};
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const LastRestartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-wrap: wrap;
  width: 100%;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #10b981;
  color: #ffffff;
`;

const LastRestartInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const MatchedPatterns = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
`;

const MatchedPatternsLabel = styled.div`
  font-style: italic;
`;

const MatchedPatternsValue = styled.div`
  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    font-style: normal;
  }
`;

const LogExcerpt = styled.div`
  margin-top: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-family: monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  white-space: pre-wrap;
  word-break: break-all;
  height: 200px;
  overflow-y: auto;
`;

const RefreshIcon = styled(HiArrowPath)`
  animation: ${({ isRefreshing }) => (isRefreshing ? 'spin 1s linear infinite' : 'none')};

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const SystemPage = () => {
  const { theme } = useTheme();
  const [systemData, setSystemData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [expandedLogs, setExpandedLogs] = useState({});

  const fetchSystemData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const token = getCookie('rb_admin_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://repayment.cat-tools.com/api/v1/admin/system/docker-supervisor/stats', {
        method: 'GET',
        headers,
      });

      // Если статус 401 или 404, просто показываем пустые данные
      if (response.status === 401 || response.status === 404) {
        setSystemData(null);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSystemData(data);
    } catch (err) {
      console.error('Ошибка при загрузке данных системы:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  const handleRefresh = () => {
    fetchSystemData();
  };

  const toggleLogExcerpt = (containerId) => {
    setExpandedLogs(prev => ({
      ...prev,
      [containerId]: !prev[containerId]
    }));
  };

  return (
    <Layout>
      <PageContent>
        <OverviewSection theme={theme}>
          <OverviewHeader>
            <OverviewTitle theme={theme}>System Management</OverviewTitle>
            <OverviewSubtitle theme={theme}>
              Monitor automated restarts triggered by the docker supervisor worker.
            </OverviewSubtitle>
          </OverviewHeader>
          <RefreshButton theme={theme} onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshIcon isRefreshing={isRefreshing} />
            Refresh
          </RefreshButton>
        </OverviewSection>

        <ContentWrapper>
          {isLoading && !systemData ? (
            <Loader />
          ) : error ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
              Ошибка при загрузке данных: {error}
            </div>
          ) : (
            <>
              <StatsCardsContainer>
                <StatCard theme={theme}>
                  <StatCardHeader>
                    <StatCardIcon>
                      <HiCube />
                    </StatCardIcon>
                    <StatCardLabel theme={theme}>Monitored Containers</StatCardLabel>
                  </StatCardHeader>
                  <StatCardValue theme={theme}>
                    {systemData?.summary?.container_count ?? systemData?.containers?.length ?? '-'}
                  </StatCardValue>
                  <StatCardSubtext theme={theme}>
                    distinct containers with recorded restarts
                  </StatCardSubtext>
                </StatCard>

                <StatCard theme={theme}>
                  <StatCardHeader>
                    <StatCardIcon>
                      <HiArrowPath />
                    </StatCardIcon>
                    <StatCardLabel theme={theme}>Restarts (Total)</StatCardLabel>
                  </StatCardHeader>
                  <StatCardValue theme={theme}>
                    {systemData?.summary?.total_restarts ?? '-'}
                  </StatCardValue>
                  <StatCardSubtext theme={theme}>
                    all-time restart count captured by the supervisor
                  </StatCardSubtext>
                </StatCard>

                <StatCard theme={theme}>
                  <StatCardHeader>
                    <StatCardIcon>
                      <HiChartBar />
                    </StatCardIcon>
                    <StatCardLabel theme={theme}>Restarts (Today)</StatCardLabel>
                  </StatCardHeader>
                  <StatCardValue theme={theme}>
                    {systemData?.summary?.total_restarts_today ?? '-'}
                  </StatCardValue>
                  <StatCardSubtext theme={theme}>
                    restarts since 00:00 (UTC)
                  </StatCardSubtext>
                </StatCard>

                <StatCard theme={theme}>
                  <StatCardHeader>
                    <StatCardIcon>
                      <HiClock />
                    </StatCardIcon>
                    <StatCardLabel theme={theme}>Last Restart</StatCardLabel>
                  </StatCardHeader>
                  <StatCardValue theme={theme}>
                    {systemData?.summary?.last_event?.at 
                      ? new Date(systemData.summary.last_event.at).toLocaleString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })
                      : '-'}
                  </StatCardValue>
                  <StatCardSubtext theme={theme}>
                    {systemData?.summary?.last_event?.container_name ?? ''}
                  </StatCardSubtext>
                </StatCard>
              </StatsCardsContainer>

              {systemData?.containers && systemData.containers.length > 0 && (
                <>
                  <SectionTitle theme={theme}>Container Details</SectionTitle>
                  <SectionSubtitle theme={theme}>
                    Per-container restart history derived from supervisor events.
                  </SectionSubtitle>

                  <ContainerList>
                    {systemData.containers.map((container, index) => (
                      <ContainerCard key={container.container_id || index} theme={theme}>
                        <ContainerHeader>
                          <ContainerName theme={theme}>{container.container_name}</ContainerName>
                          <ContainerId theme={theme}>Container ID: {container.container_id}</ContainerId>
                        </ContainerHeader>
                        
                        <ContainerStats>
                          <ContainerStat>
                            <ContainerStatLabel theme={theme}>Restarts (total)</ContainerStatLabel>
                            <ContainerStatValue theme={theme}>{container.total_restarts ?? '-'}</ContainerStatValue>
                          </ContainerStat>
                          <ContainerStat>
                            <ContainerStatLabel theme={theme}>Restarts (today)</ContainerStatLabel>
                            <ContainerStatValue theme={theme}>{container.restarts_today ?? '-'}</ContainerStatValue>
                          </ContainerStat>
                          {container.matched_patterns && container.matched_patterns.length > 0 && (
                            <MatchedPatterns theme={theme}>
                              <MatchedPatternsLabel theme={theme}>Matched patterns:</MatchedPatternsLabel>
                              <MatchedPatternsValue theme={theme}>
                                {container.matched_patterns.map((pattern, idx) => (
                                  <span key={idx}>
                                    <strong>{pattern}</strong>
                                    {idx < container.matched_patterns.length - 1 && ', '}
                                  </span>
                                ))}
                              </MatchedPatternsValue>
                            </MatchedPatterns>
                          )}
                        </ContainerStats>

                        <ShowLogButton 
                          theme={theme} 
                          onClick={() => toggleLogExcerpt(container.container_id)}
                        >
                          {expandedLogs[container.container_id] ? '▼' : '►'} Show log excerpt
                        </ShowLogButton>

                        {expandedLogs[container.container_id] && container.last_log_excerpt && (
                          <LogExcerpt theme={theme}>
                            {container.last_log_excerpt}
                          </LogExcerpt>
                        )}

                        <LastRestartContainer>
                          {container.last_restart_success && (
                            <StatusBadge>Last restart succeeded</StatusBadge>
                          )}
                          <LastRestartInfo theme={theme}>
                            Last restart: {container.last_restart_at 
                              ? new Date(container.last_restart_at).toLocaleString('ru-RU', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })
                              : '-'}
                          </LastRestartInfo>
                        </LastRestartContainer>
                      </ContainerCard>
                    ))}
                  </ContainerList>
                </>
              )}
            </>
          )}
        </ContentWrapper>
      </PageContent>
    </Layout>
  );
};
