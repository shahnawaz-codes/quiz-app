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
$id            = isset($input['id']) ? (int)$input['id'] : 0;
$questionText  = trim($input['question_text'] ?? '');
$optionA       = trim($input['option_a'] ?? '');
$optionB       = trim($input['option_b'] ?? '');
$optionC       = trim($input['option_c'] ?? '');
$optionD       = trim($input['option_d'] ?? '');
$correctAnswer = strtolower(trim($input['correct_answer'] ?? ''));

if ($id <= 0) {
    sendJsonResponse(false, null, 'Invalid question ID.', 400);
}
if (empty($questionText) || empty($optionA) || empty($optionB) || empty($optionC) || empty($optionD)) {
    sendJsonResponse(false, null, 'All question and option fields are required.', 400);
}
if (!in_array($correctAnswer, ['a', 'b', 'c', 'd'], true)) {
    sendJsonResponse(false, null, 'Correct answer must be a, b, c, or d.', 400);
}

$pdo = getDBConnection();
$stmt = $pdo->prepare("
    UPDATE questions 
    SET question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ? 
    WHERE id = ?
");

if ($stmt->execute([$questionText, $optionA, $optionB, $optionC, $optionD, $correctAnswer, $id])) {
    sendJsonResponse(true, ['message' => 'Question updated successfully']);
} else {
    sendJsonResponse(false, null, 'Failed to update question.', 500);
}
