<?php
/**
 * Results Business Logic Service
 */

require_once __DIR__ . '/../config/db.php';

class ResultService {
    /**
     * Submit quiz answers and calculate score on server
     */
    public static function submitQuiz($userId, $quizId, array $answers) {
        $userId = (int)$userId;
        $quizId = (int)$quizId;

        if ($quizId <= 0) {
            return ['success' => false, 'error' => 'Invalid quiz ID.', 'code' => 400];
        }

        $pdo = getDBConnection();

        // Re-fetch questions directly from database
        $stmt = $pdo->prepare("SELECT id, correct_answer FROM questions WHERE quiz_id = ?");
        $stmt->execute([$quizId]);
        $questions = $stmt->fetchAll();

        if (empty($questions)) {
            return ['success' => false, 'error' => 'Quiz contains no questions or does not exist.', 'code' => 400];
        }

        $totalQuestions = count($questions);
        $score = 0;

        foreach ($questions as $q) {
            $qId = $q['id'];
            $correct = strtolower(trim($q['correct_answer']));
            $userChoice = isset($answers[$qId]) ? strtolower(trim($answers[$qId])) : '';

            if ($userChoice !== '' && $userChoice === $correct) {
                $score++;
            }
        }

        $percentage = $totalQuestions > 0 ? round(($score / $totalQuestions) * 100, 2) : 0;

        $insertStmt = $pdo->prepare("
            INSERT INTO results (user_id, quiz_id, score, total_questions, percentage) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $insertStmt->execute([$userId, $quizId, $score, $totalQuestions, $percentage]);
        $resultId = (int)$pdo->lastInsertId();

        return [
            'success' => true,
            'data'    => [
                'result_id'       => $resultId,
                'score'           => $score,
                'total_questions' => $totalQuestions,
                'percentage'      => $percentage,
                'passed'          => $percentage >= 50
            ]
        ];
    }

    /**
     * Get single result details with IDOR check
     */
    public static function getResultById($resultId, array $userPayload) {
        $resultId = (int)$resultId;
        if ($resultId <= 0) {
            return ['success' => false, 'error' => 'Invalid result ID.', 'code' => 400];
        }

        $pdo = getDBConnection();

        $stmt = $pdo->prepare("
            SELECT r.id, r.user_id, r.quiz_id, r.score, r.total_questions, r.percentage, r.completed_at, 
                   q.title AS quiz_title, u.name AS student_name, u.email AS student_email
            FROM results r
            JOIN quizzes q ON r.quiz_id = q.id
            JOIN users u ON r.user_id = u.id
            WHERE r.id = ?
            LIMIT 1
        ");
        $stmt->execute([$resultId]);
        $result = $stmt->fetch();

        if (!$result) {
            return ['success' => false, 'error' => 'Result not found.', 'code' => 404];
        }

        // Ownership Guard
        if (($userPayload['role'] ?? '') !== 'admin' && (int)$result['user_id'] !== (int)$userPayload['user_id']) {
            return ['success' => false, 'error' => 'Access Denied: You do not have permission to view this quiz result.', 'code' => 403];
        }

        return [
            'success' => true,
            'data'    => [
                'result' => [
                    'id'              => (int)$result['id'],
                    'user_id'         => (int)$result['user_id'],
                    'quiz_id'         => (int)$result['quiz_id'],
                    'quiz_title'      => $result['quiz_title'],
                    'student_name'    => $result['student_name'],
                    'student_email'   => $result['student_email'],
                    'score'           => (int)$result['score'],
                    'total_questions' => (int)$result['total_questions'],
                    'percentage'      => (float)$result['percentage'],
                    'completed_at'    => $result['completed_at'],
                    'passed'          => (float)$result['percentage'] >= 50.0
                ]
            ]
        ];
    }

    /**
     * Get user history
     */
    public static function getUserHistory($userId) {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("
            SELECT r.id, r.quiz_id, r.score, r.total_questions, r.percentage, r.completed_at, q.title AS quiz_title
            FROM results r
            JOIN quizzes q ON r.quiz_id = q.id
            WHERE r.user_id = ?
            ORDER BY r.completed_at DESC
        ");
        $stmt->execute([(int)$userId]);
        $results = $stmt->fetchAll();

        $formattedResults = [];
        foreach ($results as $r) {
            $formattedResults[] = [
                'id'              => (int)$r['id'],
                'quiz_id'         => (int)$r['quiz_id'],
                'quiz_title'      => $r['quiz_title'],
                'score'           => (int)$r['score'],
                'total_questions' => (int)$r['total_questions'],
                'percentage'      => (float)$r['percentage'],
                'completed_at'    => $r['completed_at'],
                'passed'          => (float)$r['percentage'] >= 50.0
            ];
        }

        return ['success' => true, 'data' => ['results' => $formattedResults]];
    }

    /**
     * Get admin list of results across all students
     */
    public static function getAdminResults($quizId = 0) {
        $pdo = getDBConnection();
        $sql = "
            SELECT r.id, r.user_id, r.quiz_id, r.score, r.total_questions, r.percentage, r.completed_at, 
                   q.title AS quiz_title, u.name AS student_name, u.email AS student_email
            FROM results r
            JOIN quizzes q ON r.quiz_id = q.id
            JOIN users u ON r.user_id = u.id
        ";

        $params = [];
        if ($quizId > 0) {
            $sql .= " WHERE r.quiz_id = ?";
            $params[] = (int)$quizId;
        }

        $sql .= " ORDER BY r.completed_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll();

        $formattedResults = [];
        foreach ($results as $r) {
            $formattedResults[] = [
                'id'              => (int)$r['id'],
                'user_id'         => (int)$r['user_id'],
                'quiz_id'         => (int)$r['quiz_id'],
                'quiz_title'      => $r['quiz_title'],
                'student_name'    => $r['student_name'],
                'student_email'   => $r['student_email'],
                'score'           => (int)$r['score'],
                'total_questions' => (int)$r['total_questions'],
                'percentage'      => (float)$r['percentage'],
                'completed_at'    => $r['completed_at'],
                'passed'          => (float)$r['percentage'] >= 50.0
            ];
        }

        return ['success' => true, 'data' => ['results' => $formattedResults]];
    }

    /**
     * Get global leaderboard
     */
    public static function getLeaderboard() {
        $pdo = getDBConnection();
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

        return ['success' => true, 'data' => ['leaderboard' => $formatted]];
    }
}
