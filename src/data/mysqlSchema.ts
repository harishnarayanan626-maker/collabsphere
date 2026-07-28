export const MYSQL_SCHEMA_SQL = `-- ====================================================================
-- CollabSphere Database Schema (MySQL 8.0+)
-- Academic Student Project Tracking & Collaboration Platform
-- Created for CollabSphere Academic Workspace
-- ====================================================================

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS collabsphere_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE collabsphere_db;

-- Disable foreign key checks for clean teardown during migrations
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Contribution_Log;
DROP TABLE IF EXISTS File;
DROP TABLE IF EXISTS Task;
DROP TABLE IF EXISTS Project;
DROP TABLE IF EXISTS Team_Member;
DROP TABLE IF EXISTS Team;
DROP TABLE IF EXISTS Faculty;
DROP TABLE IF EXISTS Student;

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- Table: Student
-- Stores information about enrolled students, credentials, and roles.
-- ====================================================================
CREATE TABLE Student (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_student_email (email),
  INDEX idx_student_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- Table: Faculty
-- Stores faculty advisors, professors, and department details.
-- ====================================================================
CREATE TABLE Faculty (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  department VARCHAR(100) DEFAULT 'Computer Science',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_faculty_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- Table: Team
-- Stores project team entities.
-- ====================================================================
CREATE TABLE Team (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_team_name (team_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- Table: Team_Member
-- Many-to-many junction table mapping Students to Teams.
-- ====================================================================
CREATE TABLE Team_Member (
  team_id INT NOT NULL,
  student_id INT NOT NULL,
  joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (team_id, student_id),
  CONSTRAINT fk_team_member_team 
    FOREIGN KEY (team_id) REFERENCES Team(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_team_member_student 
    FOREIGN KEY (student_id) REFERENCES Student(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_tm_student (student_id),
  INDEX idx_tm_team (team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- Table: Project
-- Stores academic projects linked to a specific team.
-- ====================================================================
CREATE TABLE Project (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  project_name VARCHAR(150) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'Active',
  faculty_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_team 
    FOREIGN KEY (team_id) REFERENCES Team(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_project_faculty 
    FOREIGN KEY (faculty_id) REFERENCES Faculty(id) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_project_team_id (team_id),
  INDEX idx_project_faculty_id (faculty_id),
  INDEX idx_project_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- Table: Task
-- Stores tasks assigned to students within a project, tracking progress and status.
-- ====================================================================
CREATE TABLE Task (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  assigned_to INT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'To Do',
  priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
  due_date DATE NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ideal_progress_pct DECIMAL(5,2) DEFAULT 0.00,
  actual_progress_pct DECIMAL(5,2) DEFAULT 0.00,
  CONSTRAINT fk_task_project 
    FOREIGN KEY (project_id) REFERENCES Project(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_task_assigned_student 
    FOREIGN KEY (assigned_to) REFERENCES Student(id) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_task_project_id (project_id),
  INDEX idx_task_assigned_to (assigned_to),
  INDEX idx_task_status (status),
  INDEX idx_task_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- Table: File
-- Stores files uploaded by students for a project versioning.
-- ====================================================================
CREATE TABLE File (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  version VARCHAR(20) NOT NULL DEFAULT '1.0',
  uploaded_by INT NOT NULL,
  uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_file_project 
    FOREIGN KEY (project_id) REFERENCES Project(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_file_uploaded_by 
    FOREIGN KEY (uploaded_by) REFERENCES Student(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_file_project_id (project_id),
  INDEX idx_file_uploaded_by (uploaded_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- Table: Contribution_Log
-- Logs student activities, commits, file uploads, and milestone updates.
-- ====================================================================
CREATE TABLE Contribution_Log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  project_id INT NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_contrib_student 
    FOREIGN KEY (student_id) REFERENCES Student(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_contrib_project 
    FOREIGN KEY (project_id) REFERENCES Project(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_contrib_student_id (student_id),
  INDEX idx_contrib_project_id (project_id),
  INDEX idx_contrib_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SAMPLE SEED DATA INSERT STATEMENTS
-- ====================================================================

-- Insert Faculty
INSERT INTO Faculty (id, name, email, department) VALUES
(1, 'Dr. Marcus Vane', 'm.vane@university.edu', 'Computer Science'),
(2, 'Dr. Michael Chen', 'm.chen@university.edu', 'Data Science & AI'),
(3, 'Prof. Elena Rostova', 'e.rostova@university.edu', 'Electrical Engineering');

-- Insert Students
INSERT INTO Student (id, name, email, password_hash, role) VALUES
(1, 'Alex Chen', 'alex.chen@university.edu', '$2b$12$eXaMplEHaSh1234567890aB', 'Team Lead'),
(2, 'Sarah Johnson', 'sarah.j@university.edu', '$2b$12$eXaMplEHaSh1234567890aB', 'Student'),
(3, 'Jordan Smith', 'jordan.s@university.edu', '$2b$12$eXaMplEHaSh1234567890aB', 'Student'),
(4, 'Maria Garcia', 'maria.g@university.edu', '$2b$12$eXaMplEHaSh1234567890aB', 'Student'),
(5, 'Alex Rivera', 'alex.r@university.edu', '$2b$12$eXaMplEHaSh1234567890aB', 'Student'),
(6, 'Sarah Chen', 'sarah.c@university.edu', '$2b$12$eXaMplEHaSh1234567890aB', 'Student');

-- Insert Teams
INSERT INTO Team (id, team_name) VALUES
(1, 'Alpha Phoenix'),
(2, 'Beta Dynamics'),
(3, 'Gamma Tech'),
(4, 'Delta Matrix');

-- Insert Team Members
INSERT INTO Team_Member (team_id, student_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 5), (2, 6);

-- Insert Projects
INSERT INTO Project (id, team_id, project_name, description, status, faculty_id) VALUES
(1, 1, 'Smart Cities IoT Integration', 'Sensor grid & real-time analytics dashboard for smart urban traffic control.', 'Active', 1),
(2, 2, 'Neural Network Opt', 'High-speed model quantization framework for edge hardware.', 'Active', 2);

-- Insert Tasks
INSERT INTO Task (id, project_id, title, description, assigned_to, status, priority, due_date, ideal_progress_pct, actual_progress_pct) VALUES
(1, 1, 'Literature Review: Deep Learning', 'Complete initial review of transformer architectures.', 1, 'To Do', 'High', '2024-10-12', 100.00, 30.00),
(2, 1, 'Data Pre-processing Script', 'Clean raw dataset from faculty server and handle missing values.', 2, 'To Do', 'Medium', '2024-10-15', 80.00, 75.00),
(3, 1, 'Neural Network Architecture Design', 'Drafting initial layer sequence for research prototype.', 3, 'In Progress', 'High', '2024-10-10', 90.00, 60.00),
(4, 1, 'Database Schema Design', 'Design MySQL normalized tables for project tracking.', 1, 'Done', 'High', '2024-10-05', 100.00, 100.00);

-- Insert Files
INSERT INTO File (id, project_id, filename, version, uploaded_by) VALUES
(1, 1, 'Database_Schema_v1.0.sql', '1.0', 1),
(2, 1, 'Project_Proposal_Draft.pdf', '2.1', 2);

-- Insert Contribution Logs
INSERT INTO Contribution_Log (id, student_id, project_id, action_type) VALUES
(1, 3, 1, 'pushed to main branch'),
(2, 2, 1, 'created new task: Review Feedback'),
(3, 1, 1, 'uploaded File: Database_Schema_v1.0.sql');
`;

