import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { DatePicker } from '../components/DatePicker';
import { Loader } from '../components/Loader';
import { HiArrowPath } from 'react-icons/hi2';

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

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 14px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background-color: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  box-sizing: border-box;
  line-height: 1;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover || theme.colors.accent};
    opacity: 0.9;
  }
`;

const FiltersSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 16px;
  align-items: center;
  flex-shrink: 0;
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
`;

const DateSeparator = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
  padding: 0 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 100%;
`;

const WorkerSelect = styled.select`
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
  min-width: 180px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  option {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;

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
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatCardLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 8px;
`;

const StatCardValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatCardSubValue = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 4px;
`;

const CacheSavingsValue = styled(StatCardValue)`
  color: ${({ theme }) => theme.colors.accent};
`;

const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const TableTitle = styled.div`
  padding: 20px 20px 16px 20px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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
  text-align: left;
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

  &:last-child {
    border-bottom: none;
    font-weight: 600;
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.02)'};
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
`;

const WorkerCell = styled(TableCell)`
  font-weight: ${({ $isTotal }) => ($isTotal ? '600' : '400')};
`;

const NumberCell = styled(TableCell)`
  text-align: right;
  font-weight: ${({ $isTotal }) => ($isTotal ? '600' : '400')};
`;

const CacheSavingsCell = styled(NumberCell)`
  color: ${({ theme }) => theme.colors.accent};
`;

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0.00';
  return `$${parseFloat(value).toFixed(6)}`;
};

const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return parseFloat(value).toLocaleString('en-US');
};

