<?php
/**
 * Shared CORS Header & OPTIONS Preflight Handler
 * Must be included at the very top of every PHP API endpoint before any auth check or output.
 */

$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
if (preg_match('/^http:\/\/localhost(:\d+)?$/i', $origin)) {
    header("Access-Control-Allow-Origin: {$origin}");
} else {
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Return 200 OK immediately for browser OPTIONS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
