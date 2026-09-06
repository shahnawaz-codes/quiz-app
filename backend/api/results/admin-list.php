<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../services/ResultService.php';

validateRequestMethod('GET');
requireAuth('admin');

$quizId = isset($_GET['quiz_id']) ? (int)$_GET['quiz_id'] : 0;
$res = ResultService::getAdminResults($quizId);

sendSuccess($res['data']);
