<?php
require_once __DIR__ . '/env.php';

/**
 * Returns PDO instance for backend API database calls.
 * Reads credentials from environment variables.
 *
 * @return PDO
 */
function getDBConnection() {
    static $pdo = null;

    if ($pdo === null) {
        $host    = getenv('DB_HOST') ?: '127.0.0.1';
        $port    = getenv('DB_PORT') ?: '3306';
        $dbname  = getenv('DB_NAME') ?: 'quiz_app';
        $user    = getenv('DB_USER') ?: 'root';
        $pass    = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';
        $charset = getenv('DB_CHARSET') ?: 'utf8mb4';

        $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            error_log("Database Connection Error: " . $e->getMessage());
            header("Content-Type: application/json; charset=UTF-8");
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "error"   => "Database connection failed."
            ]);
            exit;
        }
    }

    return $pdo;
}
