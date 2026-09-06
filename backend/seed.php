<?php
/**
 * Standalone Database Seeder Script for Quiz App.
 * Run this script to populate sample quizzes & questions and demo results!
 */
require_once __DIR__ . '/config/db.php';

echo "=== Quiz App Seeder ===\n";

$pdo = getDBConnection();

$quizzesData = [
    [
        'title' => '🚀 Space & Astronomy Odyssey',
        'description' => 'Explore stars, planets, and cosmic wonders of our galaxy in this space battle quest!',
        'questions' => [
            ['question_text' => 'What is the hottest planet in our solar system?', 'option_a' => 'Mercury', 'option_b' => 'Venus', 'option_c' => 'Mars', 'option_d' => 'Jupiter', 'correct_answer' => 'b'],
            ['question_text' => 'Which galaxy is closest to our Milky Way galaxy?', 'option_a' => 'Andromeda Galaxy', 'option_b' => 'Triangulum Galaxy', 'option_c' => 'Sombrero Galaxy', 'option_d' => 'Centaurus A', 'correct_answer' => 'a'],
            ['question_text' => 'How many moons does planet Mars have?', 'option_a' => '1', 'option_b' => '2 (Phobos & Deimos)', 'option_c' => '4', 'option_d' => '0', 'correct_answer' => 'b'],
            ['question_text' => 'What gives Mars its distinct reddish appearance?', 'option_a' => 'Copper oxide', 'option_b' => 'Iron oxide (rust)', 'option_c' => 'Molten lava', 'option_d' => 'Methane gas clouds', 'correct_answer' => 'b'],
            ['question_text' => 'What is the brightest star in Earth\'s night sky?', 'option_a' => 'Polaris (North Star)', 'option_b' => 'Sirius (Dog Star)', 'option_c' => 'Betelgeuse', 'option_d' => 'Alpha Centauri', 'correct_answer' => 'b']
        ]
    ],
    [
        'title' => '⚡ Anime & Gaming Trivia Quest',
        'description' => 'Test your knowledge on iconic video games, anime heroes, and legendary gaming bosses!',
        'questions' => [
            ['question_text' => 'In Dragon Ball Z, what is Goku\'s signature energy beam attack?', 'option_a' => 'Rasengan', 'option_b' => 'Kamehameha', 'option_c' => 'Spirit Gun', 'option_d' => 'Getsuga Tensho', 'correct_answer' => 'b'],
            ['question_text' => 'Which legendary gaming studio developed The Legend of Zelda?', 'option_a' => 'Sony Interactive', 'option_b' => 'Nintendo', 'option_c' => 'Square Enix', 'option_d' => 'Capcom', 'correct_answer' => 'b'],
            ['question_text' => 'In Pokémon, which element type is Pikachu?', 'option_a' => 'Water', 'option_b' => 'Electric', 'option_c' => 'Fire', 'option_d' => 'Grass', 'correct_answer' => 'b'],
            ['question_text' => 'What is the default male protagonist name in Minecraft?', 'option_a' => 'Alex', 'option_b' => 'Steve', 'option_c' => 'Herobrine', 'option_d' => 'Notch', 'correct_answer' => 'b'],
            ['question_text' => 'In Naruto, what beast is sealed inside Naruto Uzumaki?', 'option_a' => 'Nine-Tailed Fox (Kurama)', 'option_b' => 'Eight-Tails', 'option_c' => 'One-Tail Shukaku', 'option_d' => 'Nine-Tailed Dragon', 'correct_answer' => 'a']
        ]
    ],
    [
        'title' => '💻 Web Development & Coding Arena',
        'description' => 'Show off your frontend and backend coding powers in HTML, CSS, JavaScript, and PHP!',
        'questions' => [
            ['question_text' => 'What does CSS stand for in web development?', 'option_a' => 'Creative Style Sheets', 'option_b' => 'Cascading Style Sheets', 'option_c' => 'Computer Style Syntax', 'option_d' => 'Colorful System Styles', 'correct_answer' => 'b'],
            ['question_text' => 'Which JavaScript keyword is used to declare a constant variable?', 'option_a' => 'var', 'option_b' => 'let', 'option_c' => 'const', 'option_d' => 'static', 'correct_answer' => 'c'],
            ['question_text' => 'In PHP, what character prefix is used for all variable names?', 'option_a' => '@', 'option_b' => '#', 'option_c' => '$', 'option_d' => '&', 'correct_answer' => 'c'],
            ['question_text' => 'What does HTML stand for?', 'option_a' => 'Hyper Text Markup Language', 'option_b' => 'High Tech Modern Language', 'option_c' => 'Hyperlink and Text Markup Logic', 'option_d' => 'Home Tool Markup Language', 'correct_answer' => 'a'],
            ['question_text' => 'Which HTTP status code represents a Successful OK response?', 'option_a' => '404', 'option_b' => '500', 'option_c' => '200', 'option_d' => '301', 'correct_answer' => 'c']
        ]
    ],
    [
        'title' => '🧠 World Geography & Landmarks Challenge',
        'description' => 'Travel the globe and answer questions about continents, capitals, and natural wonders!',
        'questions' => [
            ['question_text' => 'Which is the largest ocean on Planet Earth?', 'option_a' => 'Atlantic Ocean', 'option_b' => 'Pacific Ocean', 'option_c' => 'Indian Ocean', 'option_d' => 'Arctic Ocean', 'correct_answer' => 'b'],
            ['question_text' => 'In which country is the majestic Taj Mahal located?', 'option_a' => 'India', 'option_b' => 'Egypt', 'option_c' => 'Turkey', 'option_d' => 'Thailand', 'correct_answer' => 'a'],
            ['question_text' => 'What is the capital city of Japan?', 'option_a' => 'Kyoto', 'option_b' => 'Osaka', 'option_c' => 'Tokyo', 'option_d' => 'Hiroshima', 'correct_answer' => 'c'],
            ['question_text' => 'Which continent contains the Amazon Rainforest and Andes Mountains?', 'option_a' => 'Africa', 'option_b' => 'South America', 'option_c' => 'Europe', 'option_d' => 'Asia', 'correct_answer' => 'b'],
            ['question_text' => 'What is widely recognized as the longest river in the world?', 'option_a' => 'Amazon River', 'option_b' => 'Nile River', 'option_c' => 'Yangtze River', 'option_d' => 'Mississippi River', 'correct_answer' => 'b']
        ]
    ],
    [
        'title' => '🐉 Mythology & Ancient Legends Quest',
        'description' => 'Uncover secrets of Greek gods, Norse myths, and ancient legendary monsters!',
        'questions' => [
            ['question_text' => 'Who is the king of the Olympian gods in Greek mythology?', 'option_a' => 'Poseidon', 'option_b' => 'Hades', 'option_c' => 'Zeus', 'option_d' => 'Apollo', 'correct_answer' => 'c'],
            ['question_text' => 'In Norse mythology, what is the name of Thor\'s hammer?', 'option_a' => 'Excalibur', 'option_b' => 'Mjolnir', 'option_c' => 'Gungnir', 'option_d' => 'Aegis', 'correct_answer' => 'b'],
            ['question_text' => 'Which mythical bird rises renewed from its own ashes?', 'option_a' => 'Griffin', 'option_b' => 'Phoenix', 'option_c' => 'Hydra', 'option_d' => 'Chimera', 'correct_answer' => 'b'],
            ['question_text' => 'In Egyptian mythology, who is the ruler of the Underworld?', 'option_a' => 'Ra', 'option_b' => 'Osiris', 'option_c' => 'Anubis', 'option_d' => 'Horus', 'correct_answer' => 'b'],
            ['question_text' => 'What half-man half-bull monster lived in the Labyrinth of Crete?', 'option_a' => 'Centaur', 'option_b' => 'Minotaur', 'option_c' => 'Cyclops', 'option_d' => 'Satyr', 'correct_answer' => 'b']
        ]
    ],
    [
        'title' => '🎬 Cartoon & Pop Culture Battle',
        'description' => 'Fun questions about classic cartoons, animated movies, and superhero icons!',
        'questions' => [
            ['question_text' => 'Who lives in a pineapple under the sea?', 'option_a' => 'Patrick Star', 'option_b' => 'SpongeBob SquarePants', 'option_c' => 'Squidward Tentacles', 'option_d' => 'Mr. Krabs', 'correct_answer' => 'b'],
            ['question_text' => 'What kind of animal is Mickey Mouse\'s pet Pluto?', 'option_a' => 'Cat', 'option_b' => 'Dog', 'option_c' => 'Duck', 'option_d' => 'Goose', 'correct_answer' => 'b'],
            ['question_text' => 'In Toy Story, what famous phrase is written on Woody\'s pull-string soundbox?', 'option_a' => 'To Infinity and Beyond!', 'option_b' => 'There\'s a snake in my boot!', 'option_c' => 'I\'m a real boy!', 'option_d' => 'Hakuna Matata!', 'correct_answer' => 'b'],
            ['question_text' => 'Which superhero protector is known as the Dark Knight of Gotham City?', 'option_a' => 'Superman', 'option_b' => 'Batman', 'option_c' => 'Spider-Man', 'option_d' => 'Iron Man', 'correct_answer' => 'b'],
            ['question_text' => 'In the movie Shrek, what type of mythical creature is Shrek?', 'option_a' => 'Donkey', 'option_b' => 'Ogre', 'option_c' => 'Dragon', 'option_d' => 'Troll', 'correct_answer' => 'b']
        ]
    ]
];

$quizInsert = $pdo->prepare("INSERT INTO quizzes (title, description) VALUES (?, ?)");
$qInsert = $pdo->prepare("INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)");

$qCount = 0;
foreach ($quizzesData as $qd) {
    $check = $pdo->prepare("SELECT id FROM quizzes WHERE title = ? LIMIT 1");
    $check->execute([$qd['title']]);
    $row = $check->fetch();

    if ($row) {
        $quizId = $row['id'];
    } else {
        $quizInsert->execute([$qd['title'], $qd['description']]);
        $quizId = $pdo->lastInsertId();
        echo "Created Quiz: {$qd['title']}\n";
    }

    $qCheck = $pdo->prepare("SELECT COUNT(*) as count FROM questions WHERE quiz_id = ?");
    $qCheck->execute([$quizId]);
    if ((int)$qCheck->fetch()['count'] === 0) {
        foreach ($qd['questions'] as $q) {
            $qInsert->execute([$quizId, $q['question_text'], $q['option_a'], $q['option_b'], $q['option_c'], $q['option_d'], $q['correct_answer']]);
            $qCount++;
        }
    }
}

echo "Successfully seeded database! Added {$qCount} questions.\n";
