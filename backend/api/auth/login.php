<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../services/AuthService.php';

validateRequestMethod('POST');

$input = getJsonInput();
$res = AuthService::login($input['email'] ?? '', $input['password'] ?? '');

if ($res['success']) {
    sendSuccess($res['data']);
} else {
    sendError($res['error'], $res['code'] ?? 400);
}
