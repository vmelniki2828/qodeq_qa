import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
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
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [savedEmail, setSavedEmail] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Проверка заполненности полей
    if (!email || !password) {
      Notify.failure('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/authorization/token/login', {
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

      // Если получили 401, переходим ко второму этапу (2FA)
      if (response.status === 401) {
        setSavedEmail(email);
        setShow2FA(true);
        setPassword('');
        setCodeDigits(['', '', '', '', '', '']);
        setIsLoading(false);
        // Фокус на первое поле кода после небольшой задержки
        setTimeout(() => {
          const firstInput = document.getElementById('code-0');
          if (firstInput) {
            firstInput.focus();
          }
        }, 100);
        return;
      }

      // Пытаемся получить JSON только если это не 401
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
          // Сохраняем данные профиля в localStorage
          localStorage.setItem('userProfile', JSON.stringify(profileData));
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

  const handleCodeChange = (index, value) => {
    // Разрешаем только цифры
    const digits = value.replace(/\D/g, '');
    
    // Если вставлено больше одной цифры, распределяем по всем ячейкам
    if (digits.length > 1) {
      const newCodeDigits = [...codeDigits];
      const digitsArray = digits.slice(0, 6).split('');
      digitsArray.forEach((digit, i) => {
        if (i < 6) {
          newCodeDigits[i] = digit;
        }
      });
      setCodeDigits(newCodeDigits);
      // Фокус на последнее заполненное поле или последнее поле
      const lastFilledIndex = Math.min(digitsArray.length - 1, 5);
      setTimeout(() => {
        const nextInput = document.getElementById(`code-${lastFilledIndex}`);
        if (nextInput) {
          nextInput.focus();
        }
      }, 0);
      return;
    }
    
    // Если одна цифра, обрабатываем как обычно
    const digit = digits.slice(0, 1);
    const newCodeDigits = [...codeDigits];
    newCodeDigits[index] = digit;
    setCodeDigits(newCodeDigits);

    // Автоматический переход к следующему полю
    if (digit && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const digits = pastedText.replace(/\D/g, '').slice(0, 6).split('');
    const newCodeDigits = [...codeDigits];
    digits.forEach((digit, i) => {
      if (i < 6) {
        newCodeDigits[i] = digit;
      }
    });
    setCodeDigits(newCodeDigits);
    // Фокус на последнее заполненное поле или последнее поле
    const lastFilledIndex = Math.min(digits.length - 1, 5);
    setTimeout(() => {
      const nextInput = document.getElementById(`code-${lastFilledIndex}`);
      if (nextInput) {
        nextInput.focus();
      }
    }, 0);
  };

  const handleCodeKeyDown = (index, e) => {
    // При нажатии Backspace на пустом поле переходим к предыдущему
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };



  const handleSubmit =  handleLogin;

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

          {!show2FA ? (
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
          ) : (
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: theme.colors.primary,
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Код
              </label>
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                }}
              >
                {codeDigits.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onPaste={handleCodePaste}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    style={{
                      width: '50px',
                      padding: '12px',
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '4px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s',
                      backgroundColor: theme.colors.background,
                      color: theme.colors.primary,
                      textAlign: 'center',
                    }}
                    maxLength={1}
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>
          )}

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
            {isLoading ? (show2FA ? 'Проверка...' : 'Вход...') : (show2FA ? 'Подтвердить' : 'Войти')}
          </button>
        </form>
      </div>
    </LoginContainer>
  );
};

