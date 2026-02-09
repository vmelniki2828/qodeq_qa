import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi2';
import { Loader } from '../components/Loader';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, LineChart, Line } from 'recharts';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Функция для получения токена из куки
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Функция для форматирования даты
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(',', '');
  } catch (e) {
    return dateString;
  }
};

// Человекочитаемое имя ключа
const formatLabel = (key) => {
  const n = String(key)
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim();
  return n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
};

const isDateLike = (v) => {
  if (typeof v !== 'string' && typeof v !== 'number') return false;
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}(T|\s)/.test(s) || /^\d{4}-\d{2}-\d{2}$/.test(s)) return true;
  const n = Number(v);
  return !isNaN(n) && n > 1e10;
};

const formatValue = (v) => {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'boolean') return v ? 'Да' : 'Нет';
  if (typeof v === 'number') return Number.isInteger(v) ? v.toLocaleString('ru-RU') : v.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
  if (isDateLike(v)) return formatDate(v);
  if (typeof v === 'string') return v;
  if (Array.isArray(v) || (typeof v === 'object' && v !== null)) {
    const s = JSON.stringify(v);
    return s.length > 80 ? s.slice(0, 80) + '…' : s;
  }
  return String(v);
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
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px 20px 0 20px;
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

/* Стили для красивого вывода данных dashboard */
const DashboardBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
`;

const InfoCard = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary === '#0D0D0D' ? '#E5E5E5' : 'rgba(255,255,255,0.12)'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
`;

const InfoCardLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 8px;
`;

const InfoCardValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.3;
  word-break: break-word;
`;

const DashboardSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const DashboardSectionTitle = styled.div`
  padding: 14px 20px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  background: ${({ theme }) =>
    theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionContent = styled.div`
  padding: 20px;
`;


const DataTableWrap = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const DataTableHead = styled.thead`
  background: ${({ theme }) =>
    theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)'};
`;

const DataTableTh = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const DataTableBody = styled.tbody``;

const DataTableTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)'};
  }
`;

const DataTableTd = styled.td`
  padding: 12px 16px;
  color: ${({ theme }) => theme.colors.primary};
  vertical-align: top;
`;

const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) =>
    theme.colors.primary === '#0D0D0D' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const ErrorBlock = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 15px;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
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

