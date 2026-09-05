<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse(false, null, 'Method Not Allowed', 405);
}

// Protected endpoint for authenticated users
$user = requireAuth();

$pdo = getDBConnection();

// SECURITY RULE: Must only ever query results for token's user_id, never accept user_id from GET/POST
$stmt = $pdo->prepare("
    SELECT r.id, r.quiz_id, r.score, r.total_questions, r.percentage, r.completed_at, q.title AS quiz_title
    FROM results r
    JOIN quizzes q ON r.quiz_id = q.id
    WHERE r.user_id = ?
    ORDER BY r.completed_at DESC
");
$stmt->execute([$user['user_id']]);
$results = $stmt->fetchAll();

$formattedResults = [];
foreach ($results as $r) {
    $formattedResults[] = [
        'id'              => (int)$r['id'],
        'quiz_id'         => (int)$r['quiz_id'],
        'quiz_title'      => $r['quiz_title'],
        'score'           => (int)$r['score'],
        'total_questions' => (int)$r['total_questions'],
        'percentage'      => (float)$r['percentage'],
        'completed_at'    => $r['completed_at'],
        'passed'          => (float)$r['percentage'] >= 50.0
    ];
}

sendJsonResponse(true, ['results' => $formattedResults]);
