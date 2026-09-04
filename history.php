<?php
require_once __DIR__ . '/includes/auth-check.php';
checkAuth('student');

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/functions.php';

$pdo = getDBConnection();
$userId = (int)$_SESSION['user_id'];

// Fetch student's own quiz history sorted newest first
$stmt = $pdo->prepare("
    SELECT r.id, r.score, r.total_questions, r.percentage, r.completed_at, q.title AS quiz_title
    FROM results r
    JOIN quizzes q ON r.quiz_id = q.id
    WHERE r.user_id = ?
    ORDER BY r.id DESC
");
$stmt->execute([$userId]);
$history = $stmt->fetchAll();

require_once __DIR__ . '/includes/header.php';
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h2 class="fw-bold mb-1">Your Quiz History</h2>
        <p class="text-muted mb-0">Overview of all your past quiz attempts and scores</p>
    </div>
    <a href="quizzes.php" class="btn btn-primary">Take a Quiz</a>
</div>

<div class="card shadow-sm border-0">
    <div class="card-body p-0">
        <?php if (empty($history)): ?>
            <div class="text-center py-5">
                <p class="text-muted lead mb-3">You haven't completed any quizzes yet.</p>
                <a href="quizzes.php" class="btn btn-primary">Browse Available Quizzes</a>
            </div>
        <?php else: ?>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Quiz Title</th>
                            <th scope="col" class="text-center">Score</th>
                            <th scope="col" class="text-center">Percentage</th>
                            <th scope="col">Date Completed</th>
                            <th scope="col" class="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($history as $index => $item): ?>
                            <tr>
                                <th><?= count($history) - $index ?></th>
                                <td class="fw-semibold"><?= e($item['quiz_title']) ?></td>
                                <td class="text-center fw-bold"><?= e($item['score']) ?> / <?= e($item['total_questions']) ?></td>
                                <td class="text-center">
                                    <span class="badge <?= $item['percentage'] >= 50 ? 'bg-success' : 'bg-danger' ?> fs-7">
                                        <?= e($item['percentage']) ?>%
                                    </span>
                                </td>
                                <td class="text-muted small"><?= e(date('M j, Y, g:i a', strtotime($item['completed_at']))) ?></td>
                                <td class="text-end">
                                    <a href="result.php?id=<?= e($item['id']) ?>" class="btn btn-sm btn-outline-primary">
                                        View Result
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
