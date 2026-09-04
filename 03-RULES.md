# Rules — Online Quiz Platform

These exist so you don't relearn the same lesson twice mid-project. Break a rule only if you can name the specific reason.

## Security (non-negotiable, even for a college project)
1. **Every SQL query is a prepared statement.** No exceptions for "admin-only" pages.
2. **Every password** is hashed with `password_hash()` on write and checked with `password_verify()` on login. Never compare plaintext.
3. **Every protected page** includes `auth-check.php` as the first executable line, before any HTML output.
4. **Every page that loads a record by ID** (result, quiz, question) verifies ownership or role before displaying — don't rely on "the student won't guess the URL."
5. **All form output** is escaped with `htmlspecialchars()` before being echoed back (e.g., "Welcome, `<?= htmlspecialchars($name) ?>`") to prevent stored/reflected XSS from quiz titles, question text, etc.
6. `.env` / `config/db.php` credentials are never committed. Add `.env` to `.gitignore` on day one, not after the first commit.

## Code Structure
1. One file = one responsibility. `take-quiz.php` renders; `submit-quiz.php` writes. Don't let a single file both GET-render and POST-process a form — it gets unreadable fast and hides bugs.
2. Shared logic (score calculation, input sanitizing, auth check) lives in `includes/functions.php` and `includes/auth-check.php` — never copy-pasted across pages. If you're pasting the same 5 lines into a third file, stop and extract a function.
3. Every DB table interaction goes through a small set of functions per entity (e.g., `getQuizById()`, `getQuestionsByQuizId()`) rather than inline queries scattered across pages — makes the schema changeable later without a grep-and-replace across 15 files.

## Naming
- Files: `kebab-case.php` (already matches the source guide — keep it consistent, don't mix in `camelCase.php` later).
- DB tables/columns: `snake_case`, singular concept plural table (`users`, `quizzes`, `questions`, `results`) — matches the guide, don't rename mid-project.
- PHP variables: `$camelCase`. SQL columns stay `snake_case` even when pulled into PHP — don't rename at the boundary, it just adds a mental mapping step for no benefit.

## Git / Workflow
1. Commit after each working feature (register works → commit; login works → commit), not one giant commit at the end. If something breaks, you want a diff to blame, not a full rebuild.
2. `.gitignore` from the first commit: `.env`, `/vendor` (if used), OS junk files.
3. Don't touch the folder structure in §2 of the architecture doc after Phase 1 is done — restructuring mid-build is how half-finished projects stay half-finished.

## Scope Discipline
1. Nothing from the "Optional Features" list (timer, leaderboard, categories, randomization) gets started until every item in the PRD §6 "minimum version" checklist is done and demoable.
2. If you're tempted to add a feature not in the PRD, write it down in a "later" section instead of building it now — mid-build feature creep is the most common reason these projects don't finish.
