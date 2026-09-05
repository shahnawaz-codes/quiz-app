<?php
require_once __DIR__ . '/../config/env.php';

/**
 * Base64URL encode string without padding.
 */
function base64UrlEncode($data) {
    return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
}

/**
 * Base64URL decode string.
 */
function base64UrlDecode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
}

/**
 * Generates signed JWT token string.
 *
 * @param array $payload Custom claims (user_id, role, name, email)
 * @param int $expirationSeconds Default 7200 (2 hours)
 * @return string JWT Token
 */
function generateJWT(array $payload, int $expirationSeconds = 7200) {
    $secret = getenv('JWT_SECRET') ?: 'default_quiz_app_secret_key_2026';

    $header = [
        'alg' => 'HS256',
        'typ' => 'JWT'
    ];

    $payload['iat'] = time();
    $payload['exp'] = time() + $expirationSeconds;

    $headerEncoded  = base64UrlEncode(json_encode($header));
    $payloadEncoded = base64UrlEncode(json_encode($payload));

    $signatureRaw     = hash_hmac('sha256', "{$headerEncoded}.{$payloadEncoded}", $secret, true);
    $signatureEncoded = base64UrlEncode($signatureRaw);

    return "{$headerEncoded}.{$payloadEncoded}.{$signatureEncoded}";
}

/**
 * Validates JWT token signature and expiration.
 *
 * @param string $token
 * @return array|false Decoded payload array if valid, false if invalid or expired
 */
function verifyJWT($token) {
    if (empty($token)) {
        return false;
    }

    $secret = getenv('JWT_SECRET') ?: 'default_quiz_app_secret_key_2026';
    $parts = explode('.', $token);

    if (count($parts) !== 3) {
        return false;
    }

    list($headerEncoded, $payloadEncoded, $signatureProvided) = $parts;

    // Verify signature using timing-safe hash_equals
    $signatureCheckRaw = hash_hmac('sha256', "{$headerEncoded}.{$payloadEncoded}", $secret, true);
    $signatureCheck    = base64UrlEncode($signatureCheckRaw);

    if (!hash_equals($signatureCheck, $signatureProvided)) {
        return false;
    }

    $payload = json_decode(base64UrlDecode($payloadEncoded), true);
    if (!is_array($payload)) {
        return false;
    }

    // Check expiration
    if (isset($payload['exp']) && time() > $payload['exp']) {
        return false;
    }

    return $payload;
}
