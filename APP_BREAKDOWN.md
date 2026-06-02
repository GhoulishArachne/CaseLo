# CaseLogger - Application Breakdown

## Overview
**CaseLogger** is a web-based Internal Affairs case management and investigation tracking system for law enforcement agencies. It enables investigators to track cases, manage evidence, document findings, and maintain comprehensive investigation records.

---

## Architecture

### Tech Stack
- **Frontend:** React + Vite
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (email/password)
- **Storage:** Cloud-based with automatic backups
- **Deployment:** Vercel (frontend), Supabase (backend)

### Core Database Tables (12)
1. **cases** - Investigation case records
2. **complaints** - Complainant information and complaint details
3. **people** - Officer roster (name, badge, rank, division, assignment, contact)
4. **evidence** - Physical/digital evidence linked to cases
5. **events** - Timeline events (incidents, interactions, dates)
6. **notes** - Investigation notes and documentation
7. **tasks** - Action items and follow-up tasks
8. **findings** - Investigation outcomes (Sustained, Not Sustained, Exonerated, etc.)
9. **violations** - Pre-defined violation codes library (79 violations organized by category)
10. **policies** - Department policies linked to violations
11. **investigation_templates** - Standardized investigation templates
12. **custom_options** - User-defined dropdown values

---

## Layout & Navigation

### Main Structure
- **Top Navigation Bar** (80px height)
  - Left: CaseLogger branding + subtitle
  - Center: Global search bar
  - Right: Department logo, name, current section indicator
  
- **Horizontal Tab Navigation** (50px height)
  - Tabs: Dashboard, Cases, Evidence, People, Officer Profile, Timeline, Tasks, Notes, Complaints, Adjudication, Reports, Settings
  - Active tab highlighted with bottom border in accent color
  - Scrollable for smaller screens

- **Content Area**
  - Full-width responsive
  - Padding: 24px
  - Background: var(--theme-light)

### Key Sections

#### 📊 Dashboard
- **MetricGrid** - KPI cards (open cases, pending complaints, active findings, personnel count)
- **Escalation Alerts** - Complaints flagged for supervisor review, grouped by escalation reason
  - Shows complaint ID, type, and status
  - Clickable to navigate to complaint

#### 📁 Cases
- **Three-panel layout:**
  1. Left: Case creation form + case list (searchable, filterable)
  2. Top Right: Case detail view (status, priority, dates, linked records)
  3. Bottom Right: Evidence summary panel (quick view of attachments)
