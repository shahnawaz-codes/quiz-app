# Architecture — Online Quiz Platform (React SPA + PHP API)

## 1. Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, fetch/axios for API calls.
- **Backend**: PHP as a pure JSON API — no HTML rendering, no PHP-side sessions used for page auth.
- **Database**: MySQL, same 4 tables as before.
- **Local dev**: PHP served via XAMPP/Apache (through the `htdocs` symlink), React served separately by Vite's dev server (`npm run dev`, default `localhost:5173`).

This is two separate running processes during development — Apache serving the API, Vite serving the frontend — not one unified server. Don't expect `localhost/quiz-app` alone to show the React app; that URL only hits the PHP API now.

## 2. Folder Structure
```
quiz-app/                      (symlinked into htdocs)
├── backend/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register.php
│   │   │   ├── login.php
│   │   │   └── me.php          # returns current user from token
│   │   ├── quizzes/
│   │   │   ├── list.php
│   │   │   ├── get.php         # ?id= single quiz + questions (no correct_answer field!)
│   │   │   ├── create.php      # admin only
│   │   │   ├── update.php      # admin only
│   │   │   └── delete.php      # admin only
│   │   ├── questions/
│   │   │   ├── create.php
│   │   │   ├── update.php
│   │   │   └── delete.php
│   │   └── results/
│   │       ├── submit.php
│   │       ├── history.php     # student's own attempts
│   │       └── admin-list.php  # all results, admin only
│   ├── config/
│   │   ├── env.php
│   │   └── db.php
│   ├── includes/
│   │   ├── jwt.php             # encode/verify, no library
│   │   ├── auth-check.php      # reads Authorization header, verifies role
│   │   ├── cors.php            # shared CORS headers, included first on every endpoint
│   │   └── functions.php
│   └── .env
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── TakeQuiz.jsx
    │   │   ├── Result.jsx
    │   │   ├── History.jsx
    │   │   └── admin/
    │   │       ├── AdminLogin.jsx
    │   │       ├── ManageQuizzes.jsx
    │   │       ├── ManageQuestions.jsx
    │   │       └── StudentResults.jsx
    │   ├── api/
    │   │   └── client.js        # single fetch wrapper, attaches JWT header
    │   └── index.css            # Tailwind directives
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## 3. Auth Flow (JWT, hand-rolled)
1. `POST /api/auth/login.php` verifies credentials with `password_verify()`, on success signs a JWT containing `user_id`, `role`, `exp` using `hash_hmac('sha256', ...)` with a secret from `.env`. Returns `{ token, user }` as JSON.
2. React stores the token **in memory** (React state / context) — not localStorage. Storing it in localStorage is simpler but readable by any injected script; for this project's scope, memory-only means the token clears on refresh, which is an acceptable trade-off — decide if you want to add "remember me" via a refresh mechanism later, don't build it now.
3. Every subsequent API call includes `Authorization: Bearer <token>` — `src/api/client.js` is the *only* place that attaches this, so no page manually juggles headers.
4. `backend/includes/auth-check.php` reads the header, verifies the signature and expiry, decodes `user_id`/`role`, and is `require`'d at the top of every protected endpoint. It optionally takes a role argument (`requireAuth('admin')`).
5. On 401 from any API call, `AuthContext` clears state and React Router redirects to `/login` — this logic lives once in the fetch wrapper, not repeated per page.

## 4. CORS (this WILL bite you if skipped)
Every PHP endpoint must `require` a shared `backend/includes/cors.php` as its very first line, before any other output, setting:
```php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
```
Also handle `OPTIONS` preflight requests by returning 200 immediately, before any auth check — browsers send these automatically and they carry no auth header, so checking auth on an OPTIONS request will break every single POST/PUT call.

## 5. API Response Contract
Every endpoint returns JSON in one consistent shape, always — this makes the frontend's error handling uniform instead of special-cased per page:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "Invalid credentials" }
```
Set `header('Content-Type: application/json')` on every endpoint. No endpoint ever echoes raw HTML or a PHP warning directly — that breaks `response.json()` on the frontend with a cryptic parse error that's hard to debug for a beginner.

## 6. Quiz Submission (still server-authoritative — this doesn't change)
`POST /api/results/submit.php` receives `{ quiz_id, answers: [{question_id, selected}] }`. The endpoint re-fetches correct answers from the DB and calculates score server-side — the frontend never sends or trusts a score value. `GET /api/quizzes/get.php` must never include `correct_answer` in its response when a student is taking the quiz — that field only appears in admin endpoints.

## 7. What's explicitly NOT here
- No SSR (Next.js) — plain Vite SPA per what you asked for.
- No refresh-token rotation — token just expires (set `exp` to something reasonable, e.g. 2 hours) and the user logs in again.
- No API versioning (`/api/v1/`) — unnecessary at this scope.
