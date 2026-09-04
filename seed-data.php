<?php
require_once __DIR__ . '/config/db.php';

try {
    $pdo = getDBConnection();

    // 1. Seed Sample Quizzes
    $quizzesData = [
        [
            'title' => 'PHP & Web Fundamentals',
            'description' => 'Test your core knowledge of PHP scripting, superglobals, sessions, and server-side processing.',
            'questions' => [
                [
                    'question' => 'What does PHP stand for?',
                    'a' => 'Personal Home Page',
                    'b' => 'PHP: Hypertext Preprocessor',
                    'c' => 'Preformatted Hypertext Page',
                    'd' => 'Public Hosting Program',
                    'correct' => 'b'
                ],
                [
                    'question' => 'Which function is used to check if a session is already started in PHP?',
                    'a' => 'session_status()',
                    'b' => 'is_session_active()',
                    'c' => 'session_check()',
                    'd' => 'session_start()',
                    'correct' => 'a'
                ],
                [
                    'question' => 'Which superglobal array holds form data sent with HTTP POST?',
                    'a' => '$_GET',
                    'b' => '$_REQUEST',
                    'c' => '$_POST',
                    'd' => '$_SERVER',
                    'correct' => 'c'
                ],
                [
                    'question' => 'Which PHP function securely hashes passwords for storage?',
                    'a' => 'md5()',
                    'b' => 'sha1()',
                    'c' => 'password_hash()',
                    'd' => 'encrypt()',
                    'correct' => 'c'
                ],
                [
                    'question' => 'What is the correct way to include an external PHP file and halt execution if missing?',
                    'a' => 'include "file.php";',
                    'b' => 'require "file.php";',
                    'c' => 'import "file.php";',
                    'd' => 'load "file.php";',
                    'correct' => 'b'
                ]
            ]
        ],
        [
            'title' => 'MySQL & Database Essentials',
            'description' => 'Comprehensive quiz covering relational schemas, SQL queries, JOINs, and prepared statements.',
            'questions' => [
                [
                    'question' => 'Which SQL command is used to fetch rows from a database table?',
                    'a' => 'GET',
                    'b' => 'EXTRACT',
                    'c' => 'SELECT',
                    'd' => 'FETCH',
                    'correct' => 'c'
                ],
                [
                    'question' => 'What does SQL injection primarily target?',
                    'a' => 'CSS Stylesheets',
                    'b' => 'Database Queries',
                    'c' => 'Browser Cache',
                    'd' => 'DNS Resolution',
                    'correct' => 'b'
                ],
                [
                    'question' => 'Which clause is used to filter rows returned by a SELECT query?',
                    'a' => 'WHERE',
                    'b' => 'ORDER BY',
                    'c' => 'GROUP BY',
                    'd' => 'LIMIT',
                    'correct' => 'a'
                ],
                [
                    'question' => 'Which feature in PHP PDO prevents SQL injection attacks?',
                    'a' => 'Raw Query Interpolation',
                    'b' => 'Prepared Statements with Parameter Binding',
                    'c' => 'String Concatenation',
                    'd' => 'Eval Function',
                    'correct' => 'b'
                ],
                [
                    'question' => 'What type of key uniquely identifies each record in a database table?',
                    'a' => 'Foreign Key',
                    'b' => 'Unique Index',
                    'c' => 'Primary Key',
                    'd' => 'Composite Tag',
                    'correct' => 'c'
                ]
            ]
        ],
        [
            'title' => 'HTML5 & Responsive Web Design',
            'description' => 'Test your understanding of semantic HTML tags, modern layout techniques, and accessibility.',
            'questions' => [
                [
                    'question' => 'Which semantic HTML tag should wrap page header navigation links?',
                    'a' => '<section>',
                    'b' => '<nav>',
                    'c' => '<aside>',
                    'd' => '<article>',
                    'correct' => 'b'
                ],
                [
                    'question' => 'Which Bootstrap CSS class centers a card horizontally on medium screens?',
                    'a' => 'justify-content-center',
                    'b' => 'text-center',
                    'c' => 'float-center',
                    'd' => 'align-middle',
                    'correct' => 'a'
                ],
                [
                    'question' => 'Which attribute provides alternate text for screen readers and broken images?',
                    'a' => 'title',
                    'b' => 'src',
                    'c' => 'alt',
                    'd' => 'href',
                    'correct' => 'c'
                ],
                [
                    'question' => 'What input type renders a radio selection group in HTML forms?',
                    'a' => 'type="checkbox"',
                    'b' => 'type="radio"',
                    'c' => 'type="select"',
                    'd' => 'type="button"',
                    'correct' => 'b'
                ],
                [
                    'question' => 'Which CSS unit is relative to the root font size of the page?',
                    'a' => 'px',
                    'b' => 'em',
                    'c' => 'rem',
                    'd' => 'pt',
                    'correct' => 'c'
                ]
            ]
        ]
    ];

    $quizCount = 0;
    $questionCount = 0;

    foreach ($quizzesData as $qData) {
        // Insert or select quiz
        $stmt = $pdo->prepare("SELECT id FROM quizzes WHERE title = ? LIMIT 1");
        $stmt->execute([$qData['title']]);
        $quiz = $stmt->fetch();

        if (!$quiz) {
            $insertQuiz = $pdo->prepare("INSERT INTO quizzes (title, description) VALUES (?, ?)");
            $insertQuiz->execute([$qData['title'], $qData['description']]);
            $quizId = $pdo->lastInsertId();
            $quizCount++;
        } else {
            $quizId = $quiz['id'];
        }

        // Insert questions
        foreach ($qData['questions'] as $quest) {
            $checkQuest = $pdo->prepare("SELECT id FROM questions WHERE quiz_id = ? AND question_text = ? LIMIT 1");
            $checkQuest->execute([$quizId, $quest['question']]);
            if (!$checkQuest->fetch()) {
                $insertQuest = $pdo->prepare("
                    INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                $insertQuest->execute([
                    $quizId,
                    $quest['question'],
                    $quest['a'],
                    $quest['b'],
                    $quest['c'],
                    $quest['d'],
                    $quest['correct']
                ]);
                $questionCount++;
            }
        }
    }

    echo "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>Database Seed Completed</title>";
    echo "<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' rel='stylesheet'></head>";
    echo "<body class='bg-light py-5'><div class='container' style='max-width: 650px;'>";
    echo "<div class='card shadow-sm border-0'><div class='card-body p-4 text-center'>";
    echo "<div class='mb-3 fs-1 text-success'>🎉</div>";
    echo "<h2 class='fw-bold text-success mb-3'>Automated Data Seeding Complete!</h2>";
    echo "<p class='lead text-muted'>Successfully generated sample quizzes and question banks into <strong>quiz_app</strong> database.</p>";
    echo "<div class='row my-4 g-3'>";
    echo "<div class='col-6'><div class='p-3 bg-light rounded border'><h4 class='fw-bold text-primary mb-0'>3 Quizzes</h4><small class='text-muted'>Added / Verified</small></div></div>";
    echo "<div class='col-6'><div class='p-3 bg-light rounded border'><h4 class='fw-bold text-success mb-0'>15 Questions</h4><small class='text-muted'>Added / Verified</small></div></div>";
    echo "</div>";
    echo "<div class='d-grid gap-2'>";
    echo "<a href='admin/dashboard.php' class='btn btn-primary btn-lg'>Go to Admin Dashboard &rarr;</a>";
    echo "<a href='dashboard.php' class='btn btn-outline-secondary'>Go to Student Dashboard &rarr;</a>";
    echo "</div></div></div></div></body></html>";

} catch (Exception $e) {
    echo "<div style='font-family: sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; border: 1px solid #dc3545; border-radius: 8px; background: #f8d7da; color: #721c24;'>";
    echo "<h2>Seeding Error</h2>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
    echo "</div>";
}
