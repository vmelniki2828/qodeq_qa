import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ToggleTheme } from '../components/ToggleTheme';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Разрешённые учётные данные (авторизация только по ним)
const ALLOWED_LOGIN = 'f5146e1a-3c5a-4d35-89a1-287e0e4383f3';
const ALLOWED_PASSWORD = 'rADtL4cspJ6g82372_VLfDGtwTgj9g';

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

  const handleLogin = (e) => {
    e.preventDefault();

    // Проверка заполненности полей
    if (!username || !password) {
      Notify.failure('Пожалуйста, заполните все поля');
      return;
    }

    // Авторизация только по указанным логину и паролю
    if (username !== ALLOWED_LOGIN || password !== ALLOWED_PASSWORD) {
      Notify.failure('Неверный логин или пароль');
      return;
    }

    setIsLoading(true);
    Notify.success('Вход выполнен успешно!');
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 500);
  };

  return (
    <LoginContainer theme={theme}>
      <ThemeToggleWrapper>
        <ToggleTheme />
      </ThemeToggleWrapper>
      <div
        style={{
          width: '700px',
          padding: '40px',
          boxSizing: 'border-box',
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
          Qodeq QA
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
                width: '100%',
                boxSizing: 'border-box',
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
                width: '100%',
                boxSizing: 'border-box',
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
              width: '100%',
              padding: '12px',
              boxSizing: 'border-box',
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

