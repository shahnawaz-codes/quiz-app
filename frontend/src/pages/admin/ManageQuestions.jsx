import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageQuestions = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form State
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('a');
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError('');
    const res = await apiClient(`/questions/list.php?quiz_id=${quizId}`);
    if (res.success && res.data) {
      setQuiz(res.data.quiz);
      setQuestions(res.data.questions || []);
    } else {
      setError(res.error || 'Failed to fetch questions for this quiz.');
    }
    setLoading(false);
  }, [quizId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const openCreateModal = () => {
    setEditingQuestion(null);
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('a');
    setShowModal(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setQuestionText(q.question_text);
    setOptionA(q.option_a);
    setOptionB(q.option_b);
    setOptionC(q.option_c);
    setOptionD(q.option_d);
    setCorrectAnswer(q.correct_answer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingQuestion(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!questionText.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    let res;
    if (editingQuestion) {
      res = await apiClient('/questions/update.php', {
        method: 'POST',
        body: JSON.stringify({
          id: editingQuestion.id,
          question_text: questionText,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_answer: correctAnswer
        })
      });
    } else {
      res = await apiClient('/questions/create.php', {
        method: 'POST',
        body: JSON.stringify({
          quiz_id: parseInt(quizId, 10),
          question_text: questionText,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_answer: correctAnswer
        })
      });
    }

    setSubmitting(false);

    if (res.success) {
      setSuccess(editingQuestion ? 'Question updated successfully!' : 'Question added successfully!');
      closeModal();
      fetchQuestions();
    } else {
      setError(res.error || 'Operation failed.');
    }
  };

  const handleDelete = async (question) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    setError('');
    setSuccess('');
    const res = await apiClient('/questions/delete.php', {
      method: 'POST',
      body: JSON.stringify({ id: question.id })
    });

    if (res.success) {
      setSuccess('Question deleted successfully.');
      fetchQuestions();
    } else {
      setError(res.error || 'Failed to delete question.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/quizzes" className="text-sm font-semibold text-indigo-600 hover:underline">
          &larr; Back to All Quizzes
        </Link>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Questions for: {quiz ? quiz.title : `Quiz #${quizId}`}
          </h2>
          <p className="text-sm text-slate-500">{quiz?.description || 'No description provided.'}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow transition text-sm flex items-center gap-2"
        >
          + Add Question
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg p-3 text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Modal / Question Form Drawer */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 border border-slate-100 space-y-4 my-8">
            <h3 className="text-xl font-bold text-slate-900">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Question Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Enter the question prompt..."
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Option A <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Option B <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Option C <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Option D <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Correct Answer <span className="text-red-500">*</span>
                </label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                >
                  <option value="a">Option A</option>
                  <option value="b">Option B</option>
                  <option value="c">Option C</option>
                  <option value="d">Option D</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Cards List */}
      {loading ? (
        <LoadingSpinner />
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <p className="text-slate-500 lead mb-4">This quiz currently has 0 questions.</p>
          <button
            onClick={openCreateModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition"
          >
            Add First Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h4 className="text-lg font-bold text-slate-900">
                  Q{index + 1}. {q.question_text}
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(q)}
                    className="px-3 py-1 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q)}
                    className="px-3 py-1 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border text-sm ${q.correct_answer === 'a' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  <strong>A:</strong> {q.option_a} {q.correct_answer === 'a' && ' ✓ (Correct)'}
                </div>
                <div className={`p-3 rounded-lg border text-sm ${q.correct_answer === 'b' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  <strong>B:</strong> {q.option_b} {q.correct_answer === 'b' && ' ✓ (Correct)'}
                </div>
                <div className={`p-3 rounded-lg border text-sm ${q.correct_answer === 'c' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  <strong>C:</strong> {q.option_c} {q.correct_answer === 'c' && ' ✓ (Correct)'}
                </div>
                <div className={`p-3 rounded-lg border text-sm ${q.correct_answer === 'd' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  <strong>D:</strong> {q.option_d} {q.correct_answer === 'd' && ' ✓ (Correct)'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;
