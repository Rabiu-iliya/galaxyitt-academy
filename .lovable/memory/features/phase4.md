---
name: New feature tables (projects, notifications, support)
description: Schema for project submissions, in-app notifications, and support messaging system added in Phase 4
type: feature
---
# Phase 4 tables

## projects
- Students submit `repo_url` and/or `live_url` for their enrolled program
- Status flow: pending → approved | rejected
- DB trigger `on_project_reviewed` auto-issues a certificate row when status flips to `approved`, AND creates a notification for the student
- RLS: students manage own pending; instructors+admins can review

## notifications
- In-app only (no email yet). Realtime enabled via supabase_realtime publication.
- Triggers auto-create rows on scholarship/project status changes
- `useNotifications` hook + `<NotificationBell />` component (Popover with badge count)

## support_messages
- Students send subject+message; admins reply via `admin_reply` field
- Replying also inserts a notification for the user
- Status: open → resolved

## certificates
- Now has RLS (was missing). Insert only via trigger (SECURITY DEFINER bypasses RLS) or admin.
- Certificates page lists all rows joined to programs
