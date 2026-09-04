<?php
require_once __DIR__ . '/../includes/auth-check.php';
checkAuth('admin');

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$pdo = getDBConnection();

$quizId = isset($_GET['quiz_id']) ? (int)$_GET['quiz_id'] : 0;
if ($quizId <= 0) {
    $_SESSION['flash_error'] = 'Invalid quiz ID.';
    header("Location: quizzes.php");
    exit;
}

// Fetch Quiz
$quizStmt = $pdo->prepare("SELECT id, title, description FROM quizzes WHERE id = ? LIMIT 1");
$quizStmt->execute([$quizId]);
$quiz = $quizStmt->fetch();

if (!$quiz) {
    $_SESSION['flash_error'] = 'Quiz not found.';
    header("Location: quizzes.php");
    exit;
}

// Fetch Flash messages
$flashSuccess = $_SESSION['flash_success'] ?? null;
$flashError   = $_SESSION['flash_error'] ?? null;
unset($_SESSION['flash_success'], $_SESSION['flash_error']);

// Fetch Questions for this Quiz
$stmt = $pdo->prepare("SELECT id, question_text, option_a, option_b, option_c, option_d, correct_answer FROM questions WHERE quiz_id = ? ORDER BY id ASC");
$stmt->execute([$quizId]);
$questions = $stmt->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>

<div class="mb-3">
    <a href="quizzes.php" class="text-decoration-none">&larr; Back to All Quizzes</a>
</div>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h2 class="fw-bold mb-1">Questions for: <?= e($quiz['title']) ?></h2>
        <p class="text-muted mb-0"><?= e($quiz['description'] ?: 'No description provided.') ?></p>
    </div>
    <a href="add-question.php?quiz_id=<?= e($quizId) ?>" class="btn btn-primary">
        + Add Question
    </a>
</div>

<?php if ($flashSuccess): ?>
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <?= e($flashSuccess) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
<?php endif; ?>

<?php if ($flashError): ?>
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <?= e($flashError) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
<?php endif; ?>

<?php if (empty($questions)): ?>
    <div class="card shadow-sm text-center py-5">
        <div class="card-body">
            <p class="text-muted lead mb-3">This quiz currently has 0 questions.</p>
            <a href="add-question.php?quiz_id=<?= e($quizId) ?>" class="btn btn-success">Add the First Question</a>
        </div>
    </div>
<?php else: ?>
    <div class="row row-cols-1 g-4">
        <?php foreach ($questions as $index => $q): ?>
            <div class="col">
                <div class="card shadow-sm border-0 bg-light">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title fw-bold text-dark mb-0">
                                Q<?= $index + 1 ?>: <?= e($q['question_text']) ?>
                            </h5>
                            <div class="btn-group btn-group-sm">
                                <a href="edit-question.php?id=<?= e($q['id']) ?>" class="btn btn-outline-secondary">Edit</a>
                                <a href="delete-question.php?id=<?= e($q['id']) ?>&quiz_id=<?= e($quizId) ?>" 
                                   class="btn btn-outline-danger" 
                                   onclick="return confirm('Are you sure you want to delete this question?');">
                                    Delete
                                </a>
                            </div>
                        </div>

                        <div class="row g-2">
                            <div class="col-md-6">
                                <div class="p-2 rounded border <?= $q['correct_answer'] === 'a' ? 'bg-success text-white fw-bold' : 'bg-white' ?>">
                                    <strong>A:</strong> <?= e($q['option_a']) ?>
                                    <?php if ($q['correct_answer'] === 'a'): ?> &#10004; (Correct)<?php endif; ?>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-2 rounded border <?= $q['correct_answer'] === 'b' ? 'bg-success text-white fw-bold' : 'bg-white' ?>">
                                    <strong>B:</strong> <?= e($q['option_b']) ?>
                                    <?php if ($q['correct_answer'] === 'b'): ?> &#10004; (Correct)<?php endif; ?>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-2 rounded border <?= $q['correct_answer'] === 'c' ? 'bg-success text-white fw-bold' : 'bg-white' ?>">
                                    <strong>C:</strong> <?= e($q['option_c']) ?>
                                    <?php if ($q['correct_answer'] === 'c'): ?> &#10004; (Correct)<?php endif; ?>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-2 rounded border <?= $q['correct_answer'] === 'd' ? 'bg-success text-white fw-bold' : 'bg-white' ?>">
                                    <strong>D:</strong> <?= e($q['option_d']) ?>
                                    <?php if ($q['correct_answer'] === 'd'): ?> &#10004; (Correct)<?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
