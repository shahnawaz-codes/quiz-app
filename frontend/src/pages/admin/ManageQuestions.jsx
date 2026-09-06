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
        <Link to="/admin/quizzes" className="text-sm font-black text-sky-600 hover:underline flex items-center gap-1">
          &larr; Return to All Quests
        </Link>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-[0_6px_0_#0f172a]">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            ❓ {quiz ? quiz.title : `Quest #${quizId}`}
          </h2>
          <p className="text-sm font-bold text-slate-500">{quiz?.description || 'No lore description provided.'}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-emerald-500 hover:bg-emerald-400 active:translate-y-1 text-slate-900 px-5 py-3 rounded-2xl font-black shadow-[0_4px_0_#0f172a] border-2 border-slate-900 transition-all text-sm flex items-center gap-2"
        >
          ➕ ADD QUESTION CARD
        </button>
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

      {/* Modal / Question Form Drawer */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-[0_12px_0_#0f172a] max-w-2xl w-full p-6 border-4 border-slate-900 space-y-4 my-8">
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-3">
              <h3 className="text-2xl font-black text-slate-900">
                {editingQuestion ? '✏️ EDIT QUESTION' : '➕ ADD NEW QUESTION'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-900 text-xl font-bold">✖</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1">
                  Question Prompt <span className="text-coral-500">*</span>
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-900 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sky-200 shadow-[0_4px_0_#0f172a]"
                  placeholder="Enter the question prompt..."
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Option A <span className="text-coral-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-900 text-sm font-bold shadow-[0_3px_0_#0f172a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Option B <span className="text-coral-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-900 text-sm font-bold shadow-[0_3px_0_#0f172a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Option C <span className="text-coral-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-900 text-sm font-bold shadow-[0_3px_0_#0f172a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Option D <span className="text-coral-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-900 text-sm font-bold shadow-[0_3px_0_#0f172a]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Winning Answer key <span className="text-coral-500">*</span>
                </label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-900 text-sm font-bold bg-amber-50 shadow-[0_4px_0_#0f172a]"
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
                  className="px-5 py-2.5 rounded-2xl border-2 border-slate-900 text-slate-700 font-black text-sm hover:bg-slate-100 transition shadow-[0_4px_0_#0f172a]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm border-2 border-slate-900 shadow-[0_4px_0_#0f172a] active:translate-y-1 transition disabled:opacity-50"
                >
                  {submitting ? 'SAVING...' : 'SAVE QUESTION CARD 💾'}
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
        <div className="bg-white rounded-3xl border-4 border-slate-900 p-12 text-center shadow-[0_6px_0_#0f172a]">
          <p className="text-slate-600 font-black text-xl mb-4">This Quest Has 0 Question Cards!</p>
          <button
            onClick={openCreateModal}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 border-2 border-slate-900 px-6 py-3 rounded-2xl font-black text-base shadow-[0_4px_0_#0f172a] transition-all"
          >
            Add First Question Card
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-[0_6px_0_#0f172a] space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h4 className="text-xl font-black text-slate-900">
                  Q{index + 1}. {q.question_text}
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(q)}
                    className="px-3 py-1.5 border-2 border-slate-900 bg-amber-300 hover:bg-amber-200 text-slate-900 rounded-xl text-xs font-black shadow-[0_2px_0_#0f172a] transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q)}
                    className="px-3 py-1.5 border-2 border-slate-900 bg-coral-400 hover:bg-coral-300 text-white rounded-xl text-xs font-black shadow-[0_2px_0_#0f172a] transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-bold text-sm">
                <div className={`p-3.5 rounded-2xl border-2 border-slate-900 text-sm shadow-[0_3px_0_#0f172a] ${q.correct_answer === 'a' ? 'bg-emerald-300 text-slate-900 font-black' : 'bg-slate-50 text-slate-700'}`}>
                  <strong>A:</strong> {q.option_a} {q.correct_answer === 'a' && ' (★ CORRECT)'}
                </div>
                <div className={`p-3.5 rounded-2xl border-2 border-slate-900 text-sm shadow-[0_3px_0_#0f172a] ${q.correct_answer === 'b' ? 'bg-emerald-300 text-slate-900 font-black' : 'bg-slate-50 text-slate-700'}`}>
                  <strong>B:</strong> {q.option_b} {q.correct_answer === 'b' && ' (★ CORRECT)'}
                </div>
                <div className={`p-3.5 rounded-2xl border-2 border-slate-900 text-sm shadow-[0_3px_0_#0f172a] ${q.correct_answer === 'c' ? 'bg-emerald-300 text-slate-900 font-black' : 'bg-slate-50 text-slate-700'}`}>
                  <strong>C:</strong> {q.option_c} {q.correct_answer === 'c' && ' (★ CORRECT)'}
                </div>
                <div className={`p-3.5 rounded-2xl border-2 border-slate-900 text-sm shadow-[0_3px_0_#0f172a] ${q.correct_answer === 'd' ? 'bg-emerald-300 text-slate-900 font-black' : 'bg-slate-50 text-slate-700'}`}>
                  <strong>D:</strong> {q.option_d} {q.correct_answer === 'd' && ' (★ CORRECT)'}
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
