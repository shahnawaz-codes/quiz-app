# Architecture — Online Quiz Platform

## 1. Stack
HTML + Bootstrap + vanilla JS (frontend) → PHP (server logic, procedural or light MVC-style) → MySQL (data) → Apache/XAMPP (local host).

No frameworks (no Laravel/Composer) — matches the "beginner college project" scope. If you later want Composer for `vlucas/phpdotenv` (see §4), that's the one exception worth making.

## 2. Folder Structure (fixed — do not deviate mid-build)
```
quiz-app/
├── index.php
├── login.php
├── register.php
├── logout.php
├── dashboard.php
├── quizzes.php
├── take-quiz.php
├── submit-quiz.php        # NEW — separate handler, see §5
├── result.php
├── history.php
├── config/
│   ├── db.php
│   └── env.php            # NEW — loads secrets, see §4
├── includes/
│   ├── header.php
│   ├── footer.php
│   ├── auth-check.php     # NEW — session guard, see §3
│   └── functions.php      # NEW — shared helpers (score calc, sanitize)
├── assets/
│   ├── css/
│   └── js/
├── admin/
│   ├── login.php
│   ├── dashboard.php
│   ├── quizzes.php
│   ├── add-quiz.php
│   ├── edit-quiz.php
│   ├── delete-quiz.php    # NEW — was missing from original list
│   ├── questions.php
│   ├── add-question.php
│   ├── edit-question.php
│   └── delete-question.php
└── .env                    # NEW — gitignored, real DB creds
```

## 3. Auth & Session Rules
- Every protected page starts with `require_once '../includes/auth-check.php';` (or `includes/` for root-level pages). No page checks `$_SESSION` inline and independently — one shared guard, one place to fix bugs.
- `auth-check.php` takes an optional role param: `checkAuth('admin')` vs `checkAuth('student')`. A student hitting an admin URL directly gets redirected, not just denied silently.
- Session data stored: `$_SESSION['user_id']`, `$_SESSION['role']`, `$_SESSION['name']`. Never store password or password hash in session.
- Regenerate session ID on login (`session_regenerate_id(true)`) to prevent session fixation.

## 4. Config & Secrets
- `.env` file (gitignored) holds `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`.
- `config/env.php` loads it (simple manual parser is fine — no Composer required if you want to stay zero-dependency).
- `config/db.php` reads from env vars, never hardcodes credentials. This is the #1 thing that gets forgotten and then embarrassingly pushed to GitHub with a real password in it.

## 5. Quiz Submission Flow (server-authoritative)
`take-quiz.php` renders the form → POSTs to `submit-quiz.php` (separate file, not itself — keeps GET/render logic away from POST/write logic).

`submit-quiz.php` must:
1. Verify session + that `quiz_id` in the POST belongs to a real quiz.
2. Re-fetch correct answers from DB — **never trust any score value from the client**, even if JS calculated one for UX.
3. Loop submitted answers, compare to DB answers, tally score server-side.
4. Insert into `results`, redirect to `result.php?id=<result_id>` (not `?quiz_id=`, so a student can't just change the URL to see someone else's percentage math be recalculated).
5. `result.php` must check `results.user_id == $_SESSION['user_id']` before displaying — otherwise any logged-in student can view any result by guessing IDs (IDOR).

## 6. Database Access
- All queries use **prepared statements** (`mysqli` or PDO, pick one and use it everywhere — don't mix). PDO with `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION` is the easier one to get consistent.
- No raw string interpolation into SQL, ever, including in admin CRUD pages — those are usually where people get lazy because "only the admin uses it."

## 7. Error Handling
- `display_errors` off in a production-like state; log to a file instead. For a local XAMPP college project this is low-stakes, but do it anyway — it's the habit that matters.
- User-facing errors are generic ("Invalid login") — never echo raw DB error messages to the browser (avoids leaking schema info, also just looks unfinished in a viva demo).

## 8. What's explicitly NOT in this architecture
- No REST API layer — pages render server-side HTML directly. Don't add an API unless a requirement actually needs one (e.g., an SPA frontend), because it doubles your surface area for no benefit here.
- No ORM. Four tables, prepared statements, procedural functions — that's enough.
