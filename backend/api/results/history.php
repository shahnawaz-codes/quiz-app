<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../services/ResultService.php';

validateRequestMethod('GET');
$user = requireAuth();

$res = ResultService::getUserHistory($user['user_id']);
sendSuccess($res['data']);
