<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, null, 'Method Not Allowed', 405);
}

$input = getJsonInput();
$name            = trim($input['name'] ?? '');
$email           = trim($input['email'] ?? '');
$password        = $input['password'] ?? '';
$confirmPassword = $input['confirm_password'] ?? '';

if (empty($name)) {
    sendJsonResponse(false, null, 'Full name is required.', 400);
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, null, 'Please enter a valid email address.', 400);
}
if (empty($password) || strlen($password) < 6) {
    sendJsonResponse(false, null, 'Password must be at least 6 characters long.', 400);
}
if ($password !== $confirmPassword) {
    sendJsonResponse(false, null, 'Passwords do not match.', 400);
}

$pdo = getDBConnection();

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    sendJsonResponse(false, null, 'An account with this email address already exists.', 400);
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$insertStmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')");

if ($insertStmt->execute([$name, $email, $hashedPassword])) {
    sendJsonResponse(true, ['message' => 'Registration successful! Please log in.']);
} else {
    sendJsonResponse(false, null, 'Registration failed.', 500);
}
