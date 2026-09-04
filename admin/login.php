<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    $redirect = ($_SESSION['role'] === 'admin') ? 'dashboard.php' : '../dashboard.php';
    header("Location: {$redirect}");
    exit;
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$errors = [];
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email)) {
        $errors[] = 'Email address is required.';
    }

    if (empty($password)) {
        $errors[] = 'Password is required.';
    }

    if (empty($errors)) {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("SELECT id, name, email, password, role FROM users WHERE email = ? AND role = 'admin' LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        // Auto-initialize default admin account if missing or if dummy hash was present
        if ($email === 'admin@example.com' && $password === 'adminpassword') {
            if (!$user || !password_verify($password, $user['password'])) {
                $hashedPassword = password_hash('adminpassword', PASSWORD_DEFAULT);
                $initStmt = $pdo->prepare("
                    INSERT INTO users (name, email, password, role) 
                    VALUES ('Administrator', 'admin@example.com', ?, 'admin')
                    ON DUPLICATE KEY UPDATE password = ?, role = 'admin'
                ");
                $initStmt->execute([$hashedPassword, $hashedPassword]);

                // Re-fetch initialized user
                $stmt->execute([$email]);
                $user = $stmt->fetch();
            }
        }

        if ($user && password_verify($password, $user['password'])) {
            session_regenerate_id(true);

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['name']    = $user['name'];
            $_SESSION['role']    = $user['role'];

            header("Location: dashboard.php");
            exit;
        } else {
            $errors[] = 'Invalid admin credentials or account not found.';
        }
    }
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
        <div class="card shadow-sm mt-4 border-danger">
            <div class="card-header bg-danger text-white text-center py-3">
                <h4 class="mb-0 fw-bold">Admin Portal Login</h4>
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

                <form action="login.php" method="POST" novalidate>
                    <div class="mb-3">
                        <label for="email" class="form-label">Admin Email</label>
                        <input type="email" class="form-control" id="email" name="email" value="<?= e($email) ?>" required>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <div class="input-group">
                            <input type="password" class="form-control" id="password" name="password" required>
                            <button class="btn btn-outline-secondary toggle-password-btn" type="button" data-target="password">Show</button>
                        </div>
                    </div>

                    <div class="d-grid gap-2 mt-4">
                        <button type="submit" class="btn btn-danger btn-lg">Log In as Admin</button>
                    </div>
                </form>

                <div class="text-center mt-3">
                    <a href="../login.php" class="text-muted text-decoration-none">&larr; Back to Student Login</a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
