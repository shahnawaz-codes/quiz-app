<?php
require_once __DIR__ . '/../includes/auth-check.php';
checkAuth('admin');

require_once __DIR__ . '/../config/db.php';

$quizId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($quizId > 0) {
    $pdo = getDBConnection();
    
    // Delete quiz - DB foreign keys will cascade to questions and results
    $stmt = $pdo->prepare("DELETE FROM quizzes WHERE id = ?");
    if ($stmt->execute([$quizId])) {
        $_SESSION['flash_success'] = 'Quiz and all associated questions/results deleted successfully.';
    } else {
        $_SESSION['flash_error'] = 'Failed to delete quiz.';
    }
} else {
    $_SESSION['flash_error'] = 'Invalid quiz ID.';
}

header("Location: quizzes.php");
exit;
