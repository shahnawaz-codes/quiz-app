<?php
/**
 * Question Business Logic Service
 */

require_once __DIR__ . '/../config/db.php';

class QuestionService {
    /**
     * Get questions for a specific quiz
     */
    public static function getQuestionsForQuiz($quizId) {
        $quizId = (int)$quizId;
        if ($quizId <= 0) {
            return ['success' => false, 'error' => 'Invalid quiz ID.', 'code' => 400];
        }

        $pdo = getDBConnection();

        $quizStmt = $pdo->prepare("SELECT id, title, description FROM quizzes WHERE id = ? LIMIT 1");
        $quizStmt->execute([$quizId]);
        $quiz = $quizStmt->fetch();

        if (!$quiz) {
            return ['success' => false, 'error' => 'Quiz not found.', 'code' => 404];
        }

        $stmt = $pdo->prepare("
            SELECT id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer 
            FROM questions 
            WHERE quiz_id = ? 
            ORDER BY id ASC
        ");
        $stmt->execute([$quizId]);
        $questions = $stmt->fetchAll();

        foreach ($questions as &$q) {
            $q['id'] = (int)$q['id'];
            $q['quiz_id'] = (int)$q['quiz_id'];
        }

        return ['success' => true, 'data' => ['quiz' => $quiz, 'questions' => $questions]];
    }

    /**
     * Create question
     */
    public static function createQuestion($quizId, $questionText, $optionA, $optionB, $optionC, $optionD, $correctAnswer) {
        $quizId        = (int)$quizId;
        $questionText  = trim($questionText ?? '');
        $optionA       = trim($optionA ?? '');
        $optionB       = trim($optionB ?? '');
        $optionC       = trim($optionC ?? '');
        $optionD       = trim($optionD ?? '');
        $correctAnswer = strtolower(trim($correctAnswer ?? ''));

        if ($quizId <= 0) {
            return ['success' => false, 'error' => 'Invalid quiz ID.', 'code' => 400];
        }
        if (empty($questionText) || empty($optionA) || empty($optionB) || empty($optionC) || empty($optionD)) {
            return ['success' => false, 'error' => 'All question and option fields are required.', 'code' => 400];
        }
        if (!in_array($correctAnswer, ['a', 'b', 'c', 'd'], true)) {
            return ['success' => false, 'error' => 'Correct answer must be a, b, c, or d.', 'code' => 400];
        }

        $pdo = getDBConnection();
        $stmt = $pdo->prepare("
            INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        if ($stmt->execute([$quizId, $questionText, $optionA, $optionB, $optionC, $optionD, $correctAnswer])) {
            $questionId = (int)$pdo->lastInsertId();
            return [
                'success' => true,
                'data'    => [
                    'question' => [
                        'id'             => $questionId,
                        'quiz_id'        => $quizId,
                        'question_text'  => $questionText,
                        'option_a'       => $optionA,
                        'option_b'       => $optionB,
                        'option_c'       => $optionC,
                        'option_d'       => $optionD,
                        'correct_answer' => $correctAnswer
                    ]
                ]
            ];
        }

        return ['success' => false, 'error' => 'Failed to create question.', 'code' => 500];
    }

    /**
     * Update question
     */
    public static function updateQuestion($id, $questionText, $optionA, $optionB, $optionC, $optionD, $correctAnswer) {
        $id            = (int)$id;
        $questionText  = trim($questionText ?? '');
        $optionA       = trim($optionA ?? '');
        $optionB       = trim($optionB ?? '');
        $optionC       = trim($optionC ?? '');
        $optionD       = trim($optionD ?? '');
        $correctAnswer = strtolower(trim($correctAnswer ?? ''));

        if ($id <= 0) {
            return ['success' => false, 'error' => 'Invalid question ID.', 'code' => 400];
        }
        if (empty($questionText) || empty($optionA) || empty($optionB) || empty($optionC) || empty($optionD)) {
            return ['success' => false, 'error' => 'All question and option fields are required.', 'code' => 400];
        }
        if (!in_array($correctAnswer, ['a', 'b', 'c', 'd'], true)) {
            return ['success' => false, 'error' => 'Correct answer must be a, b, c, or d.', 'code' => 400];
        }

        $pdo = getDBConnection();
        $stmt = $pdo->prepare("
            UPDATE questions 
            SET question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ? 
            WHERE id = ?
        ");

        if ($stmt->execute([$questionText, $optionA, $optionB, $optionC, $optionD, $correctAnswer, $id])) {
            return ['success' => true, 'data' => ['message' => 'Question updated successfully']];
        }

        return ['success' => false, 'error' => 'Failed to update question.', 'code' => 500];
    }

    /**
     * Delete question
     */
    public static function deleteQuestion($id) {
        $id = (int)$id;
        if ($id <= 0) {
            return ['success' => false, 'error' => 'Invalid question ID.', 'code' => 400];
        }

        $pdo = getDBConnection();
        $stmt = $pdo->prepare("DELETE FROM questions WHERE id = ?");

        if ($stmt->execute([$id])) {
            return ['success' => true, 'data' => ['message' => 'Question deleted successfully']];
        }

        return ['success' => false, 'error' => 'Failed to delete question.', 'code' => 500];
    }
}
