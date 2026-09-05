<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../includes/functions.php';

// Protected endpoint - Admin only
$user = requireAuth('admin');

$quizId = isset($_GET['quiz_id']) ? (int)$_GET['quiz_id'] : 0;
if ($quizId <= 0) {
    sendJsonResponse(false, null, 'Invalid quiz ID.', 400);
}

$pdo = getDBConnection();

// Fetch quiz details
$quizStmt = $pdo->prepare("SELECT id, title, description FROM quizzes WHERE id = ? LIMIT 1");
$quizStmt->execute([$quizId]);
$quiz = $quizStmt->fetch();

if (!$quiz) {
    sendJsonResponse(false, null, 'Quiz not found.', 404);
}

// Fetch questions for this quiz
$stmt = $pdo->prepare("
    SELECT id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer 
    FROM questions 
    WHERE quiz_id = ? 
    ORDER BY id ASC
");
$stmt->execute([$quizId]);
$questions = $stmt->fetchAll();

foreach ($questions as &$q) {
    $q['id'] = (int)$q['id'];
    $q['quiz_id'] = (int)$q['quiz_id'];
}

sendJsonResponse(true, [
    'quiz' => $quiz,
    'questions' => $questions
]);
