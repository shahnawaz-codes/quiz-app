<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse(false, null, 'Method Not Allowed', 405);
}

// Protected endpoint - Admin only
$user = requireAuth('admin');

$pdo = getDBConnection();

$quizId = isset($_GET['quiz_id']) ? (int)$_GET['quiz_id'] : 0;

$sql = "
    SELECT r.id, r.user_id, r.quiz_id, r.score, r.total_questions, r.percentage, r.completed_at, 
           q.title AS quiz_title, u.name AS student_name, u.email AS student_email
    FROM results r
    JOIN quizzes q ON r.quiz_id = q.id
    JOIN users u ON r.user_id = u.id
";

$params = [];
if ($quizId > 0) {
    $sql .= " WHERE r.quiz_id = ?";
    $params[] = $quizId;
}

$sql .= " ORDER BY r.completed_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$results = $stmt->fetchAll();

$formattedResults = [];
foreach ($results as $r) {
    $formattedResults[] = [
        'id'              => (int)$r['id'],
        'user_id'         => (int)$r['user_id'],
        'quiz_id'         => (int)$r['quiz_id'],
        'quiz_title'      => $r['quiz_title'],
        'student_name'    => $r['student_name'],
        'student_email'   => $r['student_email'],
        'score'           => (int)$r['score'],
        'total_questions' => (int)$r['total_questions'],
        'percentage'      => (float)$r['percentage'],
        'completed_at'    => $r['completed_at'],
        'passed'          => (float)$r['percentage'] >= 50.0
    ];
}

sendJsonResponse(true, ['results' => $formattedResults]);
