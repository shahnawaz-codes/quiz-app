<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth-check.php';

$userPayload = requireAuth();

sendSuccess([
    'user' => [
        'id'    => (int)$userPayload['user_id'],
        'name'  => $userPayload['name'],
        'email' => $userPayload['email'],
        'role'  => $userPayload['role']
    ]
]);
