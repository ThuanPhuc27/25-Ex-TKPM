# System Architecture Overview

([_Return to index_](index.md))

The Student Management System is designed with a modern client-server architecture, clearly separating the user interface, business logic server, and database. The goal of this architecture is to ensure scalability, maintainability, and long-term development.

## 1. User Interface (Frontend)

**Technologies used:**

- ReactJS – builds a dynamic SPA (Single Page Application) interface
- Vite – a bundler tool that accelerates development
- Tailwind CSS – a modern CSS framework for rapid UI building

**Main features:**

- Display lists of students, programs, faculties, and study statuses
- Support for search, pagination, add/edit/delete students and related entities
- Communicates with backend via API (Axios)
- Supports data import/export

**Key structure:**

- `components/`: UI elements like Table, Pagination, Add, Edit
- `pages/`: main screens like Faculties, Programs, StudentStatuses
- `utils/`: utility functions such as date handling, API data access

## 2. Business Logic Server (Backend)

**Technologies used:**

- Node.js – server-side JavaScript runtime
- Express.js – framework for building RESTful APIs
- TypeScript – extends JavaScript with type checking
- Mongoose – library for connecting to MongoDB and modeling data

**Main features:**

- Provides REST APIs for the frontend
- Handles business logic: manages students, faculties, programs, study statuses
- Error handling and HTTP status code management
- Supports logging and configuration management
- Integrates migration system for sample data creation

**Main structure:**

- `controllers/`: handles HTTP requests and calls to repository
- `routes/`: defines API paths (e.g., /api/students)
- `models/`: defines MongoDB data schemas
- `repositories/`: data manipulation logic
- `migration/`: creates tables and sample data
- `services/`: MongoDB connection configuration

## 3. Database

**Database system:** MongoDB

**Data type:** NoSQL – stores data as BSON documents

**Key features:**

- Stores data about students, faculties, programs, and study statuses
- Easily scalable, suitable for systems with frequent changes
- Flexible queries via Mongoose library

**Data initialization:**

- Uses migrate-mongo to create collections and sample data
- Can update/rollback migrations if needed

## 4. General Data Flow

```
User (browser)
      ↓
Frontend ReactJS (SPA)
      ↓  API Call (Axios)
Backend ExpressJS (Node + TypeScript)
      ↓
MongoDB Database
```

([_Return to index_](index.md))