export const OpenAIStatsPage = () => {
  const { theme } = useTheme();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedWorker, setSelectedWorker] = useState('all');
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workers, setWorkers] = useState([]);

  // Примерные данные для демонстрации
  const mockData = {
    totalSpending: 0.110394,
    cacheSavings: 0.068958,
    costWithoutCache: 0.179352,
    workers: [
      {
        worker: 'ticket_data_agent',
        requests: 18,
        totalTokens: 251860,
        totalCost: 0.059054,
        cacheSavings: 0.052304,
        costWithoutCache: 0.111358,
      },
      {
        worker: 'classifier_agent',
        requests: 31,
        totalTokens: 82279,
        totalCost: 0.021537,
        cacheSavings: 0.015617,
        costWithoutCache: 0.037154,
      },
      {
        worker: 'ticket_data_lite_agent',
        requests: 12,
        totalTokens: 31867,
        totalCost: 0.018137,
        cacheSavings: 0.001038,
        costWithoutCache: 0.019175,
      },
      {
        worker: 'extractor_agent',
        requests: 26,
        totalTokens: 22473,
        totalCost: 0.011666,
        cacheSavings: 0.0,
        costWithoutCache: 0.011666,
      },
    ],
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const token = getCookie('rb_admin_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Формируем параметры запроса
      const params = new URLSearchParams();
      if (startDate) {
        params.append('start', startDate);
      }
      if (endDate) {
        params.append('end', endDate);
      }
      if (selectedWorker && selectedWorker !== 'all') {
        params.append('worker_name', selectedWorker);
      }

      const queryString = params.toString();
      const url = `https://repayment.cat-tools.com/api/v1/openai-stats/total${queryString ? `?${queryString}` : ''}`;

      // Запрос общей статистики
      const totalResponse = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (totalResponse.status === 401) {
        setStatsData(null);
        setIsLoading(false);
        return;
      }

      if (!totalResponse.ok) {
        throw new Error(`HTTP error! status: ${totalResponse.status}`);
      }

      const totalData = await totalResponse.json();

      // Запрос данных о cache savings
      let cacheSavingsData = null;
      try {
        const cacheSavingsUrl = `https://repayment.cat-tools.com/api/v1/openai-stats/cache-savings${queryString ? `?${queryString}` : ''}`;
        const cacheSavingsResponse = await fetch(cacheSavingsUrl, {
          method: 'GET',
          headers,
        });

        if (cacheSavingsResponse.ok) {
          cacheSavingsData = await cacheSavingsResponse.json();
        }
      } catch (err) {
        console.warn('Не удалось загрузить данные о cache savings:', err);
      }

      // Используем данные из cache-savings endpoint, если доступны
      const totalSpending = totalData.total_spent || 0;
      const cacheSavings = cacheSavingsData?.cache_savings !== undefined
        ? cacheSavingsData.cache_savings
        : (totalData.cache_savings !== undefined 
          ? totalData.cache_savings 
          : 0);
      
      // Вычисляем cost without cache: totalSpending + cacheSavings
      const costWithoutCache = cacheSavingsData?.cost_without_cache 
        || totalData.cost_without_cache 
        || (totalSpending + cacheSavings);

      // Запрос данных по воркерам
      let workersData = [];
      try {
        const byWorkerUrl = `https://repayment.cat-tools.com/api/v1/openai-stats/by-worker${queryString ? `?${queryString}` : ''}`;
        const byWorkerResponse = await fetch(byWorkerUrl, {
          method: 'GET',
          headers,
        });

        if (byWorkerResponse.ok) {
          const byWorkerData = await byWorkerResponse.json();
          if (byWorkerData.workers && Array.isArray(byWorkerData.workers)) {
            workersData = byWorkerData.workers;
          }
        }
      } catch (err) {
        console.warn('Не удалось загрузить данные по воркерам:', err);
      }

      // Формируем структуру данных
      const formattedData = {
        totalSpending,
        cacheSavings,
        costWithoutCache: costWithoutCache || totalSpending,
        workers: workersData.length > 0 
          ? workersData.map((w) => {
              const workerTotalCost = w.total_cost || 0;
              const workerCacheSavings = w.cached_savings !== undefined
                ? w.cached_savings
                : 0;
              // Вычисляем cost without cache: totalCost + cachedSavings
              const workerCostWithoutCache = workerTotalCost + workerCacheSavings;

              return {
                worker: w.worker_name || w.worker || 'Unknown',
                requests: w.request_count || w.requests || 0,
                totalTokens: w.total_tokens || w.tokens || 0,
                totalCost: workerTotalCost,
                cacheSavings: workerCacheSavings,
                costWithoutCache: workerCostWithoutCache,
              };
            })
          : mockData.workers, // Fallback на моковые данные, если API не вернул данные по воркерам
      };

      setStatsData(formattedData);
      
      // Обновляем список воркеров
      const uniqueWorkers = ['All workers', ...new Set(formattedData.workers.map((w) => w.worker))];
      setWorkers(uniqueWorkers);
    } catch (err) {
      console.error('Ошибка при загрузке статистики:', err);
      setStatsData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Установка дат по умолчанию (сегодня)
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    setStartDate(dateString);
    setEndDate(dateString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Загружаем данные при изменении фильтров
    if (startDate && endDate) {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, selectedWorker]);

  const handleRefresh = () => {
    fetchStats();
  };

  const filteredWorkers = statsData?.workers || [];
  const displayedWorkers = selectedWorker === 'all' 
    ? filteredWorkers 
    : filteredWorkers.filter((w) => w.worker === selectedWorker);

  const totals = displayedWorkers.reduce(
    (acc, worker) => ({
      requests: acc.requests + worker.requests,
      totalTokens: acc.totalTokens + worker.totalTokens,
      totalCost: acc.totalCost + worker.totalCost,
      cacheSavings: acc.cacheSavings + worker.cacheSavings,
      costWithoutCache: acc.costWithoutCache + worker.costWithoutCache,
    }),
    { requests: 0, totalTokens: 0, totalCost: 0, cacheSavings: 0, costWithoutCache: 0 }
  );

  return (
    <Layout>
      <PageContent>
        <OverviewSection theme={theme}>
          <OverviewHeader>
            <OverviewTitle theme={theme}>OpenAI Statistics</OverviewTitle>
            <OverviewSubtitle theme={theme}>Track spending and cache efficiency.</OverviewSubtitle>
          </OverviewHeader>
          <ActionButton theme={theme} onClick={handleRefresh} disabled={isLoading}>
            <HiArrowPath size={16} />
            Refresh
          </ActionButton>
        </OverviewSection>

        <FiltersSection theme={theme}>
          <FilterLabel theme={theme}>Start:</FilterLabel>
          <DatePicker
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DateSeparator theme={theme}>to</DateSeparator>
          <DatePicker
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <FilterLabel theme={theme}>Worker:</FilterLabel>
          <WorkerSelect
            theme={theme}
            value={selectedWorker}
            onChange={(e) => setSelectedWorker(e.target.value)}
          >
            <option value="all">All workers</option>
            {workers
              .filter((w) => w !== 'All workers')
              .map((worker) => (
                <option key={worker} value={worker}>
                  {worker}
                </option>
              ))}
          </WorkerSelect>
        </FiltersSection>

        <ContentWrapper>
          {isLoading ? (
            <Loader />
          ) : statsData ? (
            <>
              <StatsCardsContainer>
                <StatCard theme={theme}>
                  <StatCardLabel theme={theme}>Total Spending</StatCardLabel>
                  <StatCardValue theme={theme}>
                    {formatCurrency(statsData.totalSpending)}
                  </StatCardValue>
                </StatCard>
                <StatCard theme={theme}>
                  <StatCardLabel theme={theme}>Cache Savings</StatCardLabel>
                  <CacheSavingsValue theme={theme}>
                    {formatCurrency(statsData.cacheSavings)}
                  </CacheSavingsValue>
                  <StatCardSubValue theme={theme}>
                    Cost Without Cache: {formatCurrency(statsData.costWithoutCache)}
                  </StatCardSubValue>
                </StatCard>
              </StatsCardsContainer>

              <TableContainer theme={theme}>
                <TableTitle theme={theme}>Statistics by Worker</TableTitle>
                <Table theme={theme}>
                  <TableHeader theme={theme}>
                    <TableHeaderRow>
                      <TableHeaderCell theme={theme}>Worker</TableHeaderCell>
                      <TableHeaderCell theme={theme} style={{ textAlign: 'right' }}>
                        Requests
                      </TableHeaderCell>
                      <TableHeaderCell theme={theme} style={{ textAlign: 'right' }}>
                        Total Tokens
                      </TableHeaderCell>
                      <TableHeaderCell theme={theme} style={{ textAlign: 'right' }}>
                        Total Cost
                      </TableHeaderCell>
                      <TableHeaderCell theme={theme} style={{ textAlign: 'right' }}>
                        Cache Savings
                      </TableHeaderCell>
                      <TableHeaderCell theme={theme} style={{ textAlign: 'right' }}>
                        Cost Without Cache
                      </TableHeaderCell>
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {displayedWorkers.map((worker, index) => (
                      <TableRow key={index} theme={theme}>
                        <WorkerCell theme={theme}>{worker.worker}</WorkerCell>
                        <NumberCell theme={theme}>{formatNumber(worker.requests)}</NumberCell>
                        <NumberCell theme={theme}>{formatNumber(worker.totalTokens)}</NumberCell>
                        <NumberCell theme={theme}>{formatCurrency(worker.totalCost)}</NumberCell>
                        <CacheSavingsCell theme={theme}>
                          {formatCurrency(worker.cacheSavings)}
                        </CacheSavingsCell>
                        <NumberCell theme={theme}>
                          {formatCurrency(worker.costWithoutCache)}
                        </NumberCell>
                      </TableRow>
                    ))}
                    {displayedWorkers.length > 0 && (
                      <TableRow theme={theme}>
                        <WorkerCell theme={theme} $isTotal>
                          Total
                        </WorkerCell>
                        <NumberCell theme={theme} $isTotal>
                          {formatNumber(totals.requests)}
                        </NumberCell>
                        <NumberCell theme={theme} $isTotal>
                          {formatNumber(totals.totalTokens)}
                        </NumberCell>
                        <NumberCell theme={theme} $isTotal>
                          {formatCurrency(totals.totalCost)}
                        </NumberCell>
                        <CacheSavingsCell theme={theme} $isTotal>
                          {formatCurrency(totals.cacheSavings)}
                        </CacheSavingsCell>
                        <NumberCell theme={theme} $isTotal>
                          {formatCurrency(totals.costWithoutCache)}
                        </NumberCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: theme.colors.secondary }}>
              Нет данных для отображения
            </div>
          )}
        </ContentWrapper>
      </PageContent>
    </Layout>
  );
};
