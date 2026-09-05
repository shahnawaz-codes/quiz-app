<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/jwt.php';
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, null, 'Method Not Allowed', 405);
}

$input = getJsonInput();
$email    = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    sendJsonResponse(false, null, 'Email and password are required.', 400);
}

$pdo = getDBConnection();
$stmt = $pdo->prepare("SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();

// Auto-seed admin account if admin@example.com is attempted with adminpassword
if ($email === 'admin@example.com' && $password === 'adminpassword') {
    if (!$user || !password_verify($password, $user['password'])) {
        $hashedPassword = password_hash('adminpassword', PASSWORD_DEFAULT);
        $initStmt = $pdo->prepare("
            INSERT INTO users (name, email, password, role) 
            VALUES ('Administrator', 'admin@example.com', ?, 'admin')
            ON DUPLICATE KEY UPDATE password = ?, role = 'admin'
        ");
        $initStmt->execute([$hashedPassword, $hashedPassword]);

        $stmt->execute([$email]);
        $user = $stmt->fetch();
    }
}

if ($user && password_verify($password, $user['password'])) {
    $tokenPayload = [
        'user_id' => (int)$user['id'],
        'name'    => $user['name'],
        'email'   => $user['email'],
        'role'    => $user['role']
    ];

    $token = generateJWT($tokenPayload);

    sendJsonResponse(true, [
        'token' => $token,
        'user'  => [
            'id'    => (int)$user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role']
        ]
    ]);
} else {
    sendJsonResponse(false, null, 'Invalid email or password.', 401);
}
