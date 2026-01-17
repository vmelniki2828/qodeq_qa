import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { HiArrowLeft, HiArrowUp, HiArrowDown } from 'react-icons/hi2';
import { DatePicker } from '../components/DatePicker';
import { Loader } from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';

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

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-shrink: 0;
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

const ActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
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

const ButtonText = styled.span`
  display: flex;
  align-items: center;
`;

const BackIcon = styled(HiArrowLeft)`
  margin-right: 6px;
  font-size: 14px;
`;

const StatsCardsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? '#E5E5E5' : 'rgba(255,255,255,0.1)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
`;

const StatCardLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

const StatCardValue = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.2;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? '#E5E5E5' : 'rgba(255,255,255,0.1)'};
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

// Обертка для графиков с глобальными стилями hover
const ChartsWrapper = styled.div`
  .recharts-legend-wrapper {
    .recharts-default-legend {
      .recharts-legend-item {
        color: ${({ theme }) => theme.colors.secondary} !important;
        transition: color 0.2s ease !important;
        cursor: pointer !important;
        
        &:hover {
          color: ${({ theme }) => theme.colors.primary} !important;
        }
        
        .recharts-legend-item-text {
          color: inherit !important;
          transition: color 0.2s ease !important;
        }
      }
    }
  }
  
  .recharts-tooltip-wrapper {
    .recharts-default-tooltip {
      .recharts-tooltip-item {
        color: ${({ theme }) => theme.colors.secondary} !important;
        transition: color 0.2s ease !important;
        
        &:hover {
          color: ${({ theme }) => theme.colors.primary} !important;
        }
      }
    }
  }
`;

const TablesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const TableCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? '#E5E5E5' : 'rgba(255,255,255,0.1)'};
  }
`;

const TableTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.surface};
`;

const TableHeaderRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableHeaderCell = styled.th`
  padding: 14px 16px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 1px;
  background-color: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;
  white-space: nowrap;
  
  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
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
  padding: 14px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

