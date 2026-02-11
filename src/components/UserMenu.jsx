import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { ToggleTheme } from './ToggleTheme';
import { useNavigate } from 'react-router-dom';
import { HiUserCircle } from 'react-icons/hi2';
import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

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

const ProfileLinkText = styled.span`
  color: #ACACAC;
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
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 8px;
`;

const UserInfoItem = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const UserInfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 500;
  margin-right: 6px;
`;

const UserInfoValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

export const UserMenu = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      // Сначала пытаемся загрузить из localStorage
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          setUserProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error('Ошибка при парсинге сохраненного профиля:', e);
        }
      }

      // Затем обновляем данные с сервера
      try {
        const response = await apiFetch('/api/v1/profile/user/me', {
          method: 'GET',
        });

        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData);
          localStorage.setItem('userProfile', JSON.stringify(profileData));
        }
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      }
    };

    loadUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userProfile');
    navigate('/login');
  };

  return (
    <UserMenuContainer>
      <UserIconButton theme={theme}>
        <HiUserCircle style={{ fontSize: '24px', color: theme.colors.primary }} />
      </UserIconButton>
      <DropdownMenu theme={theme}>
        {userProfile && (
          <UserInfo theme={theme}>
            {userProfile.username && (
              <UserInfoItem theme={theme}>
                <UserInfoLabel theme={theme}>Имя:</UserInfoLabel>
                <UserInfoValue theme={theme}>{userProfile.username}</UserInfoValue>
              </UserInfoItem>
            )}
            {userProfile.email && (
              <UserInfoItem theme={theme}>
                <UserInfoLabel theme={theme}>Email:</UserInfoLabel>
                <UserInfoValue theme={theme}>{userProfile.email}</UserInfoValue>
              </UserInfoItem>
            )}
            {userProfile.role && (
              <UserInfoItem theme={theme}>
                <UserInfoLabel theme={theme}>Роль:</UserInfoLabel>
                <UserInfoValue theme={theme}>{userProfile.role}</UserInfoValue>
              </UserInfoItem>
            )}
            {userProfile.department && (
              <UserInfoItem theme={theme}>
                <UserInfoLabel theme={theme}>Отдел:</UserInfoLabel>
                <UserInfoValue theme={theme}>{userProfile.department}</UserInfoValue>
              </UserInfoItem>
            )}
          </UserInfo>
        )}
        <MenuItem theme={theme} onClick={() => navigate('/profile')} role="button">
          <ProfileLinkText>Профиль</ProfileLinkText>
        </MenuItem>
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


