import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Layout } from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { Loader } from '../components/Loader';
import { DateTimePicker } from '../components/DateTimePicker';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
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
  align-items: center;
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

const FilterLabel = styled.label`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DateSeparator = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0 8px;
`;

const StaffMetricsButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
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

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  
  @media (min-width: 1400px) {
    grid-template-columns: repeat(7, 1fr);
  }
`;

const MetricCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  min-width: 0;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const MetricCardTitle = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MetricCardValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.2;
  word-break: break-word;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
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

  /* Глобальные стили для убирания обводки у столбцов */
  * {
    &[class*="recharts-bar"] rect,
    &[class*="bar"] rect {
      stroke: transparent !important;
      stroke-width: 0 !important;
    }
  }

  /* Убираем обводку при клике на график */
  .recharts-wrapper {
    outline: none !important;
    border: none !important;
  }

  .recharts-wrapper:focus,
  .recharts-wrapper:active {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }

  .recharts-active-dot circle,
  .recharts-active-dot,
  .recharts-line-active-dot circle,
  .recharts-line-active-dot {
    stroke: transparent !important;
    stroke-width: 0 !important;
    outline: none !important;
  }

  .recharts-dot circle,
  .recharts-dot {
    stroke: transparent !important;
    stroke-width: 0 !important;
  }

  /* Убираем обводку у всех circle элементов */
  circle {
    stroke: transparent !important;
    stroke-width: 0 !important;
  }

  /* Убираем обводку у столбцов при наведении */
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

  /* Убираем обводку у всех rect элементов */
  rect {
    stroke: transparent !important;
    stroke-width: 0 !important;
  }

  rect:hover,
  rect:focus,
  rect:active {
    stroke: transparent !important;
    stroke-width: 0 !important;
    outline: none !important;
  }

  /* Убираем обводку у всех SVG элементов */
  svg {
    outline: none !important;
  }

  svg:focus,
  svg:active {
    outline: none !important;
  }

  /* Убираем обводку у всех элементов при фокусе */
  *:focus,
  *:active {
    outline: none !important;
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

const DataSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
`;

const DataSectionTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const DataItemLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DataItemValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ScoreDistributionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`;

const ScoreBlock = styled.div`
  background: ${({ $color }) => $color};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.2s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ScoreBlockLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 12px;
`;

const ScoreBlockValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
`;

const formatDateForAPI = (dateString) => {
  if (!dateString) return '';
  try {
    // Если дата в формате YYYY-MM-DDTHH:mm, конвертируем в ISO
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
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

const formatValue = (v) => {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'boolean') return v ? 'Да' : 'Нет';
  if (typeof v === 'number') return Number.isInteger(v) ? v.toLocaleString('ru-RU') : v.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
  if (typeof v === 'string') {
    // Проверяем, является ли строка датой в формате ISO
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
      return formatDate(v);
    }
    return v;
  }
  if (Array.isArray(v)) return v.length > 0 ? `${v.length} элементов` : 'Пусто';
  if (typeof v === 'object' && v !== null) {
    return Object.keys(v).length > 0 ? `${Object.keys(v).length} полей` : 'Пусто';
  }
  return String(v);
};

