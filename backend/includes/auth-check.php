<?php
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/functions.php';

/**
 * Extracts Bearer token from Authorization HTTP Header across Apache/Nginx/IIS/PHP server environments.
 *
 * @return string|null
 */
function getBearerToken() {
    $headers = null;

    if (isset($_SERVER['Authorization']) && !empty($_SERVER['Authorization'])) {
        $headers = trim($_SERVER['Authorization']);
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION']) && !empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION']) && !empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    } elseif (function_exists('getenv') && getenv('HTTP_AUTHORIZATION')) {
        $headers = trim(getenv('HTTP_AUTHORIZATION'));
    } elseif (function_exists('getenv') && getenv('REDIRECT_HTTP_AUTHORIZATION')) {
        $headers = trim(getenv('REDIRECT_HTTP_AUTHORIZATION'));
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    } elseif (function_exists('getallheaders')) {
        $allHeaders = getallheaders();
        foreach ($allHeaders as $name => $value) {
            if (strtolower($name) === 'authorization') {
                $headers = trim($value);
                break;
            }
        }
    }

    if (!empty($headers) && preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
        return $matches[1];
    }

    return null;
}

/**
 * Verifies Authorization JWT header and checks user role.
 *
 * @param string|null $requiredRole Optional role check ('student' or 'admin')
 * @return array Decoded user claims (user_id, role, name, email)
 */
function requireAuth($requiredRole = null) {
    $token = getBearerToken();

    if (!$token) {
        sendJsonResponse(false, null, 'Unauthorized: Missing Authorization header.', 401);
    }

    $payload = verifyJWT($token);

    if (!$payload) {
        sendJsonResponse(false, null, 'Unauthorized: Invalid or expired token.', 401);
    }

    if ($requiredRole !== null && ($payload['role'] ?? '') !== $requiredRole) {
        sendJsonResponse(false, null, 'Forbidden: Insufficient role permissions.', 403);
    }

    return $payload;
}
