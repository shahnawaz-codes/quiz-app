# Design Notes — Online Quiz Platform

Kept intentionally simple — this is a Bootstrap-CRUD project, not a design showcase. The goal is "looks finished," not "looks original."

## Layout
- Shared `header.php` / `footer.php` include a Bootstrap navbar. Navbar changes based on session: logged-out shows Login/Register, student shows Dashboard/History/Logout, admin shows Admin Dashboard/Logout. One navbar partial, conditional links — not three separate navbars.
- Container width: Bootstrap `.container` (not `.container-fluid`) — this is a form/table-heavy app, doesn't need full width.

## Pages

**Login / Register**
- Centered card, max-width ~400px, vertically centered on the page.
- Inline validation errors above the form, not as browser alerts.

**Student Dashboard**
- Bootstrap card grid (`row-cols-1 row-cols-md-3`) — one card per quiz, showing title + short description + a "Start Quiz" button.
- Empty state: if no quizzes exist yet, show a plain message, not a blank page.

**Take Quiz**
- One question per card, radio buttons for the 4 options, all questions on one scrollable page (no multi-page wizard — adds complexity for no benefit at this scope).
- Submit button fixed at the bottom, disabled until at least attempted (optional — don't over-engineer this for v1).

**Result Page**
- Score card: `X / Y correct`, percentage, pass/fail if you're doing that threshold — otherwise just the raw number, don't imply grading logic that doesn't exist yet.
- Link back to dashboard and to history.

**History**
- Bootstrap table: quiz name, date, score, percentage. Sorted newest first.

**Admin — Quizzes / Questions**
- Bootstrap table with Edit/Delete action buttons per row.
- Delete actions require a confirm step (JS `confirm()` is fine at this scope) — an accidental one-click delete on a quiz with existing results is exactly the kind of thing that looks bad in a demo.
- Add/Edit forms: standard Bootstrap form, server-validates on submit, re-renders with errors if invalid rather than losing entered data.

## Visual style
- Default Bootstrap theme (no custom CSS framework needed) — primary color for buttons/nav, `success`/`danger` classes for pass/fail or delete actions, so color communicates state without extra explanation.
- Consistent spacing: Bootstrap's `mb-3`/`mt-3` utility classes throughout instead of custom margins per page — keeps it from looking inconsistent page to page, which is the most common "unfinished" tell in these projects.

## What to skip
- No custom animations, no JS framework, no dark mode toggle. None of it demonstrates the PHP/MySQL skills this project exists to show, and all of it is time spent not finishing Phase 3.
