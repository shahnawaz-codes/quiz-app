# PRD — Online Quiz Platform

## 1. Problem
Paper-based/manual quizzes are slow to grade and hard to track. Students need a way to take MCQ quizzes online and get instant results; an admin needs a way to author and manage that content without touching code.

## 2. Goals (v1 — must ship)
- Student can register, log in, take a quiz, submit it, and see score instantly.
- Admin can create quizzes, add/edit/delete questions, and view all results.
- All scoring is server-calculated (never trust client-submitted scores).

## 3. Non-goals (v1)
- No timer, leaderboard, categories, difficulty levels, or randomized question order.
- No password reset / email verification flow.
- No multi-attempt analytics beyond a basic history list.
- No refresh tokens / "remember me" — see Architecture doc, auth section.

## 4. Tech Stack (decided)
React (Vite) + Tailwind CSS frontend, talking to a PHP JSON API backend, MySQL database. See `02-ARCHITECTURE.md` for the full breakdown — this is a bigger scope than a plain server-rendered PHP app, since the frontend and backend are now two separate running processes during development.

## 5. Users
| Role | Can do |
|---|---|
| Student | Register, login, view quizzes, take quiz once (see Open Question below), view own results/history, logout |
| Admin | Login, CRUD quizzes, CRUD questions, view all student results |

## 6. Core User Stories
- As a student, I can't see quiz answers before submitting.
- As a student, once I submit, I can't resubmit the same attempt.
- As a student, I only ever see my own results, never another student's.
- As an admin, I can't accidentally let a quiz go live with zero questions.
- As an admin, deleting a quiz should not silently break existing results rows (decide: block delete if results exist, or cascade — pick one, don't leave undefined).

## 7. OPEN QUESTIONS (resolve before coding, not during)
1. **Retakes**: can a student attempt the same quiz more than once? If yes, `results` is an append-only log and history lists all attempts. If no, you need a uniqueness constraint on `(user_id, quiz_id)` and a check before allowing quiz start. Pick one and write it here.
2. **Quiz availability**: are all quizzes always visible to all students, or does admin need to publish/unpublish? v1 default: all quizzes visible once created.
3. **Question count minimum**: what's the min questions per quiz before it appears to students? v1 default: hide a quiz from students if it has 0 questions.

## 8. Success Criteria
- A student can complete register → login → take quiz → see score in under 5 clicks after login.
- Admin can create a quiz with 5 questions and see it appear in the student list without touching the database directly.
- No plaintext passwords anywhere in the DB or logs.
- No student can retrieve another student's result by tampering with an ID or request.

## 9. Out of Scope / Explicit Risks Accepted
- Local dev only — no deployment, load, or scaling concerns handled.
- No email — "forgot password" is not supported; admin resets manually via phpMyAdmin if needed.
- JWT stored in memory (not localStorage or httpOnly cookie) — token is lost on page refresh by design; this is an accepted trade-off for avoiding CORS-cookie complexity, not an oversight.
