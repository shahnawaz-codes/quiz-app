<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../services/ResultService.php';

validateRequestMethod('POST');
$user = requireAuth();

$input = getJsonInput();
$quizId  = isset($input['quiz_id']) ? (int)$input['quiz_id'] : 0;
$answers = isset($input['answers']) && is_array($input['answers']) ? $input['answers'] : [];

$res = ResultService::submitQuiz($user['user_id'], $quizId, $answers);

if ($res['success']) {
    sendSuccess($res['data']);
} else {
    sendError($res['error'], $res['code'] ?? 400);
}