export const HelpdeskTagsStatsPage = () => {
  const { theme, isDark } = useTheme();
  const navigate = useNavigate();
  
  // Цвет обводки для графиков: белый на светлой теме, темный на темной
  const chartStrokeColor = isDark ? '#2D2D2D' : '#FFFFFF';
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [helpdeskData, setHelpdeskData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [breakdownSortColumn, setBreakdownSortColumn] = useState(null);
  const [breakdownSortDirection, setBreakdownSortDirection] = useState('asc');
  const [statsSortColumn, setStatsSortColumn] = useState(null);
  const [statsSortDirection, setStatsSortDirection] = useState('asc');

  // Установка дат по умолчанию
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setStartDate(todayStr);
    setEndDate(todayStr);
  }, []);

  const fetchHelpdeskStats = async () => {
    setIsLoading(true);
    try {
      const token = getCookie('rb_admin_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const params = new URLSearchParams();
      if (startDate) {
        params.append('start', startDate);
      }
      if (endDate) {
        params.append('end', endDate);
      }

      const queryString = params.toString();
      const url = `https://repayment.cat-tools.com/api/v1/admin/stats/helpdesk-tags${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (response.status === 401) {
        setHelpdeskData(null);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHelpdeskData(data);
    } catch (err) {
      console.error('Ошибка при загрузке статистики Helpdesk Tags:', err);
      setHelpdeskData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchHelpdeskStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  // Обработка данных для отображения
  const getTotalTickets = () => {
    return helpdeskData?.totals?.tickets || 0;
  };

  const getTaggedSum = () => {
    return helpdeskData?.totals?.by_category_sum || 0;
  };

  const getCoverage = () => {
    const total = getTotalTickets();
    const tagged = getTaggedSum();
    if (total === 0) return 0;
    return Math.round((tagged / total) * 100);
  };

  const getCategoryData = () => {
    if (helpdeskData?.categories && Array.isArray(helpdeskData.categories)) {
      return helpdeskData.categories.map(cat => ({
        name: cat.name || '',
        value: cat.count || 0
      }));
    }
    return [];
  };

  const getPercentData = () => {
    if (helpdeskData?.categories && Array.isArray(helpdeskData.categories)) {
      return helpdeskData.categories.map(cat => ({
        name: cat.name || '',
        percent: parseFloat(cat.percent_of_total || 0)
      }));
    }
    return [];
  };

  const getBreakdownData = () => {
    if (helpdeskData?.categories && Array.isArray(helpdeskData.categories)) {
      const total = getTotalTickets();
      const tagged = getTaggedSum();
      
      let data = helpdeskData.categories.map(cat => {
        const percentOfTotal = parseFloat(cat.percent_of_total || 0);
        const percentOfCategories = tagged > 0 ? ((cat.count || 0) / tagged * 100) : 0;
        
        return {
          category: cat.name || '',
          count: cat.count || 0,
          percentOfTotal: percentOfTotal,
          percentOfCategories: percentOfCategories
        };
      });

      // Сортировка
      if (breakdownSortColumn) {
        data = [...data].sort((a, b) => {
          let aValue, bValue;
          switch (breakdownSortColumn) {
            case 'category':
              aValue = a.category.toLowerCase();
              bValue = b.category.toLowerCase();
              break;
            case 'count':
              aValue = a.count;
              bValue = b.count;
              break;
            case 'percentOfTotal':
              aValue = a.percentOfTotal;
              bValue = b.percentOfTotal;
              break;
            case 'percentOfCategories':
              aValue = a.percentOfCategories;
              bValue = b.percentOfCategories;
              break;
            default:
              return 0;
          }
          
          if (aValue < bValue) return breakdownSortDirection === 'asc' ? -1 : 1;
          if (aValue > bValue) return breakdownSortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return data;
    }
    return [];
  };

  const handleBreakdownSort = (column) => {
    if (breakdownSortColumn === column) {
      setBreakdownSortDirection(breakdownSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setBreakdownSortColumn(column);
      setBreakdownSortDirection('asc');
    }
  };

  const BreakdownSortIndicator = ({ column }) => {
    if (breakdownSortColumn !== column) return null;
    return breakdownSortDirection === 'asc' ? 
      <HiArrowUp size={12} /> : 
      <HiArrowDown size={12} />;
  };

  const getStatsData = () => {
    const stats = [
      { metric: 'All tickets count', value: getTotalTickets(), isNumeric: true },
      { metric: 'Duplicates count', value: helpdeskData?.extras?.duplicates_tickets || 0, isNumeric: true },
      { metric: 'Processed tickets', value: helpdeskData?.extras?.processed_tickets || 0, isNumeric: true },
      { metric: 'Solved tickets by bot', value: helpdeskData?.extras?.solved_by_bot_tickets || 0, isNumeric: true },
      { metric: 'Full bot', value: helpdeskData?.extras?.full_bot || 0, isNumeric: true },
      { metric: 'Bot + operator', value: helpdeskData?.extras?.bot_and_operator || 0, isNumeric: true },
      { metric: 'Full operator', value: helpdeskData?.extras?.full_operator || 0, isNumeric: true },
      { 
        metric: 'Full bot %', 
        value: helpdeskData?.extras?.full_bot_percent ? helpdeskData.extras.full_bot_percent.toFixed(2) + '%' : '0.00%',
        isNumeric: false,
        numericValue: helpdeskData?.extras?.full_bot_percent || 0
      },
      { 
        metric: 'Bot + operator %', 
        value: helpdeskData?.extras?.bot_and_operator_percent ? helpdeskData.extras.bot_and_operator_percent.toFixed(2) + '%' : '0.00%',
        isNumeric: false,
        numericValue: helpdeskData?.extras?.bot_and_operator_percent || 0
      },
      { 
        metric: 'Full operator %', 
        value: helpdeskData?.extras?.full_operator_percent ? helpdeskData.extras.full_operator_percent.toFixed(2) + '%' : '0.00%',
        isNumeric: false,
        numericValue: helpdeskData?.extras?.full_operator_percent || 0
      }
    ];

    // Сортировка
    if (statsSortColumn) {
      return [...stats].sort((a, b) => {
        let aValue, bValue;
        switch (statsSortColumn) {
          case 'metric':
            aValue = a.metric.toLowerCase();
            bValue = b.metric.toLowerCase();
            break;
          case 'value':
            if (a.isNumeric && b.isNumeric) {
              aValue = a.value;
              bValue = b.value;
            } else {
              aValue = a.numericValue !== undefined ? a.numericValue : parseFloat(a.value) || 0;
              bValue = b.numericValue !== undefined ? b.numericValue : parseFloat(b.value) || 0;
            }
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) return statsSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return statsSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return stats;
  };

  const handleStatsSort = (column) => {
    if (statsSortColumn === column) {
      setStatsSortDirection(statsSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setStatsSortColumn(column);
      setStatsSortDirection('asc');
    }
  };

  const StatsSortIndicator = ({ column }) => {
    if (statsSortColumn !== column) return null;
    return statsSortDirection === 'asc' ? 
      <HiArrowUp size={12} /> : 
      <HiArrowDown size={12} />;
  };

  return (
    <Layout>
      <PageContent>
        <OverviewSection theme={theme}>
          <OverviewHeader>
            <OverviewTitle theme={theme}>Helpdesk Tags — Statistics</OverviewTitle>
            <OverviewSubtitle theme={theme}>Counts and percentages for FULL BOT / BOT + OPERATOR / FULL OPERATOR.</OverviewSubtitle>
          </OverviewHeader>
          <FiltersContainer>
            <DatePicker
              id="helpdesk-start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <DateSeparator theme={theme}>—</DateSeparator>
            <DatePicker
              id="helpdesk-end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FiltersContainer>
          <ActionButtonsContainer>
            <ActionButton theme={theme} onClick={handleBackClick}>
              <ButtonText>
                <BackIcon />
                Back
              </ButtonText>
            </ActionButton>
          </ActionButtonsContainer>
        </OverviewSection>

        <ContentWrapper>
          {isLoading ? (
            <Loader />
          ) : helpdeskData ? (
            <>
              {/* KPI Cards */}
              <StatsCardsContainer>
                <StatCard theme={theme}>
                  <StatCardLabel theme={theme}>Total Tickets</StatCardLabel>
                  <StatCardValue theme={theme}>{getTotalTickets()}</StatCardValue>
                </StatCard>
                <StatCard theme={theme}>
                  <StatCardLabel theme={theme}>Tagged Sum</StatCardLabel>
                  <StatCardValue theme={theme}>{getTaggedSum()}</StatCardValue>
                </StatCard>
                <StatCard theme={theme}>
                  <StatCardLabel theme={theme}>Coverage</StatCardLabel>
                  <StatCardValue theme={theme}>{getCoverage()}%</StatCardValue>
                </StatCard>
              </StatsCardsContainer>

              {/* Charts */}
              <ChartsWrapper theme={theme}>
                <ChartsGrid>
                  {/* By Category Donut Chart */}
                  <ChartCard theme={theme}>
                    <ChartTitle theme={theme}>By Category</ChartTitle>
                    {getCategoryData().some(cat => cat.value > 0) ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={getCategoryData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                            outerRadius={90}
                            innerRadius={50}
                            fill="#8884d8"
                            dataKey="value"
                            stroke={chartStrokeColor}
                            strokeWidth={2}
                          >
                            {getCategoryData().map((entry, index) => {
                              const colors = ['#3B82F6', '#10A37F', '#F59E0B']; // blue, green, orange
                              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                            })}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{
                              backgroundColor: theme.colors.surface,
                              border: `1px solid ${theme.colors.border}`,
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              fontSize: '12px'
                            }}
                            itemStyle={{
                              color: theme.colors.secondary,
                              transition: 'color 0.2s ease'
                            }}
                            labelStyle={{
                              color: theme.colors.primary,
                              fontWeight: 600,
                              marginBottom: '4px'
                            }}
                          />
                          <RechartsLegend 
                            wrapperStyle={{ fontSize: '12px', color: theme.colors.secondary }}
                            iconType="circle"
                            iconSize={8}
                            formatter={(value, entry) => (
                              <span 
                                style={{ 
                                  color: theme.colors.secondary,
                                  transition: 'color 0.2s ease',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.target.style.color = theme.colors.primary}
                                onMouseLeave={(e) => e.target.style.color = theme.colors.secondary}
                              >
                                {value}
                              </span>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '60px', color: theme.colors.secondary, fontSize: '14px' }}>
                        Нет данных
                      </div>
                    )}
                  </ChartCard>

                  {/* Percent of Total Bar Chart */}
                  <ChartCard theme={theme}>
                    <ChartTitle theme={theme}>Percent of Total</ChartTitle>
                    {getPercentData().length > 0 ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={getPercentData()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} opacity={0.3} />
                          <XAxis 
                            dataKey="name" 
                            stroke={theme.colors.secondary}
                            tick={{ fontSize: 11 }}
                            tickLine={false}
                          />
                          <YAxis 
                            stroke={theme.colors.secondary}
                            tick={{ fontSize: 11 }}
                            tickLine={false}
                            domain={[0, 50]}
                            ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
                          />
                          <RechartsTooltip 
                            contentStyle={{
                              backgroundColor: theme.colors.surface,
                              border: `1px solid ${theme.colors.border}`,
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              fontSize: '12px'
                            }}
                            itemStyle={{
                              color: theme.colors.secondary,
                              transition: 'color 0.2s ease'
                            }}
                            labelStyle={{
                              color: theme.colors.primary,
                              fontWeight: 600,
                              marginBottom: '4px'
                            }}
                            formatter={(value) => [`${parseFloat(value).toFixed(2)}%`, 'Percent']}
                          />
                          <Bar 
                            dataKey="percent" 
                            fill="#8B5CF6" 
                            radius={[4, 4, 0, 0]}
                          >
                            {getPercentData().map((entry, index) => {
                              const colors = ['#3B82F6', '#10A37F', '#F59E0B']; // blue, green, orange
                              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '60px', color: theme.colors.secondary, fontSize: '14px' }}>
                        Нет данных
                      </div>
                    )}
                  </ChartCard>
                </ChartsGrid>
              </ChartsWrapper>

              {/* Tables */}
              <TablesGrid>
                {/* Breakdown Table */}
                <TableCard theme={theme}>
                  <TableTitle theme={theme}>Breakdown</TableTitle>
                  <Table theme={theme}>
                    <TableHeader theme={theme}>
                      <TableHeaderRow>
                        <TableHeaderCell 
                          theme={theme} 
                          onClick={() => handleBreakdownSort('category')}
                        >
                          Category
                        </TableHeaderCell>
                        <TableHeaderCell 
                          theme={theme} 
                          onClick={() => handleBreakdownSort('count')}
                        >
                          Count
                        </TableHeaderCell>
                        <TableHeaderCell 
                          theme={theme} 
                          onClick={() => handleBreakdownSort('percentOfTotal')}
                        >
                          % of Total
                        </TableHeaderCell>
                        <TableHeaderCell 
                          theme={theme} 
                          onClick={() => handleBreakdownSort('percentOfCategories')}
                        >
                          % of Categories
                        </TableHeaderCell>
                      </TableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {getBreakdownData().map((row, index) => (
                        <TableRow key={index} theme={theme}>
                          <TableCell theme={theme}>{row.category}</TableCell>
                          <TableCell theme={theme}>{row.count}</TableCell>
                          <TableCell theme={theme}>{row.percentOfTotal.toFixed(2)}%</TableCell>
                          <TableCell theme={theme}>{row.percentOfCategories.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCard>

                {/* Helpdesk Tag Stats Table */}
                <TableCard theme={theme}>
                  <TableTitle theme={theme}>Helpdesk Tag Stats</TableTitle>
                  <Table theme={theme}>
                    <TableHeader theme={theme}>
                      <TableHeaderRow>
                        <TableHeaderCell 
                          theme={theme} 
                          onClick={() => handleStatsSort('metric')}
                        >
                          Metric
                        </TableHeaderCell>
                        <TableHeaderCell 
                          theme={theme} 
                          onClick={() => handleStatsSort('value')}
                        >
                          Value
                        </TableHeaderCell>
                      </TableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {getStatsData().map((row, index) => (
                        <TableRow key={index} theme={theme}>
                          <TableCell theme={theme}>{row.metric}</TableCell>
                          <TableCell theme={theme}>{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCard>
              </TablesGrid>
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
