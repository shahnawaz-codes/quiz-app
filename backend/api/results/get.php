<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../services/ResultService.php';

validateRequestMethod('GET');
$user = requireAuth();

$resultId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$res = ResultService::getResultById($resultId, $user);

if ($res['success']) {
    sendSuccess($res['data']);
} else {
    sendError($res['error'], $res['code'] ?? 400);
}