const COLORS = ['#3B82F6', '#10A37F', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16', '#06B6D4', '#A855F7'];

export const MetricsPage = () => {
  const { theme } = useTheme();
  const { role } = useUserProfile();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date_start, setDateStart] = useState('');
  const [date_end, setDateEnd] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(false);

  useEffect(() => {
    if (!data) return;

    // Убираем обводку и белый фон у всех столбцов после рендеринга
    const removeBarStrokes = () => {
      try {
        // Убираем обводку у столбцов
        const bars = document.querySelectorAll('.recharts-bar rect, .recharts-bar-rectangle');
        bars.forEach((bar) => {
          if (bar && bar.setAttribute) {
            bar.setAttribute('stroke', 'transparent');
            bar.setAttribute('stroke-width', '0');
            if (bar.style) {
              bar.style.stroke = 'transparent';
              bar.style.strokeWidth = '0';
            }
          }
        });

        // Убираем белый фон tooltip cursor
        const tooltipCursors = document.querySelectorAll('.recharts-tooltip-cursor, .recharts-tooltip-cursor rect, .recharts-cursor-fill');
        tooltipCursors.forEach((cursor) => {
          if (cursor && cursor.setAttribute) {
            cursor.setAttribute('fill', 'transparent');
            cursor.setAttribute('stroke', 'transparent');
            if (cursor.style) {
              cursor.style.fill = 'transparent';
              cursor.style.stroke = 'transparent';
              cursor.style.opacity = '0';
            }
          }
        });
      } catch (e) {
        console.error('Error removing bar strokes:', e);
      }
    };

    // Выполняем с задержкой для элементов, которые рендерятся позже
    const timer = setTimeout(removeBarStrokes, 200);
    const timer2 = setTimeout(removeBarStrokes, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [data]);

  // Загрузка групп для HEAD и TEAM LEAD
  useEffect(() => {
    const fetchGroups = async () => {
      if (role !== 'head' && role !== 'team_lead') {
        return;
      }
      
      setLoadingGroups(true);
      try {
        const token = getCookie('rb_admin_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch('https://qa.qodeq.net/api/v1/group/support/', {
          method: 'GET',
          headers
        });
        
        if (!res.ok) {
          throw new Error(`Ошибка ${res.status}`);
        }
        
        const json = await res.json();
        // Если данные - массив объектов с teamlead и groups, извлекаем все группы
        if (Array.isArray(json)) {
          const allGroups = [];
          json.forEach((teamleadItem) => {
            if (teamleadItem?.groups && Array.isArray(teamleadItem.groups)) {
              teamleadItem.groups.forEach((group) => {
                if (group?.id) {
                  allGroups.push({
                    id: group.id,
                    name: group.supervisor_username || `Группа ${group.id}`
                  });
                }
              });
            }
          });
          setGroups(allGroups);
        } else {
          setGroups([]);
        }
      } catch (e) {
        console.error('Ошибка при загрузке групп:', e);
        setGroups([]);
      } finally {
        setLoadingGroups(false);
      }
    };
    
    fetchGroups();
  }, [role]);

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
        if (selectedGroupId) {
          params.append('support_group_id', selectedGroupId);
        }
        
        const url = `https://qa.qodeq.net/api/v1/chat/statisticsmetrics${params.toString() ? '?' + params.toString() : ''}`;
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
        // Не показываем ошибку, если это просто отсутствие данных
        if (e.message !== 'Ошибка 404') {
          Notify.failure('Ошибка при загрузке метрик');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, [date_start, date_end, selectedGroupId]);

  return (
    <Layout>
      <GlobalChartStyles />
      <PageContent>
        <HeaderSection theme={theme}>
          <Title theme={theme}>Metrics</Title>
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
            {(role === 'head' || role === 'team_lead') && (
              <FilterGroup>
                <FilterSelect
                  theme={theme}
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  disabled={loadingGroups}
                >
                  <option value="">Все группы</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>
            )}
            <StaffMetricsButton theme={theme} onClick={() => navigate('/staff-metrics')}>
              Staff metrics
            </StaffMetricsButton>
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
          {!loading && !error && data && (
            <>
              {/* Блоки распределения оценок */}
              {data.score_distribution && typeof data.score_distribution === 'object' && (
                <ScoreDistributionGrid theme={theme}>
                  <ScoreBlock theme={theme} $color="rgba(34, 197, 94, 0.2)" style={{ borderLeft: '4px solid #16a34a' }}>
                    <ScoreBlockLabel>Green</ScoreBlockLabel>
                    <ScoreBlockValue>{data.score_distribution.green || 0}</ScoreBlockValue>
                  </ScoreBlock>
                  <ScoreBlock theme={theme} $color="rgba(234, 179, 8, 0.2)" style={{ borderLeft: '4px solid #ca8a04' }}>
                    <ScoreBlockLabel>Yellow</ScoreBlockLabel>
                    <ScoreBlockValue>{data.score_distribution.yellow || 0}</ScoreBlockValue>
                  </ScoreBlock>
                  <ScoreBlock theme={theme} $color="rgba(239, 68, 68, 0.2)" style={{ borderLeft: '4px solid #dc2626' }}>
                    <ScoreBlockLabel>Red</ScoreBlockLabel>
                    <ScoreBlockValue>{data.score_distribution.red || 0}</ScoreBlockValue>
                  </ScoreBlock>
                </ScoreDistributionGrid>
              )}

              {/* Блоки с основными метриками */}
              {(() => {
                const metrics = [];
                if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                  Object.entries(data).forEach(([key, value]) => {
                    // Пропускаем score_distribution, так как он уже отображается отдельно
                    if (key === 'score_distribution') return;
                    if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
                      metrics.push({ key, value });
                    }
                  });
                }
                
                if (metrics.length > 0) {
                  return (
                    <MetricsGrid theme={theme}>
                      {metrics.map(({ key, value }) => (
                        <MetricCard key={key} theme={theme}>
                          <MetricCardTitle theme={theme}>{formatLabel(key)}</MetricCardTitle>
                          <MetricCardValue theme={theme}>{formatValue(value)}</MetricCardValue>
                        </MetricCard>
                      ))}
                    </MetricsGrid>
                  );
                }
                return null;
              })()}

              {/* Графики для массивов данных */}
              {(() => {
                const charts = [];
                if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                  Object.entries(data).forEach(([key, value]) => {
                    if (Array.isArray(value) && value.length > 0) {
                      const firstItem = value[0];
                      if (typeof firstItem === 'object' && firstItem !== null) {
                        // Проверяем, есть ли поле с датой/временем для линейного графика
                        const hasDateField = Object.keys(firstItem).some(k => 
                          k.toLowerCase().includes('date') || 
                          k.toLowerCase().includes('time') || 
                          k.toLowerCase().includes('_id')
                        );
                        if (hasDateField) {
                          charts.push({ type: 'line', key, data: value });
                        } else {
                          charts.push({ type: 'bar', key, data: value });
                        }
                      } else {
                        charts.push({ type: 'pie', key, data: value });
                      }
                    }
                  });
                }
                
                if (charts.length > 0) {
                  return (
                    <ChartsGrid theme={theme}>
                      {charts.map(({ type, key, data: chartData }) => {
                         if (type === 'bar') {
                           const dataKeys = Object.keys(chartData[0] || {}).filter(k => typeof chartData[0][k] === 'number');
                           const labelKey = Object.keys(chartData[0] || {}).find(k => typeof chartData[0][k] !== 'number' && k !== 'id') || 'name';
                           if (dataKeys.length > 0) {
                             // Проверяем, является ли labelKey датой, и форматируем данные
                             const isDateField = labelKey.toLowerCase().includes('date') || labelKey.toLowerCase().includes('time');
                             const formattedData = isDateField 
                               ? chartData.map(item => ({
                                   ...item,
                                   [labelKey]: formatDate(item[labelKey])
                                 }))
                               : chartData;
                             return (
                               <ChartCard key={key} theme={theme}>
                                 <ChartTitle theme={theme}>{formatLabel(key)}</ChartTitle>
                                 <ResponsiveContainer width="100%" height={300}>
                                   <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                     <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} opacity={0.3} />
                                     <XAxis 
                                       dataKey={labelKey}
                                       stroke={theme.colors.secondary}
                                       tick={{ fontSize: 10, fill: theme.colors.secondary }}
                                       angle={-45}
                                       textAnchor="end"
                                       height={70}
                                       tickFormatter={(value) => {
                                         const str = value != null ? String(value).trim() : '';
                                         const shortened = str.replace(/\s+Casino$/i, '');
                                         return shortened.length > 12 ? shortened.slice(0, 11) + '…' : (shortened || str);
                                       }}
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
                                    />
                                    <Legend 
                                      wrapperStyle={{ fontSize: '12px', color: theme.colors.secondary }}
                                    />
                                    {dataKeys.slice(0, 5).map((dataKey, idx) => (
                                      <Bar 
                                        key={dataKey} 
                                        dataKey={dataKey} 
                                        fill={COLORS[idx % COLORS.length]}
                                        radius={[4, 4, 0, 0]}
                                        stroke="transparent"
                                        strokeWidth={0}
                                        style={{ stroke: 'transparent', strokeWidth: 0 }}
                                      />
                                    ))}
                                  </BarChart>
                                </ResponsiveContainer>
                              </ChartCard>
                            );
                          }
                        } else if (type === 'line') {
                          const dataKeys = Object.keys(chartData[0] || {}).filter(k => typeof chartData[0][k] === 'number');
                          const dateKey = Object.keys(chartData[0] || {}).find(k => 
                            k.toLowerCase().includes('date') || 
                            k.toLowerCase().includes('time') || 
                            k.toLowerCase().includes('_id')
                          ) || Object.keys(chartData[0] || {})[0];
                          if (dataKeys.length > 0) {
                            // Форматируем данные для отображения дат
                            const formattedData = chartData.map(item => ({
                              ...item,
                              [dateKey]: formatDate(item[dateKey])
                            }));
                            return (
                              <ChartCard key={key} theme={theme}>
                                <ChartTitle theme={theme}>{formatLabel(key)}</ChartTitle>
                                <ResponsiveContainer width="100%" height={300}>
                                  <LineChart 
                                    data={formattedData} 
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    style={{ outline: 'none' }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} opacity={0.3} />
                                    <XAxis 
                                      dataKey={dateKey}
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
                                    />
                                    <Legend 
                                      wrapperStyle={{ fontSize: '12px', color: theme.colors.secondary }}
                                    />
                                    {dataKeys.slice(0, 5).map((dataKey, idx) => (
                                      <Line 
                                        key={dataKey}
                                        type="monotone" 
                                        dataKey={dataKey} 
                                        stroke={COLORS[idx % COLORS.length]}
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: COLORS[idx % COLORS.length], stroke: 'transparent', strokeWidth: 0 }}
                                        activeDot={{ 
                                          r: 6, 
                                          fill: COLORS[idx % COLORS.length], 
                                          stroke: 'transparent', 
                                          strokeWidth: 0,
                                          style: { outline: 'none' }
                                        }}
                                      />
                                    ))}
                                  </LineChart>
                                </ResponsiveContainer>
                              </ChartCard>
                            );
                          }
                        } else if (type === 'pie') {
                          return (
                            <ChartCard key={key} theme={theme}>
                              <ChartTitle theme={theme}>{formatLabel(key)}</ChartTitle>
                              <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                  <Pie
                                    data={chartData.map((item, idx) => ({
                                      name: typeof item === 'object' ? (item.name || item.label || item.key || `Item ${idx + 1}`) : String(item),
                                      value: typeof item === 'object' ? (item.value || item.count || item.total || 0) : 1
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                                    outerRadius={100}
                                    innerRadius={50}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {chartData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip 
                                    contentStyle={{
                                      backgroundColor: theme.colors.surface,
                                      border: `1px solid ${theme.colors.border}`,
                                      borderRadius: '8px',
                                      color: theme.colors.primary
                                    }}
                                  />
                                  <Legend 
                                    wrapperStyle={{ fontSize: '12px', color: theme.colors.secondary }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </ChartCard>
                          );
                        }
                        return null;
                      })}
                    </ChartsGrid>
                  );
                }
                return null;
              })()}
            </>
          )}
        </ContentWrapper>
      </PageContent>
    </Layout>
  );
};

