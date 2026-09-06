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
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    setError('');
    setSuccess('');
    const res = await apiClient('/quizzes/seed.php', { method: 'POST' });
    setSeeding(false);
    if (res.success) {
      setSuccess(res.data?.message || 'Sample cartoon quizzes and questions successfully loaded!');
      fetchQuizzes();
    } else {
      setError(res.error || 'Failed to seed sample quizzes.');
    }
  };

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
      setSuccess(editingQuiz ? 'Quest updated successfully!' : 'New quest created successfully!');
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
      setSuccess('Quest deleted successfully.');
      fetchQuizzes();
    } else {
      setError(res.error || 'Failed to delete quiz.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-[0_6px_0_#0f172a]">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🗺️ QUEST MANAGEMENT
          </h2>
          <p className="text-sm font-bold text-slate-500">Create, edit, and manage all quiz modules</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="bg-amber-400 hover:bg-amber-300 active:translate-y-1 text-slate-900 px-5 py-3 rounded-2xl font-black shadow-[0_4px_0_#0f172a] border-2 border-slate-900 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
            title="Automatically populate 6 full quizzes with 30 questions into database"
          >
            {seeding ? '⚡ SEEDING DATABASE...' : '⚡ AUTO-SEED 6 REAL QUIZZES'}
          </button>
          <button
            onClick={openCreateModal}
            className="bg-emerald-500 hover:bg-emerald-400 active:translate-y-1 text-slate-900 px-5 py-3 rounded-2xl font-black shadow-[0_4px_0_#0f172a] border-2 border-slate-900 transition-all text-sm flex items-center gap-2"
          >
            ➕ FORGE NEW QUEST
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-100 text-emerald-900 border-2 border-emerald-500 rounded-2xl p-4 text-sm font-bold shadow-[0_4px_0_#10b981]">
          ✨ {success}
        </div>
      )}

      {error && (
        <div className="bg-coral-100 text-coral-800 border-2 border-coral-500 rounded-2xl p-4 text-sm font-bold shadow-[0_4px_0_#ef4444]">
          ⚠️ {error}
        </div>
      )}

      {/* Modal / Create & Edit Drawer */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-[0_12px_0_#0f172a] max-w-lg w-full p-6 border-4 border-slate-900 space-y-4">
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-3">
              <h3 className="text-2xl font-black text-slate-900">
                {editingQuiz ? '✏️ EDIT QUEST' : '⚔️ CREATE NEW QUEST'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-900 text-xl font-bold">✖</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1">
                  Quest Title <span className="text-coral-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-900 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sky-200 shadow-[0_4px_0_#0f172a]"
                  placeholder="e.g. PHP & Web Development Challenge"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1">
                  Quest Lore / Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-900 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sky-200 shadow-[0_4px_0_#0f172a]"
                  placeholder="Brief overview of what this quest tests..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-2xl border-2 border-slate-900 text-slate-700 font-black text-sm hover:bg-slate-100 transition shadow-[0_4px_0_#0f172a]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm border-2 border-slate-900 shadow-[0_4px_0_#0f172a] active:translate-y-1 transition disabled:opacity-50"
                >
                  {submitting ? 'SAVING...' : editingQuiz ? 'UPDATE QUEST' : 'SAVE & ADD QUESTIONS 🚀'}
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
        <div className="bg-white rounded-3xl border-4 border-slate-900 p-12 text-center shadow-[0_6px_0_#0f172a]">
          <p className="text-slate-600 font-black text-xl mb-4">No Quests Have Been Forged Yet!</p>
          <button
            onClick={openCreateModal}
            className="bg-sky-500 hover:bg-sky-400 text-white border-2 border-slate-900 px-6 py-3 rounded-2xl font-black text-base shadow-[0_4px_0_#0f172a] transition-all"
          >
            Create Your First Quest
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[0_8px_0_#0f172a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-4 divide-slate-900">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-amber-300">#</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-sky-300">Title</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Questions</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200 bg-white font-bold text-sm">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-sky-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-500">#{quiz.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-black text-slate-900">{quiz.title}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 max-w-xs truncate">
                      {quiz.description || 'No description provided.'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-900 shadow-[0_2px_0_#0f172a] ${
                        quiz.question_count > 0 ? 'bg-sky-100 text-sky-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {quiz.question_count} Question{quiz.question_count === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-black space-x-2">
                      <Link
                        to={`/admin/quizzes/${quiz.id}/questions`}
                        className="inline-flex items-center px-3 py-1.5 border-2 border-slate-900 bg-sky-400 hover:bg-sky-300 text-slate-900 rounded-xl text-xs font-black shadow-[0_2px_0_#0f172a] transition"
                      >
                        ❓ Questions
                      </Link>
                      <button
                        onClick={() => openEditModal(quiz)}
                        className="inline-flex items-center px-3 py-1.5 border-2 border-slate-900 bg-amber-300 hover:bg-amber-200 text-slate-900 rounded-xl text-xs font-black shadow-[0_2px_0_#0f172a] transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(quiz)}
                        className="inline-flex items-center px-3 py-1.5 border-2 border-slate-900 bg-coral-400 hover:bg-coral-300 text-white rounded-xl text-xs font-black shadow-[0_2px_0_#0f172a] transition"
                      >
                        🗑️ Delete
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
