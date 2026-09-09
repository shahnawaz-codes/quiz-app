# 🎓 Backend Cheat Sheet: PHP & SQL (For JS/TS Developers & College Viva)

This cheat sheet translates everything in the backend from a **JS/TS developer's perspective** and explains the complete architecture, file flow, database design, security model (HttpOnly Cookie Auth), and key viva questions for your project defense!

---

## 📑 Table of Contents
1. [JS/TS vs PHP: Rosetta Stone (Quick Translation)](#1-jst-vs-php-rosetta-stone-quick-translation)
2. [Backend Architecture Overview](#2-backend-architecture-overview)
3. [End-to-End Execution Flow (Data Lifecycle & HttpOnly Cookie Auth)](#3-end-to-end-execution-flow-data-lifecycle--httponly-cookie-auth)
4. [Backend Code Deep Dive (File-by-File)](#4-backend-code-deep-dive-file-by-file)
5. [Database & SQL Deep Dive (`schema.sql`)](#5-database--sql-deep-dive-schemasql)
6. [Security & Concepts Breakdown (HttpOnly Cookies, XSS Protection & Rehydration)](#6-security--concepts-breakdown)
7. [Top College Viva Questions & Answers](#7-top-college-viva-questions--answers)

---

## 1. JS/TS vs PHP: Rosetta Stone (Quick Translation)

If you know TypeScript/JavaScript (Node.js/Express), here is how PHP concepts map directly to what you already know:

| Feature / Concept | JS / TS (Node.js / Express) | PHP (Vanilla Backend) | Explanation in Simple Terms |
| :--- | :--- | :--- | :--- |
| **Variables** | `const x = 10;`, `let y = "hi";` | `$x = 10;`, `$y = "hi";` | All PHP variables **must** start with a dollar sign `$`. |
| **Print / Return UI** | `console.log(data)` / `res.send()` | `echo json_encode($data);` | `echo` outputs text/string to HTTP response. `json_encode` converts PHP arrays/objects to JSON strings (like `JSON.stringify()`). |
| **Objects / Hash Maps** | `{ name: "John", age: 20 }` | `['name' => 'John', 'age' => 20]` | Called **Associative Arrays** in PHP. Uses `=>` key-value syntax. |
| **Access Object Property**| `user.name` or `user['name']` | `$user['name']` or `$user->name` | Bracket syntax for arrays, `->` arrow for class instance properties/methods. |
| **Static Class Method** | `AuthService.login()` | `AuthService::login()` | Double colon `::` calls static methods on a class. |
| **String Concatenation** | `hello + " " + world` or `${name}` | `$hello . " " . $world` or `"hello {$name}"` | Dot `.` is used for string concatenation in PHP, not `+`. |
| **Import / Require** | `import x from './x'` / `require()` | `require_once __DIR__ . '/x.php';` | `require_once` loads the file once, preventing duplicate loading errors. |
| **Reading Request Body**| `req.body` (express.json) | `file_get_contents('php://input')` | Reads raw HTTP POST body payload (JSON string). |
| **Async / Promises** | `async / await`, `Promise` | Synchronous per request | PHP runs synchronously for each incoming HTTP request (runs top to bottom, sends response, terminates process). |
| **Routing** | `app.post('/api/login', handler)` | File-based: `/api/auth/login.php` | The HTTP request URL points directly to the PHP script file on the server. |
| **Cookies** | `res.cookie('name', token, { httpOnly: true })` | `setcookie('name', $token, ['httponly' => true, 'samesite' => 'Lax'])` | Sets an `HttpOnly` browser cookie directly from server HTTP headers. |

---

## 2. Backend Architecture Overview

The backend uses a clean **Controller-Service-Data Layer (Layered Architecture)** with production-grade **HttpOnly Cookie Authentication**:

```
                  ┌──────────────────────────────┐
                  │    React Frontend (Fetch)    │
                  └──────────────┬───────────────┘
                                 │ HTTP Request (credentials: 'include')
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (PHP + MySQL)                      │
│                                                                 │
│  1. CORS & Headers  ──► includes/cors.php                        │
│                         (Allows Credentials & Localhost Origins)│
│                                                                 │
│  2. API Endpoints   ──► api/auth/login.php   (Sets Cookie)      │
│     (Controllers)       api/auth/logout.php  (Clears Cookie)    │
│                         api/auth/me.php      (Session Check)    │
│                         api/quizzes/list.php                    │
│                         api/results/submit.php                  │
│                                                                 │
│  3. Middleware      ──► includes/auth-check.php                 │
│                         (Reads $_COOKIE['quiz_app_token'])      │
│                         includes/jwt.php                        │
│                         includes/response.php                   │
│                                                                 │
│  4. Service Layer   ──► services/AuthService.php                │
│     (Business Logic)    services/QuizService.php                │
│                         services/ResultService.php              │
│                         services/QuestionService.php            │
│                                                                 │
│  5. Database Layer  ──► config/db.php (PDO Connection)          │
└────────────────────────────────┬────────────────────────────────┘
                                 │ PDO SQL Queries
                                 ▼
                  ┌──────────────────────────────┐
                  │      MySQL Database Server   │
                  │        (quiz_app DB)         │
                  └──────────────┴───────────────┘
```

### Directory Structure Explanation:
- **`backend/config/`**: Holds configuration files (`env.php` for `.env` loading, `db.php` for database connection).
- **`backend/includes/`**: Helper utilities & middleware (`cors.php`, `response.php`, `jwt.php`, `auth-check.php`).
- **`backend/services/`**: Pure Business Logic & SQL query handlers. (Keeps API files clean and decoupled!).
- **`backend/api/`**: Public API routes hit by React frontend (e.g., `POST /api/auth/login.php`, `POST /api/auth/logout.php`, `GET /api/auth/me.php`).

---

## 3. End-to-End Execution Flow (Data Lifecycle & HttpOnly Cookie Auth)

### A. User submits Login credentials on React Frontend

1. **Frontend Request**:
   - User enters email/password in React and submits form.
   - React sends HTTP `POST` request to `http://localhost/quiz-app/backend/api/auth/login.php` with `{ email, password }` in JSON body and `credentials: 'include'`.

2. **CORS & Credentials Check (`backend/includes/cors.php`)**:
   - `cors.php` validates HTTP origin (e.g., `http://localhost:5173`) and attaches header `Access-Control-Allow-Credentials: true` alongside `Access-Control-Allow-Origin: http://localhost:5173`.

3. **Controller & Service Verification (`login.php` & `AuthService.php`)**:
   - `login.php` validates `POST` verb and reads JSON payload.
   - `AuthService::login` queries database using PDO Prepared Statements:
     `SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1`.
   - Compares password hash using `password_verify($password, $user['password'])`.

4. **JWT & HttpOnly Cookie Issuance**:
   - Generates signed JWT payload using `generateJWT($tokenPayload)` in `jwt.php`.
   - In `login.php`, sets an **`HttpOnly`**, **`SameSite=Lax`**, **`Path=/`** browser cookie (`quiz_app_token`) expiring in 2 hours:
     ```php
     setcookie('quiz_app_token', $token, [
         'expires'  => time() + 7200,
         'path'     => '/',
         'httponly' => true,
         'samesite' => 'Lax'
     ]);
     ```
   - Omits the token string from the JSON response body (`unset($res['data']['token'])`) so JavaScript code never accesses or stores sensitive credentials in `localStorage`.

---

### B. User Refreshes Page (Session Rehydration Flow)

1. **Browser Navigation / F5 Refresh**:
   - React application restarts in browser, context state is reset (`user: null`, `initializing: true`).
2. **Session Verification Request**:
   - `AuthContext` `useEffect` immediately sends `GET /api/auth/me.php` with `credentials: 'include'`.
   - Browser **automatically attaches** the `quiz_app_token` HttpOnly cookie to the HTTP request.
3. **Backend Token Verification (`auth-check.php` & `me.php`)**:
   - `requireAuth()` calls `getTokenFromRequest()`, which inspects `$_COOKIE['quiz_app_token']` (with fallback to `Authorization: Bearer` header).
   - Validates JWT signature using `verifyJWT($token)`.
   - Returns `{ success: true, data: { user: { id, name, email, role } } }`.
4. **State Rehydration**:
   - React puts user object into `AuthContext` (`setUser(data.user)`) and sets `initializing = false`.
   - User remains seamlessly on protected pages (`/dashboard`, `/profile`, `/admin/dashboard`) without any redirection to `/login`!

---

### C. User Log Out (`POST /api/auth/logout.php`)

1. User clicks Logout in Navbar.
2. React calls `authService.logout()`.
3. Backend sets cookie expiration in the past (`time() - 3600`), invalidating and removing `quiz_app_token` from browser.
4. React clears user state (`setUser(null)`), returning user to `/login`.

---

## 4. Backend Code Deep Dive (File-by-File)

### 1. Database Connection (`backend/config/db.php`)
- **Key Concept**: **PDO (PHP Data Objects)**.
- **What it does**: Establishes connection to MySQL.
- **Key Lines**:
  - `function getDBConnection()` uses a **Static Singleton Pattern** (`static $pdo = null;`). This ensures database connection is opened **once** per request instead of reconnecting multiple times.
  - `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION`: Configures PDO to throw exceptions on SQL errors for easy debugging.
  - `PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC`: Returns database records as Associative Arrays (JS object-like) e.g., `['id' => 1, 'name' => 'Alex']`.
  - `PDO::ATTR_EMULATE_PREPARES => false`: Uses **real prepared statements** at the database engine level (crucial for security against SQL Injection).

### 2. Standardized JSON Responses (`backend/includes/response.php`)
- **What it does**: Formats all API responses into a uniform JSON shape across the app.
- **Key Functions**:
  - `validateRequestMethod($allowedMethods)`: Checks `$_SERVER['REQUEST_METHOD']`. Halts request with 405 error if frontend uses wrong HTTP verb.
  - `getJsonInput()`: Reads raw input stream `file_get_contents('php://input')` and parses JSON into a PHP array using `json_decode($raw, true)`.
  - `sendSuccess($data)` & `sendError($message, $code)`: Standardizes output schema:
    ```json
    { "success": boolean, "data": mixed, "error": string|null }
    ```

### 3. JWT Authentication (`backend/includes/jwt.php`)
- **Key Concept**: **JSON Web Tokens (Stateless Auth)**.
- **Why JWT + HttpOnly Cookies?**: The backend is stateless; we don't store session state in server memory or files. The browser persists the signed JWT token inside an `HttpOnly` cookie and transmits it on every request.
- **How it works**:
  - A JWT has 3 parts separated by dots (`.`): `Header.Payload.Signature`.
  - `base64UrlEncode()`: Encodes binary / JSON strings into URL-safe base64 format.
  - `generateJWT($payload)`: Signs payload using `hash_hmac('sha256', "$header.$payload", SECRET_KEY)`.
  - `verifyJWT($jwt)`: Splits token into header, payload, signature. Re-computes expected signature using `SECRET_KEY`. If signatures match and token hasn't expired (`exp`), it returns decoded user payload.

### 4. Auth Route Protection Middleware (`backend/includes/auth-check.php`)
- **What it does**: Protects endpoints requiring authentication or admin role.
- **Key Functions**:
  - `getTokenFromRequest()`: Checks `$_COOKIE['quiz_app_token']` first. If missing, falls back to `getBearerToken()`.
  - `requireAuth($requiredRole)`: Verifies token. If missing or invalid, halts execution with `401 Unauthorized`. Verifies role permission if `$requiredRole` is specified (e.g. `'admin'`), returning `403 Forbidden` if unauthorized.

### 5. Login & Logout API Endpoints (`api/auth/login.php` & `api/auth/logout.php`)
- **`login.php`**: Sets `quiz_app_token` HttpOnly cookie upon successful login via `setcookie()` and returns user profile data.
- **`logout.php`**: Clears `quiz_app_token` cookie by setting expiration in the past (`time() - 3600`).
- **`me.php`**: Authenticates request via `requireAuth()` and returns current logged-in user profile.

---

## 5. Database & SQL Deep Dive (`schema.sql`)

The database is named **`quiz_app`** and consists of 4 relational tables:

```
 ┌─────────────────┐       1 : N       ┌──────────────────┐
 │      users      ├──────────────────►│     results      │
 └─────────────────┘                   └────────┬─────────┘
                                                │
                                                │ N : 1
                                                ▼
 ┌─────────────────┐       1 : N       ┌──────────────────┐
 │     quizzes     ├──────────────────►│    questions     │
 └─────────────────┘                   └──────────────────┘
```

### Table Schemas & Breakdown

#### 1. `users` Table
Stores registered students and administrators.
- `id`: `INT AUTO_INCREMENT PRIMARY KEY` (Unique auto-incrementing ID).
- `name`: `VARCHAR(100) NOT NULL` (User's display name / Gamer tag).
- `email`: `VARCHAR(150) NOT NULL UNIQUE` (Unique constraint ensures no 2 users have same email).
- `password`: `VARCHAR(255) NOT NULL` (Stores Bcrypt hashed password, never plain text!).
- `role`: `ENUM('student', 'admin') NOT NULL DEFAULT 'student'` (Restricts role values to either 'student' or 'admin').

#### 2. `quizzes` Table
Stores quiz topics/modules created by Admins.
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`.
- `title`: `VARCHAR(255) NOT NULL`.
- `description`: `TEXT NULL`.
- `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`.

#### 3. `questions` Table
Stores questions belonging to a specific quiz.
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`.
- `quiz_id`: `INT NOT NULL` (Foreign Key referencing `quizzes(id)`).
- `question_text`: `TEXT NOT NULL`.
- `option_a`, `option_b`, `option_c`, `option_d`: `VARCHAR(255) NOT NULL`.
- `correct_answer`: `ENUM('a', 'b', 'c', 'd') NOT NULL`.
- `CONSTRAINT fk_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE`
  - **`ON DELETE CASCADE`**: If an admin deletes a Quiz, MySQL automatically deletes all questions linked to that quiz!

#### 4. `results` Table
Stores scores of quiz attempts completed by students.
- `id`: `INT AUTO_INCREMENT PRIMARY KEY`.
- `user_id`: `INT NOT NULL` (Foreign Key referencing `users(id)`).
- `quiz_id`: `INT NOT NULL` (Foreign Key referencing `quizzes(id)`).
- `score`: `INT NOT NULL` (Number of correct answers).
- `total_questions`: `INT NOT NULL`.
- `percentage`: `DECIMAL(5,2) NOT NULL` (e.g., `85.50%`).
- `completed_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`.

---

## 6. Security & Concepts Breakdown

### 1. Why HttpOnly Cookies over LocalStorage?
- **LocalStorage Vulnerability**: JavaScript code on the page (including third-party scripts or XSS payloads) can easily read `localStorage.getItem('token')` and steal credentials.
- **HttpOnly Protection**: `HttpOnly` cookies **cannot be accessed by JavaScript** via `document.cookie`. Browsers automatically transmit the cookie in HTTP request headers, completely shielding the auth token from XSS attacks.

### 2. How do we prevent SQL Injection?
- **Bad / Insecure Query**: `"SELECT * FROM users WHERE email = '" . $user_input . "'"` (Vulnerable to injection like `' OR '1'='1`).
- **Our Secure Approach**: **PDO Prepared Statements with Parameter Binding**:
  ```php
  $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
  $stmt->execute([$email]);
  ```
  - MySQL treats `$email` strictly as literal string data, making SQL injection impossible.

### 3. How are Passwords Secured?
- Passwords are **NEVER** stored in plain text.
- When registering: `password_hash($password, PASSWORD_DEFAULT)` generates a secure Bcrypt hash with salt.
- When logging in: `password_verify($password, $user['password'])` checks if raw input matches the hash.

### 4. How does Role-Based Access Control (RBAC) work?
- Protected endpoints call `requireAuth('admin')` or `requireAuth('student')`.
- Middleware inspects verified JWT payload. If `role !== $requiredRole`, HTTP `403 Forbidden` response is returned immediately.

---

## 7. Top College Viva Questions & Answers

Here are exact answers to give when your professor asks about the backend:

#### Q1: What architecture did you follow for your backend?
> **Answer**: "We built a RESTful API backend using Vanilla PHP with a layered architecture—separating concerns into API Controllers (`api/`), Business Logic Services (`services/`), Helper/Middleware routines (`includes/`), and Data Access configuration (`config/`). It communicates with the React frontend using JSON over HTTP."

#### Q2: How do you connect PHP to MySQL, and why?
> **Answer**: "We use **PDO (PHP Data Objects)** because PDO supports prepared statements for preventing SQL injection, provides object-oriented database interaction, supports error exception handling, and yields associative arrays easily."

#### Q3: How do you protect your API against SQL Injection attacks?
> **Answer**: "All database queries use PDO Prepared Statements (`$stmt->prepare()` and `$stmt->execute([$param])`). Parameters are bound separately from SQL query structure, preventing malicious user input from altering SQL command logic."

#### Q4: How is User Authentication handled? Is it Session-based or Token-based? Where is the token stored?
> **Answer**: "It is **stateless JWT authentication using secure HttpOnly cookies**. When a user logs in, the backend signs a JWT token containing the user's ID, email, and role, and sets it in an `HttpOnly`, `SameSite=Lax` browser cookie (`quiz_app_token`). Because the cookie is `HttpOnly`, JavaScript cannot access or read it, protecting against XSS attacks. The browser automatically transmits the cookie with `credentials: 'include'` on every API request. On page refresh, React rehydrates user state by querying `GET /api/auth/me.php`."

#### Q5: What happens when an authenticated user refreshes the page?
> **Answer**: "When refreshed, React context starts empty (`user: null`, `initializing: true`). `AuthContext` executes an automated session verification request (`GET /api/auth/me.php`) with `credentials: 'include'`. The browser sends the `HttpOnly` cookie, PHP verifies the JWT signature, and returns user data. React updates context state (`setUser(data.user)`) and turns off `initializing`, allowing `ProtectedRoute` to render the protected page seamlessly without redirecting to `/login`."

#### Q6: What happens in the database when a Quiz is deleted by an Admin?
> **Answer**: "Because we defined `ON DELETE CASCADE` foreign key constraints on the `questions` and `results` tables referencing `quizzes(id)`, deleting a quiz automatically removes all associated questions and student test results cleanly without orphaned records."

#### Q7: How do you prevent unauthorized users (students) from adding or deleting quizzes?
> **Answer**: "We implemented Role-Based Access Control (RBAC) in `auth-check.php`. Admin routes call `requireAuth('admin')`, which decodes the JWT token and verifies `role === 'admin'`. Non-admin requests receive an HTTP 403 Forbidden response."

#### Q8: Why use `password_hash()` instead of MD5 or SHA1?
> **Answer**: "MD5 and SHA1 are obsolete, fast cryptographic hashes vulnerable to collision and rainbow table attacks. `password_hash()` uses **Bcrypt**, which automatically handles cryptographic salting and work factor (key stretching), making brute-force attacks computationally infeasible."

---
*Updated for your College Quiz App Backend Defense & Presentation.*
