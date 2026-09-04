<?php
require_once __DIR__ . '/../includes/auth-check.php';
checkAuth('admin');

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$pdo = getDBConnection();

$questionId = isset($_GET['id']) ? (int)$_GET['id'] : (isset($_POST['id']) ? (int)$_POST['id'] : 0);
if ($questionId <= 0) {
    $_SESSION['flash_error'] = 'Invalid question ID.';
    header("Location: quizzes.php");
    exit;
}

// Fetch existing question
$stmt = $pdo->prepare("SELECT id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer FROM questions WHERE id = ? LIMIT 1");
$stmt->execute([$questionId]);
$question = $stmt->fetch();

if (!$question) {
    $_SESSION['flash_error'] = 'Question not found.';
    header("Location: quizzes.php");
    exit;
}

$quizId        = $question['quiz_id'];
$errors        = [];
$questionText  = $question['question_text'];
$optionA       = $question['option_a'];
$optionB       = $question['option_b'];
$optionC       = $question['option_c'];
$optionD       = $question['option_d'];
$correctAnswer = $question['correct_answer'];

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
        $updateStmt = $pdo->prepare("
            UPDATE questions 
            SET question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ? 
            WHERE id = ?
        ");
        if ($updateStmt->execute([$questionText, $optionA, $optionB, $optionC, $optionD, $correctAnswer, $questionId])) {
            $_SESSION['flash_success'] = 'Question updated successfully!';
            header("Location: questions.php?quiz_id={$quizId}");
            exit;
        } else {
            $errors[] = 'Failed to update question.';
        }
    }
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-9 col-lg-8">
        <div class="card shadow-sm mt-3">
            <div class="card-header bg-secondary text-white py-3">
                <h4 class="mb-0 fw-bold">Edit Question</h4>
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

                <form action="edit-question.php?id=<?= e($questionId) ?>" method="POST" novalidate>
                    <input type="hidden" name="id" value="<?= e($questionId) ?>">

                    <div class="mb-3">
                        <label for="question_text" class="form-label fw-semibold">Question Text <span class="text-danger">*</span></label>
                        <textarea class="form-control" id="question_text" name="question_text" rows="3" required><?= e($questionText) ?></textarea>
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
                        <a href="questions.php?quiz_id=<?= e($quizId) ?>" class="btn btn-outline-secondary">&larr; Cancel</a>
                        <button type="submit" class="btn btn-primary">Update Question</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
