export interface SpringFile {
  path: string;
  filename: string;
  type: 'entity' | 'config' | 'repository' | 'controller' | 'service' | 'dto' | 'main' | 'pom';
  content: string;
  description: string;
}

export const APPLICATION_PROPERTIES = `# ===================================================================
# CollabSphere Spring Boot Application Configuration
# Database Engine: MySQL 8.0+ | Persistence: Spring Data JPA / Hibernate
# ===================================================================

# Server Configuration
server.port=8080
server.servlet.context-path=/api/v1

# MySQL Database DataSource Settings
spring.datasource.url=jdbc:mysql://localhost:3306/collabsphere?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=rootpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Connection Pool Settings (HikariCP)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.connection-timeout=20000

# JPA / Hibernate Properties
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.use_sql_comments=true
spring.jpa.open-in-view=false

# JSON Formatting
spring.jackson.serialization.indent-output=true
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
`;

export const POM_XML = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-inf/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.collabsphere</groupId>
    <artifactId>collabsphere-backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>collabsphere</name>
    <description>CollabSphere Student Project Tracking Backend with Spring Data JPA &amp; MySQL</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- MySQL Connector -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Boot Starter Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
`;

export const STUDENT_ENTITY = `package com.collabsphere.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * Entity representing a Student enrolled in CollabSphere.
 */
@Entity
@Table(name = "student", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email", name = "uk_student_email")
})
public class Student implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 30)
    private String role = "Student";

    // Constructors
    public Student() {}

    public Student(String name, String email, String passwordHash, String role) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return Objects.equals(id, student.id) && Objects.equals(email, student.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }
}
`;

export const TEAM_ENTITY = `package com.collabsphere.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Entity representing a student project Team.
 */
