import { apiClient } from '../api/client';

export const authService = {
  login: (email, password) => apiClient('/auth/login.php', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password, confirmPassword) => apiClient('/auth/register.php', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, confirm_password: confirmPassword })
  }),
  logout: () => apiClient('/auth/logout.php', { method: 'POST' }),
  getMe: () => apiClient('/auth/me.php')
};
