<?php
/**
 * Shared API Response & Request Helpers
 */

require_once __DIR__ . '/cors.php';

/**
 * Validates HTTP Request Method. Halts request with 405 if not allowed.
 *
 * @param array|string $allowedMethods
 */
function validateRequestMethod($allowedMethods) {
    $methods = is_array($allowedMethods) ? array_map('strtoupper', $allowedMethods) : [strtoupper($allowedMethods)];
    if (!in_array($_SERVER['REQUEST_METHOD'], $methods, true)) {
        sendError('Method Not Allowed', 405);
    }
}

/**
 * Sends standard JSON response shape: { "success": true/false, "data": ..., "error": ... }
 *
 * @param bool $success
 * @param mixed $data
 * @param string|null $error
 * @param int $code
 */
function sendJsonResponse($success, $data = null, $error = null, $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => (bool)$success,
        'data'    => $data,
        'error'   => $error
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Sends success JSON response.
 *
 * @param mixed $data
 * @param int $code
 */
function sendSuccess($data = null, $code = 200) {
    sendJsonResponse(true, $data, null, $code);
}

/**
 * Sends error JSON response.
 *
 * @param string $message
 * @param int $code
 */
function sendError($message, $code = 400) {
    sendJsonResponse(false, null, $message, $code);
}

/**
 * Parses raw JSON request body into an associative array.
 *
 * @return array
 */
function getJsonInput() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}