- **Features:**
  - Create new cases with automatic case numbering (CASE-YYYY-###)
  - Filter by status (All, Active, Closed)
  - Edit case details
  - Cascade delete (deletes linked evidence, events, tasks, findings)
  - Add related cases, prior complaints, involved personnel

#### 👥 People (Officer Roster)
- **Left panel:** Employee creation form + sortable officer list (by rank)
- **Right panel:** Personnel edit panel (rank, badge #, assignment, division, contact)
- **Features:**
  - Edit officer information
  - View early intervention flags
  - Rank-based hierarchy (Chief → Deputy Chief → Commander → etc.)
  - Badge number as unique identifier

#### 📋 Officer Profile
- **Two-column grid layout:**
  1. Left sidebar: Officer list with name, rank, badge #
  2. Right panel: Officer information form (editable fields) + metrics grid
- **Officer edit form includes:** Rank, Badge #, Assignment, Division, Contact Info
- **Metrics displayed:** Risk scores, training deficiencies, complaint count

#### 🚨 Complaints
- **Complaint intake system with:** Complainant info, incident details, supervisor referral option
- **Complaint fields:**
  - Complainant name/contact
  - Complaint type (Internal/External)
  - Incident location, date/time
  - Narrative description
  - Evidence attachments (comma-separated filenames)
  - Escalate for supervisor review (optional reason)
  - Involved personnel (badge numbers)
- **Auto-screening:** Duplicate detection, similarity scoring
- **Status tracking:** Intake, Submitted, Under Review, Closed

#### 📊 Adjudication
- **Finding management for cases**
- **Finding types:** Sustained, Not Sustained, Exonerated, Unfounded, Policy Failure
- **Track:** Severity level, appeal status, command review status, discipline template

#### 📚 Evidence
- **Evidence list** - All evidence from all cases
- **Fields:** Evidence type, source, discovery date, confidence level, chain of custody notes

#### ⏱️ Timeline
- **Chronological event log** - Incidents, interactions, key dates

#### ✓ Tasks
- **Action item tracking** - Priority, status, due dates, assigned to

#### 📝 Notes
- **Investigation documentation** - Tagged notes with dates, authors

#### 📄 Reports
- **Department statistics and analytics**
- **Metrics:** Cases by status, complaints by type, personnel analytics

#### ⚙️ Settings
- **Theme Selector** - 12 professional themes (see below)
- **Department Branding** - Logo URL, department name, report header, signature block
- **Violation Library** - View, create, edit 79-violation library with categories:
  - Conduct, Integrity, Performance, Safety, Use of Force, Miscellaneous
  - Sequential codes: Cond-1, Int-1, Perf-1, UoF-1, Prof-1, Misc-1, etc.
- **Custom Dropdowns** - Define priority levels, investigation types, etc.
- **Policies** - Manage department policies and links to violations

---

## Design System

### 12 Themes (All with Light Text on Dark Backgrounds OR Dark Text on Light Backgrounds)

**Dark Themes (Light Text #F3F4F6):**
1. **Command Operations Center** (#0B1220) - Modern command center with blue accent
2. **Police Headquarters** (#111827) - Navy with gold accents
3. **Tactical Operations Center** (#050505) - Near-black with green alerts
4. **Department Coordinator Executive Suite** (#0F172A) - Navy with silver accents
5. **Intelligence Bureau** (#111827) - Dark with cyan highlights
6. **Dark Neon** (#0D0D0D) - Black with neon accents
7. **High-Tech Blue** (#0C1929) - Deep blue with cyan

**Light Themes (Dark Text #1F2937):**
8. **Government Records System** (#F3F4F6) - Light gray professional
9. **Monochrome Professional** (#F5F5F5) - Neutral gray
10. **Warm Sunset** (#FFF8F3) - Cream with warm accents
11. **Cool Arctic** (#F0F9FF) - Light blue
12. **Classic Government** (#F9FAFB) - Off-white with burgundy

### Color Strategy
- **Accent Color** - Used for:
  - Active navigation underlines
  - Button outlines and states
  - Alert borders
  - Status indicators
- **Secondary Accent** - Warnings, alerts, success states
- **Text Color** - Theme-aware (light on dark, dark on light) for WCAG AA compliance

### Typography
- Default system font stack
- Font sizes: 10-20px (based on hierarchy)
- Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 900 (extra-bold)

### Component Styles
- **Panels/Cards:** White background, 1px border (#dce4e1), 8px border-radius
- **Form inputs:** White bg, gray border, focus state with accent color
- **Buttons:** Accent border outline, hover effects
- **Labels:** Uppercase, 12px, medium weight, slightly muted color
- **Spacing:** 8px, 12px, 16px, 24px increments

---

## Features

### Case Management
- ✅ Create cases with auto-numbered IDs
- ✅ Track status, priority, classification
- ✅ Link related cases and prior complaints
- ✅ Assign investigators
- ✅ Filter and search cases
- ✅ Add evidence, events, notes, tasks to cases

### Personnel Management
- ✅ Officer roster with ranks and badge numbers
- ✅ Edit officer information (assignment, division, contact)
- ✅ Track risk scores and training deficiencies
- ✅ Early intervention flag system
- ✅ View complaint history per officer

### Complaint Processing
- ✅ Complaint intake forms
- ✅ Complainant information tracking
- ✅ Supervisor escalation option
- ✅ Automatic duplicate detection
- ✅ Evidence attachment support

### Investigation Tools
- ✅ Violation code library (79 violations with sequential codes)
- ✅ Finding adjudication (Sustained/Not Sustained/etc.)
- ✅ Investigation templates
- ✅ Timeline tracking
- ✅ Task management
- ✅ Note documentation

### Reporting & Analytics
- ✅ Department metrics dashboard
- ✅ Case statistics by status
- ✅ Personnel performance metrics
- ✅ Early intervention analysis

### System Features
- ✅ Multi-user cloud authentication
- ✅ Real-time data sync with Supabase
- ✅ Automatic backups
- ✅ Customizable themes and branding
- ✅ Department logo and header customization
- ✅ Custom dropdown values
- ✅ Search across all case data

---

## Data Flow

### Case Lifecycle
1. **Create** - New case initiated, assigned number (CASE-2026-001)
2. **Investigate** - Add evidence, events, notes, tasks
3. **Document** - Record findings, adjudicate violations
4. **Review** - Supervisor review, command review
5. **Close** - Mark as Closed, auto-cascade deletes related records

### Complaint Workflow
1. **Submit** - Complaint intake (complainant info, incident details)
2. **Screen** - Auto-duplicate detection, similarity analysis
3. **Route** - Escalate if needed (supervisor review flag)
4. **Investigate** - Link to case, add evidence/notes
5. **Adjudicate** - Document findings
6. **Resolve** - Close complaint, archive

### Authentication Flow
1. User signs up or logs in via email/password
2. Supabase authenticates and creates session
3. Session persists across browser refreshes
4. User data loads from Supabase on app start
5. All changes sync to cloud in real-time

---

## User Roles & Workflows

### Investigator
- Create and manage cases
- Document evidence and events
- Add investigation notes
- Track tasks
- Adjudicate findings

### Supervisor
- View dashboards and metrics
- Monitor escalated complaints
- Review officer personnel files
- Approve investigations
- Manage early intervention flags

### Department Coordinator
- Manage officer roster
- Update department branding
- Configure custom options
- View system-wide statistics
- Manage violation library

### Department Administrator
- Create users
- Configure authentication
- Manage system themes
- Backup and restore data

---

## Current Limitations / Known Issues
- No document attachment storage (filenames only)
- No real-time collaboration notifications
- No email notifications for escalations
- Limited access control (all authenticated users see all data)
- No audit logging of data changes

---

## Future Enhancements (Noted for Discussion)
- Document management system with folder hierarchy
- Personnel file system (training records, promotions, discipline)
- Role-based access control (different views for different roles)
- Email notifications and alerts
- Export/import functionality
- API for external integrations
- Mobile app
- Real-time collaboration features
