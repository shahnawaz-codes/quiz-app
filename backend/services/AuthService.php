<?php
/**
 * Authentication Business Logic Service
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/jwt.php';

class AuthService {
    /**
     * Authenticate user with email and password
     */
    public static function login($email, $password) {
        $email = trim($email);
        if (empty($email) || empty($password)) {
            return ['success' => false, 'error' => 'Email and password are required.', 'code' => 400];
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

            return [
                'success' => true,
                'data'    => [
                    'token' => $token,
                    'user'  => [
                        'id'    => (int)$user['id'],
                        'name'  => $user['name'],
                        'email' => $user['email'],
                        'role'  => $user['role']
                    ]
                ]
            ];
        }

        return ['success' => false, 'error' => 'Invalid email or password.', 'code' => 401];
    }

    /**
     * Register a new student user
     */
    public static function register($name, $email, $password, $confirmPassword) {
        $name            = trim($name);
        $email           = trim($email);
        $password        = $password ?? '';
        $confirmPassword = $confirmPassword ?? '';

        if (empty($name)) {
            return ['success' => false, 'error' => 'Adventurer Alias / Gamer Name is required.', 'code' => 400];
        }
        if (strlen($name) < 2) {
            return ['success' => false, 'error' => 'Adventurer Alias must be at least 2 characters long.', 'code' => 400];
        }
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'error' => 'Please enter a valid email address.', 'code' => 400];
        }
        if (empty($password) || strlen($password) < 6) {
            return ['success' => false, 'error' => 'Password must be at least 6 characters long.', 'code' => 400];
        }
        if ($password !== $confirmPassword) {
            return ['success' => false, 'error' => 'Passwords do not match.', 'code' => 400];
        }

        $pdo = getDBConnection();

        // Check duplicate name
        $nameCheck = $pdo->prepare("SELECT id FROM users WHERE LOWER(name) = LOWER(?) LIMIT 1");
        $nameCheck->execute([$name]);
        if ($nameCheck->fetch()) {
            return ['success' => false, 'error' => "The Adventurer Alias '$name' is already claimed! Please choose a unique Gamer Tag.", 'code' => 400];
        }

        // Check duplicate email
        $emailCheck = $pdo->prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1");
        $emailCheck->execute([$email]);
        if ($emailCheck->fetch()) {
            return ['success' => false, 'error' => 'An account with this email address already exists.', 'code' => 400];
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $insertStmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')");

        if ($insertStmt->execute([$name, $email, $hashedPassword])) {
            return ['success' => true, 'data' => ['message' => 'Registration successful! Welcome to the Realm. Please log in.']];
        }

        return ['success' => false, 'error' => 'Registration failed.', 'code' => 500];
    }
}
