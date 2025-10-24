import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from './Calendar';
import './QAAnalytics.css';
import {
  ActiveFilters,
  ActiveFiltersLabel,
  ActiveFiltersList,
  ActiveFilterItem,
  ActiveFilterText,
  RemoveFilterBtn,
  FiltersTriggerBtn,
  FilterIcon,
  SlideoutFilters,
  SlideoutContent,
  SlideoutHeader,
  CloseFiltersBtn,
  DateFiltersRow,
  FilterGroup,
  FilterLabel,
  FilterActions,
  ApplyFiltersBtn,
  ClearFiltersBtn
} from '../styles/QAChats.styled';

export const QAAnalytics = () => {
  const navigate = useNavigate();
  const [statisticsData, setStatisticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    createdFrom: '',
    createdTo: ''
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Формируем URL с параметрами дат
        let url = 'http://185.138.164.88/api/v1/chat/statistics/?checked=true';
        
        if (filters.createdFrom) {
          url += `&date_start=${filters.createdFrom}`;
        }
        
        if (filters.createdTo) {
          url += `&date_end=${filters.createdTo}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStatisticsData(data);
      } catch (err) {
        console.error('Ошибка загрузки статистики:', err);
        setError('Ошибка загрузки данных статистики');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [filters.createdFrom, filters.createdTo]);

  const handleOperatorClick = (agentId) => {
    navigate(`/agent/${agentId}`);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      createdFrom: '',
      createdTo: ''
    });
  };

  const handleCalendarOpen = (calendarType) => {
    setOpenCalendar(calendarType);
  };

  const handleCalendarClose = () => {
    setOpenCalendar(null);
  };

  const applyFilters = () => {
    // Фильтры применяются автоматически через useEffect при изменении filters.createdFrom и filters.createdTo
    setIsFiltersOpen(false);
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="qa-analytics">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Загрузка статистики...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="qa-analytics">
          <div className="error-container">
            <div className="error-message">
              <h3>Ошибка загрузки</h3>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Проверяем, есть ли данные для отображения
  const hasData = statisticsData && (
    statisticsData.agents?.length > 0 ||
    statisticsData.aggregate?.count_chats > 0 ||
    statisticsData.aggregate?.average_score > 0 ||
    statisticsData.aggregate?.count_errors > 0 ||
    statisticsData.aggregate?.top_questions?.length > 0 ||
    statisticsData.aggregate?.top_tags?.length > 0
  );

  if (!hasData) {
    return (
      <div className="page-content">
        <div className="qa-analytics">
          <div className="analytics-header">
            <h1 className="analytics-title">Аналитика</h1>
            <p className="analytics-subtitle">Статистика по чатам и операторам</p>
            
            <div className="filters-section">
              {Object.values(filters).filter(value => value !== '').length > 0 && (
                <ActiveFilters>
                  <ActiveFiltersLabel>Активные фильтры:</ActiveFiltersLabel>
                  <ActiveFiltersList>
                    {filters.createdFrom && (
                      <ActiveFilterItem>
                        <ActiveFilterText>От: {filters.createdFrom}</ActiveFilterText>
                        <RemoveFilterBtn onClick={() => handleFilterChange('createdFrom', '')}>×</RemoveFilterBtn>
                      </ActiveFilterItem>
                    )}
                    {filters.createdTo && (
                      <ActiveFilterItem>
                        <ActiveFilterText>До: {filters.createdTo}</ActiveFilterText>
                        <RemoveFilterBtn onClick={() => handleFilterChange('createdTo', '')}>×</RemoveFilterBtn>
                      </ActiveFilterItem>
                    )}
                  </ActiveFiltersList>
                </ActiveFilters>
              )}
            </div>
            
            <FiltersTriggerBtn onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
              <FilterIcon>🔍</FilterIcon>
            </FiltersTriggerBtn>
            
            <SlideoutFilters isOpen={isFiltersOpen}>
              <SlideoutContent>
                <SlideoutHeader>
                  <h3>Filters</h3>
                  <CloseFiltersBtn onClick={() => setIsFiltersOpen(false)}>×</CloseFiltersBtn>
                </SlideoutHeader>
                
                <DateFiltersRow>
                  <FilterGroup>
                    <FilterLabel>От:</FilterLabel>
                    <Calendar
                      value={filters.createdFrom}
                      onChange={(value) => handleFilterChange('createdFrom', value)}
                      placeholder="Выберите начальную дату"
                      isOpen={openCalendar === 'createdFrom'}
                      onOpen={() => handleCalendarOpen('createdFrom')}
                      onClose={handleCalendarClose}
                      minDate={new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)}
                      maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
                    />
                  </FilterGroup>
                  
                  <FilterGroup>
                    <FilterLabel>До:</FilterLabel>
                    <Calendar
                      value={filters.createdTo}
                      onChange={(value) => handleFilterChange('createdTo', value)}
                      placeholder="Выберите конечную дату"
                      isOpen={openCalendar === 'createdTo'}
                      onOpen={() => handleCalendarOpen('createdTo')}
                      onClose={handleCalendarClose}
                      minDate={new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)}
                      maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
                    />
                  </FilterGroup>
                </DateFiltersRow>
                
                <FilterActions>
                  <ClearFiltersBtn onClick={clearFilters}>
                    Очистить все
                  </ClearFiltersBtn>
                  <ApplyFiltersBtn onClick={applyFilters}>
                    Применить
                  </ApplyFiltersBtn>
                </FilterActions>
              </SlideoutContent>
            </SlideoutFilters>
          </div>
          
          <div className="no-data-container">
            <div className="no-data-message">
              <h2>Данные отсутствуют</h2>
              <p>За выбранный период нет данных для отображения</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="qa-analytics">
        <div className="analytics-header">
          <h1 className="analytics-title">Аналитика</h1>
          <p className="analytics-subtitle">Статистика и отчеты по тестированию</p>
          
          {/* Отображение активных фильтров */}
          {Object.values(filters).filter(value => value !== '').length > 0 && (
            <ActiveFilters>
              <ActiveFiltersLabel>Активные фильтры:</ActiveFiltersLabel>
              <ActiveFiltersList>
                {filters.createdFrom && (
                  <ActiveFilterItem>
                    <ActiveFilterText>С: {new Date(filters.createdFrom).toLocaleDateString('ru-RU')}</ActiveFilterText>
                    <RemoveFilterBtn onClick={() => handleFilterChange('createdFrom', '')}>×</RemoveFilterBtn>
                  </ActiveFilterItem>
                )}
                {filters.createdTo && (
                  <ActiveFilterItem>
                    <ActiveFilterText>По: {new Date(filters.createdTo).toLocaleDateString('ru-RU')}</ActiveFilterText>
                    <RemoveFilterBtn onClick={() => handleFilterChange('createdTo', '')}>×</RemoveFilterBtn>
                  </ActiveFilterItem>
                )}
              </ActiveFiltersList>
            </ActiveFilters>
          )}
        </div>
        
        <FiltersTriggerBtn onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
          <FilterIcon>🔍</FilterIcon>
        </FiltersTriggerBtn>
        
        <SlideoutFilters isOpen={isFiltersOpen}>
          <SlideoutContent>
            <SlideoutHeader>
              <h3>Filters</h3>
              <CloseFiltersBtn onClick={() => setIsFiltersOpen(false)}>
                ×
              </CloseFiltersBtn>
            </SlideoutHeader>
            
            <div className="slideout-body">
              <DateFiltersRow>
                <FilterGroup>
                  <FilterLabel>От:</FilterLabel>
                  <Calendar
                    value={filters.createdFrom}
                    onChange={(value) => handleFilterChange('createdFrom', value)}
                    placeholder="Выберите начальную дату"
                    isOpen={openCalendar === 'createdFrom'}
                    onOpen={() => handleCalendarOpen('createdFrom')}
                    onClose={handleCalendarClose}
                    minDate={new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)}
                    maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
                  />
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>До:</FilterLabel>
                  <Calendar
                    value={filters.createdTo}
                    onChange={(value) => handleFilterChange('createdTo', value)}
                    placeholder="Выберите конечную дату"
                    isOpen={openCalendar === 'createdTo'}
                    onOpen={() => handleCalendarOpen('createdTo')}
                    onClose={handleCalendarClose}
                    minDate={new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)}
                    maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
                  />
                </FilterGroup>
              </DateFiltersRow>
            </div>

            <FilterActions>
              <ClearFiltersBtn onClick={clearFilters}>
                Очистить все
              </ClearFiltersBtn>
              <ApplyFiltersBtn onClick={applyFilters}>
                Применить
              </ApplyFiltersBtn>
            </FilterActions>
          </SlideoutContent>
        </SlideoutFilters>
        
        <div className="analytics-grid">
          {/* Общая статистика */}
          <div className="stats-section">
            <h2 className="section-title">Общая статистика</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <div className="stat-value">{statisticsData?.aggregate?.count_chats || 0}</div>
                  <div className="stat-label">Всего чатов</div>
                  <div className="stat-footer">Template</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-value">{statisticsData?.aggregate?.average_score?.toFixed(1) || 0}</div>
                  <div className="stat-label">Средний балл</div>
                  <div className="stat-footer">Template</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚠️</div>
                <div className="stat-content">
                  <div className="stat-value">{statisticsData?.aggregate?.count_errors || 0}</div>
                  <div className="stat-label">Количество ошибок</div>
                  <div className="stat-footer">Template</div>
                </div>
              </div>
            </div>
          </div>

          {/* Операторы */}
          {statisticsData?.agents && statisticsData.agents.length > 0 && (
            <div className="operators-section">
              <h2 className="section-title">Операторы</h2>
              <div className="operators-list">
                {statisticsData.agents.map((agent, index) => (
                  <div 
                    key={agent.agents_id || index} 
                    className="operator-item"
                    onClick={() => handleOperatorClick(agent.agents_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="operator-info">
                      <div className="operator-name">{agent.agents_name}</div>
                      <div className="operator-supervisor">{agent.head || 'Нет Руководителя'}</div>
                    </div>
                    <div className="operator-stats">
                      <div className="operator-stat">
                        <div className="operator-stat-value">{agent.total_chats || 0}</div>
                        <div className="operator-stat-label">Всего чатов</div>
                      </div>
                      <div className="operator-stat">
                        <div className="operator-stat-value">{agent.total_checked || 0}</div>
                        <div className="operator-stat-label">Проверено</div>
                      </div>
                      <div className="operator-stat">
                        <div className="operator-stat-value">{agent.grade || 0}</div>
                        <div className="operator-stat-label">Балл</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Топ вопросов */}
          {statisticsData?.aggregate?.top_questions && statisticsData.aggregate.top_questions.length > 0 && (
            <div className="questions-section">
              <h2 className="section-title">Топ вопросов с нарушениями</h2>
              <div className="questions-list">
                {statisticsData.aggregate.top_questions.map((question, index) => (
                  <div key={question.id || index} className="question-item">
                    <div className="question-number">{index + 1}</div>
                    <div className="question-text">{question.text}</div>
                    <div className="question-violations">{question.violations} нарушений</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Топ тегов */}
          {statisticsData?.aggregate?.top_tags && statisticsData.aggregate.top_tags.length > 0 && (
            <div className="tags-section">
              <h2 className="section-title">Топ тегов</h2>
              <div className="tags-list">
                {statisticsData.aggregate.top_tags.map((tag, index) => (
                  <div key={index} className="tag-item">
                    <div className="tag-name" style={{ color: tag.color }}>
                      {tag.tag}
                    </div>
                    <div className="tag-count">{tag.count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
