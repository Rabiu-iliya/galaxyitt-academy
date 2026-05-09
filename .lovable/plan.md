## Scope

Three large requests in one turn. Implementing all of it well requires schema changes plus rewrites of ~8 pages. Here is the plan I propose — please confirm or trim before I start.

## 1. Schema migrations (Supabase)

- Add `instructor_id uuid` to `cohorts` (assignment of instructor to cohort).
- Add `cohort_id uuid` and `instructor_id uuid` to `modules` and `lessons`.
- Create `announcements` table (`title`, `body`, `created_by`, `audience`, `created_at`) with RLS: admins manage, authenticated read.
- Create `app_settings` table (single-row, key/value JSON) with RLS: admins read/update, authenticated read.
- Update RLS on `modules`/`lessons` so instructors can only manage rows where `instructor_id = auth.uid()`.

## 2. Data-connected page rewrites

| Page | Change |
|---|---|
| `admin/AdminInstructors.tsx` | List instructors from `user_roles` joined with `profiles`; show name, phone, assigned cohorts count. |
| `admin/AdminAnalytics.tsx` | Add recharts `LineChart` of new users per month from `profiles.created_at`; keep stat cards. |
| `admin/AdminAnnouncements.tsx` | Form to create + table to list from `announcements`. |
| `admin/AdminCertificates.tsx` | Already joins — verify and add empty/loading states. |
| `admin/AdminSettings.tsx` | Fetch + update single `app_settings` row (site name, contact email, scholarship open). |
| `instructor/InstructorStudents.tsx` | Fetch from `enrollments` joined to `profiles` filtered by cohorts where `instructor_id = me`. |
| `instructor/InstructorCohort.tsx` | Fetch cohorts where `instructor_id = me`; show program name. |
| `instructor/InstructorLessons.tsx` | New cohort → module → lesson nested workflow with create buttons; card grid UI. |
| `instructor/InstructorHome.tsx` | Real counts: my cohorts, my students, pending submissions. |

## 3. UI polish

- Install `recharts`.
- Card layout for lessons grouped under modules (`md:grid-cols-2`, `rounded-xl`, hover scale, `BookOpen`/`Clock` icons).
- Use existing semantic tokens (not raw `slate-800` etc.) so dark/light theme keeps working.

## 4. Out of scope (flag)

- Adding a real assignment UI for admins to attach instructors to cohorts — I'll add an "Assign Instructor" select on `ManageCohorts` so the new flow is usable end-to-end.
- I will NOT touch existing working pages (Programs, Scholarships, Projects, Support).

## Technical notes

- Migration runs first (single call), then code edits.
- RLS update for `lessons`/`modules` keeps existing admin policy and replaces the broad instructor `has_role` policy with `instructor_id = auth.uid()`.
- `announcements.audience` enum: `all | students | instructors`.
- Notifications: optional — creating an announcement could fan out to `notifications`; I'll skip unless you ask.

Confirm and I'll execute.