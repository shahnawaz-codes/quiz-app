<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../services/QuizService.php';

validateRequestMethod(['POST', 'PUT']);
requireAuth('admin');

$input = getJsonInput();
$res = QuizService::updateQuiz(
    $input['id'] ?? 0,
    $input['title'] ?? '',
    $input['description'] ?? ''
);

if ($res['success']) {
    sendSuccess($res['data']);
} else {
    sendError($res['error'], $res['code'] ?? 400);
}
