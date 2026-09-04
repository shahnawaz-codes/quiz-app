<?php
require_once __DIR__ . '/includes/auth-check.php';
checkAuth('student');

require_once __DIR__ . '/config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: quizzes.php");
    exit;
}

$userId  = (int)$_SESSION['user_id'];
$quizId  = isset($_POST['quiz_id']) ? (int)$_POST['quiz_id'] : 0;
$answers = isset($_POST['answers']) && is_array($_POST['answers']) ? $_POST['answers'] : [];

if ($quizId <= 0) {
    $_SESSION['flash_error'] = 'Invalid quiz submission.';
    header("Location: quizzes.php");
    exit;
}

$pdo = getDBConnection();

// Re-fetch correct answers directly from database — NEVER trust client score data
$stmt = $pdo->prepare("SELECT id, correct_answer FROM questions WHERE quiz_id = ?");
$stmt->execute([$quizId]);
$dbQuestions = $stmt->fetchAll();

if (empty($dbQuestions)) {
    $_SESSION['flash_error'] = 'Invalid quiz attempt.';
    header("Location: quizzes.php");
    exit;
}

$totalQuestions = count($dbQuestions);
$score = 0;

foreach ($dbQuestions as $q) {
    $qId = $q['id'];
    $correct = strtolower($q['correct_answer']);
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
$insertStmt->execute([$userId, $quizId, $score, $totalQuestions, $percentage]);
$resultId = $pdo->lastInsertId();

// Redirect to result page by result ID (not quiz ID)
header("Location: result.php?id={$resultId}");
exit;
