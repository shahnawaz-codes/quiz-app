<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/auth-check.php';

$userPayload = requireAuth();

sendJsonResponse(true, [
    'user' => [
        'id'    => (int)$userPayload['user_id'],
        'name'  => $userPayload['name'],
        'email' => $userPayload['email'],
        'role'  => $userPayload['role']
    ]
]);
