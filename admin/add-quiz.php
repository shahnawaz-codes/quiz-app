<?php
require_once __DIR__ . '/../includes/auth-check.php';
checkAuth('admin');

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$errors = [];
$title = '';
$description = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title       = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');

    if (empty($title)) {
        $errors[] = 'Quiz title is required.';
    }

    if (empty($errors)) {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("INSERT INTO quizzes (title, description) VALUES (?, ?)");
        if ($stmt->execute([$title, $description])) {
            $quizId = $pdo->lastInsertId();
            $_SESSION['flash_success'] = "Quiz '{$title}' created successfully! Now add questions to it.";
            header("Location: questions.php?quiz_id={$quizId}");
            exit;
        } else {
            $errors[] = 'Failed to create quiz. Please try again.';
        }
    }
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-8 col-lg-6">
        <div class="card shadow-sm mt-3">
            <div class="card-header bg-primary text-white py-3">
                <h4 class="mb-0 fw-bold">Create New Quiz</h4>
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

                <form action="add-quiz.php" method="POST" novalidate>
                    <div class="mb-3">
                        <label for="title" class="form-label fw-semibold">Quiz Title <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="title" name="title" value="<?= e($title) ?>" placeholder="e.g. PHP & Web Development Basics" required>
                    </div>

                    <div class="mb-3">
                        <label for="description" class="form-label fw-semibold">Description</label>
                        <textarea class="form-control" id="description" name="description" rows="4" placeholder="Brief overview of what this quiz covers..."><?= e($description) ?></textarea>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <a href="quizzes.php" class="btn btn-outline-secondary">&larr; Cancel</a>
                        <button type="submit" class="btn btn-success">Save & Add Questions &rarr;</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
