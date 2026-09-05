<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendJsonResponse(false, null, 'Method Not Allowed', 405);
}

// Protected endpoint - Admin only
$user = requireAuth('admin');

$input = getJsonInput();
$id = isset($input['id']) ? (int)$input['id'] : (isset($_GET['id']) ? (int)$_GET['id'] : 0);

if ($id <= 0) {
    sendJsonResponse(false, null, 'Invalid quiz ID.', 400);
}

$pdo = getDBConnection();

// Deletes quiz - foreign keys with ON DELETE CASCADE handle questions and results
$stmt = $pdo->prepare("DELETE FROM quizzes WHERE id = ?");

if ($stmt->execute([$id])) {
    sendJsonResponse(true, ['message' => 'Quiz deleted successfully']);
} else {
    sendJsonResponse(false, null, 'Failed to delete quiz.', 500);
}
