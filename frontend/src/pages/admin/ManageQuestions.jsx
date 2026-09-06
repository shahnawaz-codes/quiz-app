import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageHeader from '../../components/common/PageHeader';
import Modal from '../../components/common/Modal';
import { HelpCircle, Plus, Edit3, Trash2, ArrowLeft, AlertCircle, CheckCircle, Check } from 'lucide-react';

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
    const res = await quizService.getQuestionsByQuiz(quizId);
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!questionText.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    const payload = {
      question_text: questionText,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct_answer: correctAnswer
    };

    let res;
    if (editingQuestion) {
      res = await quizService.updateQuestion({ ...payload, id: editingQuestion.id });
    } else {
      res = await quizService.createQuestion({ ...payload, quiz_id: parseInt(quizId, 10) });
    }

    setSubmitting(false);

    if (res.success) {
      setSuccess(editingQuestion ? 'Question updated successfully!' : 'New question added successfully!');
      setShowModal(false);
      fetchQuestions();
    } else {
      setError(res.error || 'Operation failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    setError('');
    setSuccess('');
    const res = await quizService.deleteQuestion(id);

    if (res.success) {
      setSuccess('Question deleted successfully!');
      fetchQuestions();
    } else {
      setError(res.error || 'Failed to delete question.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        icon={HelpCircle}
        title={quiz ? `Manage Questions: ${quiz.title}` : 'Manage Questions'}
        subtitle="Add, edit, or delete multiple-choice challenge questions"
        badgeText={`QUEST #${quizId}`}
      >
        <Link
          to="/admin/quizzes"
          className="px-4 py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-2xl text-xs font-black text-slate-800 flex items-center justify-center gap-1.5 font-cartoon"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Quizzes
        </Link>
        <button
          onClick={openCreateModal}
          className="btn-cartoon-yellow px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-slate-900" />
          <span>Add Question ⚡</span>
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

      {/* Questions List */}
      {loading ? (
        <LoadingSpinner />
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-3xl border-4 border-slate-900 p-12 text-center shadow-[0_8px_0_#0f172a] space-y-4">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-3xl border-3 border-slate-900 flex items-center justify-center mx-auto text-3xl font-black">
            ❓
          </div>
          <h3 className="text-xl font-black text-slate-900 font-cartoon">No Questions Added Yet</h3>
          <p className="text-slate-600 text-xs sm:text-sm font-bold max-w-md mx-auto">
            Click "Add Question" to create your first multiple-choice challenge for this quest!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[0_6px_0_#0f172a] space-y-4"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-2xl bg-amber-400 border-2 border-slate-900 text-slate-900 font-black text-xs flex items-center justify-center font-cartoon shrink-0">
                    Q{idx + 1}
                  </span>
                  <h4 className="text-lg font-black text-slate-900 font-cartoon pt-1">
                    {q.question_text}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(q)}
                    className="p-2 bg-amber-300 hover:bg-amber-400 text-slate-900 rounded-xl border-2 border-slate-900 shadow-[0_2px_0_#0f172a]"
                    title="Edit Question"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl border-2 border-slate-900 shadow-[0_2px_0_#0f172a]"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {[
                  { key: 'a', val: q.option_a, label: 'A' },
                  { key: 'b', val: q.option_b, label: 'B' },
                  { key: 'c', val: q.option_c, label: 'C' },
                  { key: 'd', val: q.option_d, label: 'D' }
                ].map((opt) => {
                  const isCorrect = q.correct_answer === opt.key;
                  return (
                    <div
                      key={opt.key}
                      className={`p-3 rounded-2xl border-2 border-slate-900 text-xs font-bold flex items-center justify-between ${
                        isCorrect
                          ? 'bg-emerald-100 border-emerald-900 text-emerald-950 font-black ring-2 ring-emerald-400'
                          : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-xl border border-slate-900 flex items-center justify-center font-black text-[10px] font-cartoon ${
                          isCorrect ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900'
                        }`}>
                          {opt.label}
                        </span>
                        {opt.val}
                      </span>
                      {isCorrect && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-300 px-2 py-0.5 rounded-full border border-slate-900 flex items-center gap-1 font-cartoon">
                          <Check className="w-3 h-3" /> Correct
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingQuestion ? 'Edit Question ✏️' : 'Add New Question ⚡'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider font-cartoon mb-1">
              Question Prompt / Text
            </label>
            <textarea
              rows="2"
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. What is the signature attack of Goku in DBZ?"
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-900 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider font-cartoon mb-1">
                Option A
              </label>
              <input
                type="text"
                required
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="Option A answer..."
                className="w-full px-3 py-2 rounded-2xl border-2 border-slate-900 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider font-cartoon mb-1">
                Option B
              </label>
              <input
                type="text"
                required
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="Option B answer..."
                className="w-full px-3 py-2 rounded-2xl border-2 border-slate-900 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider font-cartoon mb-1">
                Option C
              </label>
              <input
                type="text"
                required
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                placeholder="Option C answer..."
                className="w-full px-3 py-2 rounded-2xl border-2 border-slate-900 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider font-cartoon mb-1">
                Option D
              </label>
              <input
                type="text"
                required
                value={optionD}
                onChange={(e) => setOptionD(e.target.value)}
                placeholder="Option D answer..."
                className="w-full px-3 py-2 rounded-2xl border-2 border-slate-900 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider font-cartoon mb-1">
              Select Correct Option Answer 🎯
            </label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-900 text-slate-900 text-xs font-black focus:outline-none focus:ring-2 focus:ring-sky-500 bg-amber-100 font-cartoon"
            >
              <option value="a">Option A is Correct</option>
              <option value="b">Option B is Correct</option>
              <option value="c">Option C is Correct</option>
              <option value="d">Option D is Correct</option>
            </select>
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
              {submitting ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageQuestions;
