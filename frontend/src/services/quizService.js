import { apiClient } from '../api/client';

export const quizService = {
  getQuizzes: () => apiClient('/quizzes/list.php'),
  getQuizById: (id) => apiClient(`/quizzes/get.php?id=${id}`),
  createQuiz: (title, description) => apiClient('/quizzes/create.php', {
    method: 'POST',
    body: JSON.stringify({ title, description })
  }),
  updateQuiz: (id, title, description) => apiClient('/quizzes/update.php', {
    method: 'POST',
    body: JSON.stringify({ id, title, description })
  }),
  deleteQuiz: (id) => apiClient('/quizzes/delete.php', {
    method: 'POST',
    body: JSON.stringify({ id })
  }),

  // Questions
  getQuestionsByQuiz: (quizId) => apiClient(`/questions/list.php?quiz_id=${quizId}`),
  createQuestion: (data) => apiClient('/questions/create.php', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateQuestion: (data) => apiClient('/questions/update.php', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteQuestion: (id) => apiClient('/questions/delete.php', {
    method: 'POST',
    body: JSON.stringify({ id })
  })
};
