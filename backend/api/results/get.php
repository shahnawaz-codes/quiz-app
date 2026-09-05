<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse(false, null, 'Method Not Allowed', 405);
}

$user = requireAuth();

$resultId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($resultId <= 0) {
    sendJsonResponse(false, null, 'Invalid result ID.', 400);
}

$pdo = getDBConnection();

$stmt = $pdo->prepare("
    SELECT r.id, r.user_id, r.quiz_id, r.score, r.total_questions, r.percentage, r.completed_at, 
           q.title AS quiz_title, u.name AS student_name, u.email AS student_email
    FROM results r
    JOIN quizzes q ON r.quiz_id = q.id
    JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
    LIMIT 1
");
$stmt->execute([$resultId]);
$result = $stmt->fetch();

if (!$result) {
    sendJsonResponse(false, null, 'Result not found.', 404);
}

// Strict IDOR Ownership Guard: Prevent students from viewing other students' results
if ($user['role'] !== 'admin' && (int)$result['user_id'] !== (int)$user['user_id']) {
    sendJsonResponse(false, null, 'Access Denied: You do not have permission to view this quiz result.', 403);
}

$formattedResult = [
    'id'              => (int)$result['id'],
    'user_id'         => (int)$result['user_id'],
    'quiz_id'         => (int)$result['quiz_id'],
    'quiz_title'      => $result['quiz_title'],
    'student_name'    => $result['student_name'],
    'student_email'   => $result['student_email'],
    'score'           => (int)$result['score'],
    'total_questions' => (int)$result['total_questions'],
    'percentage'      => (float)$result['percentage'],
    'completed_at'    => $result['completed_at'],
    'passed'          => (float)$result['percentage'] >= 50.0
];

sendJsonResponse(true, ['result' => $formattedResult]);
