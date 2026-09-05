const API_BASE_URL = 'http://localhost/quiz-app/backend/api';

let inMemoryToken = typeof window !== 'undefined' ? sessionStorage.getItem('quiz_app_token') : null;
let onUnauthorizedCallback = () => {};

export const setAuthToken = (token) => {
  inMemoryToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem('quiz_app_token', token);
    } else {
      sessionStorage.removeItem('quiz_app_token');
    }
  }
};

export const getAuthToken = () => inMemoryToken;

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
