import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quizService';
import LoadingSpinner from '../../components/LoadingSpinner';
import QuizCard from '../../components/quiz/QuizCard';
import PageHeader from '../../components/common/PageHeader';
import Modal from '../../components/common/Modal';
import { Trophy, Plus, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { apiClient } from '../../api/client';

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError('');
    const res = await quizService.getQuizzes();
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    let res;
    if (editingQuiz) {
      res = await quizService.updateQuiz(editingQuiz.id, title, description);
    } else {
      res = await quizService.createQuiz(title, description);
    }

    setSubmitting(false);

    if (res.success) {
      setSuccess(editingQuiz ? 'Quest updated successfully!' : 'New quest created successfully!');
      setShowModal(false);
      fetchQuizzes();
    } else {
      setError(res.error || 'Operation failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quest? All associated questions will be permanently removed!')) {
      return;
    }

    setError('');
    setSuccess('');
    const res = await quizService.deleteQuiz(id);

    if (res.success) {
      setSuccess('Quest deleted successfully!');
      fetchQuizzes();
    } else {
      setError(res.error || 'Failed to delete quest.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        icon={Trophy}
        title="Guild Quests Management"
        subtitle="Create, edit, and organize quiz arenas for your hero students"
        badgeText="GUILD MASTER CONTROLS"
      >
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="btn-cartoon-yellow px-4 py-3 rounded-2xl text-xs flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-slate-900" />
          <span>{seeding ? 'Seeding...' : 'Load Sample Quizzes ✨'}</span>
        </button>
        <button
          onClick={openCreateModal}
          className="btn-cartoon-sky px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Create New Quest ⚡</span>
        </button>
      </PageHeader>

      {/* Notifications */}
      {error && (
        <div className="bg-rose-100 border-3 border-slate-900 text-rose-900 p-4 rounded-2xl text-xs font-black shadow-[0_4px_0_#0f172a] flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600" /> {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-100 border-3 border-slate-900 text-emerald-900 p-4 rounded-2xl text-xs font-black shadow-[0_4px_0_#0f172a] flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" /> {success}
        </div>
      )}

      {/* Quizzes List Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : quizzes.length === 0 ? (
        <div className="bg-white rounded-3xl border-4 border-slate-900 p-12 text-center shadow-[0_8px_0_#0f172a] space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-slate-900 rounded-3xl border-3 border-slate-900 flex items-center justify-center mx-auto text-3xl font-black">
            📜
          </div>
          <h3 className="text-xl font-black text-slate-900 font-cartoon">No Quests Created Yet</h3>
          <p className="text-slate-600 text-xs sm:text-sm font-bold max-w-md mx-auto">
            Click "Create New Quest" above to publish your first quiz module!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              isAdmin={true}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Quiz Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingQuiz ? 'Edit Quest ✏️' : 'Create New Quest ⚡'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider font-cartoon mb-1">
              Quest Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Space Odyssey Quest"
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-900 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider font-cartoon mb-1">
              Quest Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide brief details about this quiz quest..."
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-900 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2.5 rounded-2xl text-xs font-black text-slate-700 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 font-cartoon"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-cartoon-yellow px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider"
            >
              {submitting ? 'Saving...' : editingQuiz ? 'Update Quest' : 'Create Quest'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageQuizzes;
