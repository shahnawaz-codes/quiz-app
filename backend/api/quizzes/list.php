<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../includes/functions.php';

// Protected endpoint - Authenticated users (students or admins)
$user = requireAuth();

$pdo = getDBConnection();

$stmt = $pdo->prepare("
    SELECT q.id, q.title, q.description, q.created_at, COUNT(quest.id) AS question_count
    FROM quizzes q
    LEFT JOIN questions quest ON q.id = quest.quiz_id
    GROUP BY q.id
    ORDER BY q.id DESC
");
$stmt->execute();
$quizzes = $stmt->fetchAll();

// Format numbers
foreach ($quizzes as &$quiz) {
    $quiz['id'] = (int)$quiz['id'];
    $quiz['question_count'] = (int)$quiz['question_count'];
}

sendJsonResponse(true, ['quizzes' => $quizzes]);
