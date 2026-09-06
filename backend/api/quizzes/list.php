<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../services/QuizService.php';

requireAuth();

$res = QuizService::getAllQuizzes();
sendSuccess($res['data']);
