<?php
/**
 * Shared API Helper Functions
 */

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
