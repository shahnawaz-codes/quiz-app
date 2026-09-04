<?php
require_once __DIR__ . '/../includes/auth-check.php';
checkAuth('admin');

require_once __DIR__ . '/../config/db.php';

$questionId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$quizId     = isset($_GET['quiz_id']) ? (int)$_GET['quiz_id'] : 0;

if ($questionId > 0 && $quizId > 0) {
    $pdo = getDBConnection();
    
    $stmt = $pdo->prepare("DELETE FROM questions WHERE id = ?");
    if ($stmt->execute([$questionId])) {
        $_SESSION['flash_success'] = 'Question deleted successfully.';
    } else {
        $_SESSION['flash_error'] = 'Failed to delete question.';
    }
    header("Location: questions.php?quiz_id={$quizId}");
    exit;
} else {
    $_SESSION['flash_error'] = 'Invalid parameters for deletion.';
    header("Location: quizzes.php");
    exit;
}
