import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { ToggleTheme } from './ToggleTheme';
import { useNavigate } from 'react-router-dom';
import { HiUserCircle } from 'react-icons/hi2';
import { useState, useEffect } from 'react';

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserIconButton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.2s ease;
  z-index: 1000;
  border: 1px solid ${({ theme }) => theme.colors.border};

  ${UserMenuContainer}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const MenuItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D'
        ? '#f0f0f0'
        : 'rgba(255,255,255,0.08)'};
  }

  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  transition: all 0.15s ease;
  margin-top: 4px;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D'
        ? 'rgba(239,68,68,0.1)'
        : 'rgba(239,68,68,0.15)'};
    color: #ef4444;
  }
`;

const ThemeSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ThemeLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
`;

const UserField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
`;

const FieldLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  min-width: 100px;
`;

const FieldValue = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.primary};
  text-align: right;
  word-break: break-all;
  max-width: 120px;
`;

const UserLoading = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
`;

const LoadingSpinnerSmall = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const UserError = styled.div`
  color: #E53E3E;
  font-size: 14px;
  padding: 8px 0;
`;

export const UserMenu = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

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
      } else {
        console.error('Ошибка получения данных пользователя');
      }
    } catch (error) {
      console.error('Ошибка сети при получении данных пользователя:', error);
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <UserMenuContainer>
      <UserIconButton theme={theme}>
        <HiUserCircle style={{ fontSize: '24px', color: theme.colors.primary }} />
      </UserIconButton>
      <DropdownMenu theme={theme}>
        {isUserLoading ? (
          <UserLoading theme={theme}>
            <LoadingSpinnerSmall theme={theme} />
            <span>Загрузка...</span>
          </UserLoading>
        ) : userData ? (
          <UserInfo>
            <UserField>
              <FieldLabel theme={theme}>Username:</FieldLabel>
              <FieldValue theme={theme}>{userData.username}</FieldValue>
            </UserField>
            <UserField>
              <FieldLabel theme={theme}>Email:</FieldLabel>
              <FieldValue theme={theme}>{userData.email || 'Не указан'}</FieldValue>
            </UserField>
            <UserField>
              <FieldLabel theme={theme}>Role:</FieldLabel>
              <FieldValue theme={theme}>{userData.role}</FieldValue>
            </UserField>
            <UserField>
              <FieldLabel theme={theme}>Department:</FieldLabel>
              <FieldValue theme={theme}>{userData.department}</FieldValue>
            </UserField>
            <UserField>
              <FieldLabel theme={theme}>Activated:</FieldLabel>
              <FieldValue theme={theme}>{userData.activated ? 'Да' : 'Нет'}</FieldValue>
            </UserField>
            <UserField>
              <FieldLabel theme={theme}>Organization:</FieldLabel>
              <FieldValue theme={theme}>{userData.organization?.name}</FieldValue>
            </UserField>
          </UserInfo>
        ) : (
          <UserError>Ошибка загрузки данных</UserError>
        )}
        <MenuItem theme={theme}>
          <ThemeSection>
            <ThemeLabel theme={theme}>Тема</ThemeLabel>
            <ToggleTheme />
          </ThemeSection>
        </MenuItem>
        <LogoutButton theme={theme} onClick={handleLogout}>
          Выйти
        </LogoutButton>
      </DropdownMenu>
    </UserMenuContainer>
  );
};

