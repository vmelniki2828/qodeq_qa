import React, { useState, useEffect } from 'react';
import './QAMain.css';

export const QAMain = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(
        'http://185.138.164.88/api/v1/profile/user/dashboard',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        console.log('Данные дашборда:', data);
      } else {
        const errorData = await response.json();
        console.error('Ошибка получения данных:', errorData);
        setError('Ошибка загрузки данных дашборда');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="qa-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Дашборд</h1>
            <p className="dashboard-subtitle">Обзор системы и статистика</p>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Загрузка дашборда...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="qa-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Дашборд</h1>
            <p className="dashboard-subtitle">Обзор системы и статистика</p>
          </div>
          <div className="error-container">
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <h3>Ошибка загрузки</h3>
              <p>{error}</p>
              <button onClick={fetchDashboardData} className="retry-button">
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="qa-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Дашборд</h1>
          <p className="dashboard-subtitle">Обзор системы и статистика</p>
          <button className="create-button">
            <span className="create-icon">+</span>
            Create
          </button>
        </div>

        {dashboardData && (
          <div className="dashboard-grid">
            {/* Статистические карточки */}
            {dashboardData.analytics && (
              <div className="stats-section">
                <h2 className="section-title">Статистика</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">💬</div>
                    <div className="stat-content">
                      <div className="stat-value">{dashboardData.analytics.total_chats}</div>
                      <div className="stat-label">Всего чатов</div>
                      <div className="stat-footer">Template</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                      <div className="stat-value">{dashboardData.analytics.average_rating}%</div>
                      <div className="stat-label">Средний рейтинг</div>
                      <div className="stat-footer">Template</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🤖</div>
                    <div className="stat-content">
                      <div className="stat-value">{dashboardData.analytics.active_agents}</div>
                      <div className="stat-label">Активные агенты</div>
                      <div className="stat-footer">Template</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Интеграции */}
            {dashboardData.integrations && (
              <div className="integrations-section">
                <h2 className="section-title">Интеграции</h2>
                <div className="integrations-list">
                  {dashboardData.integrations.map((integration, index) => (
                    <div key={index} className="integration-item">
                      <div className="integration-status">
                        <div className={`status-dot ${integration.status}`}></div>
                        <span className="status-text">
                          {integration.status === 'enabled' ? 'Активна' : 'Отключена'}
                        </span>
                      </div>
                      <div className="integration-name">{integration.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Предупреждения */}
            {dashboardData.errors && dashboardData.errors.length > 0 && (
              <div className="warnings-section">
                <h2 className="section-title">Предупреждения</h2>
                <div className="warnings-list">
                  {dashboardData.errors.map((error, index) => (
                    <div key={index} className="warning-item">
                      <div className="warning-icon">⚠️</div>
                      <div className="warning-content">
                        <div className="warning-message">{error.message}</div>
                        <div className="warning-meta">
                          <span className="warning-type">{error.type}</span>
                          <span className="warning-time">
                            {new Date(error.timestamp).toLocaleString('ru-RU')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
