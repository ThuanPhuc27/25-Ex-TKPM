# Data Validation Guide

([_Return to index_](index.md))

## Overview

This guide covers validation strategies implemented in the Student Management System, organized by validation type with real examples from the codebase.

## Validation Classifications

### 1. Schema-Level Built-in Validators

**Required Fields & Constraints:**

```typescript
// From student.ts
studentId: {
  type: String,
  required: true,
  unique: [true, 'Student ID must be unique (student id "{VALUE}" already exists)'],
},
sex: {
  type: String,
  enum: ["male", "female", "other"],
  default: "other",
},
identityDocuments: {
  type: [identityDocumentSchema],
  required: true,
  minlength: 1,
},
```

**Range Validation:**

```typescript
// From course.ts
courseCredits: {
  type: Number,
  required: true,
  min: [2, "Course credits cannot be less than 2"],
},

// From enrollment.ts
score: {
  type: Number,
  min: [0, "Score cannot be less than 0"],
  max: [10, "Score cannot be greater than 10"],
},
```

### 2. Custom Async Validators

**Reference Existence Validation:**

```typescript
// From student.ts - Faculty reference validation
faculty: {
  type: mongoose.Schema.ObjectId,
  required: true,
  ref: MODEL_NAMES.FACULTY,
  validate: {
    validator: async function (value: Types.ObjectId) {
      const faculty = await mongoose.models[MODEL_NAMES.FACULTY].findById(value);
      return !!faculty;
    },
    message: 'Faculty with id "{VALUE}" does not exist',
  },
},
```

**Business Logic Validation:**

```typescript
// From class.ts - Course deactivation check
courseCode: {
  type: String,
  required: true,
  validate: [
    {
      validator: async function (v: string) {
        const course = await mongoose.models[MODEL_NAMES.COURSE]
          .findOne({ courseCode: v }).exec();
        return !!course;
      },
      message: 'Course with code "{VALUE}" does not exist',
    },
    {
      validator: async function (v: string) {
        const course = await mongoose.models[MODEL_NAMES.COURSE]
          .findOne({ courseCode: v }).exec();
        return !course?.deactivated;
      },
      message: 'Course with code "{VALUE}" is deactivated and cannot be used',
    },
  ],
},
```

### 3. Conditional Validation

**Type-Based Required Fields:**

```typescript
// From student.ts - Identity document validation
hasChip: {
  type: Boolean,
  required: [
    function () {
      return (this as IIdentityDocument).type === "cccd" ? true : false;
    },
    "Chip is required for CCCD type",
  ],
},
issueCountry: {
  type: String,
  required: [
    function () {
      return (this as IIdentityDocument).type === "passport" ? true : false;
    },
    "Issue country is required for passport type",
  ],
},
```

### 4. Pre-save Hooks

**Update Prevention:**

```typescript
// From course.ts - Prevent course code updates
CourseSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update?.courseCode) {
    throw new Error("Updating course code is not allowed.");
  }
});
```

### 5. Error Handling Patterns

**MongoDB Duplicate Key Errors:**

```typescript
// From courseController.ts
if (error.name === "MongoServerError" && error.code === 11000) {
  res.status(400).json({
    message: `Record already exists`,
  });
  return;
}
```

## Testing Validation

**Unit Test Example:**

```typescript
// From course.test.ts
it("should validate unique courseCode", async () => {
  await Course.create({
    courseCode: "CS101",
    courseName: "Intro to CS",
    courseCredits: 3,
    managingFaculty: mockFacultyId,
    courseDescription: "Description",
  });

  try {
    await Course.create({
      courseCode: "CS101", // Duplicate
      courseName: "Another Course",
      courseCredits: 4,
      managingFaculty: mockFacultyId,
      courseDescription: "Description",
    });
  } catch (err: any) {
    expect(err.code).toBe(11000); // MongoDB duplicate key error
  }
});
```

---

**Version**: 1.0

([_Return to index_](index.md))
