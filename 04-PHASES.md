# Build Phases — Online Quiz Platform

Each phase should end in something that actually runs, not just files that exist. Don't start a phase until the previous one is demoable.

## Phase 0 — Setup (before writing app logic)
- Install/verify XAMPP, start Apache + MySQL.
- Create `quiz_app` database in phpMyAdmin.
- Create all 4 tables with correct types and foreign keys (see schema notes below — the source guide gives fields but not types/constraints, decide those now, not while coding a form).
- Set up folder structure exactly as in `02-ARCHITECTURE.md`.
- Create `.env`, `.gitignore`, initialize git repo, first commit.

**Schema decisions to lock now (not in the original guide):**
- `users.password` → `VARCHAR(255)` (bcrypt hashes need room).
- `users.role` → `ENUM('student','admin')`, not a free-text string.
- `questions.correct_answer` → `ENUM('a','b','c','d')` to prevent garbage data.
- Foreign keys: `results.user_id → users.id`, `results.quiz_id → quizzes.id`, `questions.quiz_id → quizzes.id`, all `ON DELETE CASCADE` or `ON DELETE RESTRICT` — pick per the PRD's open question #6 on quiz deletion, and write the decision down before you write the DDL.

## Phase 1 — Auth (student side)
- `register.php`: form + validation + `password_hash()` + insert.
- `login.php`: form + `password_verify()` + session start + `session_regenerate_id()`.
- `logout.php`: destroy session.
- `includes/auth-check.php`: the shared guard, used from here on.
- **Done when:** you can register a new student, log in, get redirected to a dashboard stub, and log out — and a logged-out user hitting `dashboard.php` directly gets bounced to login.

## Phase 2 — Admin: content management
- `admin/login.php` (separate from student login, or same login with role check — decide and be consistent).
- `admin/add-quiz.php`, `admin/quizzes.php` (list + edit/delete).
- `admin/add-question.php`, `admin/questions.php` (list + edit/delete), scoped to a quiz.
- **Done when:** an admin can create a quiz, add at least 3 questions to it, and see them listed — all via the UI, no manual DB edits.

## Phase 3 — Student: taking a quiz
- `quizzes.php`: list available quizzes (only ones with ≥1 question — see PRD open question #3).
- `take-quiz.php`: render questions as radio groups.
- `submit-quiz.php`: server-side scoring per `02-ARCHITECTURE.md` §5, insert into `results`.
- `result.php`: show score, with the ownership check from architecture §5.
- **Done when:** a student can take a real quiz end-to-end and the score shown matches manual counting.

## Phase 4 — History & admin results view
- `history.php`: student's own past attempts.
- `admin/dashboard.php` or a results page: all results, filterable by quiz.
- **Done when:** both roles can see the results relevant to them, and a student cannot see another student's row (test this explicitly by trying to tamper the URL).

## Phase 5 — Polish (only after Phase 1–4 all pass the checklist)
- Bootstrap styling pass (cards, tables, navbar).
- Basic client-side validation (required fields, email format) as UX sugar — server-side validation must already exist independent of this.
- Error/empty states (no quizzes yet, quiz with 0 questions, etc.).

## Explicitly deferred (do not start early)
Timer, leaderboard, categories/difficulty, randomized questions — only after Phase 5 is fully working and demoed once.
