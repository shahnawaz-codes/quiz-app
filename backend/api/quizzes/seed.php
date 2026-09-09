<?php
/**
 * API Seeder Endpoint Wrapper
 */
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../seed.php';

validateRequestMethod('POST');
requireAuth('admin');

try {
    $res = seedDatabase();
    sendSuccess($res);
} catch (Exception $e) {
    sendError('Seeding failed: ' . $e->getMessage(), 500);
}

