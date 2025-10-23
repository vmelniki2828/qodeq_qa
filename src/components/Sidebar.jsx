import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  UserOutlined, 
  BarChartOutlined, 
  MessageOutlined, 
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  ApiOutlined,
  ProjectOutlined,
  TeamOutlined,
  TagsOutlined
} from '@ant-design/icons';
import './Sidebar.css';

export const Sidebar = ({ onCollapseChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSettings, setExpandedSettings] = useState(false);

  const menuItems = [
    { id: 'qa_main', icon: UserOutlined, label: 'Профиль', path: '/qa_main' },
    { id: 'qa_analytics', icon: BarChartOutlined, label: 'Аналитика', path: '/qa_analytics' },
    { id: 'qa_chats', icon: MessageOutlined, label: 'Чаты', path: '/qa_chats' },
    { 
      id: 'qa_settings', 
      icon: SettingOutlined, 
      label: 'Настройки', 
      path: '/qa_settings',
      hasSubmenu: true,
      submenu: [
        { id: 'settings_main', icon: HomeOutlined, label: 'Главная', path: '/qa_settings' },
        { id: 'settings_integrations', icon: ApiOutlined, label: 'Интеграции', path: '/qa_settings/integrations' },
        { id: 'settings_projects', icon: ProjectOutlined, label: 'Проекты', path: '/qa_settings/projects' },
        { id: 'settings_agents', icon: TeamOutlined, label: 'Агенты', path: '/qa_settings/agents' },
        { id: 'settings_tags', icon: TagsOutlined, label: 'Теги', path: '/qa_settings/tags' }
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  const toggleSettingsSubmenu = () => {
    setExpandedSettings(!expandedSettings);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">◉</span>
          {!isCollapsed && <span className="logo-text">QODEQ QA</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map(item => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path || 
              (item.hasSubmenu && item.submenu.some(sub => location.pathname === sub.path));
            
            return (
              <li key={item.id} className="nav-item">
                <button 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleSettingsSubmenu();
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                >
                  <span className="nav-icon">
                    <IconComponent />
                  </span>
                  {!isCollapsed && <span className="nav-text">{item.label}</span>}
                </button>
                
                {/* Подменю для настроек */}
                {item.hasSubmenu && !isCollapsed && expandedSettings && (
                  <ul className="submenu">
                    {item.submenu.map(subItem => {
                      const SubIconComponent = subItem.icon;
                      return (
                        <li key={subItem.id} className="submenu-item">
                          <button 
                            className={`submenu-link ${location.pathname === subItem.path ? 'active' : ''}`}
                            onClick={() => handleNavigation(subItem.path)}
                          >
                            <span className="submenu-icon">
                              <SubIconComponent />
                            </span>
                            <span className="submenu-text">{subItem.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="collapse-btn" onClick={toggleCollapse}>
          {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>
    </div>
  );
};