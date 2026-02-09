import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { ToggleTheme } from '../components/ToggleTheme';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { apiFetch, getCookie, setCookie } from '../utils/api';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { loadProfile } = useUserProfile();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Проверка заполненности полей
    if (!email || !password) {
      Notify.failure('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://qa.qodeq.net/api/v1/authorization/token/login', {
        method: 'POST',
        credentials: 'include',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Пытаемся получить JSON
      let data = {};
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        }
      } catch (e) {
        // Игнорируем ошибку парсинга JSON
      }

      if (!response.ok) {
        Notify.failure(data.message || 'Неверный email или пароль');
        setIsLoading(false);
        return;
      }

      // Сохраняем access_token в куки, если он есть в ответе
      if (data.access_token) {
        setCookie('rb_admin_token', data.access_token);
      }

      // Загружаем данные профиля пользователя
      try {
        const profileResponse = await apiFetch('/api/v1/profile/user/me', {
          method: 'GET',
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          localStorage.setItem('userProfile', JSON.stringify(profileData));
          await loadProfile();
        }
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
        // Не блокируем вход, если не удалось загрузить профиль
      }

      // Если запрос успешен (не 401), переходим сразу на dashboard
      Notify.success('Вход выполнен успешно!');
      setIsLoading(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      console.error('Ошибка при входе:', error);
      Notify.failure('Произошла ошибка при входе. Попробуйте позже.');
      setIsLoading(false);
    }
  };

  const handleSubmit = handleLogin;

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
          Qodeq QA
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: theme.colors.primary,
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Введите email"
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
              name="password"
              autoComplete="on"
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