const ErrorsTable = styled.table`
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

// Стили для таблицы Recent Errors с выравниванием по центру
const ErrorsTableHeaderCell = styled.th`
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
  position: relative;
  white-space: nowrap;
  
  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const ErrorsTableCell = styled.td`
  padding: 14px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

// Рекурсивный вывод данных API: примитивы — карточки, объекты — секции, массивы — таблица или теги
function renderDashboardData(data, theme) {
  if (data == null || (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0)) {
    return <EmptyState theme={theme}>Нет данных для отображения</EmptyState>;
  }
  if (Array.isArray(data)) {
    if (data.length === 0) return <EmptyState theme={theme}>Пустой список</EmptyState>;
    const allPrimitive = data.every((x) => x == null || (typeof x !== 'object' && typeof x !== 'function'));
    if (allPrimitive) {
      return (
        <TagsWrap theme={theme}>
          {data.map((v, i) => (
            <Tag key={i} theme={theme}>{formatValue(v)}</Tag>
          ))}
        </TagsWrap>
      );
    }
    const columns = [...new Set(data.flatMap((obj) => (obj && typeof obj === 'object' ? Object.keys(obj) : [])))];
    if (columns.length === 0) return <EmptyState theme={theme}>Нет колонок</EmptyState>;
    return (
      <DataTableWrap theme={theme}>
        <DataTable>
          <DataTableHead>
            <tr>
              {columns.map((col) => (
                <DataTableTh key={col} theme={theme}>{formatLabel(col)}</DataTableTh>
              ))}
            </tr>
          </DataTableHead>
          <DataTableBody>
            {data.map((row, i) => (
              <DataTableTr key={i} theme={theme}>
                {columns.map((col) => (
                  <DataTableTd key={col} theme={theme}>{formatValue(row && row[col])}</DataTableTd>
                ))}
              </DataTableTr>
            ))}
          </DataTableBody>
        </DataTable>
      </DataTableWrap>
    );
  }
  if (typeof data === 'object' && data !== null) {
    const primitives = [];
    const complex = [];
    Object.entries(data).forEach(([k, v]) => {
      if (v === null || v === undefined) primitives.push([k, v]);
      else if (typeof v !== 'object') primitives.push([k, v]);
      else if (Array.isArray(v)) {
        // Не выводим пустые Integrations
        const keyLower = k.toLowerCase();
        if (keyLower === 'integrations' && v.length === 0) {
          return; // Пропускаем пустые массивы
        }
        complex.push([k, v]);
      } else {
        const keyLower = k.toLowerCase();
        // Не выводим блок Integrations, если он пустой
        if (keyLower === 'integrations' && typeof v === 'object' && v !== null) {
          // Проверяем, пустой ли объект
          if (Object.keys(v).length === 0) {
            return; // Пропускаем пустые объекты
          }
          // Проверяем, содержит ли объект только пустые массивы/объекты
          const hasNonEmptyValue = Object.values(v).some(val => {
            if (val === null || val === undefined) return false;
            if (Array.isArray(val)) return val.length > 0;
            if (typeof val === 'object') return Object.keys(val).length > 0;
            return true; // Примитивные значения считаем непустыми
          });
          if (!hasNonEmptyValue) {
            return; // Пропускаем, если все значения пустые
          }
        }
        // Не выводим блок Settings, если Issues пустое
        if (keyLower === 'settings' && typeof v === 'object' && v !== null) {
          const issues = v.issues || v.Issues || v.issues_ || v.Issues_;
          if (issues === null || issues === undefined || 
              (Array.isArray(issues) && issues.length === 0) ||
              (typeof issues === 'object' && Object.keys(issues).length === 0)) {
            return; // Пропускаем Settings, если Issues пустое
          }
        }
        complex.push([k, v]);
      }
    });
    return (
      <DashboardBlock theme={theme}>
        {primitives.length > 0 && (
          <InfoGrid theme={theme}>
            {primitives.map(([k, v]) => (
              <InfoCard key={k} theme={theme}>
                <InfoCardLabel theme={theme}>{formatLabel(k)}</InfoCardLabel>
                <InfoCardValue theme={theme}>{formatValue(v)}</InfoCardValue>
              </InfoCard>
            ))}
          </InfoGrid>
        )}
        {complex.map(([k, v]) => (
          <DashboardSection key={k} theme={theme}>
            <DashboardSectionTitle theme={theme}>{formatLabel(k)}</DashboardSectionTitle>
            <SectionContent theme={theme}>{renderDashboardData(v, theme)}</SectionContent>
          </DashboardSection>
        ))}
      </DashboardBlock>
    );
  }
  return (
    <InfoCard theme={theme}>
      <InfoCardValue theme={theme}>{formatValue(data)}</InfoCardValue>
    </InfoCard>
  );
}

export const DashboardPage = () => {
  const { theme, isDark } = useTheme();
  
  // Цвет обводки для графиков: белый на светлой теме, темный на темной
  const chartStrokeColor = isDark ? '#2D2D2D' : '#FFFFFF';
  const [activeView] = useState(null);
  const [startDate] = useState('');
  const [endDate] = useState('');
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supportData, setSupportData] = useState(null);
  const [isLoadingSupport, setIsLoadingSupport] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' или 'desc'

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('https://qa.qodeq.net/api/v1/profile/user/dashboard', {
          method: 'GET',
          credentials: "include",
          headers,
        });

        // Если статус 401, просто показываем пустые ячейки
        if (response.status === 401) {
          setStatsData(null);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStatsData(data);
      } catch (err) {
        console.error('Ошибка при загрузке статистики:', err);
        setError(err.message);
        Notify.failure('Ошибка при загрузке статистики');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);





  const getTitle = () => {
    return 'Dashboard';
  };

  return (
    <Layout>
      <PageContent>
        <OverviewSection theme={theme}>
          <OverviewHeader>
            <OverviewTitle theme={theme}>{getTitle()}</OverviewTitle>
          </OverviewHeader>
        </OverviewSection>

        <ContentWrapper>
          {activeView === null && (
            <>
              {isLoading ? (
                <Loader />
              ) : error ? (
                <ErrorBlock>
                  Ошибка при загрузке данных: {error}
                </ErrorBlock>
              ) : (
                renderDashboardData(statsData, theme)
              )}
            </>
          )}
          {activeView === 'support' && (
            <>
              {isLoadingSupport ? (
                <Loader />
              ) : supportData ? (
                <>
                  <StatsCardsContainer>
                    <StatCard theme={theme}>
                      <StatCardLabel theme={theme}>Total Events</StatCardLabel>
                      <StatCardValue theme={theme}>
                        {supportData.usageTotals?.count || supportData.total_events || supportData.totalEvents || 0}
                      </StatCardValue>
                    </StatCard>
                    <StatCard theme={theme}>
                      <StatCardLabel theme={theme}>Errors</StatCardLabel>
                      <StatCardValue theme={theme}>
                        {supportData.usageTotals?.errors || supportData.errors || supportData.error_count || 0}
                      </StatCardValue>
                    </StatCard>
                    <StatCard theme={theme}>
                      <StatCardLabel theme={theme}>Input Tokens</StatCardLabel>
                      <StatCardValue theme={theme}>
                        {supportData.usageTotals?.input_tokens || supportData.input_tokens || supportData.inputTokens || 0}
                      </StatCardValue>
                    </StatCard>
                  </StatsCardsContainer>

                  <ChartsWrapper theme={theme}>
                  <ChartsGrid>
                    {/* By Message Type Donut Chart */}
                    <ChartCard theme={theme}>
                      <ChartTitle theme={theme}>By Message Type</ChartTitle>
                      {supportData.byType && Array.isArray(supportData.byType) && supportData.byType.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            <Pie
                              data={supportData.byType.map(item => ({ name: item.name || 'Unknown', value: item.count || 0 }))}
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
                              {supportData.byType.map((entry, index) => {
                                const colors = ['#8B5CF6', '#10A37F', '#3B82F6', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16', '#06B6D4', '#A855F7'];
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

                    {/* Operator vs Non-Operator Donut Chart */}
                    <ChartCard theme={theme}>
                      <ChartTitle theme={theme}>Operator vs Non-Operator</ChartTitle>
                      {supportData.byOperator && Array.isArray(supportData.byOperator) && supportData.byOperator.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            <Pie
                              data={supportData.byOperator.map(item => ({ name: String(item.name), value: item.count || 0 }))}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                              outerRadius={90}
                              innerRadius={50}
                              fill="#8884d8"
                              dataKey="value"
                              stroke={chartStrokeColor}
                              strokeWidth={2}
                            >
                              {supportData.byOperator.map((entry, index) => {
                                const colors = ['#10A37F', '#8B5CF6'];
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

                    {/* Time Series Chart */}
                    <ChartCard theme={theme}>
                      <ChartTitle theme={theme}>Time Series (Daily)</ChartTitle>
                      {supportData.timeSeries && Array.isArray(supportData.timeSeries) && supportData.timeSeries.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                          <LineChart data={supportData.timeSeries.map(item => ({ date: item._id, events: item.count || 0, errors: item.errors || 0 }))} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} opacity={0.3} />
                            <XAxis 
                              dataKey="date" 
                              stroke={theme.colors.secondary}
                              tick={{ fontSize: 11 }}
                              tickLine={false}
                            />
                            <YAxis 
                              stroke={theme.colors.secondary}
                              tick={{ fontSize: 11 }}
                              tickLine={false}
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
                            />
                            <RechartsLegend 
                              wrapperStyle={{ fontSize: '12px', color: theme.colors.secondary, paddingTop: '10px' }}
                              iconType="line"
                              iconSize={12}
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
                            <Line 
                              type="monotone" 
                              dataKey="events" 
                              stroke="#3B82F6" 
                              strokeWidth={2.5} 
                              dot={{ r: 4, fill: '#3B82F6' }}
                              activeDot={{ r: 6 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="errors" 
                              stroke="#10A37F" 
                              strokeWidth={2.5} 
                              dot={{ r: 4, fill: '#10A37F' }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: theme.colors.secondary, fontSize: '14px' }}>
                          Нет данных
                        </div>
                      )}
                    </ChartCard>

                    {/* By Payment Bar Chart */}
                    <ChartCard theme={theme}>
                      <ChartTitle theme={theme}>By Payment</ChartTitle>
                      {supportData.byPayment && Array.isArray(supportData.byPayment) && supportData.byPayment.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                          <BarChart data={supportData.byPayment.map(item => ({ name: item.name || 'Unknown', count: item.count || 0 }))} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} opacity={0.3} />
                            <XAxis 
                              dataKey="name" 
                              stroke={theme.colors.secondary}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              tick={{ fontSize: 10 }}
                              tickLine={false}
                            />
                            <YAxis 
                              stroke={theme.colors.secondary}
                              tick={{ fontSize: 11 }}
                              tickLine={false}
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
                            />
                            <Bar 
                              dataKey="count" 
                              fill="#8B5CF6" 
                              radius={[4, 4, 0, 0]}
                            />
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

                  {/* Recent Errors Table */}
                  {supportData.recent_errors || supportData.recentErrors ? (() => {
                    const errors = supportData.recentErrors || supportData.recent_errors || [];
                    
                    // Функция сортировки
                    const getSortValue = (error, column) => {
                      switch (column) {
                        case 'when':
                          const dateStr = error.created_at || error.when || error.timestamp || '';
                          return dateStr ? new Date(dateStr).getTime() : 0;
                        case 'ticket':
                          return (error.ticket_id || error.ticket || 'unknown').toLowerCase();
                        case 'type':
                          return (error.type || error.message_type || '—').toLowerCase();
                        case 'payment':
                          return (error.payment || error.payment_name || '—').toLowerCase();
                        case 'error':
                          return (error.error || error.error_message || '—').toLowerCase();
                        default:
                          return '';
                      }
                    };
                    
                    // Сортировка данных
                    const sortedErrors = [...errors].sort((a, b) => {
                      if (!sortColumn) return 0;
                      const aValue = getSortValue(a, sortColumn);
                      const bValue = getSortValue(b, sortColumn);
                      
                      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                      return 0;
                    });
                    
                    // Обработчик клика на заголовок
                    const handleSort = (column) => {
                      if (sortColumn === column) {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortColumn(column);
                        setSortDirection('asc');
                      }
                    };
                    
                    // Компонент для отображения индикатора сортировки
                    const SortIndicator = ({ column }) => {
                      if (sortColumn !== column) return null;
                      return sortDirection === 'asc' ? 
                        <HiArrowUp size={12} /> : 
                        <HiArrowDown size={12} />;
                    };
                    
                    return (
                      <ChartCard theme={theme}>
                        <ChartTitle theme={theme}>Recent Errors</ChartTitle>
                        <ErrorsTable theme={theme}>
                          <TableHeader theme={theme}>
                            <TableHeaderRow>
                              <ErrorsTableHeaderCell 
                                theme={theme} 
                                onClick={() => handleSort('when')}
                              >
                                When <SortIndicator column="when" />
                              </ErrorsTableHeaderCell>
                              <ErrorsTableHeaderCell 
                                theme={theme} 
                                onClick={() => handleSort('ticket')}
                              >
                                Ticket <SortIndicator column="ticket" />
                              </ErrorsTableHeaderCell>
                              <ErrorsTableHeaderCell 
                                theme={theme} 
                                onClick={() => handleSort('type')}
                              >
                                Type <SortIndicator column="type" />
                              </ErrorsTableHeaderCell>
                              <ErrorsTableHeaderCell 
                                theme={theme} 
                                onClick={() => handleSort('payment')}
                              >
                                Payment <SortIndicator column="payment" />
                              </ErrorsTableHeaderCell>
                              <ErrorsTableHeaderCell 
                                theme={theme} 
                                onClick={() => handleSort('error')}
                              >
                                Error <SortIndicator column="error" />
                              </ErrorsTableHeaderCell>
                            </TableHeaderRow>
                          </TableHeader>
                          <TableBody>
                            {sortedErrors.map((error, index) => (
                              <TableRow key={index} theme={theme}>
                                <ErrorsTableCell theme={theme}>
                                  {error.created_at ? formatDate(error.created_at) : error.when ? formatDate(error.when) : error.timestamp ? formatDate(error.timestamp) : '—'}
                                </ErrorsTableCell>
                                <ErrorsTableCell theme={theme}>{error.ticket_id || error.ticket || 'unknown'}</ErrorsTableCell>
                                <ErrorsTableCell theme={theme}>{error.type || error.message_type || '—'}</ErrorsTableCell>
                                <ErrorsTableCell theme={theme}>{error.payment || error.payment_name || '—'}</ErrorsTableCell>
                                <ErrorsTableCell theme={theme}>{error.error || error.error_message || '—'}</ErrorsTableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </ErrorsTable>
                      </ChartCard>
                    );
                  })() : null}
                </>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: theme.colors.secondary }}>
                  Нет данных для отображения
            </div>
              )}
            </>
          )}
        </ContentWrapper>
      </PageContent>
    </Layout>
  );
};

