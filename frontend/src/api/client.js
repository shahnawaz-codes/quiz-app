const API_BASE_URL = 'http://localhost/quiz-app/backend/api';

let onUnauthorizedCallback = () => {};

export const setOnUnauthorized = (fn) => {
  onUnauthorizedCallback = fn;
};

export const apiClient = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
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
