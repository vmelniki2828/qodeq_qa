// Базовый URL для API
export const API_BASE_URL = 'https://qa.qodeq.net';

// Функция для получения токена из куки
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Функция для установки куки
export const setCookie = (name, value, days = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Функция для добавления базового URL к относительным путям API
const getFullUrl = (url) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url; // Уже полный URL
  }
  if (url.startsWith('/api')) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
};

// Флаг для предотвращения множественных одновременных запросов на обновление токена
let isRefreshing = false;
let refreshPromise = null;

/**
 * Обновляет токен через API refresh endpoint
 * @returns {Promise<boolean>} true если токен успешно обновлен, false в противном случае
 */
const refreshToken = async () => {
  // Если уже идет обновление, возвращаем существующий промис
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshTokenFromCookie = getCookie('refresh_token');
      const response = await fetch(`${API_BASE_URL}/api/v1/authorization/token/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: refreshTokenFromCookie ? JSON.stringify({ refresh_token: refreshTokenFromCookie }) : undefined,
      });

      if (!response.ok) {
        // Если refresh не удался, возможно нужно перейти на страницу логина
        console.error('Не удалось обновить токен', response.status);
        return false;
      }

      // Проверяем, есть ли токен в JSON ответе
      let data = {};
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        }
      } catch (e) {
        // Игнорируем ошибку парсинга JSON
      }
      
      // Сохраняем новый токен, если он пришел в ответе
      if (data.access_token) {
        setCookie('rb_admin_token', data.access_token);
      }

      // Проверяем, обновился ли токен в куках (сервер может установить его напрямую через Set-Cookie)
      // Даем небольшую задержку, чтобы куки успели обновиться
      await new Promise(resolve => setTimeout(resolve, 100));
      const newToken = getCookie('rb_admin_token');
      
      // Если токен есть (либо в ответе, либо в куках), считаем обновление успешным
      if (data.access_token || newToken) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('Ошибка при обновлении токена:', error);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Обертка над fetch с автоматическим обновлением токена при 401 ошибке
 * @param {string} url - URL для запроса
 * @param {RequestInit} options - Опции для fetch (method, headers, body и т.д.)
 * @param {boolean} retryOn401 - Повторять ли запрос после обновления токена (по умолчанию true)
 * @returns {Promise<Response>} Ответ от сервера
 */
export const apiFetch = async (url, options = {}, retryOn401 = true) => {
  // Получаем токен из куки
  const token = getCookie('rb_admin_token');
  
  // Добавляем базовый URL к относительным путям
  const fullUrl = getFullUrl(url);
  
  // Подготавливаем заголовки
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Добавляем токен в заголовки, если он есть
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Выполняем запрос
  let response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: options.credentials || 'include',
  });

  // Если получили 401 и разрешено повторять запрос, пытаемся обновить токен
  if (response.status === 401 && retryOn401) {
    console.log('Получен 401, пытаемся обновить токен...');
    const refreshed = await refreshToken();
    
    if (refreshed) {
      // Получаем новый токен
      const newToken = getCookie('rb_admin_token');
      console.log('Токен обновлен, повторяем запрос...', newToken ? 'Токен найден' : 'Токен не найден');
      
      // Обновляем заголовки с новым токеном
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
      }

      // Повторяем оригинальный запрос
      response = await fetch(fullUrl, {
        ...options,
        headers,
        credentials: options.credentials || 'include',
      });
      console.log('Повторный запрос выполнен, статус:', response.status);
    } else {
      console.error('Не удалось обновить токен');
    }
  }

  return response;
};

