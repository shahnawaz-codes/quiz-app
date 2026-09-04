<?php
require_once __DIR__ . '/config/db.php';

try {
    $pdo = getDBConnection();
    $email = 'admin@example.com';
    $password = 'adminpassword';
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();

    if ($existing) {
        $update = $pdo->prepare("UPDATE users SET password = ?, role = 'admin' WHERE id = ?");
        $update->execute([$hashedPassword, $existing['id']]);
        echo "<div style='font-family: sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; border: 1px solid #28a745; border-radius: 8px; background: #d4edda; color: #155724;'>";
        echo "<h2>Success! Admin Account Updated</h2>";
        echo "<p>Admin user <strong>admin@example.com</strong> has been configured with password <strong>adminpassword</strong>.</p>";
        echo "<a href='admin/login.php' style='display: inline-block; background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Go to Admin Login &rarr;</a>";
        echo "</div>";
    } else {
        $insert = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES ('Administrator', ?, ?, 'admin')");
        $insert->execute([$email, $hashedPassword]);
        echo "<div style='font-family: sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; border: 1px solid #28a745; border-radius: 8px; background: #d4edda; color: #155724;'>";
        echo "<h2>Success! Admin Account Created</h2>";
        echo "<p>Admin user <strong>admin@example.com</strong> created with password <strong>adminpassword</strong>.</p>";
        echo "<a href='admin/login.php' style='display: inline-block; background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Go to Admin Login &rarr;</a>";
        echo "</div>";
    }
} catch (Exception $e) {
    echo "<div style='font-family: sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; border: 1px solid #dc3545; border-radius: 8px; background: #f8d7da; color: #721c24;'>";
    echo "<h2>Database Error</h2>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
    echo "</div>";
}
