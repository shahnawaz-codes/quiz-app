# Design Notes — Online Quiz Platform (React SPA + Tailwind CSS)

Tailwind only, throughout — no Bootstrap classes anywhere in this project. If a class looks like `btn btn-primary` or `alert alert-danger`, it's Bootstrap and doesn't belong here; use Tailwind utilities instead.

## Layout & Components
- **`Navbar.jsx`**: rendered once in `App.jsx`, reads `AuthContext` to decide which links show:
  - Logged out: Login, Register.
  - Student: Dashboard, History, Logout.
  - Admin: Manage Quizzes, Student Results, Logout.
  One component, conditional rendering inside it — not three separate navbar components.
- **`ProtectedRoute.jsx`**: wraps routes needing auth, optional `role` prop. Redirects to `/login` if no valid token, or to a "not authorized" state if role doesn't match.
- **`LoadingSpinner.jsx`**: one reusable spinner component (simple Tailwind `animate-spin` border div), used by every page during an API call — not rebuilt per page.

## Page Design

**Login / Register / AdminLogin**
- Centered card (`max-w-md mx-auto mt-20 p-8 rounded-xl shadow-lg bg-white`).
- Password field with a show/hide toggle (an eye icon button, plain `useState` boolean — no library needed).
- Inline error banner above the form (`bg-red-50 text-red-700 border border-red-200 rounded-md p-3`), not a browser `alert()`.

**Student Dashboard**
- Welcome header with the user's name from `AuthContext`.
- Optional summary row (available quizzes count, attempts, average score) as small stat cards — only build this if `Phase 4`'s history data already exists; don't fetch extra endpoints just for a nicer dashboard before that data is real.
- Quiz grid: `grid grid-cols-1 md:grid-cols-3 gap-6`, each quiz as a card with title, short description, "Start Quiz" button.
- Empty state: centered message + icon if the quiz list is empty, not a blank grid.

**Take Quiz**
- One question per card, stacked vertically, 4 options as styled radio buttons (custom-styled `input[type=radio]` with Tailwind, or a button-group pattern where the whole option row is clickable, not just the tiny circle — better UX for the actual demo).
- Selection state tracked in local component state (`{questionId: selectedOption}`) before the single submit POST.
- Submit button sticky at the bottom on mobile widths (`sticky bottom-0`), disabled while the request is in flight — not disabled based on "all questions answered," since partial submission is allowed unless the PRD says otherwise.

**Result Page**
- Score card: large `X / Y` and percentage, pass/fail badge (`bg-green-100 text-green-800` vs `bg-red-100 text-red-800`).
- If the API returns a 403 (ownership check failed), show a plain "You don't have access to this result" state — never a broken/blank page from an unhandled fetch error.

**History / Admin Student Results**
- Responsive table (`overflow-x-auto` wrapper + `min-w-full` table, since Tailwind has no built-in responsive table component like Bootstrap does).
- Admin view adds a quiz filter `<select>` above the table, styled consistently with form inputs elsewhere.

## Visual System
- Pick one accent color (e.g. `indigo-600`) used consistently for primary buttons/links — don't let different pages default to different colors.
- Semantic colors: green for success/pass, red for error/fail/delete, amber for warnings — consistent across the whole app, not just the result page.
- Spacing scale: stick to Tailwind's default scale (`p-4`, `gap-6`, `mt-8`, etc.) — don't hand-write arbitrary pixel values (`mt-[13px]`), it makes the UI feel inconsistent even when each individual page looks fine in isolation.
- Font: Tailwind's default stack is fine — don't add a custom Google Font just for this project unless you specifically want the practice of wiring one in.

## What to skip
No custom animation library, no dark mode toggle, no component library (shadcn/MUI) layered on top of Tailwind — plain Tailwind utilities are enough at this scope and keep the dependency list short, which matters when you're explaining the stack in a viva.
