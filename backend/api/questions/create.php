<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../services/QuestionService.php';

validateRequestMethod('POST');
requireAuth('admin');

$input = getJsonInput();
$res = QuestionService::createQuestion(
    $input['quiz_id'] ?? 0,
    $input['question_text'] ?? '',
    $input['option_a'] ?? '',
    $input['option_b'] ?? '',
    $input['option_c'] ?? '',
    $input['option_d'] ?? '',
    $input['correct_answer'] ?? ''
);

if ($res['success']) {
    sendSuccess($res['data']);
} else {
    sendError($res['error'], $res['code'] ?? 400);
}
