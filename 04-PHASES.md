# Build Phases — Online Quiz Platform (React SPA + PHP API)

Backend and frontend for a feature are built in the same phase, back-to-back — build an endpoint, then immediately build the page that calls it, then test the two together. Don't build all backend endpoints first and all frontend pages second; you won't know an endpoint is wrong until something tries to consume it.

## Phase 0 — Setup
- XAMPP running, database created (name per your earlier decision), 4 tables with the types/constraints from the original schema decisions.
- `backend/` folder with `config/`, `includes/` (empty stubs for `cors.php`, `jwt.php`, `auth-check.php`, `functions.php`), `.env` with DB creds + a JWT secret (any long random string).
- `frontend/` scaffolded with `npm create vite@latest frontend -- --template react`, Tailwind installed and configured, React Router installed.
- **Done when:** `npm run dev` shows the default Vite+React page at `localhost:5173`, and `localhost/quiz-app/backend/config/db.php` (hit directly, temporarily) connects to MySQL without error.

## Phase 1 — Auth
**Backend:** `backend/includes/cors.php`, `jwt.php` (encode/verify functions), `auth-check.php`. Endpoints: `POST /api/auth/register.php`, `POST /api/auth/login.php`, `GET /api/auth/me.php`.
**Frontend:** `AuthContext.jsx`, `api/client.js`, `Login.jsx`, `Register.jsx`, `ProtectedRoute.jsx`, a placeholder `Dashboard.jsx` that just says "logged in as X".
- **Done when:** you can register via the React form, log in, get redirected to the dashboard placeholder showing your name/role, refresh the page (token clears — expected per the architecture decision), and hitting the dashboard route while logged out redirects to `/login`.
- **Explicitly test CORS here** — if login fails with a CORS error in the browser console, fix it now before building anything else on top of it.

## Phase 2 — Admin: Quiz & Question Management
**Backend:** `quizzes/create.php`, `update.php`, `delete.php`, `list.php`; `questions/create.php`, `update.php`, `delete.php` — all behind `requireAuth('admin')`.
**Frontend:** `AdminLogin.jsx` (or reuse `Login.jsx` with role check), `ManageQuizzes.jsx`, `ManageQuestions.jsx`.
- **Done when:** an admin user can create a quiz with 3+ questions entirely through the React UI, edit one, delete one, with no direct DB edits.

## Phase 3 — Student Takes a Quiz
**Backend:** `quizzes/get.php` (returns quiz + questions, **no correct_answer field**), `results/submit.php` (server-side scoring per architecture §6).
**Frontend:** update `Dashboard.jsx` to list real quizzes, `TakeQuiz.jsx`, `Result.jsx`.
- **Done when:** a student can pick a quiz, answer it, submit, and see a real server-calculated score — and manually editing the request payload in browser devtools to change an answer's "correctness" has no effect, because the frontend never sends a score.

## Phase 4 — History & Admin Results
**Backend:** `results/history.php` (scoped to token's `user_id`, no exceptions), `results/admin-list.php`.
**Frontend:** `History.jsx`, `StudentResults.jsx` (admin, with quiz filter dropdown).
- **Done when:** a student sees only their own attempts, and — explicitly test this — copying another student's result ID and hitting the history/result endpoint with your own token returns nothing or a 403, not their data.

## Phase 5 — Polish
- Full Tailwind pass per `05-DESIGN.md`: consistent spacing, loading spinners on every API call, empty states, pass/fail badges.
- Navbar conditional rendering fully wired to `AuthContext`.
- Basic 404 page in React Router for unmatched routes.

## Explicitly deferred
Timer, leaderboard, categories/difficulty, randomized questions, refresh tokens, "remember me," API versioning.
