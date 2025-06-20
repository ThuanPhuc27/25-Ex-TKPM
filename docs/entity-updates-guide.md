# Entity Updates Guide: Adding New Properties to Existing Models

## Overview

This guide provides step-by-step instructions for safely adding new properties to existing entities in the Student Management System. It ensures data integrity, backward compatibility, and system functionality.

**Prerequisites**: Development environment access, TypeScript/Mongoose knowledge, migration system familiarity

## 11-Step Process

### Step 1: Plan the Change

Consider these questions:

- Is this field required or optional?
- What default value for existing records?
- Will this affect existing API endpoints?
- Any validation requirements?

Checklist:

- [ ] Define property purpose and requirements
- [ ] Determine required vs optional
- [ ] Plan default values
- [ ] Identify affected endpoints
- [ ] Plan validation rules

### Step 2: Update TypeScript Interface

**File**: `backend/src/models/[modelName].ts`

```typescript
export interface IEntity {
  // ...existing properties...
  newField?: boolean; // NEW - make optional initially
  relatedField?: string; // NEW
  // ...remaining properties...
}
```

### Step 3: Update Mongoose Schema

```typescript
const entitySchema = new Schema<IEntity>(
  {
    // ...existing fields...
    newField: {
      type: Boolean,
      default: false,
      required: false,
    },
    relatedField: {
      type: String,
      required: false,
    },
    // ...remaining fields...
  },
  { timestamps: true }
);
```

### Step 4: Create Database Migration

**File**: `backend/src/migration/YYYYMMDD-description.js`

```javascript
const { COLLECTION_NAMES } = require("../constants/collectionNames");

module.exports = {
  async up(db, client) {
    const result = await db
      .collection(COLLECTION_NAMES.TARGET_COLLECTION)
      .updateMany(
        {},
        {
          $set: {
            newField: false,
            relatedField: null,
          },
        }
      );
    console.log(`Updated ${result.modifiedCount} documents`);
  },

  async down(db, client) {
    await db.collection(COLLECTION_NAMES.TARGET_COLLECTION).updateMany(
      {},
      {
        $unset: {
          newField: "",
          relatedField: "",
        },
      }
    );
  },
};
```

### Step 5: Run Migration

```powershell
Set-Location backend
npx migrate-mongo up
```

### Step 6: Update Controllers

**File**: `backend/src/controllers/[entityName]Controller.ts`

```typescript
export const createEntity = async (req: Request, res: Response) => {
  try {
    const entityData = req.body;

    // Set defaults for new fields if needed
    if (entityData.newField === undefined) {
      entityData.newField = false;
    }

    const entity = new EntityModel(entityData);
    await entity.save();

    res.status(201).json({
      success: true,
      data: entity,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
```

### Step 7: Update Routes

**File**: `backend/src/routes/[entityName]Route.ts`

```typescript
import { Router } from "express";
import {
  createEntity,
  getAllEntities,
  getEntityById,
  updateEntity,
  deleteEntity,
  newFeatureEndpoint, // NEW IMPORT if needed
} from "../controllers/entityController";

const router = Router();

router.post("/", createEntity);
router.get("/", getAllEntities);
router.get("/:id", getEntityById);
router.put("/:id", updateEntity);
router.delete("/:id", deleteEntity);
router.post("/new-feature", newFeatureEndpoint); // NEW ROUTE if needed

export default router;
```

### Step 8: Update Repository Layer

**File**: `backend/src/repositories/[entityName]Repository.ts`

```typescript
export const findByNewField = async (value: boolean): Promise<IEntity[]> => {
  return await EntityModel.find({ newField: value });
};

export const updateNewField = async (
  id: string,
  value: boolean
): Promise<IEntity | null> => {
  return await EntityModel.findByIdAndUpdate(
    id,
    { newField: value },
    { new: true }
  );
};
```

### Step 9: Update Tests

**File**: `backend/src/models/[entityName].test.ts`

```typescript
describe("Entity New Fields", () => {
  it("should set newField to default value", async () => {
    const entity = new EntityModel(baseData);
    await entity.save();
    expect(entity.newField).toBe(false);
  });

  it("should validate relatedField", async () => {
    const entity = new EntityModel({
      ...baseData,
      relatedField: "test-value",
    });
    await expect(entity.save()).resolves.not.toThrow();
  });
});
```

### Step 10: Update Documentation

Update relevant documentation files:

- API documentation
- Database schema documentation
- Entity relationship diagrams

### Step 11: Test and Deploy

1. **Run Tests**: Ensure all tests pass
2. **Test Migration**: Verify in staging environment
3. **Deploy**: Follow deployment procedures
4. **Monitor**: Check logs and performance

## Best Practices

- Make new fields optional initially
- Set sensible defaults
- Create comprehensive tests
- Always test migrations in staging first
- Plan rollback procedures

## Common Pitfalls

- Making new fields required without defaults
- Forgetting to update all CRUD operations
- Not testing migration rollback
- Missing validation updates
- Inadequate test coverage

## Testing Strategies

### Unit Testing Approach

#### Test Categories

1. **Schema Validation Tests**: Test new field validation rules
2. **Migration Tests**: Test data transformation
3. **API Tests**: Test endpoint behavior with new fields
4. **Integration Tests**: Test complete workflows

#### Example Test Structure

```typescript
describe("Student Email Verification Feature", () => {
  describe("Schema Validation", () => {
    // Test individual field validation
  });

  describe("Migration", () => {
    // Test data migration
  });

  describe("API Integration", () => {
    // Test API endpoints
  });

  describe("Business Logic", () => {
    // Test complete workflows
  });
});
```

### Integration Testing

#### Database Integration

```typescript
// Test with real database operations
it("should handle email verification workflow", async () => {
  // Create student
  const student = await Student.create(testData);

  // Verify initial state
  expect(student.emailVerified).toBe(false);

  // Simulate verification
  const verificationResult = await verifyEmail(student.emailVerificationToken);

  // Verify final state
  expect(verificationResult.emailVerified).toBe(true);
});
```
