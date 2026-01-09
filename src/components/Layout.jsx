import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import './Layout.css';

export const Layout = ({ children }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isUserMenuClosing, setIsUserMenuClosing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentChildren, setCurrentChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname) {
      // Просто обновляем контент без анимаций исчезновения/появления
      setCurrentChildren(children);
    }
  }, [location.pathname, children]);

  // Загрузка данных пользователя при инициализации
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsUserLoading(true);
      const response = await fetch('http://185.138.164.88/api/v1/profile/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        console.log('Данные пользователя:', data);
      } else {
        console.error('Ошибка получения данных пользователя');
      }
    } catch (error) {
      console.error('Ошибка сети при получении данных пользователя:', error);
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleSidebarCollapseChange = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleUserMenuToggle = () => {
    if (isUserMenuOpen) {
      setIsUserMenuClosing(true);
      setTimeout(() => {
        setIsUserMenuOpen(false);
        setIsUserMenuClosing(false);
      }, 300);
    } else {
      setIsUserMenuOpen(true);
    }
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.operator-avatar') && !event.target.closest('.user-menu')) {
        setIsUserMenuClosing(true);
        setTimeout(() => {
          setIsUserMenuOpen(false);
          setIsUserMenuClosing(false);
        }, 300);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <div className="layout">
      <Sidebar onCollapseChange={handleSidebarCollapseChange} />
      <div className={`layout-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="layout-header">
          <div className="operator-avatar" onClick={handleUserMenuToggle}>
            {!userData ? (
              <div className="avatar-loading-spinner"></div>
            ) : (
              <span className="operator-letter">
                {userData.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          {isUserMenuOpen && (
            <div className={`user-menu ${isUserMenuClosing ? 'closing' : ''}`}>
              <div className="user-menu-content">
                {isUserLoading ? (
                  <div className="user-loading">
                    <div className="loading-spinner-small"></div>
                    <span>Загрузка...</span>
                  </div>
                ) : userData ? (
                  <div className="user-info">
                    <div className="user-field">
                      <span className="field-label">Username:</span>
                      <span className="field-value">{userData.username}</span>
                    </div>
                    <div className="user-field">
                      <span className="field-label">Email:</span>
                      <span className="field-value">{userData.email || 'Не указан'}</span>
                    </div>
                    <div className="user-field">
                      <span className="field-label">Role:</span>
                      <span className="field-value">{userData.role}</span>
                    </div>
                    <div className="user-field">
                      <span className="field-label">Department:</span>
                      <span className="field-value">{userData.department}</span>
                    </div>
                    <div className="user-field">
                      <span className="field-label">Activated:</span>
                      <span className="field-value">{userData.activated ? 'Да' : 'Нет'}</span>
                    </div>
                    <div className="user-field">
                      <span className="field-label">Organization Name:</span>
                      <span className="field-value">{userData.organization?.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="user-error">Ошибка загрузки данных</div>
                )}
              </div>
            </div>
          )}
        </header>
        <div className="content-wrapper">
          {currentChildren}
        </div>
      </div>
    </div>
  );
};

