import { apiClient } from '../api/client';

export const resultService = {
  submitQuiz: (quizId, answers) => apiClient('/results/submit.php', {
    method: 'POST',
    body: JSON.stringify({ quiz_id: quizId, answers })
  }),
  getResultById: (id) => apiClient(`/results/get.php?id=${id}`),
  getUserHistory: () => apiClient('/results/history.php'),
  getLeaderboard: () => apiClient('/results/leaderboard.php'),
  getAdminResults: (quizId = 0) => apiClient(`/results/admin-list.php${quizId > 0 ? `?quiz_id=${quizId}` : ''}`)
};
