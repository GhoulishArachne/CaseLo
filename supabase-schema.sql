-- ============================================
-- CaseLogger PostgreSQL Schema for Supabase
-- Run this script in Supabase SQL Editor
-- ============================================

-- ============================================
-- TABLE: cases
-- ============================================
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Intake',
  priority VARCHAR(20) DEFAULT 'Medium',
  classification VARCHAR(50) DEFAULT 'Unclassified',
  investigation_type VARCHAR(50) DEFAULT 'General',
  opened DATE NOT NULL DEFAULT CURRENT_DATE,
  closed DATE,
  tags TEXT[] DEFAULT '{}',
  related_case_ids UUID[] DEFAULT '{}',
  prior_complaint_ids UUID[] DEFAULT '{}',
  involved_person_ids UUID[] DEFAULT '{}',
  description TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: complaints
-- ============================================
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_number VARCHAR(20) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  complainant JSONB DEFAULT '{}'::jsonb,
  contact JSONB DEFAULT '{}'::jsonb,
  incident JSONB DEFAULT '{}'::jsonb,
  supervisor_referral JSONB DEFAULT '{}'::jsonb,
  screening JSONB DEFAULT '{}'::jsonb,
  evidence UUID[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'Intake',
  mandatory_ia_review_alert JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: people (Officer Roster)
-- ============================================
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  badge_number VARCHAR(20),
  rank VARCHAR(50),
  department VARCHAR(100),
  personnel_history JSONB DEFAULT '{}'::jsonb,
  risk_score_override INT,
  risk_score_override_date DATE,
  risk_score_override_reason TEXT,
  training_deficiencies TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: evidence (FK → cases)
-- ============================================
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  evidence_id VARCHAR(20),
  evidence_type VARCHAR(50) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  discovery_date DATE,
  confidence VARCHAR(20),
  chain_of_custody TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: events (FK → cases)
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  event_id VARCHAR(20),
  type VARCHAR(50),
  event_date DATE,
  event_time TIME,
  location VARCHAR(255),
  description TEXT,
  witnesses TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: notes (FK → cases)
-- ============================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  note_id VARCHAR(20),
  tag VARCHAR(50),
  note_date DATE,
  author VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: tasks (FK → cases)
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  task_id VARCHAR(20),
  title VARCHAR(255),
  priority VARCHAR(20) DEFAULT 'Medium',
  status VARCHAR(20) DEFAULT 'Open',
  due_date DATE,
  assigned_to VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: findings (FK → cases)
-- ============================================
CREATE TABLE IF NOT EXISTS findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  finding_id VARCHAR(20),
  finding_type VARCHAR(50),
  officer_involved UUID REFERENCES people(id),
  severity_level VARCHAR(20) DEFAULT 'None',
  appeal_status VARCHAR(20) DEFAULT 'None',
  command_review_status VARCHAR(20) DEFAULT 'Pending',
  discipline_template VARCHAR(50) DEFAULT 'None',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: violations (Violation Library)
-- ============================================
CREATE TABLE IF NOT EXISTS violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  violation_code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  category VARCHAR(50),
  severity VARCHAR(20),
  discipline_recommendations TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: policies (Policy Library)
-- ============================================
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  url VARCHAR(500),
  category VARCHAR(50),
  version VARCHAR(20),
  effective_date DATE,
  linked_violation_ids UUID[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: investigation_templates
-- ============================================
CREATE TABLE IF NOT EXISTS investigation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255),
  description TEXT,
  category VARCHAR(50),
  investigation_scope TEXT,
  key_questions TEXT[],
  required_evidence_types TEXT[],
  linked_violations UUID[] DEFAULT '{}',
  linked_policies UUID[] DEFAULT '{}',
  estimated_days INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: custom_options (User-defined dropdowns)
-- ============================================
CREATE TABLE IF NOT EXISTS custom_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) UNIQUE NOT NULL,
  options TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_priority ON cases(priority);
CREATE INDEX IF NOT EXISTS idx_cases_case_number ON cases(case_number);
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_events_case_id ON events(case_id);
CREATE INDEX IF NOT EXISTS idx_notes_case_id ON notes(case_id);
CREATE INDEX IF NOT EXISTS idx_tasks_case_id ON tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_findings_case_id ON findings(case_id);
CREATE INDEX IF NOT EXISTS idx_complaints_number ON complaints(complaint_number);

-- ============================================
-- TABLE: document_folders
-- ============================================
CREATE TABLE IF NOT EXISTS document_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  parent_folder_id UUID REFERENCES document_folders(id) ON DELETE CASCADE,
  document_type VARCHAR(50),
  person_id UUID REFERENCES people(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: documents
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  filename VARCHAR(255),
  document_type VARCHAR(50),
  folder_id UUID NOT NULL REFERENCES document_folders(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE SET NULL,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  storage_path TEXT,
  description TEXT,
  file_size INT,
  mime_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_document_folders_person ON document_folders(person_id);
CREATE INDEX IF NOT EXISTS idx_document_folders_parent ON document_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_folder ON documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_person ON documents(person_id);
CREATE INDEX IF NOT EXISTS idx_documents_case ON documents(case_id);

-- ============================================
-- ROW-LEVEL SECURITY (RLS) Setup
-- ============================================

-- Enable RLS on all tables
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read/write all records
CREATE POLICY "Enable all for authenticated users on cases" ON cases
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on complaints" ON complaints
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on people" ON people
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on evidence" ON evidence
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on events" ON events
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on notes" ON notes
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on tasks" ON tasks
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on findings" ON findings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on violations" ON violations
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on policies" ON policies
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on investigation_templates" ON investigation_templates
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on custom_options" ON custom_options
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on document_folders" ON document_folders
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users on documents" ON documents
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- Seed Data: Violations
-- ============================================
INSERT INTO violations (violation_code, title, description, category, severity) VALUES
('VC-001', 'Conduct Unbecoming an Officer', 'Behavior unbecoming of a law enforcement officer', 'Conduct', 'Medium'),
('VC-002', 'Neglect of Duty', 'Failure to perform assigned duties', 'Performance', 'Medium'),
('VC-003', 'Corruption', 'Abuse of power for personal gain', 'Integrity', 'Critical'),
('VC-004', 'Truthfulness Violation', 'Providing false or misleading information', 'Integrity', 'High'),
('VC-005', 'Excessive Force', 'Use of more force than necessary', 'Use of Force', 'Critical')
ON CONFLICT (violation_code) DO NOTHING;

-- ============================================
-- Seed Data: Custom Options
-- ============================================
INSERT INTO custom_options (category, options) VALUES
('priorityOptions', '{"Critical","High","Medium","Low"}'),
('investigationTypes', '{"General","Use of Force","Corruption","Pursuit","Harassment"}')
ON CONFLICT (category) DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- Schema created successfully!
-- 12 tables created with RLS enabled
-- All authenticated users can read/write all records
-- Cascade deletes configured (deleting case deletes related evidence/tasks/findings)