@Entity
@Table(name = "team")
public class Team implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "team_name", nullable = false, length = 100)
    private String teamName;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "team_member",
        joinColumns = @JoinColumn(name = "team_id", foreignKey = @ForeignKey(name = "fk_tm_team")),
        inverseJoinColumns = @JoinColumn(name = "student_id", foreignKey = @ForeignKey(name = "fk_tm_student"))
    )
    private Set<Student> members = new HashSet<>();

    // Constructors
    public Team() {}

    public Team(String teamName) {
        this.teamName = teamName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Set<Student> getMembers() {
        return members;
    }

    public void setMembers(Set<Student> members) {
        this.members = members;
    }

    public void addMember(Student student) {
        this.members.add(student);
    }

    public void removeMember(Student student) {
        this.members.remove(student);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Team team = (Team) o;
        return Objects.equals(id, team.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
`;

export const PROJECT_ENTITY = `package com.collabsphere.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * Entity representing an Academic Project owned by a Team.
 */
@Entity
@Table(name = "project")
public class Project implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false, foreignKey = @ForeignKey(name = "fk_project_team"))
    private Team team;

    @Column(name = "project_name", nullable = false, length = 150)
    private String projectName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", foreignKey = @ForeignKey(name = "fk_project_faculty"))
    private Faculty facultyAdvisor;

    // Constructors
    public Project() {}

    public Project(Team team, String projectName) {
        this.team = team;
        this.projectName = projectName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Faculty getFacultyAdvisor() {
        return facultyAdvisor;
    }

    public void setFacultyAdvisor(Faculty facultyAdvisor) {
        this.facultyAdvisor = facultyAdvisor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Project project = (Project) o;
        return Objects.equals(id, project.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
`;

export const TASK_ENTITY = `package com.collabsphere.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entity representing a Task deliverable within a Project.
 */
@Entity
@Table(name = "task")
public class Task implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false, foreignKey = @ForeignKey(name = "fk_task_project"))
    private Project project;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to", foreignKey = @ForeignKey(name = "fk_task_student"))
    private Student assignedTo;

    @Column(nullable = false, length = 30)
    private String status = "To Do"; // "To Do", "In Progress", "Done"

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDate createdDate = LocalDate.now();

    @Column(name = "ideal_progress_pct", precision = 5, scale = 2)
    private BigDecimal idealProgressPct = new BigDecimal("100.00");

    @Column(name = "actual_progress_pct", precision = 5, scale = 2)
    private BigDecimal actualProgressPct = BigDecimal.ZERO;

    // Constructors
    public Task() {}

    public Task(Project project, String title, String description, Student assignedTo, String status, LocalDate dueDate) {
        this.project = project;
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
        this.status = status;
        this.dueDate = dueDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Student getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(Student assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public BigDecimal getIdealProgressPct() {
        return idealProgressPct;
    }

    public void setIdealProgressPct(BigDecimal idealProgressPct) {
        this.idealProgressPct = idealProgressPct;
    }

    public BigDecimal getActualProgressPct() {
        return actualProgressPct;
    }

    public void setActualProgressPct(BigDecimal actualProgressPct) {
        this.actualProgressPct = actualProgressPct;
    }
}
`;

export const FILE_UPLOAD_ENTITY = `package com.collabsphere.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Entity representing a File Upload associated with a Project.
 */
@Entity
@Table(name = "file_upload")
public class FileUpload implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false, foreignKey = @ForeignKey(name = "fk_file_project"))
    private Project project;

    @Column(nullable = false, length = 255)
    private String filename;

    @Column(length = 20)
    private String version = "v1.0";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", foreignKey = @ForeignKey(name = "fk_file_student"))
    private Student uploadedBy;

    @Column(name = "uploaded_date", nullable = false)
    private LocalDateTime uploadedDate = LocalDateTime.now();

    // Constructors
    public FileUpload() {}

    public FileUpload(Project project, String filename, String version, Student uploadedBy) {
        this.project = project;
        this.filename = filename;
        this.version = version;
        this.uploadedBy = uploadedBy;
        this.uploadedDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Student getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(Student uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public LocalDateTime getUploadedDate() {
        return uploadedDate;
    }

    public void setUploadedDate(LocalDateTime uploadedDate) {
        this.uploadedDate = uploadedDate;
    }
}
`;

export const CONTRIBUTION_LOG_ENTITY = `package com.collabsphere.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Entity representing an automated audit Trail for Student Contributions.
 */
@Entity
@Table(name = "contribution_log")
public class ContributionLog implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false, foreignKey = @ForeignKey(name = "fk_log_student"))
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false, foreignKey = @ForeignKey(name = "fk_log_project"))
    private Project project;

    @Column(name = "action_type", nullable = false, length = 100)
    private String actionType;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    // Constructors
    public ContributionLog() {}

    public ContributionLog(Student student, Project project, String actionType) {
        this.student = student;
        this.project = project;
        this.actionType = actionType;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
`;

export const FACULTY_ENTITY = `package com.collabsphere.model;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * Entity representing a Faculty Advisor supervising projects.
 */
@Entity
@Table(name = "faculty")
public class Faculty implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 100)
    private String department;

    // Constructors
    public Faculty() {}

    public Faculty(String name, String email, String department) {
        this.name = name;
        this.email = email;
        this.department = department;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
`;

export const MAIN_APP = `package com.collabsphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CollabSphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(CollabSphereApplication.class, args);
        System.out.println("🚀 CollabSphere Spring Boot Service running on http://localhost:8080/api/v1");
    }
}
`;

export const TASK_REPOSITORY = `package com.collabsphere.repository;

import com.collabsphere.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssignedToId(Long studentId);

    List<Task> findByStatus(String status);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId AND t.actualProgressPct < t.idealProgressPct")
    List<Task> findDelayedTasksByProject(@Param("projectId") Long projectId);
}
`;

export const TEAM_REPOSITORY = `package com.collabsphere.repository;

import com.collabsphere.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByTeamName(String teamName);
}
`;

export const PROJECT_REPOSITORY = `package com.collabsphere.repository;

import com.collabsphere.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByTeamId(Long teamId);
}
`;

export const FILE_UPLOAD_REPOSITORY = `package com.collabsphere.repository;

import com.collabsphere.model.FileUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {
    List<FileUpload> findByProjectId(Long projectId);
    
    @Query("SELECT f FROM FileUpload f WHERE f.project.id = :projectId AND f.filename = :filename ORDER BY f.uploadedDate DESC")
    List<FileUpload> findByProjectIdAndFilenameOrderByUploadedDateDesc(@Param("projectId") Long projectId, @Param("filename") String filename);
}
`;

export const STUDENT_REPOSITORY = `package com.collabsphere.repository;

import com.collabsphere.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
}
`;

export const TASK_CONTROLLER = `package com.collabsphere.controller;

