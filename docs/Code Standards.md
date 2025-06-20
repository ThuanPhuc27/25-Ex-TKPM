# Code Standards - Student Management System

## 1. Project Structure

```
.
├── backend/
│   ├── controllers/         # Handles request logic
│   ├── models/              # Defines MongoDB schema with Mongoose
│   ├── routes/              # Defines API endpoints
│   ├── repositories/        # Data queries
│   ├── services/            # Business logic processing
│   ├── migration/           # Scripts for sample data creation
│   ├── logger/              # Logging configuration
│   └── constants/           # Common constants
├── frontend/
│   ├── components/          # Reusable React components
│   ├── pages/               # Main display pages
│   ├── utils/               # Utility functions for data processing
│   └── assets/              # Images and icons
├── docker-compose.yml       # Docker service configuration
└── README.md
```

## 2. Naming Conventions

### 2.1 Folders and Files
- Use `kebab-case` for file and folder names: `faculty-controller.ts`

### 2.2 Variables, Functions, Parameters
- Use `camelCase`: `studentList`, `getStudentInfo()`

### 2.3 Class, Interface, Component
- Use `PascalCase`: `StudentService`, `FacultyRepository`

### 2.4 Constants
- Use `UPPER_SNAKE_CASE`: `MAX_RETRY_COUNT`, `MODEL_NAMES`

### 2.5 Generic Types
- Use `T` or `TEntity`, `TData` for generic data types.

### 2.6 Private Fields
- Prefix `_` for private fields: `_id`, `_privateMethod()`

## 3. Coding Rules

### 3.1 TypeScript & JavaScript

- Always specify data types for variables, functions, and parameters.
- Use `const` for immutable variables, `let` for mutable variables.
- Do not use `var`.
- Use `async/await` instead of `.then()`.
- Use template strings instead of string concatenation:
  ```ts
  const greeting = `Hello, ${name}!`;
  ```
- Use destructuring:
  ```ts
  const { name, age } = student;
  ```
- Use optional chaining and nullish coalescing:
  ```ts
  const result = user?.profile?.email ?? "N/A";
  ```

### 3.2 Mongoose Schema

Example:
```ts
import mongoose, { Schema, Document, Types } from "mongoose";
import { MODEL_NAMES } from "../constants/collectionNames";

export interface IFaculty {
  facultyName: string;
}

export interface IFacultyDocument extends Document<unknown, {}, IFaculty>, IFaculty {
  _id: Types.ObjectId;
}

const FacultySchema: Schema = new Schema<IFaculty>(
  {
    facultyName: {
      type: String,
      required: true,
      unique: [true, 'Faculty name must be unique'],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFaculty>(MODEL_NAMES.FACULTY, FacultySchema);
```

### 3.3 Error Handling

- Backend:
  ```ts
  try {
    const data = await getData();
    res.json(data);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
  ```

- Frontend:
  ```js
  try {
    const res = await fetchData();
  } catch (err) {
    showToast(err.message);
  }
  ```

## 4. Code Formatting

- Use 2 spaces for indentation.
- No extra spaces in `()` or before `{}`.
- Add spaces before and after operators:
  ```ts
  const total = a + b;
  ```

- One statement per line.
- Sort `import` statements in order: Node, external libraries, internal.

## 5. Testing

- Write unit tests for service and repository using **Jest**.
- Example:
  ```ts
  describe("StudentRepository", () => {
    it("getAllStudents() returns an array", async () => {
      const students = await getAllStudents();
      expect(Array.isArray(students)).toBe(true);
    });
  });
  ```

## 6. API Standards

### 6.1 RESTful Endpoints

| Resource             | GET              | POST        | PUT                | DELETE             |
|----------------------|------------------|-------------|--------------------|--------------------|
| /students            | Get list         | Create new  | -                  | -                  |
| /students/{id}       | Get details      | -           | Update             | Delete             |
| /faculties           | Get list         | Create new  | -                  | -                  |

### 6.2 Response Format
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "Nguyen Van A"
  },
  "message": "Success"
}
```

## 7. Git Workflow

### 7.1 Branch Naming

- `feature/add-student-api`
- `bugfix/fix-edit-form`
- `hotfix/fix-crash-app`

### 7.2 Commit Syntax

```
<type>: <description>
```

Example:

- `feat: add API to create new student`
- `fix: fix error loading list`
- `docs: update README`

## 8. Documentation & Comments

- Write descriptions for complex functions using JSDoc:
  ```ts
  /**
   * Calculate average score
   * @param {number[]} scores
   * @returns {number}
   */
  function avg(scores) { ... }
  ```

