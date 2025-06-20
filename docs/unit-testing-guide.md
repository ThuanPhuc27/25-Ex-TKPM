# Unit Testing Guide

## Overview

This guide covers unit testing for the Student Management System using **Vitest** and **MongoDB Memory Server** for isolated database testing.

## Testing Stack

- **Vitest**: Testing framework with TypeScript support
- **MongoDB Memory Server**: In-memory database for isolation
- **Mongoose**: ODM with validation testing
- **Vi**: Mocking and spying utilities

## Test Structure

### Base Test Setup

Every test file follows a consistent pattern with setup and teardown methods:

```typescript
import {
  describe,
  it,
  expect,
  beforeEach,
  afterAll,
  beforeAll,
  vi,
} from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect Mongoose to the in-memory database
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Disconnect and stop the in-memory MongoDB instance
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = await mongoose.connection.db?.collections();
  for (const collection of collections || []) {
    await collection.deleteMany({});
  }
});
```

This setup ensures:

- **Isolation**: Each test runs with a clean database
- **Speed**: In-memory database for fast execution
- **Reliability**: No dependency on external database state

## Course Model Testing Example

The Course model testing demonstrates three key testing scenarios: successful creation, validation errors, and uniqueness constraints. Let's break down each test to understand the testing patterns used.

### Test Suite Structure

First, we establish the test suite structure using Vitest's `describe` function:

```typescript
describe("Course Schema", () => {
  // Individual test cases go here
});
```

This groups all Course-related tests together and provides a clear scope for our testing suite.

### Test 1: Successful Course Creation

This test verifies that a course can be created successfully with valid data and proper mocking of dependencies.

#### Setting Up Mock Data

```typescript
it("should successfully create a course with valid information", async () => {
  const mockManagingFaculty = new mongoose.Types.ObjectId();
  const mockPrerequisiteCourse1 = new mongoose.Types.ObjectId();
  const mockPrerequisiteCourse2 = new mongoose.Types.ObjectId();
```

We create mock ObjectIds to represent related entities. These simulate the IDs that would exist in a real database without requiring actual data to be present.

#### Mocking Faculty Validation

```typescript
vi.spyOn(Faculty, "findById").mockReturnValue({
  exec: vi.fn().mockResolvedValue({ _id: mockManagingFaculty }),
} as unknown as mongoose.Query<any, any>);
```

This mocks the Faculty model's `findById` method to simulate that the managing faculty exists. The Course model validates that the referenced faculty exists before saving, so we need to mock this dependency.

#### Mocking Prerequisite Course Validation

```typescript
vi.spyOn(Course, "findById")
  .mockReturnValueOnce({
    exec: vi.fn().mockResolvedValue({ _id: mockPrerequisiteCourse1 }),
  } as unknown as mongoose.Query<any, any>)
  .mockReturnValueOnce({
    exec: vi.fn().mockResolvedValue({ _id: mockPrerequisiteCourse2 }),
  } as unknown as mongoose.Query<any, any>);
```

Since courses can have prerequisites, we mock multiple calls to `Course.findById` using `mockReturnValueOnce` to return different mock courses for each prerequisite validation.

#### Creating the Course

```typescript
const course = await Course.create({
  courseCode: "CS102",
  courseName: "Data Structures",
  courseCredits: 4,
  managingFaculty: mockManagingFaculty,
  courseDescription: "An in-depth course on data structures.",
  prequisiteCourses: [mockPrerequisiteCourse1, mockPrerequisiteCourse2],
});
```

We create a course with valid data that should pass all validation rules. This tests the happy path where everything works correctly.

#### Verifying the Results

```typescript
  expect(course).toBeDefined();
  expect(course.courseCode).toBe("CS102");
  expect(course.courseName).toBe("Data Structures");
  expect(course.courseCredits).toBe(4);
  expect(course.managingFaculty.toString()).toBe(mockManagingFaculty.toString());
  expect(course.courseDescription).toBe("An in-depth course on data structures.");
  expect(course.prequisiteCourses).toHaveLength(2);
});
```

We verify that the course was created successfully and all properties were saved correctly. This ensures our model behaves as expected.

### Test 2: Required Field Validation

This test ensures that all required fields are properly validated by the schema.

```typescript
it("should validate required fields", async () => {
  try {
    await Course.create({
      courseCode: "",
      courseName: "",
      courseCredits: null,
      managingFaculty: null,
      courseDescription: "",
    });
  } catch (err: any) {
    expect(err.name).toBe("ValidationError");
    expect(err.errors.courseCode).toBeDefined();
    expect(err.errors.courseName).toBeDefined();
    expect(err.errors.courseCredits).toBeDefined();
    expect(err.errors.managingFaculty).toBeDefined();
    expect(err.errors.courseDescription).toBeDefined();
  }
});
```

**Purpose**: This test intentionally provides invalid data (empty strings and null values) to verify that Mongoose validation rules are working correctly. We expect a `ValidationError` to be thrown with specific error messages for each invalid field.

