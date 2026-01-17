import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarStyled = styled.aside`
  width: 186px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 16px 12px;
`;

const Nav = styled.nav`
  flex: 1;
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

const ModelsButton = styled.div`
  padding: 10px 14px;
  margin: 2px 0;
  border-radius: 6px;
  cursor: pointer;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.15s ease;
  font-size: 14px;
  font-weight: 400;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D'
        ? '#f8f8f8'
        : 'rgba(255,255,255,0.04)'};
  }
`;

const ModelsButtonText = styled.span`
  display: flex;
  align-items: center;
`;

const ModelsDropdown = styled.div`
  margin-left: 14px;
  margin-top: 4px;
  margin-bottom: 4px;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const ModelsItem = styled.div`
  padding: 8px 14px;
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
  font-size: 13px;
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

const menuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Playground', path: '/playground' },
  { label: 'System', path: '/system' },
  { label: 'Telegram Tools', path: '/telegram-tools' },
  { label: 'OpenAI Stats', path: '/openai-stats' },
];

const models = [
  { label: 'Users', path: '/models/users' },
  { label: 'Payments', path: '/models/payments' },
  { label: 'Payment Aliases', path: '/models/payment-aliases' },
  { label: 'Ping Data', path: '/models/ping-data' },
  { label: 'Chats', path: '/models/chats' },
  { label: 'Message Templates', path: '/models/message-templates' },
  { label: 'Tickets', path: '/models/tickets' },
  { label: 'Events', path: '/models/events' },
  { label: 'Ticket Data', path: '/models/ticket-data' },
  { label: 'OCR Results', path: '/models/ocr-results' },
  { label: 'Gateways', path: '/models/gateways' },
  { label: 'Projects', path: '/models/projects' },
  { label: 'Tags', path: '/models/tags' },
  { label: 'Teams', path: '/models/teams' },
];

export const Sidebar = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModelsOpen, setIsModelsOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleModels = () => {
    setIsModelsOpen(!isModelsOpen);
  };

  // Автоматически открывать список Models, если текущая страница находится в списке Models
  useEffect(() => {
    const isModelsPage = models.some((model) => 
      location.pathname === model.path || location.pathname.startsWith(model.path + '/')
    );
    if (isModelsPage) {
      setIsModelsOpen(true);
    }
  }, [location.pathname]);

  return (
    <SidebarStyled theme={theme}>
      <Nav>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <MenuItem
              key={item.path}
              $active={active}
              theme={theme}
              onClick={() => navigate(item.path)}
            >
              <span>{item.label}</span>
            </MenuItem>
          );
        })}
        
        <ModelsButton theme={theme} onClick={toggleModels}>
          <ModelsButtonText>
            <span>Models</span>
          </ModelsButtonText>
        </ModelsButton>

        <ModelsDropdown $isOpen={isModelsOpen}>
          {models.map((model) => {
            const active = isActive(model.path);
            return (
              <ModelsItem
                key={model.path}
                $active={active}
                theme={theme}
                onClick={() => navigate(model.path)}
              >
                {model.label}
              </ModelsItem>
            );
          })}
        </ModelsDropdown>
      </Nav>
    </SidebarStyled>
  );
};

