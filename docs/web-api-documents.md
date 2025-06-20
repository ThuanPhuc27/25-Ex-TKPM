# Student Management System – API Documentation

([_Return to index_](index.md))

## Overview

The Student Management System is a RESTful web service designed to manage academic entities such as students, classes, courses, and faculty. It supports both standard CRUD operations and advanced features like score tracking, XML data import, and dynamic configuration through a clean and consistent API.

## Key Features

- **CRUD Support**: All major entities support Create, Read, Update, and Delete operations.
- **Bulk Operations**: Batch creation and import/export of student records.
- **Score Management**: Track enrollment scores and view student scoreboards.
- **Centralized Configuration**: Manage system-wide settings, rules, and email domains through secure endpoints.
- **Structured API Design**: Consistent `/entity/action` and `/:id/edit` patterns for clarity and maintainability.

## Technical Notes

- **HTTP Methods**: `GET`, `POST`, `PATCH`, `DELETE`
- **Data Formats**:
  - Default: `application/json`
  - Import Support: `application/xml` (students only)
- **Authentication & Authorization**: Recommended for sensitive routes
- **Rate Limiting**: Suggested for `POST`, `PATCH`, and `DELETE` endpoints

## API Routes Summary

### 1. Student Management

| Endpoint               | Method | Description           |
| ---------------------- | ------ | --------------------- |
| `/students`            | GET    | Get all students      |
| `/students/:studentId` | GET    | Get a single student  |
| `/students/add-one`    | POST   | Add a single student  |
| `/students/add-multi`  | POST   | Add multiple students |
| `/students/import`     | POST   | Import students (XML) |
| `/students/export-all` | GET    | Export all students   |
| `/students/:studentId` | PATCH  | Update a student      |
| `/students/:studentId` | DELETE | Delete a student      |

### 2. Class Management

| Endpoint                   | Method | Description     |
| -------------------------- | ------ | --------------- |
| `/classes`                 | GET    | Get all classes |
| `/classes/add`             | POST   | Add a new class |
| `/classes/:classId/edit`   | PATCH  | Update a class  |
| `/classes/:classId/delete` | DELETE | Delete a class  |

### 3. Course Management

| Endpoint                    | Method | Description      |
| --------------------------- | ------ | ---------------- |
| `/courses`                  | GET    | Get all courses  |
| `/courses/add`              | POST   | Add a new course |
| `/courses/:courseId/edit`   | PATCH  | Update a course  |
| `/courses/:courseId/delete` | DELETE | Delete a course  |

### 4. Enrollment Management

| Endpoint                                     | Method | Description                |
| -------------------------------------------- | ------ | -------------------------- |
| `/enrollments`                               | GET    | Get all enrollments        |
| `/enrollments/add`                           | POST   | Add a new enrollment       |
| `/enrollments/:enrollmentId/cancel`          | DELETE | Cancel an enrollment       |
| `/enrollments/:enrollmentId/score`           | PATCH  | Update enrollment score    |
| `/enrollments/student/:studentId`            | GET    | Get enrollments by student |
| `/enrollments/class/:classCode`              | GET    | Get enrollments by class   |
| `/enrollments/student/:studentId/scoreboard` | GET    | Get student scoreboard     |

### 5. Faculty Management

| Endpoint                     | Method | Description       |
| ---------------------------- | ------ | ----------------- |
| `/faculty`                   | GET    | Get all faculties |
| `/faculty/add`               | POST   | Add a faculty     |
| `/faculty/:facultyId/edit`   | PATCH  | Update a faculty  |
| `/faculty/:facultyId/delete` | DELETE | Delete a faculty  |

### 6. Program Management

| Endpoint                     | Method | Description      |
| ---------------------------- | ------ | ---------------- |
| `/program`                   | GET    | Get all programs |
| `/program/add`               | POST   | Add a program    |
| `/program/:programId/edit`   | PATCH  | Update a program |
| `/program/:programId/delete` | DELETE | Delete a program |

### 7. Student Status Management

| Endpoint                          | Method | Description      |
| --------------------------------- | ------ | ---------------- |
| `/studentStatus`                  | GET    | Get all statuses |
| `/studentStatus/add`              | POST   | Add a status     |
| `/studentStatus/:statusId/edit`   | PATCH  | Update a status  |
| `/studentStatus/:statusId/delete` | DELETE | Delete a status  |

### 8. System Configuration

| Endpoint  | Method | Description                   |
| --------- | ------ | ----------------------------- |
| `/config` | GET    | Get system configuration data |

### 9. Email Domains

| Endpoint   | Method | Description                  |
| ---------- | ------ | ---------------------------- |
| `/domains` | GET    | Get allowed email domains    |
| `/domains` | POST   | Update allowed email domains |

### 10. Transition Rules

| Endpoint | Method | Description                       |
| -------- | ------ | --------------------------------- |
| `/rules` | GET    | Get all academic transition rules |
| `/rules` | POST   | Update transition rules           |

## Future Enhancements (Suggestions)

- Add `PUT` method support for full entity replacement
- Implement soft deletes with `isActive` or `isDeleted` flags
- Role-based access control (RBAC) for route-level permissions
- API versioning via `/api/v1/...` path prefix
- Pagination for large GET responses

([_Return to index_](index.md))
