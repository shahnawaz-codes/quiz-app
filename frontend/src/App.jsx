import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TakeQuiz from './pages/TakeQuiz';
import Result from './pages/Result';
import History from './pages/History';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageQuizzes from './pages/admin/ManageQuizzes';
import ManageQuestions from './pages/admin/ManageQuestions';
import StudentResults from './pages/admin/StudentResults';

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:quizId"
              element={
                <ProtectedRoute requiredRole="student">
                  <TakeQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result/:resultId"
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute requiredRole="student">
                  <History />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quizzes"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ManageQuizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quizzes/:quizId/questions"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ManageQuestions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/results"
              element={
                <ProtectedRoute requiredRole="admin">
                  <StudentResults />
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Online Quiz Platform — React + PHP JWT API
        </footer>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
