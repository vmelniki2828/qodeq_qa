import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ToggleTheme } from '../components/ToggleTheme';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Функция для установки куки
const setCookie = (name, value, days = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) =>
    theme.colors.background === '#FFFFFF'
      ? '#f5f5f5'
      : theme.colors.surface};
  position: relative;
`;

const ThemeToggleWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Константы для логина и пароля
  const CORRECT_USERNAME = 'f5146e1a-3c5a-4d35-89a1-287e0e4383f3';
  const CORRECT_PASSWORD = 'rADtL4cspJ6g82372_VLfDGtwTgj9g';

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Проверка заполненности полей
    if (!username || !password) {
      Notify.failure('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);

    // Локальная проверка логина и пароля
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
      // Сохраняем токен в куки (можно использовать любой токен для совместимости)
      setCookie('rb_admin_token', 'local_auth_token');
      
      Notify.success('Вход выполнен успешно!');
      setIsLoading(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      Notify.failure('Неверный username или пароль');
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer theme={theme}>
      <ThemeToggleWrapper>
        <ToggleTheme />
      </ThemeToggleWrapper>
      <div
        style={{
          width: '100%',
          maxWidth: '700px',
          padding: '40px',
          backgroundColor: theme.colors.background,
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <h2
          style={{
            marginBottom: '30px',
            textAlign: 'center',
            color: theme.colors.primary,
            fontSize: '28px',
          }}
        >
          Qodeq Payment Panel
        </h2>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="username"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: theme.colors.primary,
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '674px',
                padding: '12px',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '4px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
                backgroundColor: theme.colors.background,
                color: theme.colors.primary,
              }}
              placeholder="Введите username"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: theme.colors.primary,
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '674px',
                padding: '12px',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '4px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
                backgroundColor: theme.colors.background,
                color: theme.colors.primary,
              }}
              placeholder="Введите пароль"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '676px',
              padding: '12px',
              boxSizing: 'content-box',
              backgroundColor: isLoading ? theme.colors.border : theme.colors.primary,
              color: theme.colors.background,
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s, opacity 0.3s',
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => !isLoading && (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => !isLoading && (e.target.style.opacity = '1')}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </LoginContainer>
  );
};