import com.collabsphere.model.Project;
import com.collabsphere.model.Student;
import com.collabsphere.model.Task;
import com.collabsphere.repository.ProjectRepository;
import com.collabsphere.repository.StudentRepository;
import com.collabsphere.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for Task Management operations in CollabSphere.
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private StudentRepository studentRepository;

    /**
     * POST /api/tasks : Create a new task deliverable.
     */
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Map<String, Object> payload) {
        try {
            Long projectId = Long.valueOf(payload.get("projectId").toString());
            String title = (String) payload.get("title");
            String description = (String) payload.get("description");
            String status = payload.containsKey("status") ? (String) payload.get("status") : "To Do";

            Optional<Project> projectOpt = projectRepository.findById(projectId);
            if (projectOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Project not found with ID: " + projectId));
            }

            Task task = new Task();
            task.setProject(projectOpt.get());
            task.setTitle(title);
            task.setDescription(description);
            task.setStatus(status);
            task.setCreatedDate(LocalDate.now());

            if (payload.containsKey("assignedToId") && payload.get("assignedToId") != null) {
                Long studentId = Long.valueOf(payload.get("assignedToId").toString());
                studentRepository.findById(studentId).ifPresent(task::setAssignedTo);
            }

            if (payload.containsKey("dueDate") && payload.get("dueDate") != null) {
                task.setDueDate(LocalDate.parse((String) payload.get("dueDate")));
            }

            if (payload.containsKey("idealProgressPct")) {
                task.setIdealProgressPct(new BigDecimal(payload.get("idealProgressPct").toString()));
            }

            if (payload.containsKey("actualProgressPct")) {
                task.setActualProgressPct(new BigDecimal(payload.get("actualProgressPct").toString()));
            }

            Task savedTask = taskRepository.save(task);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to create task: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/tasks/{id} : Update task status, description, and actual progress percentage.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTaskStatusAndProgress(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Object> updates) {

        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Task not found with ID: " + id));
        }

        Task task = taskOpt.get();

        if (updates.containsKey("status")) {
            task.setStatus((String) updates.get("status"));
        }

        if (updates.containsKey("actualProgressPct")) {
            task.setActualProgressPct(new BigDecimal(updates.get("actualProgressPct").toString()));
        }

        if (updates.containsKey("title")) {
            task.setTitle((String) updates.get("title"));
        }

        if (updates.containsKey("description")) {
            task.setDescription((String) updates.get("description"));
        }

        if (updates.containsKey("assignedToId") && updates.get("assignedToId") != null) {
            Long studentId = Long.valueOf(updates.get("assignedToId").toString());
            Optional<Student> studentOpt = studentRepository.findById(studentId);
            studentOpt.ifPresent(task::setAssignedTo);
        }

        Task updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * GET /api/tasks/project/{projectId} : Retrieve all tasks associated with a project.
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable("projectId") Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return ResponseEntity.ok(tasks);
    }
}
`;

export const TEAM_CONTROLLER = `package com.collabsphere.controller;

import com.collabsphere.model.Student;
import com.collabsphere.model.Team;
import com.collabsphere.repository.StudentRepository;
import com.collabsphere.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for Team Management and Invitations in CollabSphere.
 */
@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private StudentRepository studentRepository;

    /**
     * POST /api/teams : Create a new student project team.
     */
    @PostMapping
    public ResponseEntity<?> createTeam(@RequestBody Map<String, String> payload) {
        String teamName = payload.get("teamName");
        if (teamName == null || teamName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "teamName parameter is required"));
        }

        Team team = new Team(teamName.trim());
        Team savedTeam = teamRepository.save(team);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTeam);
    }

    /**
     * POST /api/teams/{id}/invite : Add a student member to an existing team.
     */
    @PostMapping("/{id}/invite")
    public ResponseEntity<?> inviteMember(
            @PathVariable("id") Long teamId,
            @RequestBody Map<String, Object> payload) {

        Optional<Team> teamOpt = teamRepository.findById(teamId);
        if (teamOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Team not found with ID: " + teamId));
        }

        Team team = teamOpt.get();
        Student student = null;

        if (payload.containsKey("studentId") && payload.get("studentId") != null) {
            Long studentId = Long.valueOf(payload.get("studentId").toString());
            student = studentRepository.findById(studentId).orElse(null);
        } else if (payload.containsKey("email") && payload.get("email") != null) {
            String email = (String) payload.get("email");
            student = studentRepository.findByEmail(email).orElse(null);
        }

        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Student record not found for the provided studentId or email"));
        }

        team.addMember(student);
        Team updatedTeam = teamRepository.save(team);

        return ResponseEntity.ok(Map.of(
                "message", "Student successfully added to team " + team.getTeamName(),
                "teamId", updatedTeam.getId(),
                "memberCount", updatedTeam.getMembers().size()
        ));
    }
}
`;

export const FILE_CONTROLLER = `package com.collabsphere.controller;

