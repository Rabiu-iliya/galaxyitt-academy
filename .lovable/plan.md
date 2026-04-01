
# GalaxyITT Technology Academy — Phase 1

## Design System
- **Colors**: Blue (#1E3A5F primary) + Gold (#D4A843 accent) on white background
- **Dark mode toggle** available
- **Typography**: Modern, clean — Inter/similar sans-serif
- **Style**: Premium, card-based, international academy feel

## 1. Landing Page
- **Hero**: Bold headline, CTA to register, academy branding
- **Programs section**: Card grid showing all 14 programs with prices (₦)
- **About Academy**: Mission, vision
- **Why Choose Us**: Key differentiators (cohort-based, live classes, certificates)
- **How It Works**: Register → Choose Program → Pay → Learn
- **Testimonials**: Placeholder testimonials
- **Pricing overview**: Program price table
- **Footer**: Links, social, contact info

## 2. Authentication (Supabase Auth)
- Register (email/password + name)
- Login
- Forgot password / reset password flow
- Email verification
- Role-based access (roles table: super_admin, admin, instructor, student)
- Protected routes per role

## 3. Programs & Enrollment Pages
- **Programs listing page**: All 14 programs as cards with price, duration, description, "Apply" button
- **Program detail page**: Full description, curriculum outline, cohort availability, enroll button
- **Enrollment flow**: Choose program → Select available cohort → Mock payment step → Confirmation

## 4. Database Schema (Supabase)
- `profiles` — user info linked to auth
- `user_roles` — role-based access (admin, instructor, student, super_admin)
- `programs` — 14 pre-seeded programs with name, description, price, duration
- `cohorts` — start/end dates, max students, status, linked program
- `enrollments` — user + program + cohort, payment status
- `payments` — amount, method, status, invoice reference (mock for now)

## 5. Basic Dashboards (Shell/Layout)
- **Student dashboard shell**: Sidebar with navigation items (Dashboard, My Program, Modules, Live Classes, Assignments, Certificates, Payments, Profile). Shows enrolled program info.
- **Admin dashboard shell**: Sidebar with admin nav. Programs/cohorts/students management pages (list views).
- **Instructor dashboard shell**: Sidebar with instructor nav. Assigned cohorts view.

## 6. Mobile Responsive
- All pages fully responsive
- Collapsible sidebar on mobile
- Touch-friendly cards and navigation

## What's Deferred to Later Phases
- Payment gateway integration (Paystack/Flutterwave) — currently mock
- Learning modules, lessons, video player
- Assignment system with file upload & grading
- Live classroom (3rd-party embed like Jitsi/Daily.co)
- Certificate generation (PDF)
- Analytics & reporting
- Attendance tracking
- Announcements system
