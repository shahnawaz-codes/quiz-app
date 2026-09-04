<?php
require_once __DIR__ . '/includes/auth-check.php';
checkAuth('student');

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/functions.php';

$pdo = getDBConnection();

$quizId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($quizId <= 0) {
    $_SESSION['flash_error'] = 'Invalid quiz ID selected.';
    header("Location: quizzes.php");
    exit;
}

// Fetch quiz
$quizStmt = $pdo->prepare("SELECT id, title, description FROM quizzes WHERE id = ? LIMIT 1");
$quizStmt->execute([$quizId]);
$quiz = $quizStmt->fetch();

if (!$quiz) {
    $_SESSION['flash_error'] = 'The requested quiz was not found.';
    header("Location: quizzes.php");
    exit;
}

// Fetch questions for this quiz
$questStmt = $pdo->prepare("SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions WHERE quiz_id = ? ORDER BY id ASC");
$questStmt->execute([$quizId]);
$questions = $questStmt->fetchAll();

if (empty($questions)) {
    $_SESSION['flash_error'] = 'This quiz has no questions yet.';
    header("Location: quizzes.php");
    exit;
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-lg-9 col-xl-8">
        <div class="mb-3">
            <a href="quizzes.php" class="text-decoration-none">&larr; Back to Quizzes</a>
        </div>

        <div class="card shadow-sm border-0 mb-4 bg-primary text-white">
            <div class="card-body p-4">
                <h2 class="fw-bold mb-1"><?= e($quiz['title']) ?></h2>
                <p class="mb-0 opacity-75"><?= e($quiz['description'] ?: 'Please answer all questions below and submit.') ?></p>
            </div>
        </div>

        <form action="submit-quiz.php" method="POST">
            <input type="hidden" name="quiz_id" value="<?= e($quizId) ?>">

            <?php foreach ($questions as $index => $q): ?>
                <div class="card shadow-sm border-0 mb-4">
                    <div class="card-body p-4">
                        <h5 class="fw-bold text-dark mb-3">
                            Q<?= $index + 1 ?>. <?= e($q['question_text']) ?>
                        </h5>

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="answers[<?= e($q['id']) ?>]" id="q<?= e($q['id']) ?>_a" value="a" required>
                            <label class="form-check-label w-100 p-2 rounded border bg-light" for="q<?= e($q['id']) ?>_a">
                                <strong>A:</strong> <?= e($q['option_a']) ?>
                            </label>
                        </div>

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="answers[<?= e($q['id']) ?>]" id="q<?= e($q['id']) ?>_b" value="b">
                            <label class="form-check-label w-100 p-2 rounded border bg-light" for="q<?= e($q['id']) ?>_b">
                                <strong>B:</strong> <?= e($q['option_b']) ?>
                            </label>
                        </div>

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="answers[<?= e($q['id']) ?>]" id="q<?= e($q['id']) ?>_c" value="c">
                            <label class="form-check-label w-100 p-2 rounded border bg-light" for="q<?= e($q['id']) ?>_c">
                                <strong>C:</strong> <?= e($q['option_c']) ?>
                            </label>
                        </div>

                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="answers[<?= e($q['id']) ?>]" id="q<?= e($q['id']) ?>_d" value="d">
                            <label class="form-check-label w-100 p-2 rounded border bg-light" for="q<?= e($q['id']) ?>_d">
                                <strong>D:</strong> <?= e($q['option_d']) ?>
                            </label>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>

            <div class="d-grid gap-2 mb-5">
                <button type="submit" class="btn btn-success btn-lg fw-bold py-3">Submit Quiz Answers &rarr;</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
