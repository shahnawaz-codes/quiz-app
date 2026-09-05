import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError('');
    const res = await apiClient('/quizzes/list.php');
    if (res.success && res.data) {
      setQuizzes(res.data.quizzes || []);
    } else {
      setError(res.error || 'Failed to fetch quizzes.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const openCreateModal = () => {
    setEditingQuiz(null);
    setTitle('');
    setDescription('');
    setShowModal(true);
  };

  const openEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setTitle(quiz.title);
    setDescription(quiz.description || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingQuiz(null);
    setTitle('');
    setDescription('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    let res;
    if (editingQuiz) {
      res = await apiClient('/quizzes/update.php', {
        method: 'POST',
        body: JSON.stringify({ id: editingQuiz.id, title, description })
      });
    } else {
      res = await apiClient('/quizzes/create.php', {
        method: 'POST',
        body: JSON.stringify({ title, description })
      });
    }

    setSubmitting(false);

    if (res.success) {
      setSuccess(editingQuiz ? 'Quiz updated successfully!' : 'Quiz created successfully!');
      closeModal();
      fetchQuizzes();
    } else {
      setError(res.error || 'Operation failed.');
    }
  };

  const handleDelete = async (quiz) => {
    if (!window.confirm(`Are you sure you want to delete "${quiz.title}"? All associated questions and student results will be permanently removed.`)) {
      return;
    }

    setError('');
    setSuccess('');
    const res = await apiClient('/quizzes/delete.php', {
      method: 'POST',
      body: JSON.stringify({ id: quiz.id })
    });

    if (res.success) {
      setSuccess('Quiz deleted successfully.');
      fetchQuizzes();
    } else {
      setError(res.error || 'Failed to delete quiz.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Quiz Management</h2>
          <p className="text-sm text-slate-500">Create, edit, and manage all quiz modules</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow transition text-sm flex items-center gap-2"
        >
          + Create New Quiz
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

      {/* Modal / Create & Edit Drawer */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-100 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Quiz Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="e.g. PHP & Web Development Basics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Brief overview of what this quiz covers..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
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
                  {submitting ? 'Saving...' : editingQuiz ? 'Update Quiz' : 'Save & Add Questions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Table */}
      {loading ? (
        <LoadingSpinner />
      ) : quizzes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <p className="text-slate-500 lead mb-4">No quizzes have been created yet.</p>
          <button
            onClick={openCreateModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition"
          >
            Create Your First Quiz
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">#</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider">Questions</th>
                  <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-500">#{quiz.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{quiz.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                      {quiz.description || 'No description provided.'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        quiz.question_count > 0 ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {quiz.question_count} Question{quiz.question_count === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        to={`/admin/quizzes/${quiz.id}/questions`}
                        className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-50 transition"
                      >
                        Questions
                      </Link>
                      <button
                        onClick={() => openEditModal(quiz)}
                        className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(quiz)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuizzes;
