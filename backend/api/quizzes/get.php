<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../services/QuizService.php';

validateRequestMethod('GET');

$user = requireAuth();
$quizId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

$res = QuizService::getQuizById($quizId, $user['role']);

if ($res['success']) {
    sendSuccess($res['data']);
} else {
    sendError($res['error'], $res['code'] ?? 400);
}
