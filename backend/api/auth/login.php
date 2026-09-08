<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../services/AuthService.php';

validateRequestMethod('POST');

$input = getJsonInput();
$res = AuthService::login($input['email'] ?? '', $input['password'] ?? '');

if ($res['success']) {
    $token = $res['data']['token'] ?? '';
    if (!empty($token)) {
        setcookie('quiz_app_token', $token, [
            'expires'  => time() + 7200,
            'path'     => '/',
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
    }
    unset($res['data']['token']);
    sendSuccess($res['data']);
} else {
    sendError($res['error'], $res['code'] ?? 400);
}
