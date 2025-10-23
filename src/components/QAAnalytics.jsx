import React, { useState, useEffect } from 'react';
import './QAAnalytics.css';

export const QAAnalytics = () => {
  const [statisticsData, setStatisticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch('http://185.138.164.88/api/v1/chat/statistics/?checked=true', {
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
  }, []);

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

  return (
    <div className="page-content">
      <div className="qa-analytics">
        <div className="analytics-header">
          <h1 className="analytics-title">Аналитика</h1>
          <p className="analytics-subtitle">Статистика и отчеты по тестированию</p>
        </div>
        
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
                  <div key={agent.agents_id || index} className="operator-item">
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
        </div>
      </div>
    </div>
  );
};
