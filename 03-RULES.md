# Rules — Online Quiz Platform (React SPA + PHP API)

## Security (non-negotiable)
1. Every SQL query is a prepared statement — no exceptions.
2. Passwords: `password_hash()` on write, `password_verify()` on login. Never plaintext, never logged.
3. Every protected endpoint starts with `require '../../includes/cors.php';` then `require '../../includes/auth-check.php';` — in that order, before any other logic. CORS first because OPTIONS preflight requests must succeed even without auth.
4. JWT secret lives in `.env`, never hardcoded, never committed.
5. Every endpoint that loads a record by ID (a specific result, a specific quiz) verifies ownership/role server-side — the frontend hiding a button is not access control. A student calling `history.php` must only ever get rows where `user_id` matches the token's `user_id`, regardless of what the frontend sends.
6. `GET /api/quizzes/get.php` never returns `correct_answer` to a student-role token — check role before building the response, don't just hide the field in the UI.
7. All user-generated text (question text, quiz titles) is escaped on the **frontend** with React's default JSX escaping (which happens automatically — don't use `dangerouslySetInnerHTML` anywhere in this project) rather than relying on the backend to sanitize output.

## Backend (PHP API) rules
1. One file = one endpoint = one HTTP method's worth of logic. Don't make one `.php` file branch on `$_SERVER['REQUEST_METHOD']` to handle both GET and POST for different purposes — split them.
2. Every endpoint returns the `{success, data}` / `{success, error}` shape from `02-ARCHITECTURE.md` §5 — no exceptions, no raw arrays, no HTML error pages.
3. Shared logic (JWT encode/verify, DB connection, score calculation) lives in `backend/includes/` — never copy-pasted across endpoint files.
4. `display_errors` off; PHP errors/warnings must never leak into a JSON response body.

## Frontend (React) rules
1. All API calls go through `src/api/client.js` — no component calls `fetch()` directly. This is where the JWT header gets attached and 401s get handled, once.
2. Auth state (`token`, `user`, `role`) lives in `AuthContext`, read via a `useAuth()` hook — don't pass auth state down through props manually across pages.
3. `ProtectedRoute.jsx` wraps any route requiring login, with an optional role prop (`<ProtectedRoute role="admin">`). No page independently checks `if (!user) redirect...` — one guard, one place to fix bugs.
4. Loading and error states are handled explicitly in every page that calls the API — a blank white screen while a fetch is pending is not acceptable, same for a silent failure on error.
5. Tailwind only — no Bootstrap classes, no mixing the two systems. If you paste a UI snippet from somewhere that uses `class="btn btn-primary"`, convert it to Tailwind utilities before using it.

## Naming
- React components: `PascalCase.jsx`. Hooks: `useCamelCase.js`. Everything else in `frontend/src`: `camelCase`.
- PHP endpoint files: `kebab-case.php`, one verb per file (`create.php`, `update.php`, `delete.php`) inside a resource folder (`quizzes/`, `questions/`) rather than one giant `quiz-api.php`.
- DB tables/columns: unchanged from the original — `snake_case`, same 4 tables.

## Git / Workflow
1. `frontend/` and `backend/` each get committed to the same repo (monorepo, not two separate repos) — simpler for a solo project.
2. `.gitignore` covers `.env`, `frontend/node_modules`, `frontend/dist`.
3. Commit after each working endpoint + its matching frontend page, not backend-then-frontend in two giant separate pushes — makes it obvious when a bug was introduced on which side.

## Scope Discipline
1. No refresh tokens, no "remember me," no API versioning — these are explicitly deferred per the architecture doc, don't add them mid-build because a tutorial mentions them.
2. Nothing from the original "Optional Features" list (timer, leaderboard, categories, randomization) until the full JWT + CRUD + quiz-taking flow works end to end.
