<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../services/AuthService.php';

validateRequestMethod('POST');

$input = getJsonInput();
$res = AuthService::register(
    $input['name'] ?? '',
    $input['email'] ?? '',
    $input['password'] ?? '',
    $input['confirm_password'] ?? ''
);

if ($res['success']) {
    sendSuccess($res['data']);
} else {
    sendError($res['error'], $res['code'] ?? 400);
}