### Test 3: Unique Constraint Validation

This test verifies that the database enforces uniqueness on the `courseCode` field.

#### Setting Up the First Course

```typescript
it("should validate unique courseCode", async () => {
  const mockManagingFaculty = new mongoose.Types.ObjectId();

  vi.spyOn(Faculty, "findById").mockReturnValue({
    exec: vi.fn().mockResolvedValue({ _id: mockManagingFaculty }),
  } as unknown as mongoose.Query<any, any>);

  await Course.create({
    courseCode: "CS101",
    courseName: "Intro to CS",
    courseCredits: 3,
    managingFaculty: mockManagingFaculty,
    courseDescription: "Description",
  });
```

First, we create a course successfully with a specific `courseCode` ("CS101").

#### Testing Duplicate Prevention

```typescript
  try {
    await Course.create({
      courseCode: "CS101", // Same courseCode as above
      courseName: "Another Course",
      courseCredits: 4,
      managingFaculty: mockManagingFaculty,
      courseDescription: "Description",
    });
  } catch (err: any) {
    expect(err.code).toBe(11000); // MongoDB duplicate key error
  }
});
```

**Purpose**: We attempt to create another course with the same `courseCode` and expect MongoDB to throw a duplicate key error (code 11000). This ensures our unique index on `courseCode` is working correctly.

## Testing Best Practices

### 1. Test Organization

Organize tests by functionality:

```typescript
describe("Course Schema", () => {
  describe("Validation", () => {
    // Validation tests
  });

  describe("Business Logic", () => {
    // Business logic tests
  });

  describe("Relationships", () => {
    // Reference and relationship tests
  });
});
```

### 2. Mocking External Dependencies

Always mock external database queries:

```typescript
// Mock faculty existence check
vi.spyOn(Faculty, "findById").mockReturnValue({
  exec: vi.fn().mockResolvedValue({ _id: mockFacultyId }),
} as unknown as mongoose.Query<any, any>);
```

### 3. Test Data Cleanup

Ensure clean state between tests:

```typescript
beforeEach(async () => {
  // Clear all collections before each test
  const collections = await mongoose.connection.db?.collections();
  for (const collection of collections || []) {
    await collection.deleteMany({});
  }
});
```

### 4. Comprehensive Error Testing

Test both success and failure scenarios:

```typescript
// Test successful creation
it("should create valid document", async () => {
  // Test creation logic
});

// Test validation failure
it("should reject invalid data", async () => {
  try {
    await Model.create(invalidData);
  } catch (err) {
    expect(err.name).toBe("ValidationError");
  }
});
```

## Running Tests

### Using Package.json Scripts

The system provides convenient npm scripts for running tests:

```powershell
# Run all tests
npm test

# Run tests in watch mode (automatically re-run on file changes)
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- course.test.ts

# Run tests matching a pattern
npm test -- --grep "validation"
```

### Using Vitest CLI Directly

```powershell
# Navigate to backend directory
Set-Location backend

# Run all tests
npx vitest

# Run specific test file
npx vitest src/models/course.test.ts

# Run tests in UI mode
npx vitest --ui

# Run tests with detailed output
npx vitest --verbose
```

### Continuous Integration

For CI/CD pipelines:

```powershell
# Run tests once and exit (no watch mode)
npm test -- --run

# Generate test report in JUnit format
npm test -- --reporter=junit --outputFile=test-results.xml
```

## Test Configuration

The testing setup is configured in `vitest.config.ts`:

```typescript
import path from "path";

const config = {
  resolve: {
    alias: [
      {
        find: "@models",
        replacement: path.resolve(__dirname, "./src/models"),
      },
      {
        find: "@utils",
        replacement: path.resolve(__dirname, "./src/utils"),
      },
      // ... other aliases
    ],
  },
};

export default config;
```

This configuration:

- **Path Aliases**: Enables clean imports like `@models/course`
- **TypeScript Support**: Native TypeScript compilation
- **Module Resolution**: Proper handling of absolute imports

## Debugging Tests

### Using Console Logs

```typescript
it("should debug test data", async () => {
  const course = await Course.create(validCourseData);
  console.log("Created course:", course.toJSON());
  expect(course).toBeDefined();
});
```

### Using Vitest Debugging

```powershell
# Run tests with Node.js inspector
npx vitest --inspect-brk

# Run specific test with debugging
npx vitest course.test.ts --inspect-brk
```

### VS Code Integration

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "program": "${workspaceFolder}/backend/node_modules/vitest/vitest.mjs",
  "args": ["--inspect-brk", "--no-file-parallelism"],
  "cwd": "${workspaceFolder}/backend",
  "env": {
    "NODE_ENV": "test"
  }
}
```

---

**Version**: 1.0

**Framework**: Vitest + MongoDB Memory Server

**Last Updated**: June 20, 2025
