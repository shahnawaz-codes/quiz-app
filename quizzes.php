<?php
require_once __DIR__ . '/includes/auth-check.php';
checkAuth('student');

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/functions.php';

$pdo = getDBConnection();

// Fetch flash messages
$flashError = $_SESSION['flash_error'] ?? null;
unset($_SESSION['flash_error']);

// Query only quizzes with AT LEAST 1 question (PRD Open Question 3)
$stmt = $pdo->prepare("
    SELECT q.id, q.title, q.description, COUNT(quest.id) AS question_count
    FROM quizzes q
    INNER JOIN questions quest ON q.id = quest.quiz_id
    GROUP BY q.id
    HAVING COUNT(quest.id) > 0
    ORDER BY q.id DESC
");
$stmt->execute();
$quizzes = $stmt->fetchAll();

require_once __DIR__ . '/includes/header.php';
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h2 class="fw-bold mb-1">Available Quizzes</h2>
        <p class="text-muted mb-0">Select a quiz module to test your knowledge</p>
    </div>
</div>

<?php if ($flashError): ?>
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <?= e($flashError) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
<?php endif; ?>

<?php if (empty($quizzes)): ?>
    <div class="card shadow-sm text-center py-5">
        <div class="card-body">
            <h4 class="text-muted mb-2">No Quizzes Available</h4>
            <p class="text-muted mb-0">There are currently no quizzes ready with questions. Please check back later!</p>
        </div>
    </div>
<?php else: ?>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <?php foreach ($quizzes as $quiz): ?>
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
