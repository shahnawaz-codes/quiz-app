<?php
require_once __DIR__ . '/../includes/auth-check.php';
checkAuth('admin');

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$pdo = getDBConnection();

$quizId = isset($_GET['quiz_id']) ? (int)$_GET['quiz_id'] : (isset($_POST['quiz_id']) ? (int)$_POST['quiz_id'] : 0);
if ($quizId <= 0) {
    $_SESSION['flash_error'] = 'Invalid quiz ID.';
    header("Location: quizzes.php");
    exit;
}

// Verify quiz exists
$quizStmt = $pdo->prepare("SELECT id, title FROM quizzes WHERE id = ? LIMIT 1");
$quizStmt->execute([$quizId]);
$quiz = $quizStmt->fetch();

if (!$quiz) {
    $_SESSION['flash_error'] = 'Quiz not found.';
    header("Location: quizzes.php");
    exit;
}

$errors = [];
$questionText  = '';
$optionA       = '';
$optionB       = '';
$optionC       = '';
$optionD       = '';
$correctAnswer = 'a';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $questionText  = trim($_POST['question_text'] ?? '');
    $optionA       = trim($_POST['option_a'] ?? '');
    $optionB       = trim($_POST['option_b'] ?? '');
    $optionC       = trim($_POST['option_c'] ?? '');
    $optionD       = trim($_POST['option_d'] ?? '');
    $correctAnswer = strtolower(trim($_POST['correct_answer'] ?? ''));

    if (empty($questionText)) {
        $errors[] = 'Question text is required.';
    }
    if (empty($optionA)) {
        $errors[] = 'Option A is required.';
    }
    if (empty($optionB)) {
        $errors[] = 'Option B is required.';
    }
    if (empty($optionC)) {
        $errors[] = 'Option C is required.';
    }
    if (empty($optionD)) {
        $errors[] = 'Option D is required.';
    }
    if (!in_array($correctAnswer, ['a', 'b', 'c', 'd'], true)) {
        $errors[] = 'Correct answer must be Option A, B, C, or D.';
    }

    if (empty($errors)) {
        $stmt = $pdo->prepare("
            INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        if ($stmt->execute([$quizId, $questionText, $optionA, $optionB, $optionC, $optionD, $correctAnswer])) {
            $_SESSION['flash_success'] = 'Question added successfully!';
            header("Location: questions.php?quiz_id={$quizId}");
            exit;
        } else {
            $errors[] = 'Failed to add question.';
        }
    }
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-9 col-lg-8">
        <div class="card shadow-sm mt-3">
            <div class="card-header bg-primary text-white py-3">
                <h4 class="mb-0 fw-bold">Add Question to: <?= e($quiz['title']) ?></h4>
            </div>
            <div class="card-body p-4">
                <?php if (!empty($errors)): ?>
                    <div class="alert alert-danger" role="alert">
                        <ul class="mb-0 ps-3">
                            <?php foreach ($errors as $error): ?>
                                <li><?= e($error) ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>

                <form action="add-question.php?quiz_id=<?= e($quizId) ?>" method="POST" novalidate>
                    <input type="hidden" name="quiz_id" value="<?= e($quizId) ?>">

                    <div class="mb-3">
                        <label for="question_text" class="form-label fw-semibold">Question Text <span class="text-danger">*</span></label>
                        <textarea class="form-control" id="question_text" name="question_text" rows="3" placeholder="Enter the question here..." required><?= e($questionText) ?></textarea>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label for="option_a" class="form-label fw-semibold">Option A <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="option_a" name="option_a" value="<?= e($optionA) ?>" required>
                        </div>
                        <div class="col-md-6">
                            <label for="option_b" class="form-label fw-semibold">Option B <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="option_b" name="option_b" value="<?= e($optionB) ?>" required>
                        </div>
                        <div class="col-md-6">
                            <label for="option_c" class="form-label fw-semibold">Option C <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="option_c" name="option_c" value="<?= e($optionC) ?>" required>
                        </div>
                        <div class="col-md-6">
                            <label for="option_d" class="form-label fw-semibold">Option D <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="option_d" name="option_d" value="<?= e($optionD) ?>" required>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-semibold">Correct Answer <span class="text-danger">*</span></label>
                        <select class="form-select" name="correct_answer" required>
                            <option value="a" <?= $correctAnswer === 'a' ? 'selected' : '' ?>>Option A</option>
                            <option value="b" <?= $correctAnswer === 'b' ? 'selected' : '' ?>>Option B</option>
                            <option value="c" <?= $correctAnswer === 'c' ? 'selected' : '' ?>>Option C</option>
                            <option value="d" <?= $correctAnswer === 'd' ? 'selected' : '' ?>>Option D</option>
                        </select>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <a href="questions.php?quiz_id=<?= e($quizId) ?>" class="btn btn-outline-secondary">&larr; Back to Questions</a>
                        <button type="submit" class="btn btn-success">Save Question</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
