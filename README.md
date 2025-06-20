# Student Management

Group25-Ex-TKPM

## Group members

| Student Id | Name           |
| ---------- | -------------- |
| 2212 0358  | Phạm Chí Thuần |
| 2212 0360  | Lê Phúc Thuận  |
| 2212 0363  | Phan Hồng Thức |

## How to Run the Project

- See [docs/installation-guide.md](docs/installation-guide.md) for detailed instructions on how to set up and run the project.

## Developer Guide

- See [docs/index.md](docs/index.md) for an overview of the project and links to detailed guides.

## Folder Structure

```
.
├── README.md
├── backend
│   ├── Dockerfile
│   ├── migrate-mongo-config.js
│   ├── src
│   │   ├── constants
│   │   │   └── httpStatusCodes.ts
│   │   ├── controllers
│   │   │   ├── configController.ts
│   │   │   ├── facultyController.ts
│   │   │   ├── ...
│   │   ├── logger
│   │   │   └── index.ts
│   │   ├── migration
│   │   │   ├── 20250320-add-student-collection.js
│   │   │   ├── ...
│   │   ├── models
│   │   │   ├── faculty.ts
│   │   │   ├── program.ts
│   │   │   ├── student.ts
│   │   │   └── studentStatus.ts
│   │   ├── repositories
│   │   │   ├── facultyRepository.ts
│   │   │   ├── ...
│   │   ├── routes
│   │   │   ├── configRoute.ts
│   │   │   ├── facultyRoute.ts
│   │   │   ├── ....
│   │   └── services
│   │       └── database.service.ts
│   └── tsconfig.json
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── index.html
│   ├── src
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   ├── bg-boost-desktop.svg
│   │   │   ├── bg-boost-mobile.svg
│   │   │   ├── ...
│   │   ├── components
│   │   │   ├── Add.jsx
│   │   │   ├── Edit.jsx
│   │   │   ├── ...
│   │   ├── config.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Faculties.jsx
│   │   │   ├── ...
│   │   └── utils
│   │       ├── dateFormatter.js
│   │       ├── ...
│   ├── tailwind.config.cjs
│   └── vite.config.js
└── public
    └── favicon-32x32.png

```
