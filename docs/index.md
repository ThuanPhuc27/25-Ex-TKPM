# Student Management System - Developer Guide

Welcome to the developer guide for the Student Management System. This comprehensive guide is designed to help developers understand, set up, and contribute to the codebase effectively.

## Getting Started

New to the project? Start here to get your development environment up and running:

- [Getting Started with Your App Development](getting-started-with-your-app-development.md) - Complete setup guide for local development

## System Architecture

Understanding the system design and structure:

- [Architecture Overview](architecture-overview.md) - System architecture, technology stack, and data flow
- [Database Schema](database-schema.md) - MongoDB collections, relationships, and data models
- [Web API Documentation](web-api-documents.md) - Complete REST API reference with endpoints and examples

## Development Workflows

Essential guides for common development tasks:

- [Code Standards](code-standards.md) - Coding conventions, naming standards, and best practices
- [Entity Updates Guide](entity-updates-guide.md) - Step-by-step process for adding properties to existing models
- [Registering New Routes](registering-new-routes.md) - How to create and register new API endpoints
- [Data Validation Guide](data-validation-guide.md) - Validation patterns and implementation strategies
- [Unit Testing Guide](unit-testing-guide.md) - Testing framework setup, patterns, and best practices

## Technology Stack

This project is built with modern web technologies:

### Frontend

- **React.js** - Component-based UI library
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript superset
- **Mongoose** - MongoDB object modeling library

### Database & Testing

- **MongoDB** - NoSQL document database
- **Vitest** - Unit testing framework
- **MongoDB Memory Server** - In-memory database for testing

## Development Best Practices

- Follow the [Code Standards](code-standards.md) for consistent code quality
- Write unit tests for new features using our [Testing Guide](unit-testing-guide.md)
- Use proper validation patterns as outlined in the [Data Validation Guide](data-validation-guide.md)
- Follow the established patterns when [adding new routes](registering-new-routes.md)
- Always test entity updates using the [Entity Updates Guide](entity-updates-guide.md)

## Quick Reference

- **API Base URL**: `http://localhost:3001`
- **Frontend URL**: `http://localhost:5173`
- **Database**: MongoDB on port 27017
- **Testing**: Run with `npm test` in the backend directory

---

_Last updated: June 20, 2025_
