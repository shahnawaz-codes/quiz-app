<?php
require_once __DIR__ . '/../includes/auth-check.php';
checkAuth('admin');

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$pdo = getDBConnection();

$selectedQuizId = isset($_GET['quiz_id']) ? (int)$_GET['quiz_id'] : 0;

// Fetch all quizzes for filter dropdown
$quizzesStmt = $pdo->query("SELECT id, title FROM quizzes ORDER BY title ASC");
$allQuizzes  = $quizzesStmt->fetchAll();

// Prepared statement to fetch results, filterable by quiz_id
if ($selectedQuizId > 0) {
    $stmt = $pdo->prepare("
        SELECT r.id, r.score, r.total_questions, r.percentage, r.completed_at,
               u.name AS student_name, u.email AS student_email,
               q.title AS quiz_title
        FROM results r
        JOIN users u ON r.user_id = u.id
        JOIN quizzes q ON r.quiz_id = q.id
        WHERE r.quiz_id = ?
        ORDER BY r.id DESC
    ");
    $stmt->execute([$selectedQuizId]);
} else {
    $stmt = $pdo->prepare("
        SELECT r.id, r.score, r.total_questions, r.percentage, r.completed_at,
               u.name AS student_name, u.email AS student_email,
               q.title AS quiz_title
        FROM results r
        JOIN users u ON r.user_id = u.id
        JOIN quizzes q ON r.quiz_id = q.id
        ORDER BY r.id DESC
    ");
    $stmt->execute();
}
$resultsList = $stmt->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h2 class="fw-bold mb-1">Student Quiz Results</h2>
        <p class="text-muted mb-0">Review score performance across all student quiz attempts</p>
    </div>
    <div>
        <a href="dashboard.php" class="btn btn-outline-secondary">&larr; Back to Dashboard</a>
    </div>
</div>

<!-- Filter Bar -->
<div class="card shadow-sm border-0 mb-4 bg-light">
    <div class="card-body p-3">
        <form action="results.php" method="GET" class="row g-3 align-items-center">
            <div class="col-auto">
                <label for="quiz_id" class="col-form-label fw-semibold">Filter by Quiz:</label>
            </div>
            <div class="col-md-5">
                <select name="quiz_id" id="quiz_id" class="form-select" onchange="this.form.submit()">
                    <option value="0" <?= $selectedQuizId === 0 ? 'selected' : '' ?>>-- All Quizzes --</option>
                    <?php foreach ($allQuizzes as $q): ?>
                        <option value="<?= e($q['id']) ?>" <?= $selectedQuizId === (int)$q['id'] ? 'selected' : '' ?>>
                            <?= e($q['title']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <?php if ($selectedQuizId > 0): ?>
                <div class="col-auto">
                    <a href="results.php" class="btn btn-outline-dark btn-sm">Clear Filter</a>
                </div>
            <?php endif; ?>
        </form>
    </div>
</div>

<!-- Results Table -->
<div class="card shadow-sm border-0">
    <div class="card-body p-0">
        <?php if (empty($resultsList)): ?>
            <div class="text-center py-5">
                <p class="text-muted lead mb-0">No quiz attempts found for this selection.</p>
            </div>
        <?php else: ?>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Student</th>
                            <th scope="col">Quiz Title</th>
                            <th scope="col" class="text-center">Score</th>
                            <th scope="col" class="text-center">Percentage</th>
                            <th scope="col">Date Attempted</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($resultsList as $index => $row): ?>
                            <tr>
                                <th><?= count($resultsList) - $index ?></th>
                                <td>
                                    <div class="fw-bold"><?= e($row['student_name']) ?></div>
                                    <small class="text-muted"><?= e($row['student_email']) ?></small>
                                </td>
                                <td class="fw-semibold"><?= e($row['quiz_title']) ?></td>
                                <td class="text-center fw-bold"><?= e($row['score']) ?> / <?= e($row['total_questions']) ?></td>
                                <td class="text-center">
                                    <span class="badge <?= $row['percentage'] >= 50 ? 'bg-success' : 'bg-danger' ?> fs-7">
                                        <?= e($row['percentage']) ?>%
                                    </span>
                                </td>
                                <td class="text-muted small"><?= e(date('M j, Y, g:i a', strtotime($row['completed_at']))) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
