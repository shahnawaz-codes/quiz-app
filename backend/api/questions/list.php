<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../services/QuestionService.php';

requireAuth('admin');

$quizId = isset($_GET['quiz_id']) ? (int)$_GET['quiz_id'] : 0;
$res = QuestionService::getQuestionsForQuiz($quizId);

if ($res['success']) {
    sendSuccess($res['data']);
} else {
    sendError($res['error'], $res['code'] ?? 400);
}
