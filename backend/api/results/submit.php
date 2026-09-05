<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, null, 'Method Not Allowed', 405);
}

$user = requireAuth();

$input = getJsonInput();
$quizId = isset($input['quiz_id']) ? (int)$input['quiz_id'] : 0;
$answers = isset($input['answers']) && is_array($input['answers']) ? $input['answers'] : [];

if ($quizId <= 0) {
    sendJsonResponse(false, null, 'Invalid quiz ID.', 400);
}

$pdo = getDBConnection();

// Re-fetch questions directly from database — NEVER trust client score data
$stmt = $pdo->prepare("SELECT id, correct_answer FROM questions WHERE quiz_id = ?");
$stmt->execute([$quizId]);
$questions = $stmt->fetchAll();

if (empty($questions)) {
    sendJsonResponse(false, null, 'Quiz contains no questions or does not exist.', 400);
}

$totalQuestions = count($questions);
$score = 0;

foreach ($questions as $q) {
    $qId = $q['id'];
    $correct = strtolower(trim($q['correct_answer']));
    $userChoice = isset($answers[$qId]) ? strtolower(trim($answers[$qId])) : '';

    if ($userChoice !== '' && $userChoice === $correct) {
        $score++;
    }
}

$percentage = $totalQuestions > 0 ? round(($score / $totalQuestions) * 100, 2) : 0;

// Insert server-calculated result row into results table
$insertStmt = $pdo->prepare("
    INSERT INTO results (user_id, quiz_id, score, total_questions, percentage) 
    VALUES (?, ?, ?, ?, ?)
");
$insertStmt->execute([$user['user_id'], $quizId, $score, $totalQuestions, $percentage]);
$resultId = (int)$pdo->lastInsertId();

sendJsonResponse(true, [
    'result_id'       => $resultId,
    'score'           => $score,
    'total_questions' => $totalQuestions,
    'percentage'      => $percentage,
    'passed'          => $percentage >= 50
]);
