<?php
require_once __DIR__ . '/../includes/auth-check.php';
checkAuth('admin');

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$pdo = getDBConnection();

$quizId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($quizId <= 0) {
    $_SESSION['flash_error'] = 'Invalid quiz ID.';
    header("Location: quizzes.php");
    exit;
}

// Fetch quiz
$stmt = $pdo->prepare("SELECT id, title, description FROM quizzes WHERE id = ? LIMIT 1");
$stmt->execute([$quizId]);
$quiz = $stmt->fetch();

if (!$quiz) {
    $_SESSION['flash_error'] = 'Quiz not found.';
    header("Location: quizzes.php");
    exit;
}

$errors = [];
$title       = $quiz['title'];
$description = $quiz['description'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title       = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');

    if (empty($title)) {
        $errors[] = 'Quiz title is required.';
    }

    if (empty($errors)) {
        $updateStmt = $pdo->prepare("UPDATE quizzes SET title = ?, description = ? WHERE id = ?");
        if ($updateStmt->execute([$title, $description, $quizId])) {
            $_SESSION['flash_success'] = "Quiz updated successfully!";
            header("Location: quizzes.php");
            exit;
        } else {
            $errors[] = 'Failed to update quiz.';
        }
    }
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-8 col-lg-6">
        <div class="card shadow-sm mt-3">
            <div class="card-header bg-secondary text-white py-3">
                <h4 class="mb-0 fw-bold">Edit Quiz</h4>
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

                <form action="edit-quiz.php?id=<?= e($quizId) ?>" method="POST" novalidate>
                    <div class="mb-3">
                        <label for="title" class="form-label fw-semibold">Quiz Title <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="title" name="title" value="<?= e($title) ?>" required>
                    </div>

                    <div class="mb-3">
                        <label for="description" class="form-label fw-semibold">Description</label>
                        <textarea class="form-control" id="description" name="description" rows="4"><?= e($description) ?></textarea>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <a href="quizzes.php" class="btn btn-outline-secondary">&larr; Cancel</a>
                        <button type="submit" class="btn btn-primary">Update Quiz</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