import com.collabsphere.model.FileUpload;
import com.collabsphere.model.Project;
import com.collabsphere.model.Student;
import com.collabsphere.repository.FileUploadRepository;
import com.collabsphere.repository.ProjectRepository;
import com.collabsphere.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for Managing Deliverable File Uploads with Version Incrementing.
 */
@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private FileUploadRepository fileUploadRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private StudentRepository studentRepository;

    /**
     * POST /api/files : Log a file upload deliverable with auto-calculated version incrementing.
     */
    @PostMapping
    public ResponseEntity<?> logFileUpload(@RequestBody Map<String, Object> payload) {
        try {
            Long projectId = Long.valueOf(payload.get("projectId").toString());
            String filename = (String) payload.get("filename");

            if (filename == null || filename.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "filename parameter is required"));
            }

            Optional<Project> projectOpt = projectRepository.findById(projectId);
            if (projectOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Project not found with ID: " + projectId));
            }

            Student uploader = null;
            if (payload.containsKey("uploadedById") && payload.get("uploadedById") != null) {
                Long studentId = Long.valueOf(payload.get("uploadedById").toString());
                uploader = studentRepository.findById(studentId).orElse(null);
            }

            // Calculate auto-incremented version number for this filename & project
            List<FileUpload> existing = fileUploadRepository
                    .findByProjectIdAndFilenameOrderByUploadedDateDesc(projectId, filename);

            String nextVersion = "v1.0";
            if (!existing.isEmpty()) {
                int count = existing.size() + 1;
                nextVersion = "v" + count + ".0";
            }

            FileUpload fileUpload = new FileUpload();
            fileUpload.setProject(projectOpt.get());
            fileUpload.setFilename(filename.trim());
            fileUpload.setVersion(nextVersion);
            fileUpload.setUploadedBy(uploader);
            fileUpload.setUploadedDate(LocalDateTime.now());

            FileUpload savedFile = fileUploadRepository.save(fileUpload);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedFile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to log file upload: " + e.getMessage()));
        }
    }

    /**
     * GET /api/files/project/{projectId} : Retrieve all uploaded deliverables for a project.
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<FileUpload>> getFilesByProject(@PathVariable("projectId") Long projectId) {
        List<FileUpload> files = fileUploadRepository.findByProjectId(projectId);
        return ResponseEntity.ok(files);
    }
}
`;

export const PREDICTION_SERVICE = `package com.collabsphere.service;

import com.collabsphere.model.ContributionLog;
import com.collabsphere.model.Student;
import com.collabsphere.model.Task;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Service providing rule-based AI analytical insights for CollabSphere project tracking.
 * Includes deadline risk projection, workload balance evaluation, and contribution monitoring.
 */
@Service
public class PredictionService {

