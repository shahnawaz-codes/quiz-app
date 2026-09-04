<?php
/**
 * Shared session guard.
 *
 * @param string|null $requiredRole 'student' or 'admin'
 */
function checkAuth($requiredRole = null) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $scriptPath = $_SERVER['SCRIPT_NAME'] ?? '';
    $isAdminArea = (strpos($scriptPath, '/admin/') !== false);

    // 1. Unauthenticated check
    if (!isset($_SESSION['user_id'])) {
        $loginPath = $isAdminArea ? 'login.php' : 'login.php';
        header("Location: {$loginPath}");
        exit;
    }

    // 2. Role authorization check
    if ($requiredRole !== null) {
        $userRole = $_SESSION['role'] ?? '';
        if ($userRole !== $requiredRole) {
            if ($userRole === 'admin') {
                $target = $isAdminArea ? 'dashboard.php' : 'admin/dashboard.php';
            } else {
                $target = $isAdminArea ? '../dashboard.php' : 'dashboard.php';
            }
            header("Location: {$target}");
            exit;
        }
    }
}

