import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const SidebarStyled = styled.aside`
  width: 210px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 16px 12px;
  box-sizing: border-box;
`;

const Nav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 0;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-bottom: 2px;
`;

const MenuItem = styled.div`
  padding: 10px 14px;
  margin: 2px 0;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${({ $active, theme }) =>
    $active
      ? theme.colors.primary === '#0D0D0D'
        ? '#f0f0f0'
        : 'rgba(255,255,255,0.08)'
      : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.secondary};
  display: flex;
  align-items: center;
  transition: all 0.15s ease;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '500' : '400')};

  &:hover {
    background-color: ${({ $active, theme }) =>
      !$active
        ? theme.colors.primary === '#0D0D0D'
          ? '#f8f8f8'
          : 'rgba(255,255,255,0.04)'
        : null};
  }
`;

const MenuText = styled.span``;

const Submenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-left: 20px;
  margin-top: 4px;
  display: ${({ $expanded }) => ($expanded ? 'block' : 'none')};
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SubmenuItem = styled.li`
  margin-bottom: 2px;
`;

const SubmenuLink = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${({ $active, theme }) =>
    $active
      ? theme.colors.primary === '#0D0D0D'
        ? '#f0f0f0'
        : 'rgba(255,255,255,0.08)'
      : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.secondary};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? '500' : '400')};
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ $active, theme }) =>
      !$active
        ? theme.colors.primary === '#0D0D0D'
          ? '#f8f8f8'
          : 'rgba(255,255,255,0.04)'
        : null};
  }
`;

const SubmenuText = styled.span`
  font-size: 13px;
`;

export const Sidebar = ({ onCollapseChange }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSettings, setExpandedSettings] = useState(false);

  const menuItems = [
    { id: 'qa_main', label: 'Профиль', path: '/qa_main' },
    { id: 'qa_analytics', label: 'Аналитика', path: '/qa_analytics' },
    { id: 'qa_chats', label: 'Чаты', path: '/qa_chats' },
    { 
      id: 'qa_settings', 
      label: 'Настройки', 
      path: '/qa_settings',
      hasSubmenu: true,
      submenu: [
        { id: 'settings_main', label: 'Главная', path: '/qa_settings' },
        { id: 'settings_integrations', label: 'Интеграции', path: '/qa_settings/integrations' },
        { id: 'settings_projects', label: 'Проекты', path: '/qa_settings/projects' },
        { id: 'settings_agents', label: 'Агенты', path: '/qa_settings/agents' },
        { id: 'settings_tags', label: 'Теги', path: '/qa_settings/tags' }
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSettingsSubmenu = () => {
    setExpandedSettings(!expandedSettings);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <SidebarStyled theme={theme}>
      <Nav>
        <NavList>
          {menuItems.map(item => {
            const active = isActive(item.path) || 
              (item.hasSubmenu && item.submenu.some(sub => isActive(sub.path)));
            
            return (
              <NavItem key={item.id}>
                <MenuItem
                  $active={active}
                  theme={theme}
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleSettingsSubmenu();
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                >
                  <MenuText>{item.label}</MenuText>
                </MenuItem>
                
                {item.hasSubmenu && (
                  <Submenu $expanded={expandedSettings}>
                    {item.submenu.map(subItem => {
                      const subActive = isActive(subItem.path);
                      return (
                        <SubmenuItem key={subItem.id}>
                          <SubmenuLink
                            $active={subActive}
                            theme={theme}
                            onClick={() => handleNavigation(subItem.path)}
                          >
                            <SubmenuText>{subItem.label}</SubmenuText>
                          </SubmenuLink>
                        </SubmenuItem>
                      );
                    })}
                  </Submenu>
                )}
              </NavItem>
            );
          })}
        </NavList>
      </Nav>

    </SidebarStyled>
  );
};
