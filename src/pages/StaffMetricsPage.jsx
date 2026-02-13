import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Layout } from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { Loader } from '../components/Loader';
import { DateTimePicker } from '../components/DateTimePicker';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { HiArrowLeft } from 'react-icons/hi2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const GlobalChartStyles = createGlobalStyle`
  /* Убираем обводку у всех столбцов recharts */
  .recharts-bar-rectangle,
  .recharts-bar-rectangle:hover,
  .recharts-active-bar,
  .recharts-active-bar:hover,
  .recharts-bar rect,
  .recharts-bar rect:hover,
  rect.recharts-bar-rectangle,
  rect.recharts-bar-rectangle:hover {
    stroke: transparent !important;
    stroke-width: 0 !important;
    outline: none !important;
  }

  /* Убираем обводку у всех rect элементов столбцов */
  .recharts-bar rect,
  .recharts-bar rect:hover,
  .recharts-bar rect:focus,
  .recharts-bar rect:active {
    stroke: transparent !important;
    stroke-width: 0 !important;
    outline: none !important;
  }

  /* Убираем белый фон/overlay при наведении - tooltip cursor */
  .recharts-tooltip-cursor,
  .recharts-tooltip-cursor rect,
  .recharts-tooltip-cursor-fill,
  .recharts-cursor-fill {
    fill: transparent !important;
    stroke: transparent !important;
    stroke-width: 0 !important;
    opacity: 0 !important;
    display: none !important;
  }

  /* Убираем активный бар overlay */
  .recharts-active-bar,
  .recharts-active-bar rect {
    fill: transparent !important;
    stroke: transparent !important;
    stroke-width: 0 !important;
    opacity: 0 !important;
  }

  /* Убираем все возможные overlay элементы */
  .recharts-reference-line,
  .recharts-reference-line rect {
    fill: transparent !important;
    stroke: transparent !important;
  }
`;

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

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 20px;
  flex-wrap: wrap;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 6px 10px;
  padding-right: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::-ms-expand {
    display: none;
  }

  option {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DateSeparator = styled.div`
  display: flex;
  align-items: flex-end;
  padding-bottom: 6px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0 8px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
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

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
`;

const ErrorBlock = styled.div`
  padding: 20px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  color: #dc2626;
  font-size: 14px;
`;

const formatDateForAPI = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      // Возвращаем только дату в формате YYYY-MM-DD без времени
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    // Если это уже строка в формате YYYY-MM-DD, возвращаем как есть
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    return dateString;
  } catch (e) {
    return dateString;
  }
};

const formatLabel = (key) => {
  const n = String(key)
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim();
  return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  } catch (e) {
    return dateString;
  }
};

const CheckerCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? '#E5E5E5' : 'rgba(255,255,255,0.15)'};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
`;

const CheckerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CheckerName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const CheckerTotal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const CheckerTotalLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CheckerTotalValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? '#E5E5E5' : 'rgba(255,255,255,0.15)'};
  }
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
`;

const StatCardLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const StatCardValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const COLORS = ['#3B82F6', '#10A37F', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16', '#06B6D4', '#A855F7'];

export const StaffMetricsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date_start, setDateStart] = useState('');
  const [date_end, setDateEnd] = useState('');
  const [selectedChecker, setSelectedChecker] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const params = new URLSearchParams();
        if (date_start) {
          const formattedDate = formatDateForAPI(date_start);
          if (formattedDate) {
            params.append('date_start', formattedDate);
          }
        }
        if (date_end) {
          const formattedDate = formatDateForAPI(date_end);
          if (formattedDate) {
            params.append('date_end', formattedDate);
          }
        }
        
        const url = `https://qa.qodeq.net/api/v1/chat/statisticsmetrics/checks${params.toString() ? '?' + params.toString() : ''}`;
        const res = await fetch(url, { 
          method: 'GET', 
          headers 
        });
        
        if (!res.ok) {
          if (res.status === 404) {
            setData(null);
            setLoading(false);
            return;
          }
          throw new Error(`Ошибка ${res.status}`);
        }
        
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error('Ошибка при загрузке метрик:', e);
        setError(e.message);
        setData(null);
        if (e.message !== 'Ошибка 404') {
          Notify.failure('Ошибка при загрузке метрик');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, [date_start, date_end]);

  return (
    <Layout>
      <GlobalChartStyles />
      <PageContent>
        <HeaderSection theme={theme}>
          <TitleContainer>
            <BackButton theme={theme} onClick={() => navigate('/metrics')}>
              <HiArrowLeft size={16} />
              Back
            </BackButton>
            <Title theme={theme}>Staff Metrics</Title>
          </TitleContainer>
          <FiltersContainer theme={theme}>
            <FilterGroup>
              <DateTimePicker
                value={date_start}
                onChange={(e) => {
                  const value = e?.target?.value || e;
                  setDateStart(value);
                }}
                placeholder="Выберите дату начала"
              />
            </FilterGroup>
            <DateSeparator theme={theme}>—</DateSeparator>
            <FilterGroup>
              <DateTimePicker
                value={date_end}
                onChange={(e) => {
                  const value = e?.target?.value || e;
                  setDateEnd(value);
                }}
                placeholder="Выберите дату окончания"
              />
            </FilterGroup>
            {data && Array.isArray(data) && data.length > 0 && (
              <FilterGroup>
                <FilterSelect
                  theme={theme}
                  value={selectedChecker}
                  onChange={(e) => setSelectedChecker(e.target.value)}
                >
                  <option value="">Все</option>
                  {data.map((checker) => (
                    <option key={checker.checker_id} value={checker.checker_username}>
                      {checker.checker_username}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>
            )}
          </FiltersContainer>
        </HeaderSection>

        <ContentWrapper theme={theme}>
          {loading && <Loader />}
          {error && !loading && (
            <ErrorBlock>{error}</ErrorBlock>
          )}
          {!loading && !error && !data && (
            <EmptyState theme={theme}>Нет данных для отображения</EmptyState>
          )}
          {!loading && !error && data && Array.isArray(data) && data.length > 0 && (() => {
            // Если выбран конкретный проверяющий, показываем только его
            if (selectedChecker) {
              const filteredData = data.filter(checker => checker.checker_username === selectedChecker);
              
              if (filteredData.length === 0) {
                return <EmptyState theme={theme}>Проверяющий не найден</EmptyState>;
              }

              return filteredData.map((checker, index) => {
                const chartData = checker.days?.map(day => ({
                  date: formatDate(day.date),
                  dateRaw: day.date,
                  checks: day.checks_count || 0
                })) || [];
                const totalChecks = checker.days?.reduce((sum, day) => sum + (day.checks_count || 0), 0) || 0;

                return (
                  <CheckerCard key={checker.checker_id || index} theme={theme}>
                    <CheckerHeader theme={theme}>
                      <CheckerName theme={theme}>
                        {checker.checker_username || 'Неизвестный пользователь'}
                      </CheckerName>
                      <CheckerTotal theme={theme}>
                        <CheckerTotalLabel theme={theme}>Всего проверок</CheckerTotalLabel>
                        <CheckerTotalValue theme={theme}>{totalChecks}</CheckerTotalValue>
                      </CheckerTotal>
                    </CheckerHeader>
                    
                    {chartData.length > 0 && (
                      <ChartCard theme={theme}>
                        <ChartTitle theme={theme} style={{ marginBottom: '80px' }}>Проверки по дням</ChartTitle>
                        <ResponsiveContainer width="100%" height={300} style={{ marginTop: '20px' }}>
                          <BarChart 
                            data={chartData} 
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} opacity={0.3} />
                            <XAxis 
                              dataKey="date"
                              stroke={theme.colors.secondary}
                              tick={{ fontSize: 11, fill: theme.colors.secondary }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis 
                              stroke={theme.colors.secondary}
                              tick={{ fontSize: 11, fill: theme.colors.secondary }}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: theme.colors.surface,
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: '8px',
                                color: theme.colors.primary
                              }}
                              cursor={{ fill: 'transparent', stroke: 'transparent', strokeWidth: 0 }}
                              formatter={(value) => [value, 'Проверок']}
                              labelFormatter={(label) => `Дата: ${label}`}
                            />
                            <Bar 
                              dataKey="checks" 
                              fill={theme.colors.accent}
                              radius={[4, 4, 0, 0]}
                              stroke="transparent"
                              strokeWidth={0}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartCard>
                    )}
                  </CheckerCard>
                );
              });
            }

            // Если ничего не выбрано, суммируем все данные
            const allDates = new Set();
            data.forEach(checker => {
              checker.days?.forEach(day => {
                if (day.date) allDates.add(day.date);
              });
            });

            const aggregatedData = Array.from(allDates).sort().map(date => {
              const totalChecks = data.reduce((sum, checker) => {
                const dayData = checker.days?.find(d => d.date === date);
                return sum + (dayData?.checks_count || 0);
              }, 0);
              return {
                date: formatDate(date),
                dateRaw: date,
                checks: totalChecks
              };
            });

            const totalChecks = aggregatedData.reduce((sum, day) => sum + day.checks, 0);

            return (
              <CheckerCard theme={theme}>
                <CheckerHeader theme={theme}>
                  <CheckerName theme={theme}>
                    Все проверяющие (сумма)
                  </CheckerName>
                  <CheckerTotal theme={theme}>
                    <CheckerTotalLabel theme={theme}>Всего проверок</CheckerTotalLabel>
                    <CheckerTotalValue theme={theme}>{totalChecks}</CheckerTotalValue>
                  </CheckerTotal>
                </CheckerHeader>
                
                 {aggregatedData.length > 0 && (
                   <ChartCard theme={theme} style={{ marginBottom: 0 }}>
                     <ChartTitle theme={theme} style={{ marginBottom: '80px' }}>Проверки по дням (сумма всех проверяющих)</ChartTitle>
                     <ResponsiveContainer width="100%" height={300} style={{ marginTop: '20px' }}>
                      <BarChart 
                        data={aggregatedData} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} opacity={0.3} />
                        <XAxis 
                          dataKey="date"
                          stroke={theme.colors.secondary}
                          tick={{ fontSize: 11, fill: theme.colors.secondary }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          stroke={theme.colors.secondary}
                          tick={{ fontSize: 11, fill: theme.colors.secondary }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: theme.colors.surface,
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: '8px',
                            color: theme.colors.primary
                          }}
                          cursor={{ fill: 'transparent', stroke: 'transparent', strokeWidth: 0 }}
                          formatter={(value) => [value, 'Проверок']}
                          labelFormatter={(label) => `Дата: ${label}`}
                        />
                        <Bar 
                          dataKey="checks" 
                          fill={theme.colors.accent}
                          radius={[4, 4, 0, 0]}
                          stroke="transparent"
                          strokeWidth={0}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                )}
              </CheckerCard>
            );
          })()}
          {!loading && !error && (!Array.isArray(data) || data.length === 0) && (
            <EmptyState theme={theme}>Нет данных для отображения</EmptyState>
          )}
        </ContentWrapper>
      </PageContent>
    </Layout>
  );
};

