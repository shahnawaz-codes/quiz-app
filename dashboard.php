<?php
require_once __DIR__ . '/includes/auth-check.php';
checkAuth('student');

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/functions.php';

$pdo = getDBConnection();
$userId = (int)$_SESSION['user_id'];

// Student metrics
$attemptsStmt = $pdo->prepare("SELECT COUNT(*), AVG(percentage) FROM results WHERE user_id = ?");
$attemptsStmt->execute([$userId]);
list($totalAttempts, $avgPercentage) = $attemptsStmt->fetch(PDO::FETCH_NUM);
$totalAttempts = (int)$totalAttempts;
$avgPercentage = $avgPercentage !== null ? round((float)$avgPercentage, 1) : 0;

// Fetch active quizzes (with >= 1 question)
$quizzesStmt = $pdo->prepare("
    SELECT q.id, q.title, q.description, COUNT(quest.id) AS question_count
    FROM quizzes q
    INNER JOIN questions quest ON q.id = quest.quiz_id
    GROUP BY q.id
    HAVING COUNT(quest.id) > 0
    ORDER BY q.id DESC
    LIMIT 6
");
$quizzesStmt->execute();
$availableQuizzes = $quizzesStmt->fetchAll();

require_once __DIR__ . '/includes/header.php';
?>

<div class="row mb-4">
    <div class="col-12">
        <div class="card shadow-sm border-0 bg-primary text-white">
            <div class="card-body p-4">
                <h2 class="fw-bold mb-1">Welcome back, <?= e($_SESSION['name']) ?>!</h2>
                <p class="mb-0 opacity-75">Ready to test your skills? Choose a quiz below or review your past attempt history.</p>
            </div>
        </div>
    </div>
</div>

<div class="row g-4 mb-4">
    <div class="col-md-4">
        <div class="card shadow-sm border-start border-primary border-4 h-100">
            <div class="card-body">
                <h6 class="text-uppercase text-muted fw-bold small">Available Quizzes</h6>
                <h3 class="fw-bold mb-0 text-primary"><?= count($availableQuizzes) ?></h3>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card shadow-sm border-start border-success border-4 h-100">
            <div class="card-body">
                <h6 class="text-uppercase text-muted fw-bold small">Quizzes Attempted</h6>
                <h3 class="fw-bold mb-0 text-success"><?= e($totalAttempts) ?></h3>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card shadow-sm border-start border-info border-4 h-100">
            <div class="card-body">
                <h6 class="text-uppercase text-muted fw-bold small">Average Score</h6>
                <h3 class="fw-bold mb-0 text-info"><?= e($avgPercentage) ?>%</h3>
            </div>
        </div>
    </div>
</div>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="fw-bold mb-0">Featured Quizzes</h4>
    <a href="quizzes.php" class="btn btn-outline-primary btn-sm">View All Quizzes &rarr;</a>
</div>

<?php if (empty($availableQuizzes)): ?>
    <div class="card shadow-sm text-center py-5">
        <div class="card-body">
            <h5 class="text-muted mb-2">No Quizzes Available</h5>
            <p class="text-muted mb-0">No quizzes are available right now. Please check back later!</p>
        </div>
    </div>
<?php else: ?>
    <div class="row row-cols-1 row-cols-md-3 g-4 mb-4">
        <?php foreach ($availableQuizzes as $quiz): ?>
            <div class="col">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-body d-flex flex-column p-4">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title fw-bold text-dark mb-0"><?= e($quiz['title']) ?></h5>
                            <span class="badge bg-primary fs-7"><?= e($quiz['question_count']) ?> Qs</span>
                        </div>
                        <p class="card-text text-muted flex-grow-1 small">
                            <?= e($quiz['description'] ?: 'No description provided.') ?>
                        </p>
                        <div class="mt-3">
                            <a href="take-quiz.php?id=<?= e($quiz['id']) ?>" class="btn btn-primary w-100 fw-semibold">
                                Start Quiz &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
