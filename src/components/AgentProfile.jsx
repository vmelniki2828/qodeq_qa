import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QAAnalytics.css';

export const AgentProfile = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await fetch(`http://185.138.164.88/api/v1/settings/agent/${agentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAgentData(data);
        
      } catch (err) {
        console.error('Ошибка загрузки данных оператора:', err);
        setError('Ошибка загрузки данных оператора');
      } finally {
        setIsLoading(false);
      }
    };

    if (agentId) {
      fetchAgentData();
    }
  }, [agentId]);

  const handleBackToAnalytics = () => {
    navigate('/qa_analytics');
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="qa-analytics">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Загрузка данных оператора...</p>
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
              <button 
                onClick={handleBackToAnalytics}
                style={{
                  background: 'var(--color-bg-panel)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  marginTop: '16px'
                }}
              >
                ← Назад к аналитике
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="qa-analytics">
        <div className="agent-header">
          <button 
            onClick={handleBackToAnalytics}
            className="back-button"
          >
            ← Назад к аналитике
          </button>
        </div>
        
        <div className="analytics-header">
          <h1 className="analytics-title">{agentData?.name || agentData?.agents_name || 'Оператор'}</h1>
          <p className="analytics-subtitle">Информация об операторе</p>
        </div>
        
        <div className="agent-profile">
          <div className="agent-info-card">
            {agentData && (
              <div className="agent-details">
                {/* Основная информация */}
                <div className="info-section">
                  <h3>Основная информация</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Имя:</span>
                      <span className="info-value">{agentData.name || agentData.agents_name || 'Не указано'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{agentData.email || 'Не указано'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Телефон:</span>
                      <span className="info-value">{agentData.phone || 'Не указано'}</span>
                    </div>
                  </div>
                </div>

                {/* Статистика */}
                {(agentData.total_chats || agentData.total_checked || agentData.grade) && (
                  <div className="info-section">
                    <h3>Статистика</h3>
                    <div className="stats-grid">
                      {agentData.total_chats && (
                        <div className="stat-card">
                          <div className="stat-icon">💬</div>
                          <div className="stat-content">
                            <div className="stat-value">{agentData.total_chats}</div>
                            <div className="stat-label">Всего чатов</div>
                          </div>
                        </div>
                      )}
                      {agentData.total_checked && (
                        <div className="stat-card">
                          <div className="stat-icon">✅</div>
                          <div className="stat-content">
                            <div className="stat-value">{agentData.total_checked}</div>
                            <div className="stat-label">Проверено</div>
                          </div>
                        </div>
                      )}
                      {agentData.grade && (
                        <div className="stat-card">
                          <div className="stat-icon">⭐</div>
                          <div className="stat-content">
                            <div className="stat-value">{agentData.grade}</div>
                            <div className="stat-label">Балл</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Дополнительная информация */}
                <div className="info-section">
                  <h3>Дополнительная информация</h3>
                  <div className="info-grid">
                    {Object.entries(agentData).map(([key, value]) => {
                      // Пропускаем уже отображенные поля
                      if (['name', 'agents_name', 'id', 'agents_id', 'email', 'phone', 'total_chats', 'total_checked', 'grade'].includes(key)) {
                        return null;
                      }
                      
                      return (
                        <div key={key} className="info-item">
                          <span className="info-label">{key}:</span>
                          <span className="info-value">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
