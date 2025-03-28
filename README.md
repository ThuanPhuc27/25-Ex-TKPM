# Student Management

Group25-Ex-TKPM

## Group members

| Student Id | Name           |
| ---------- | -------------- |
| 2212 0358  | Phạm Chí Thuần |
| 2212 0360  | Lê Phúc Thuận  |
| 2212 0363  | Phan Hồng Thức |

## Cấu Trúc Thư Mục
```
.
├── README.md
├── backend
│   ├── Dockerfile
│   ├── migrate-mongo-config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── constants
│   │   │   └── httpStatusCodes.ts
│   │   ├── controllers
│   │   │   ├── configController.ts
│   │   │   ├── facultyController.ts
│   │   │   ├── programController.ts
│   │   │   ├── studentController.ts
│   │   │   ├── studentStatusController.ts
│   │   │   └── studentTransferingController.ts
│   │   ├── index.ts
│   │   ├── logger
│   │   │   └── index.ts
│   │   ├── migration
│   │   │   ├── 20250320-add-student-collection.js
│   │   │   ├── 20250320-create-faculty.js
│   │   │   ├── 20250320-create-programs.js
│   │   │   └── 20250321-create-studentstatuses.js
│   │   ├── models
│   │   │   ├── faculty.ts
│   │   │   ├── program.ts
│   │   │   ├── student.ts
│   │   │   └── studentStatus.ts
│   │   ├── repositories
│   │   │   ├── facultyRepository.ts
│   │   │   ├── programRepository.ts
│   │   │   ├── studentRepository.ts
│   │   │   └── studentStatusRepository.ts
│   │   ├── routes
│   │   │   ├── configRoute.ts
│   │   │   ├── facultyRoute.ts
│   │   │   ├── programRoute.ts
│   │   │   ├── studentRoute.ts
│   │   │   └── studentStatusRoute.ts
│   │   └── services
│   │       └── database.service.ts
│   └── tsconfig.json
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.cjs
│   ├── prettier.config.cjs
│   ├── src
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   ├── bg-boost-desktop.svg
│   │   │   ├── bg-boost-mobile.svg
│   │   │   ├── bg-shorten-desktop.svg
│   │   │   ├── bg-shorten-mobile.svg
│   │   │   ├── icon-brand-recognition.svg
│   │   │   ├── icon-detailed-records.svg
│   │   │   ├── icon-facebook.svg
│   │   │   ├── icon-fully-customizable.svg
│   │   │   ├── icon-instagram.svg
│   │   │   ├── icon-pinterest.svg
│   │   │   ├── icon-twitter.svg
│   │   │   ├── illustration-working.svg
│   │   │   ├── logo.svg
│   │   │   └── menu-outline.svg
│   │   ├── components
│   │   │   ├── Add.jsx
│   │   │   ├── Edit.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ImportExport.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Table.jsx
│   │   │   └── index.jsx
│   │   ├── config.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Faculties.jsx
│   │   │   ├── Programs.jsx
│   │   │   ├── StudentDetails.jsx
│   │   │   └── StudentStatuses.jsx
│   │   └── utils
│   │       ├── dateFormatter.js
│   │       ├── getFaculties.js
│   │       ├── getPrograms.js
│   │       └── getStudentStatuses.js
│   ├── tailwind.config.cjs
│   └── vite.config.js
└── public
    └── favicon-32x32.png

```
## Hướng Dẫn Cài Đặt và Chạy

1.  **Cài Đặt Database:**
Trong file docker-compose.yml, bạn cần cấu hình dịch vụ MongoDB như sau:
    ```
    services:
        mongodb:
            image: mongo:latest
            container_name: mongodb
            ports:
              - "27017:27017"
            environment:
              MONGO_INITDB_ROOT_USERNAME: user
              MONGO_INITDB_ROOT_PASSWORD: pass
            volumes:
              - mongodb_data:/data/db
            networks:
              - app-network
        volumes:
          mongodb_data:

        networks:
          app-network:
            driver: bridge
    ```

1.  **Chạy MigrationData:**

    ```bash
    git clone [https://github.com/ThuanPhuc27/25-Ex-TKPM.git
    cd 25-Ex-TKPM/backend
    npm install
    ```
    
    Tạo file .env trong thư mục backend. Bạn có thể thay thế localhost bằng địa chỉ IP của container MongoDB nếu cần (hoặc giữ nguyên localhost nếu chạy mọi thứ trên máy local):

    ```
    PORT=3001
    DB_CONNECTION_STRING="mongodb://user:pass@localhost:27017/studentmanagerment?authSource=admin"
    DB_NAME="studentmanagerment"
    ```
    Chạy lệnh sau để chạy các migration và tạo dữ liệu ban đầu:

    ```
    npx migrate-mongo up
    ```


2.  **Chạy Ứng Dụng:**

#####  Sau khi chạy migration xong, bạn có thể cấu hình các dịch vụ (frontend và backend):
- Backend 
```
cd backend 
npm install
npm run dev
```
- Frontend 
```
cd ../frontend
npm install
npm run dev


```
Ứng dụng sẽ chạy tại `http://localhost:5173` 