    /**
     * Rule 1: Calculates the deadline risk level for a task based on current progress rate.
     * 
     * Logic:
     * - Measures elapsed days between createdDate and today.
     * - Estimates daily progress rate (% per day) based on actualProgressPct.
     * - Projects completion date = today + (remaining % / daily progress rate).
     * - Compares projected completion date with task dueDate:
     *   * Completed or projected on/before due date: "None"
     *   * Overdue by 1-2 days: "Low"
     *   * Overdue by 3-7 days: "Medium"
     *   * Overdue by >7 days or 0% progress when near/past due: "High"
     * 
     * @param task the Task entity containing progress percentage and dates
     * @return Risk category: "None", "Low", "Medium", or "High"
     */
    public String calculateDeadlineRisk(Task task) {
        if (task == null) {
            return "None";
        }

        BigDecimal actualPct = task.getActualProgressPct() != null ? task.getActualProgressPct() : BigDecimal.ZERO;

        // If task is already 100% complete, there is no deadline risk
        if (actualPct.compareTo(new BigDecimal("100.00")) >= 0) {
            return "None";
        }

        LocalDate now = LocalDate.now();
        LocalDate createdDate = task.getCreatedDate() != null ? task.getCreatedDate() : now;
        LocalDate dueDate = task.getDueDate() != null ? task.getDueDate() : now.plusDays(7);

        // Calculate days elapsed since task creation (minimum 1 day to prevent division by zero)
        long daysElapsed = ChronoUnit.DAYS.between(createdDate, now);
        if (daysElapsed <= 0) {
            daysElapsed = 1;
        }

        double currentPct = actualPct.doubleValue();

        // Handle zero progress scenario
        if (currentPct <= 0) {
            long daysUntilDue = ChronoUnit.DAYS.between(now, dueDate);
            if (daysUntilDue <= 0) {
                return "High"; // Overdue with zero progress
            } else if (daysUntilDue <= 3) {
                return "Medium";
            } else {
                return "Low";
            }
        }

        // Calculate daily progress rate (% per day)
        double progressPerDay = currentPct / daysElapsed;
        double remainingPct = 100.0 - currentPct;

        // Estimated remaining days needed to complete task
        long estimatedDaysToComplete = (long) Math.ceil(remainingPct / progressPerDay);

        // Projected completion date based on rate
        LocalDate projectedCompletionDate = now.plusDays(estimatedDaysToComplete);

        // Check if projected completion date is on or before due date
        if (!projectedCompletionDate.isAfter(dueDate)) {
            return "None";
        }

        // Calculate days overdue
        long daysOverdue = ChronoUnit.DAYS.between(dueDate, projectedCompletionDate);

        if (daysOverdue > 7) {
            return "High";
        } else if (daysOverdue >= 3) {
            return "Medium";
        } else {
            return "Low";
        }
    }

    /**
     * Rule 2: Evaluates team workload distribution and flags underloaded team members.
     * 
     * Logic:
     * - Groups tasks by assigned student ID.
     * - Computes the average task count per assigned team member.
     * - Calculates the population standard deviation of task counts across members.
     * - Flags any member whose task count is lower than (Average - 1 * Standard Deviation).
     * 
     * @param teamTasks list of tasks assigned within a team project
     * @return List of student ID strings for underloaded team members
     */
    public List<String> calculateWorkloadImbalance(List<Task> teamTasks) {
        if (teamTasks == null || teamTasks.isEmpty()) {
            return Collections.emptyList();
        }

        // Group task count by assigned Student ID
        Map<String, Long> taskCountByStudent = new HashMap<>();

        for (Task task : teamTasks) {
            if (task.getAssignedTo() != null && task.getAssignedTo().getId() != null) {
                String studentId = task.getAssignedTo().getId().toString();
                taskCountByStudent.put(studentId, taskCountByStudent.getOrDefault(studentId, 0L) + 1);
            }
        }

        if (taskCountByStudent.isEmpty()) {
            return Collections.emptyList();
        }

        // Compute average task count
        double totalTasks = taskCountByStudent.values().stream().mapToDouble(Long::doubleValue).sum();
        int memberCount = taskCountByStudent.size();
        double mean = totalTasks / memberCount;

        // Compute standard deviation
        double varianceSum = 0.0;
        for (long count : taskCountByStudent.values()) {
            varianceSum += Math.pow(count - mean, 2);
        }
        double stdDev = Math.sqrt(varianceSum / memberCount);

        // Threshold: Member is underloaded if task count < (mean - 1 * stdDev)
        double underloadThreshold = mean - stdDev;

        List<String> underloadedStudentIds = new ArrayList<>();
        for (Map.Entry<String, Long> entry : taskCountByStudent.entrySet()) {
            if (entry.getValue() < underloadThreshold) {
                underloadedStudentIds.add(entry.getKey());
            }
        }

        return underloadedStudentIds;
    }

