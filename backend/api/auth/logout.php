<?php
require_once __DIR__ . '/../../includes/response.php';

validateRequestMethod('POST');

// Clear the HttpOnly session cookie
setcookie('quiz_app_token', '', [
    'expires'  => time() - 3600,
    'path'     => '/',
    'httponly' => true,
    'samesite' => 'Lax'
]);

sendSuccess(['message' => 'Logged out successfully']);
