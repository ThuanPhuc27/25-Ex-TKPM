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






# 🎓 University Management System

Hệ thống quản lý trường đại học toàn diện với đầy đủ các module quản lý sinh viên, lớp học, môn học và các nghiệp vụ liên quan.

## 🌟 Tính Năng Nổi Bật

### 1. 👨‍🎓 Quản Lý Sinh Viên
- **CRUD** thông tin sinh viên
- **Nhập/Xuất hàng loạt** định dạng XML
- Tìm kiếm và cập nhật theo `studentId`

### 2. 🏫 Quản Lý Lớp Học
- Tạo và quản lý lớp học với các thuộc tính:
  - Mã lớp
  - Tên lớp
  - Giảng viên phụ trách
- Chỉnh sửa/xóa theo `classId`

### 3. 📚 Quản Lý Môn Học
- Quản lý thông tin môn học:
  - Mã môn học
  - Tên môn học
  - Thông tin liên quan
- Hỗ trợ cập nhật và xóa môn học

### 4. 📝 Quản Lý Ghi Danh
- Ghi danh sinh viên vào lớp
- Cập nhật điểm theo từng ghi danh
- Truy xuất thông tin theo:
  - `studentId`
  - `classCode`
- Xuất bảng điểm cá nhân

### 5. 🧑‍🏫 Quản Lý Khoa/Viện
- Thêm/cập nhật/xóa thông tin khoa
- Quản lý cây tổ chức trường học

### 6. 🎓 Quản Lý Chương Trình Đào Tạo
- Quản lý các hệ đào tạo:
  - Đại học
  - Cao học
  - ...
- Chỉnh sửa thông tin chương trình

### 7. 📌 Quản Lý Trạng Thái Sinh Viên
- Theo dõi trạng thái học tập:
  - Đang học
  - Bảo lưu
  - Tốt nghiệp
  - ...
- CRUD các trạng thái

### 8. ⚙️ Cấu Hình Hệ Thống
- Cài đặt hệ thống:
  - Email mặc định
  - Quy tắc điểm
  - Giới hạn ghi danh
- API truy xuất cấu hình

### 9. 📧 Quản Lý Email Domain
- Danh sách domain email được phép
- Cập nhật qua API POST

### 10. 🔁 Quy Tắc Chuyển Trạng Thái
- Xây dựng luồng nghiệp vụ:
  - Đang học → Tốt nghiệp
  - Đang học → Bảo lưu

