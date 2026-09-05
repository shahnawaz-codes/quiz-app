<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse(false, null, 'Method Not Allowed', 405);
}

$user = requireAuth();

$quizId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($quizId <= 0) {
    sendJsonResponse(false, null, 'Invalid quiz ID.', 400);
}

$pdo = getDBConnection();

// Fetch quiz details
$stmt = $pdo->prepare("SELECT id, title, description, created_at FROM quizzes WHERE id = ? LIMIT 1");
$stmt->execute([$quizId]);
$quiz = $stmt->fetch();

if (!$quiz) {
    sendJsonResponse(false, null, 'Quiz not found.', 404);
}

$quiz['id'] = (int)$quiz['id'];

// Fetch questions for this quiz
$qStmt = $pdo->prepare("
    SELECT id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer 
    FROM questions 
    WHERE quiz_id = ? 
    ORDER BY id ASC
");
$qStmt->execute([$quizId]);
$questions = $qStmt->fetchAll();

$formattedQuestions = [];
foreach ($questions as $q) {
    $item = [
        'id'            => (int)$q['id'],
        'quiz_id'       => (int)$q['quiz_id'],
        'question_text' => $q['question_text'],
        'option_a'      => $q['option_a'],
        'option_b'      => $q['option_b'],
        'option_c'      => $q['option_c'],
        'option_d'      => $q['option_d'],
    ];

    // Only include correct_answer if user is admin (prevent answer leak to students)
    if ($user['role'] === 'admin') {
        $item['correct_answer'] = $q['correct_answer'];
    }

    $formattedQuestions[] = $item;
}

$quiz['questions'] = $formattedQuestions;

sendJsonResponse(true, ['quiz' => $quiz]);
