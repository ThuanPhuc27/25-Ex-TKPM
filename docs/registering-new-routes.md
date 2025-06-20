# Registering New Routes

([_Return to index_](index.md))

## 1. Overview

This project uses Express with TypeScript and organizes routes by feature in the `routes/` directory. Each route file represents a module such as: students, classes, courses, faculties, etc.

Registering a route means attaching it to the app using `app.use()`.

---

## 2. Folder Structure

```
src/
├── controllers/
├── routes/
│   ├── classRoute.ts
│   ├── configRoute.ts
│   ├── courseRoute.ts
│   ├── domainRoute.ts
│   ├── enrollmentRoute.ts
│   ├── facultyRoute.ts
│   ├── programRoute.ts
│   ├── ruleRoutes.ts
│   ├── studentRoute.ts
│   └── studentStatusRoute.ts
├── app.ts
```

---

## 3. Route Example: `classRoute.ts`

```ts
import { Router } from "express";
import {
  addClassController,
  getAllClassesController,
  updateClassController,
  deleteClassController,
} from "../controllers/classController";

const router = Router();

router.get("/", getAllClassesController); // GET /classes
router.post("/add", addClassController); // POST /classes/add
router.patch(":classId/edit", updateClassController); // PATCH /classes/:id/edit
router.delete(":classId/delete", deleteClassController); // DELETE /classes/:id/delete

export default router;
```

---

## 4. Registering Routes in `app.ts`

```ts
import express from "express";
import classRoutes from "./routes/classRoute";
import studentRoutes from "./routes/studentRoute";
// ... other routes

const app = express();

app.use("/classes", classRoutes);
app.use("/students", studentRoutes);
app.use("/config", configRoutes);
app.use("/studentStatus", studentStatusRoutes);
app.use("/faculty", facultyRoutes);
app.use("/program", programRoutes);
app.use("/domains", domainRoutes);
app.use("/rules", ruleRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);
```

---

## 5. Benefits

- 🪜 Clear separation by feature
- 🚀 Easy to extend and test
- 🚪 Easy to apply middleware (like auth, logging...)
- 🏋️ Optimized for teamwork and module division

---

## 6. Adding a New Route

1. Create a new file in the `routes/` directory, e.g. `teacherRoute.ts`
2. Declare the route in the file:

   ```ts
   const router = Router();
   router.get("/", getAllTeachers);
   export default router;
   ```

3. Import and register it in `app.ts`:

   ```ts
   import teacherRoutes from "./routes/teacherRoute";
   app.use("/teachers", teacherRoutes);
   ```

---

## 📢 Conclusion

Registering new routes makes the project easier to manage, extend, and apply RESTful API standards in the backend.

([_Return to index_](index.md))
