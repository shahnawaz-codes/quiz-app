<?php
require_once __DIR__ . '/includes/auth-check.php';
checkAuth('student');

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/functions.php';

$pdo = getDBConnection();

$resultId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($resultId <= 0) {
    $_SESSION['flash_error'] = 'Invalid result ID.';
    header("Location: quizzes.php");
    exit;
}

// Fetch result details from database
$stmt = $pdo->prepare("
    SELECT r.id, r.user_id, r.quiz_id, r.score, r.total_questions, r.percentage, r.completed_at, q.title AS quiz_title
    FROM results r
    JOIN quizzes q ON r.quiz_id = q.id
    WHERE r.id = ?
    LIMIT 1
");
$stmt->execute([$resultId]);
$result = $stmt->fetch();

// Strict IDOR Ownership Guard: Prevent students from viewing other students' results by changing URL ID
if (!$result || (int)$result['user_id'] !== (int)$_SESSION['user_id']) {
    http_response_code(403);
    require_once __DIR__ . '/includes/header.php';
    ?>
    <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
            <div class="alert alert-danger shadow-sm mt-4 text-center p-4">
                <h4 class="alert-heading fw-bold mb-2">Access Denied (403 Forbidden)</h4>
                <p class="mb-3">You do not have permission to view this quiz result.</p>
                <a href="quizzes.php" class="btn btn-outline-danger btn-sm">&larr; Return to Quizzes</a>
            </div>
        </div>
    </div>
    <?php
    require_once __DIR__ . '/includes/footer.php';
    exit;
}

$passed = $result['percentage'] >= 50;

require_once __DIR__ . '/includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-8 col-lg-6">
        <div class="card shadow-sm mt-3 border-0">
            <div class="card-header text-center py-4 <?= $passed ? 'bg-success text-white' : 'bg-danger text-white' ?>">
                <h3 class="fw-bold mb-0">Quiz Completed!</h3>
                <p class="mb-0 opacity-75"><?= e($result['quiz_title']) ?></p>
            </div>
            <div class="card-body p-4 text-center">
                <div class="display-3 fw-bold my-3 <?= $passed ? 'text-success' : 'text-danger' ?>">
                    <?= e($result['score']) ?> / <?= e($result['total_questions']) ?>
                </div>

                <h4 class="fw-semibold mb-3">
                    Percentage: <span class="badge <?= $passed ? 'bg-success' : 'bg-danger' ?> fs-5"><?= e($result['percentage']) ?>%</span>
                </h4>

                <p class="text-muted small">
                    Completed on <?= e(date('F j, Y, g:i a', strtotime($result['completed_at']))) ?>
                </p>

                <hr class="my-4">

                <div class="d-flex justify-content-center gap-3">
                    <a href="quizzes.php" class="btn btn-primary">Take Another Quiz</a>
                    <a href="history.php" class="btn btn-outline-secondary">View Quiz History</a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