export interface SchemaTableColumn {
  name: string;
  type: string;
  key?: 'PRI' | 'MUL' | 'UNI';
  nullable: boolean;
  defaultVal?: string;
  description: string;
}

export interface SchemaTable {
  name: string;
  description: string;
  columns: SchemaTableColumn[];
  indexes: string[];
  foreignKeys: string[];
}

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    name: 'Student',
    description: 'Enrolled students, credentials, system roles, and account timestamps.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PRI', nullable: false, description: 'Unique Student ID' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false, description: 'Student Full Name' },
      { name: 'email', type: 'VARCHAR(150)', key: 'UNI', nullable: false, description: 'Institutional Email' },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, description: 'Bcrypt Hashed Password' },
      { name: 'role', type: 'VARCHAR(50)', nullable: false, defaultVal: "'Student'", description: 'System Role (Student / Team Lead)' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: true, defaultVal: 'CURRENT_TIMESTAMP', description: 'Account creation time' },
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE idx_student_email (email)', 'INDEX idx_student_role (role)'],
    foreignKeys: [],
  },
  {
    name: 'Faculty',
    description: 'Faculty professors and department mentors overseeing student teams.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PRI', nullable: false, description: 'Unique Faculty ID' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false, description: 'Faculty Name' },
      { name: 'email', type: 'VARCHAR(150)', key: 'UNI', nullable: false, description: 'Faculty Email' },
      { name: 'department', type: 'VARCHAR(100)', nullable: true, defaultVal: "'Computer Science'", description: 'Academic Department' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: true, defaultVal: 'CURRENT_TIMESTAMP', description: 'Creation timestamp' },
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE idx_faculty_email (email)'],
    foreignKeys: [],
  },
  {
    name: 'Team',
    description: 'Collaborative teams formed for academic projects.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PRI', nullable: false, description: 'Unique Team ID' },
      { name: 'team_name', type: 'VARCHAR(100)', key: 'UNI', nullable: false, description: 'Team Name' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: true, defaultVal: 'CURRENT_TIMESTAMP', description: 'Creation timestamp' },
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE idx_team_name (team_name)'],
    foreignKeys: [],
  },
  {
    name: 'Team_Member',
    description: 'Junction table linking students to their assigned project teams.',
    columns: [
      { name: 'team_id', type: 'INT', key: 'PRI', nullable: false, description: 'Foreign Key to Team.id' },
      { name: 'student_id', type: 'INT', key: 'PRI', nullable: false, description: 'Foreign Key to Student.id' },
      { name: 'joined_date', type: 'TIMESTAMP', nullable: true, defaultVal: 'CURRENT_TIMESTAMP', description: 'Join timestamp' },
    ],
    indexes: ['PRIMARY (team_id, student_id)', 'INDEX idx_tm_student (student_id)', 'INDEX idx_tm_team (team_id)'],
    foreignKeys: [
      'FOREIGN KEY (team_id) REFERENCES Team(id) ON DELETE CASCADE',
      'FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE',
    ],
  },
  {
    name: 'Project',
    description: 'Academic projects managed under a specific team and guided by a faculty advisor.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PRI', nullable: false, description: 'Unique Project ID' },
      { name: 'team_id', type: 'INT', key: 'MUL', nullable: false, description: 'Foreign Key to Team.id' },
      { name: 'project_name', type: 'VARCHAR(150)', nullable: false, description: 'Project Title' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Project Scope and Objectives' },
      { name: 'status', type: 'VARCHAR(50)', nullable: true, defaultVal: "'Active'", description: 'Status (Active, Planning, Completed)' },
      { name: 'faculty_id', type: 'INT', key: 'MUL', nullable: true, description: 'Faculty Advisor Foreign Key' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: true, defaultVal: 'CURRENT_TIMESTAMP', description: 'Creation timestamp' },
    ],
    indexes: ['PRIMARY (id)', 'INDEX idx_project_team_id (team_id)', 'INDEX idx_project_faculty_id (faculty_id)', 'INDEX idx_project_status (status)'],
    foreignKeys: [
      'FOREIGN KEY (team_id) REFERENCES Team(id) ON DELETE CASCADE',
      'FOREIGN KEY (faculty_id) REFERENCES Faculty(id) ON DELETE SET NULL',
    ],
  },
  {
    name: 'Task',
    description: 'Individual task items within a project, tracking progress percentages and risk levels.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PRI', nullable: false, description: 'Unique Task ID' },
      { name: 'project_id', type: 'INT', key: 'MUL', nullable: false, description: 'Foreign Key to Project.id' },
      { name: 'title', type: 'VARCHAR(200)', nullable: false, description: 'Task Title' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Detailed Task Instructions' },
      { name: 'assigned_to', type: 'INT', key: 'MUL', nullable: true, description: 'Foreign Key to Student.id' },
      { name: 'status', type: 'VARCHAR(50)', nullable: false, defaultVal: "'To Do'", description: 'Status (To Do, In Progress, Done)' },
      { name: 'priority', type: 'VARCHAR(20)', nullable: false, defaultVal: "'Medium'", description: 'Priority (Low, Medium, High)' },
      { name: 'due_date', type: 'DATE', nullable: true, description: 'Target Due Date' },
      { name: 'created_date', type: 'TIMESTAMP', nullable: true, defaultVal: 'CURRENT_TIMESTAMP', description: 'Task Creation Date' },
      { name: 'ideal_progress_pct', type: 'DECIMAL(5,2)', nullable: true, defaultVal: '0.00', description: 'Ideal Expected Progress %' },
      { name: 'actual_progress_pct', type: 'DECIMAL(5,2)', nullable: true, defaultVal: '0.00', description: 'Actual Completed Progress %' },
    ],
    indexes: ['PRIMARY (id)', 'INDEX idx_task_project_id (project_id)', 'INDEX idx_task_assigned_to (assigned_to)', 'INDEX idx_task_status (status)', 'INDEX idx_task_due_date (due_date)'],
    foreignKeys: [
      'FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE',
      'FOREIGN KEY (assigned_to) REFERENCES Student(id) ON DELETE SET NULL',
    ],
  },
  {
    name: 'File',
    description: 'Deliverables and project assets uploaded by team members with versioning.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PRI', nullable: false, description: 'Unique File ID' },
      { name: 'project_id', type: 'INT', key: 'MUL', nullable: false, description: 'Foreign Key to Project.id' },
      { name: 'filename', type: 'VARCHAR(255)', nullable: false, description: 'File Name' },
      { name: 'version', type: 'VARCHAR(20)', nullable: false, defaultVal: "'1.0'", description: 'Version Tag' },
      { name: 'uploaded_by', type: 'INT', key: 'MUL', nullable: false, description: 'Foreign Key to Student.id' },
      { name: 'uploaded_date', type: 'TIMESTAMP', nullable: true, defaultVal: 'CURRENT_TIMESTAMP', description: 'Upload Date' },
    ],
    indexes: ['PRIMARY (id)', 'INDEX idx_file_project_id (project_id)', 'INDEX idx_file_uploaded_by (uploaded_by)'],
    foreignKeys: [
      'FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE',
      'FOREIGN KEY (uploaded_by) REFERENCES Student(id) ON DELETE CASCADE',
    ],
  },
  {
    name: 'Contribution_Log',
    description: 'Audit log recording granular student contributions and repository commits.',
    columns: [
      { name: 'id', type: 'INT AUTO_INCREMENT', key: 'PRI', nullable: false, description: 'Unique Log ID' },
      { name: 'student_id', type: 'INT', key: 'MUL', nullable: false, description: 'Foreign Key to Student.id' },
      { name: 'project_id', type: 'INT', key: 'MUL', nullable: false, description: 'Foreign Key to Project.id' },
      { name: 'action_type', type: 'VARCHAR(100)', nullable: false, description: 'Action Description' },
      { name: 'timestamp', type: 'TIMESTAMP', nullable: true, defaultVal: 'CURRENT_TIMESTAMP', description: 'Activity Timestamp' },
    ],
    indexes: ['PRIMARY (id)', 'INDEX idx_contrib_student_id (student_id)', 'INDEX idx_contrib_project_id (project_id)', 'INDEX idx_contrib_timestamp (timestamp)'],
    foreignKeys: [
      'FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE',
      'FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE',
    ],
  },
];
