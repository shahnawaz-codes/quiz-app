<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$isLoggedIn = isset($_SESSION['user_id']);
$userRole   = $_SESSION['role'] ?? '';
$userName   = $_SESSION['name'] ?? '';

$basePath = (strpos($_SERVER['SCRIPT_NAME'] ?? '', '/admin/') !== false) ? '../' : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Online Quiz Platform</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?= $basePath ?>assets/css/style.css">
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div class="container">
        <a class="navbar-brand" href="<?= $basePath ?><?= ($isLoggedIn && $userRole === 'admin') ? 'admin/dashboard.php' : 'dashboard.php' ?>">Online Quiz</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <?php if ($isLoggedIn): ?>
                    <?php if ($userRole === 'admin'): ?>
                        <li class="nav-item"><a class="nav-link" href="<?= $basePath ?>admin/dashboard.php">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link" href="<?= $basePath ?>admin/quizzes.php">Manage Quizzes</a></li>
                        <li class="nav-item"><a class="nav-link" href="<?= $basePath ?>admin/results.php">Student Results</a></li>
                    <?php else: ?>
                        <li class="nav-item"><a class="nav-link" href="<?= $basePath ?>dashboard.php">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link" href="<?= $basePath ?>quizzes.php">Quizzes</a></li>
                        <li class="nav-item"><a class="nav-link" href="<?= $basePath ?>history.php">History</a></li>
                    <?php endif; ?>
                    <li class="nav-item d-flex align-items-center me-2 ms-2 text-light">
                        <small>Welcome, <?= htmlspecialchars($userName) ?></small>
                    </li>
                    <li class="nav-item"><a class="btn btn-outline-light btn-sm my-1" href="<?= $basePath ?>logout.php">Logout</a></li>
                <?php else: ?>
                    <li class="nav-item"><a class="nav-link" href="<?= $basePath ?>login.php">Login</a></li>
                    <li class="nav-item"><a class="nav-link" href="<?= $basePath ?>register.php">Register</a></li>
                <?php endif; ?>
            </ul>
        </div>
    </div>
</nav>
<main class="container py-4">

