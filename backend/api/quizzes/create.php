<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, null, 'Method Not Allowed', 405);
}

// Protected endpoint - Admin only
$user = requireAuth('admin');

$input = getJsonInput();
$title       = trim($input['title'] ?? '');
$description = trim($input['description'] ?? '');

if (empty($title)) {
    sendJsonResponse(false, null, 'Quiz title is required.', 400);
}

$pdo = getDBConnection();
$stmt = $pdo->prepare("INSERT INTO quizzes (title, description) VALUES (?, ?)");

if ($stmt->execute([$title, $description])) {
    $quizId = (int)$pdo->lastInsertId();
    sendJsonResponse(true, [
        'quiz' => [
            'id'             => $quizId,
            'title'          => $title,
            'description'    => $description,
            'question_count' => 0
        ]
    ]);
} else {
    sendJsonResponse(false, null, 'Failed to create quiz.', 500);
}
