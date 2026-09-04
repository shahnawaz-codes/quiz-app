<?php
require_once __DIR__ . '/../includes/auth-check.php';
checkAuth('admin');

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$pdo = getDBConnection();

// Fetch summary metrics
$quizCountStmt = $pdo->query("SELECT COUNT(*) FROM quizzes");
$totalQuizzes = (int)$quizCountStmt->fetchColumn();

$questionCountStmt = $pdo->query("SELECT COUNT(*) FROM questions");
$totalQuestions = (int)$questionCountStmt->fetchColumn();

$resultCountStmt = $pdo->query("SELECT COUNT(*) FROM results");
$totalResults = (int)$resultCountStmt->fetchColumn();

$userCountStmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'");
$totalStudents = (int)$userCountStmt->fetchColumn();

require_once __DIR__ . '/../includes/header.php';
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h2 class="fw-bold mb-0">Admin Dashboard</h2>
        <p class="text-muted mb-0">Overview of quizzes, question banks, and student attempts</p>
    </div>
    <a href="add-quiz.php" class="btn btn-success">
        + Create New Quiz
    </a>
</div>

<div class="row g-4 mb-4">
    <div class="col-md-3">
        <div class="card shadow-sm border-start border-primary border-4">
            <div class="card-body">
                <h6 class="text-uppercase text-muted fw-bold small">Total Quizzes</h6>
                <h3 class="fw-bold mb-0 text-primary"><?= e($totalQuizzes) ?></h3>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card shadow-sm border-start border-success border-4">
            <div class="card-body">
                <h6 class="text-uppercase text-muted fw-bold small">Total Questions</h6>
                <h3 class="fw-bold mb-0 text-success"><?= e($totalQuestions) ?></h3>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <a href="results.php" class="text-decoration-none">
            <div class="card shadow-sm border-start border-info border-4 h-100">
                <div class="card-body">
                    <h6 class="text-uppercase text-muted fw-bold small">Quiz Attempts</h6>
                    <h3 class="fw-bold mb-0 text-info"><?= e($totalResults) ?></h3>
                </div>
            </div>
        </a>
    </div>
    <div class="col-md-3">
        <div class="card shadow-sm border-start border-warning border-4 h-100">
            <div class="card-body">
                <h6 class="text-uppercase text-muted fw-bold small">Registered Students</h6>
                <h3 class="fw-bold mb-0 text-warning"><?= e($totalStudents) ?></h3>
            </div>
        </div>
    </div>
</div>

<div class="row g-4">
    <div class="col-md-6">
        <div class="card shadow-sm h-100">
            <div class="card-body p-4">
                <h4 class="fw-bold mb-3">Quiz Management</h4>
                <p class="text-muted">Create new quizzes, edit existing descriptions, or manage the question repository for each module.</p>
                <a href="quizzes.php" class="btn btn-primary">Go to Quiz List &rarr;</a>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card shadow-sm h-100">
            <div class="card-body p-4">
                <h4 class="fw-bold mb-3">Quick Actions</h4>
                <div class="d-grid gap-2">
                    <a href="add-quiz.php" class="btn btn-outline-success">Create Quiz</a>
                    <a href="quizzes.php" class="btn btn-outline-secondary">View All Quizzes & Questions</a>
                    <a href="results.php" class="btn btn-outline-info">View Student Results</a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
