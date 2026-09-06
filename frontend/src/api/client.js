const API_BASE_URL = 'http://localhost/quiz-app/backend/api';

const TOKEN_KEY = 'quiz_app_token';
const USER_KEY = 'quiz_app_user';

let inMemoryToken = typeof window !== 'undefined'
  ? (localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY))
  : null;
let onUnauthorizedCallback = () => {};

export const setAuthToken = (token) => {
  inMemoryToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
  }
};

export const getAuthToken = () => {
  if (!inMemoryToken && typeof window !== 'undefined') {
    inMemoryToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }
  return inMemoryToken;
};

export const setOnUnauthorized = (fn) => {
  onUnauthorizedCallback = fn;
};

export const apiClient = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (response.status === 401) {
      onUnauthorizedCallback();
    }

    if (!response.ok || !data) {
      return {
        success: false,
        data: null,
        error: data?.error || `Request failed with status ${response.status}`
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message || 'Network request failed'
    };
  }
};
