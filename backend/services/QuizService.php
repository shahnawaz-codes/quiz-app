<?php
/**
 * Quizzes Business Logic Service
 */

require_once __DIR__ . '/../config/db.php';

class QuizService {
    /**
     * Get list of all quizzes with question count
     */
    public static function getAllQuizzes() {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("
            SELECT q.id, q.title, q.description, q.created_at, COUNT(quest.id) AS question_count
            FROM quizzes q
            LEFT JOIN questions quest ON q.id = quest.quiz_id
            GROUP BY q.id
            ORDER BY q.id DESC
        ");
        $stmt->execute();
        $quizzes = $stmt->fetchAll();

        foreach ($quizzes as &$quiz) {
            $quiz['id'] = (int)$quiz['id'];
            $quiz['question_count'] = (int)$quiz['question_count'];
        }

        return ['success' => true, 'data' => ['quizzes' => $quizzes]];
    }

    /**
     * Get single quiz details with questions
     */
    public static function getQuizById($quizId, $userRole) {
        $quizId = (int)$quizId;
        if ($quizId <= 0) {
            return ['success' => false, 'error' => 'Invalid quiz ID.', 'code' => 400];
        }

        $pdo = getDBConnection();
        $stmt = $pdo->prepare("SELECT id, title, description, created_at FROM quizzes WHERE id = ? LIMIT 1");
        $stmt->execute([$quizId]);
        $quiz = $stmt->fetch();

        if (!$quiz) {
            return ['success' => false, 'error' => 'Quiz not found.', 'code' => 404];
        }

        $quiz['id'] = (int)$quiz['id'];

        $qStmt = $pdo->prepare("
            SELECT id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer 
            FROM questions 
            WHERE quiz_id = ? 
            ORDER BY id ASC
        ");
        $qStmt->execute([$quizId]);
        $questions = $qStmt->fetchAll();

        $formattedQuestions = [];
        foreach ($questions as $q) {
            $item = [
                'id'            => (int)$q['id'],
                'quiz_id'       => (int)$q['quiz_id'],
                'question_text' => $q['question_text'],
                'option_a'      => $q['option_a'],
                'option_b'      => $q['option_b'],
                'option_c'      => $q['option_c'],
                'option_d'      => $q['option_d'],
            ];

            // Only include correct_answer if user is admin
            if ($userRole === 'admin') {
                $item['correct_answer'] = $q['correct_answer'];
            }

            $formattedQuestions[] = $item;
        }

        $quiz['questions'] = $formattedQuestions;

        return ['success' => true, 'data' => ['quiz' => $quiz]];
    }

    /**
     * Create a new quiz
     */
    public static function createQuiz($title, $description) {
        $title       = trim($title ?? '');
        $description = trim($description ?? '');

        if (empty($title)) {
            return ['success' => false, 'error' => 'Quiz title is required.', 'code' => 400];
        }

        $pdo = getDBConnection();
        $stmt = $pdo->prepare("INSERT INTO quizzes (title, description) VALUES (?, ?)");

        if ($stmt->execute([$title, $description])) {
            $quizId = (int)$pdo->lastInsertId();
            return [
                'success' => true,
                'data'    => [
                    'quiz' => [
                        'id'             => $quizId,
                        'title'          => $title,
                        'description'    => $description,
                        'question_count' => 0
                    ]
                ]
            ];
        }

        return ['success' => false, 'error' => 'Failed to create quiz.', 'code' => 500];
    }

    /**
     * Update an existing quiz
     */
    public static function updateQuiz($id, $title, $description) {
        $id          = (int)$id;
        $title       = trim($title ?? '');
        $description = trim($description ?? '');

        if ($id <= 0) {
            return ['success' => false, 'error' => 'Invalid quiz ID.', 'code' => 400];
        }
        if (empty($title)) {
            return ['success' => false, 'error' => 'Quiz title is required.', 'code' => 400];
        }

        $pdo = getDBConnection();
        $stmt = $pdo->prepare("UPDATE quizzes SET title = ?, description = ? WHERE id = ?");

        if ($stmt->execute([$title, $description, $id])) {
            return ['success' => true, 'data' => ['message' => 'Quiz updated successfully']];
        }

        return ['success' => false, 'error' => 'Failed to update quiz.', 'code' => 500];
    }

    /**
     * Delete a quiz
     */
    public static function deleteQuiz($id) {
        $id = (int)$id;
        if ($id <= 0) {
            return ['success' => false, 'error' => 'Invalid quiz ID.', 'code' => 400];
        }

        $pdo = getDBConnection();
        $stmt = $pdo->prepare("DELETE FROM quizzes WHERE id = ?");

        if ($stmt->execute([$id])) {
            return ['success' => true, 'data' => ['message' => 'Quiz deleted successfully']];
        }

        return ['success' => false, 'error' => 'Failed to delete quiz.', 'code' => 500];
    }
}
