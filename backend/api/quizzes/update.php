<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendJsonResponse(false, null, 'Method Not Allowed', 405);
}

// Protected endpoint - Admin only
$user = requireAuth('admin');

$input = getJsonInput();
$id          = isset($input['id']) ? (int)$input['id'] : 0;
$title       = trim($input['title'] ?? '');
$description = trim($input['description'] ?? '');

if ($id <= 0) {
    sendJsonResponse(false, null, 'Invalid quiz ID.', 400);
}
if (empty($title)) {
    sendJsonResponse(false, null, 'Quiz title is required.', 400);
}

$pdo = getDBConnection();
$stmt = $pdo->prepare("UPDATE quizzes SET title = ?, description = ? WHERE id = ?");

if ($stmt->execute([$title, $description, $id])) {
    sendJsonResponse(true, ['message' => 'Quiz updated successfully']);
} else {
    sendJsonResponse(false, null, 'Failed to update quiz.', 500);
}
