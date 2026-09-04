<?php
require_once __DIR__ . '/../includes/auth-check.php';
checkAuth('admin');

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$pdo = getDBConnection();

// Fetch flash messages
$flashSuccess = $_SESSION['flash_success'] ?? null;
$flashError   = $_SESSION['flash_error'] ?? null;
unset($_SESSION['flash_success'], $_SESSION['flash_error']);

// Query all quizzes with question count using prepared statement
$stmt = $pdo->prepare("
    SELECT q.id, q.title, q.description, q.created_at, COUNT(quest.id) AS question_count
    FROM quizzes q
    LEFT JOIN questions quest ON q.id = quest.quiz_id
    GROUP BY q.id
    ORDER BY q.id DESC
");
$stmt->execute();
$quizzes = $stmt->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h2 class="fw-bold mb-0">Quiz Management</h2>
        <p class="text-muted mb-0">Create, edit, and manage all quiz modules</p>
    </div>
    <a href="add-quiz.php" class="btn btn-success">
        <i class="bi bi-plus-lg"></i> + Create New Quiz
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

<div class="card shadow-sm">
    <div class="card-body p-0">
        <?php if (empty($quizzes)): ?>
            <div class="text-center py-5">
                <p class="text-muted lead mb-3">No quizzes have been created yet.</p>
                <a href="add-quiz.php" class="btn btn-primary">Create Your First Quiz</a>
            </div>
        <?php else: ?>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col" style="width: 5%;">#</th>
                            <th scope="col" style="width: 25%;">Title</th>
                            <th scope="col" style="width: 35%;">Description</th>
                            <th scope="col" class="text-center" style="width: 15%;">Questions</th>
                            <th scope="col" class="text-end" style="width: 20%;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($quizzes as $quiz): ?>
                            <tr>
                                <th scope="row"><?= e($quiz['id']) ?></th>
                                <td class="fw-semibold"><?= e($quiz['title']) ?></td>
                                <td class="text-muted small"><?= e($quiz['description'] ?: 'No description provided.') ?></td>
                                <td class="text-center">
                                    <span class="badge <?= $quiz['question_count'] > 0 ? 'bg-primary' : 'bg-warning text-dark' ?> fs-6">
                                        <?= e($quiz['question_count']) ?> Question<?= $quiz['question_count'] === 1 ? '' : 's' ?>
                                    </span>
                                </td>
                                <td class="text-end">
                                    <div class="btn-group btn-group-sm" role="group">
                                        <a href="questions.php?quiz_id=<?= e($quiz['id']) ?>" class="btn btn-outline-primary" title="Manage Questions">
                                            Questions
                                        </a>
                                        <a href="edit-quiz.php?id=<?= e($quiz['id']) ?>" class="btn btn-outline-secondary" title="Edit Quiz">
                                            Edit
                                        </a>
                                        <a href="delete-quiz.php?id=<?= e($quiz['id']) ?>" 
                                           class="btn btn-outline-danger" 
                                           onclick="return confirm('Are you sure you want to delete this quiz? All associated questions and student results will be permanently removed.');" 
                                           title="Delete Quiz">
                                            Delete
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