    /**
     * Rule 3: Detects students with low recent activity within a sliding time window.
     * 
     * Logic:
     * - Filters contribution log entries recorded within the last 'windowDays' from now.
     * - Counts relevant log entries for each unique student ID.
     * - Flags student IDs with fewer than 2 logged contribution entries within the window.
     * 
     * @param logs list of ContributionLog entries
     * @param windowDays lookback window in days (e.g., 7 or 14 days)
     * @return List of student IDs (Long) flagged for low contribution activity
     */
    public List<Long> calculateLowContribution(List<ContributionLog> logs, int windowDays) {
        if (logs == null || logs.isEmpty()) {
            return Collections.emptyList();
        }

        LocalDateTime cutoffTime = LocalDateTime.now().minusDays(windowDays);

        // Map to store recent log counts per student ID
        Map<Long, Integer> recentLogCounts = new HashMap<>();
        Set<Long> allEncounteredStudents = new HashSet<>();

        for (ContributionLog log : logs) {
            if (log.getStudent() != null && log.getStudent().getId() != null) {
                Long studentId = log.getStudent().getId();
                allEncounteredStudents.add(studentId);

                if (log.getTimestamp() != null && log.getTimestamp().isAfter(cutoffTime)) {
                    recentLogCounts.put(studentId, recentLogCounts.getOrDefault(studentId, 0) + 1);
                }
            }
        }

        List<Long> flaggedStudentIds = new ArrayList<>();

        // Check each student against the minimum contribution threshold (< 2)
        for (Long studentId : allEncounteredStudents) {
            int count = recentLogCounts.getOrDefault(studentId, 0);
            if (count < 2) {
                flaggedStudentIds.add(studentId);
            }
        }

        return flaggedStudentIds;
    }
}
`;

export const CONTRIBUTION_LOG_REPOSITORY = `package com.collabsphere.repository;

import com.collabsphere.model.ContributionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContributionLogRepository extends JpaRepository<ContributionLog, Long> {
    List<ContributionLog> findByProjectId(Long projectId);
}
`;

export const RISK_REPORT_DTO = `package com.collabsphere.dto;

import java.util.List;

/**
 * Data Transfer Object combining AI Risk Report analysis for a Project.
 */
public class RiskReportResponseDto {

    private List<TaskRiskInfo> deadlineRisks;
    private List<String> workloadFlags;
    private List<Long> lowContributionFlags;

    public RiskReportResponseDto() {}

    public RiskReportResponseDto(List<TaskRiskInfo> deadlineRisks, List<String> workloadFlags, List<Long> lowContributionFlags) {
        this.deadlineRisks = deadlineRisks;
        this.workloadFlags = workloadFlags;
        this.lowContributionFlags = lowContributionFlags;
    }

    public List<TaskRiskInfo> getDeadlineRisks() {
        return deadlineRisks;
    }

    public void setDeadlineRisks(List<TaskRiskInfo> deadlineRisks) {
        this.deadlineRisks = deadlineRisks;
    }

    public List<String> getWorkloadFlags() {
        return workloadFlags;
    }

    public void setWorkloadFlags(List<String> workloadFlags) {
        this.workloadFlags = workloadFlags;
    }

    public List<Long> getLowContributionFlags() {
        return lowContributionFlags;
    }

    public void setLowContributionFlags(List<Long> lowContributionFlags) {
        this.lowContributionFlags = lowContributionFlags;
    }

    /**
     * Inner DTO representing deadline risk calculation for an individual task.
     */
    public static class TaskRiskInfo {
        private Long taskId;
        private String taskTitle;
        private String riskLevel;

        public TaskRiskInfo() {}

        public TaskRiskInfo(Long taskId, String taskTitle, String riskLevel) {
            this.taskId = taskId;
            this.taskTitle = taskTitle;
            this.riskLevel = riskLevel;
        }

        public Long getTaskId() {
            return taskId;
        }

        public void setTaskId(Long taskId) {
            this.taskId = taskId;
        }

        public String getTaskTitle() {
            return taskTitle;
        }

        public void setTaskTitle(String taskTitle) {
            this.taskTitle = taskTitle;
        }

        public String getRiskLevel() {
            return riskLevel;
        }

        public void setRiskLevel(String riskLevel) {
            this.riskLevel = riskLevel;
        }
    }
}
`;

export const PROJECT_CONTROLLER = `package com.collabsphere.controller;

