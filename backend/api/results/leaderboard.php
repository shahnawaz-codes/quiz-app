<?php
require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/auth-check.php';
require_once __DIR__ . '/../../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse(false, null, 'Method Not Allowed', 405);
}

$pdo = getDBConnection();

// Fetch top players ordered by total points / total score
$stmt = $pdo->query("
    SELECT u.id, u.name, u.email, u.role,
           COALESCE(SUM(r.score), 0) AS total_score,
           COALESCE(SUM(r.score * 100), 0) AS total_exp,
           COUNT(r.id) AS total_quests
    FROM users u
    LEFT JOIN results r ON u.id = r.user_id
    WHERE u.role = 'student'
    GROUP BY u.id, u.name, u.email, u.role
    ORDER BY total_exp DESC, total_score DESC, u.id ASC
    LIMIT 10
");

$leaderboard = $stmt->fetchAll();
$avatars = ['👹', '🐨', '☁️', '🧙‍♂️', '🥷', '🐲', '🤖', '🦊'];

$formatted = [];
$rank = 1;
foreach ($leaderboard as $player) {
    $avatar = $avatars[($player['id'] - 1) % count($avatars)];
    $formatted[] = [
        'rank'         => $rank++,
        'id'           => (int)$player['id'],
        'name'         => $player['name'],
        'points'       => (int)$player['total_exp'],
        'total_score'  => (int)$player['total_score'],
        'total_quests' => (int)$player['total_quests'],
        'avatar'       => $avatar
    ];
}

sendJsonResponse(true, ['leaderboard' => $formatted]);
