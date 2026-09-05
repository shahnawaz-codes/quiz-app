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
$quizId        = isset($input['quiz_id']) ? (int)$input['quiz_id'] : 0;
$questionText  = trim($input['question_text'] ?? '');
$optionA       = trim($input['option_a'] ?? '');
$optionB       = trim($input['option_b'] ?? '');
$optionC       = trim($input['option_c'] ?? '');
$optionD       = trim($input['option_d'] ?? '');
$correctAnswer = strtolower(trim($input['correct_answer'] ?? ''));

if ($quizId <= 0) {
    sendJsonResponse(false, null, 'Invalid quiz ID.', 400);
}
if (empty($questionText) || empty($optionA) || empty($optionB) || empty($optionC) || empty($optionD)) {
    sendJsonResponse(false, null, 'All question and option fields are required.', 400);
}
if (!in_array($correctAnswer, ['a', 'b', 'c', 'd'], true)) {
    sendJsonResponse(false, null, 'Correct answer must be a, b, c, or d.', 400);
}

$pdo = getDBConnection();
$stmt = $pdo->prepare("
    INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

if ($stmt->execute([$quizId, $questionText, $optionA, $optionB, $optionC, $optionD, $correctAnswer])) {
    $questionId = (int)$pdo->lastInsertId();
    sendJsonResponse(true, [
        'question' => [
            'id'             => $questionId,
            'quiz_id'        => $quizId,
            'question_text'  => $questionText,
            'option_a'       => $optionA,
            'option_b'       => $optionB,
            'option_c'       => $optionC,
            'option_d'       => $optionD,
            'correct_answer' => $correctAnswer
        ]
    ]);
} else {
    sendJsonResponse(false, null, 'Failed to create question.', 500);
}