import com.collabsphere.dto.RiskReportResponseDto;
import com.collabsphere.model.ContributionLog;
import com.collabsphere.model.Project;
import com.collabsphere.model.Task;
import com.collabsphere.repository.ContributionLogRepository;
import com.collabsphere.repository.ProjectRepository;
import com.collabsphere.repository.TaskRepository;
import com.collabsphere.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST Controller for Project Management & AI Risk Analysis in CollabSphere.
 */
@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ContributionLogRepository contributionLogRepository;

    @Autowired
    private PredictionService predictionService;

    /**
     * GET /api/projects/{id}/risk-report
     * 
     * Generates a single unified risk report JSON response for a project:
     * 1. Evaluates deadline risk for all open tasks (status != "Done") using PredictionService.calculateDeadlineRisk.
     * 2. Evaluates workload distribution across team members using PredictionService.calculateWorkloadImbalance.
     * 3. Detects students with low recent activity (< 2 log entries in last 7 days) using PredictionService.calculateLowContribution.
     * 
     * @param id Project ID
     * @return ResponseEntity with RiskReportResponseDto
     */
    @GetMapping("/{id}/risk-report")
    public ResponseEntity<?> getProjectRiskReport(@PathVariable("id") Long id) {
        Optional<Project> projectOpt = projectRepository.findById(id);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Project not found with ID: " + id));
        }

        // 1. Fetch all project tasks and filter open tasks (not "Done")
        List<Task> allProjectTasks = taskRepository.findByProjectId(id);
        List<Task> openTasks = allProjectTasks.stream()
                .filter(t -> !"Done".equalsIgnoreCase(t.getStatus()))
                .collect(Collectors.toList());

        // Calculate deadline risks for open tasks
        List<RiskReportResponseDto.TaskRiskInfo> deadlineRisks = new ArrayList<>();
        for (Task task : openTasks) {
            String riskLevel = predictionService.calculateDeadlineRisk(task);
            deadlineRisks.add(new RiskReportResponseDto.TaskRiskInfo(
                    task.getId(),
                    task.getTitle(),
                    riskLevel
            ));
        }

        // 2. Calculate workload imbalance flags across team tasks
        List<String> workloadFlags = predictionService.calculateWorkloadImbalance(allProjectTasks);

        // 3. Calculate low contribution flags for project logs within last 7 days
        List<ContributionLog> logs = contributionLogRepository.findByProjectId(id);
        List<Long> lowContributionFlags = predictionService.calculateLowContribution(logs, 7);

        // Combine into DTO response
        RiskReportResponseDto reportResponse = new RiskReportResponseDto(
                deadlineRisks,
                workloadFlags,
                lowContributionFlags
        );

        return ResponseEntity.ok(reportResponse);
    }
}
`;

export const SPRING_BOOT_FILES: SpringFile[] = [
  {
    path: 'src/main/resources/application.properties',
    filename: 'application.properties',
    type: 'config',
    content: APPLICATION_PROPERTIES,
    description: 'MySQL datasource, HikariCP pool, and Hibernate JPA properties',
  },
  {
    path: 'pom.xml',
    filename: 'pom.xml',
    type: 'pom',
    content: POM_XML,
    description: 'Maven build file with Spring Boot Data JPA & MySQL dependencies',
  },
  {
    path: 'src/main/java/com/collabsphere/dto/RiskReportResponseDto.java',
    filename: 'RiskReportResponseDto.java',
    type: 'dto',
    content: RISK_REPORT_DTO,
    description: 'Data Transfer Object combining deadline risks, workload flags & low contribution student IDs',
  },
  {
    path: 'src/main/java/com/collabsphere/controller/ProjectController.java',
    filename: 'ProjectController.java',
    type: 'controller',
    content: PROJECT_CONTROLLER,
    description: 'REST Controller with GET /api/projects/{id}/risk-report endpoint for AI analytics',
  },
  {
    path: 'src/main/java/com/collabsphere/service/PredictionService.java',
    filename: 'PredictionService.java',
    type: 'service',
    content: PREDICTION_SERVICE,
    description: 'Spring Service for AI Deadline Risk, Workload Imbalance & Low Contribution Analytics',
  },
  {
    path: 'src/main/java/com/collabsphere/controller/TaskController.java',
    filename: 'TaskController.java',
    type: 'controller',
    content: TASK_CONTROLLER,
    description: 'REST Controller for Task endpoints (POST create, PUT status/progress, GET by project)',
  },
  {
    path: 'src/main/java/com/collabsphere/controller/TeamController.java',
    filename: 'TeamController.java',
    type: 'controller',
    content: TEAM_CONTROLLER,
    description: 'REST Controller for Team endpoints (POST create team, POST invite member)',
  },
  {
    path: 'src/main/java/com/collabsphere/controller/FileController.java',
    filename: 'FileController.java',
    type: 'controller',
    content: FILE_CONTROLLER,
    description: 'REST Controller for FileUpload endpoints (POST log upload with versioning)',
  },
  {
    path: 'src/main/java/com/collabsphere/model/Student.java',
    filename: 'Student.java',
    type: 'entity',
    content: STUDENT_ENTITY,
    description: 'JPA Entity for Student with email unique constraint and user role',
  },
  {
    path: 'src/main/java/com/collabsphere/model/Team.java',
    filename: 'Team.java',
    type: 'entity',
    content: TEAM_ENTITY,
    description: 'JPA Entity for Team with @ManyToMany members join table',
  },
  {
    path: 'src/main/java/com/collabsphere/model/Project.java',
    filename: 'Project.java',
    type: 'entity',
    content: PROJECT_ENTITY,
    description: 'JPA Entity for Project with @ManyToOne links to Team and Faculty Advisor',
  },
  {
    path: 'src/main/java/com/collabsphere/model/Task.java',
    filename: 'Task.java',
    type: 'entity',
    content: TASK_ENTITY,
    description: 'JPA Entity for Task with ideal vs. actual progress tracking',
  },
  {
    path: 'src/main/java/com/collabsphere/model/FileUpload.java',
    filename: 'FileUpload.java',
    type: 'entity',
    content: FILE_UPLOAD_ENTITY,
    description: 'JPA Entity for FileUpload mapping deliverables to Projects',
  },
  {
    path: 'src/main/java/com/collabsphere/model/ContributionLog.java',
    filename: 'ContributionLog.java',
    type: 'entity',
    content: CONTRIBUTION_LOG_ENTITY,
    description: 'JPA Entity for automated audit logging of student contributions',
  },
  {
    path: 'src/main/java/com/collabsphere/model/Faculty.java',
    filename: 'Faculty.java',
    type: 'entity',
    content: FACULTY_ENTITY,
    description: 'JPA Entity for Faculty advisor information',
  },
  {
    path: 'src/main/java/com/collabsphere/repository/TaskRepository.java',
    filename: 'TaskRepository.java',
    type: 'repository',
    content: TASK_REPOSITORY,
    description: 'Spring Data JPA Repository for Task queries',
  },
  {
    path: 'src/main/java/com/collabsphere/repository/TeamRepository.java',
    filename: 'TeamRepository.java',
    type: 'repository',
    content: TEAM_REPOSITORY,
    description: 'Spring Data JPA Repository for Team persistence',
  },
  {
    path: 'src/main/java/com/collabsphere/repository/ProjectRepository.java',
    filename: 'ProjectRepository.java',
    type: 'repository',
    content: PROJECT_REPOSITORY,
    description: 'Spring Data JPA Repository for Project persistence',
  },
  {
    path: 'src/main/java/com/collabsphere/repository/FileUploadRepository.java',
    filename: 'FileUploadRepository.java',
    type: 'repository',
    content: FILE_UPLOAD_REPOSITORY,
    description: 'Spring Data JPA Repository for FileUpload queries and version tracking',
  },
  {
    path: 'src/main/java/com/collabsphere/repository/StudentRepository.java',
    filename: 'StudentRepository.java',
    type: 'repository',
    content: STUDENT_REPOSITORY,
    description: 'Spring Data JPA Repository for Student lookup',
  },
  {
    path: 'src/main/java/com/collabsphere/repository/ContributionLogRepository.java',
    filename: 'ContributionLogRepository.java',
    type: 'repository',
    content: CONTRIBUTION_LOG_REPOSITORY,
    description: 'Spring Data JPA Repository for ContributionLog lookup by Project ID',
  },
  {
    path: 'src/main/java/com/collabsphere/CollabSphereApplication.java',
    filename: 'CollabSphereApplication.java',
    type: 'main',
    content: MAIN_APP,
    description: 'Spring Boot Main Application entry point',
  },
];
