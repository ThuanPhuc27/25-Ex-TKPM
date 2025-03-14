# Student Management
## Cau truc thu muc
Chắc chắn rồi, đây là một ví dụ đầy đủ về file README.md cho dự án "Student Management" của bạn, bao gồm tất cả các phần đã thảo luận và một số bổ sung:

Markdown

# Student Management

Ứng dụng quản lý sinh viên cho phép người dùng thêm, sửa, xóa và xem danh sách sinh viên. Dự án được xây dựng bằng React, Vite và Tailwind CSS.

## Mục Lục

* [Mô Tả](#mô-tả)
* [Cài Đặt](#cài-đặt)
* [Cách Sử Dụng](#cách-sử-dụng)
* [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
* [Biến Môi Trường](#biến-môi-trường)
* [Docker](#docker)
* [Dependencies](#dependencies)
* [Đóng Góp](#đóng-góp)
* [Giấy Phép](#giấy-phép)
* [Liên Hệ](#liên-hệ)

## Mô Tả

Ứng dụng "Student Management" là một ứng dụng web đơn giản cho phép người dùng quản lý danh sách sinh viên. Các tính năng chính bao gồm:

* Thêm sinh viên mới.
* Xem danh sách sinh viên.
* Sửa thông tin sinh viên.
* Xóa sinh viên.
* Tìm kiếm sinh viên.

## Cài Đặt

### Chạy Thủ Công

1.  **Clone Repository:**

    ```bash
    git clone [https://github.com/ThuanPhuc27/25-Ex-TKPM.git](https://github.com/ThuanPhuc27/25-Ex-TKPM.git)
    cd 25-Ex-TKPM
    ```

2.  **Cài Đặt Dependencies:**

    ```bash
    npm install
    ```

3.  **Chạy Ứng Dụng:**

    ```bash
    npm run dev
    ```

    Ứng dụng sẽ chạy tại `http://localhost:5173`.

## Cách Sử Dụng

1.  Truy cập ứng dụng tại `http://localhost:5173` trong trình duyệt.
2.  Sử dụng giao diện để thêm, sửa, xóa và xem danh sách sinh viên.
3.  Sử dụng chức năng tìm kiếm để tìm kiếm sinh viên theo tên hoặc mã sinh viên.

## Cấu Trúc Thư Mục

.
├── src/
│   ├── components/      # Các component UI 
│   │   ├── index.jsx
│   │   ├── Header.jsx
│   │   └── ...
│   ├── pages/           # Các trang của ứng dụng
│   │   ├── AddStudent.jsx
│   │   └── ...
│   ├── model/          
│   │   ├── student/
│   │   └── ...
│   ├── App.js           # Component gốc của ứng dụng
│   └── main.jsx         # Điểm vào của ứng dụng
├── public/              # Các file tĩnh (index.html)
├── .env                 # Biến môi trường
├── .gitignore           # File bỏ qua cho Git
├── Dockerfile           # Cấu hình Docker
├── package.json         # Thông tin dự án và dependencies
├── package-lock.json    # Thông tin chi tiết về dependencies
├── postcss.config.cjs   # Cấu hình PostCSS
├── prettier.config.cjs # Cấu hình Prettier
├── tailwind.config.cjs # Cấu hình Tailwind CSS
└── vite.config.js      # Cấu hình Vite

## Hướng Dẫn Cài Đặt và Chạy

### Chạy Thủ Công

1.  **Clone Repository:**

    ```bash
    git clone [https://github.com/ThuanPhuc27/25-Ex-TKPM.git
    cd 25-Ex-TKPM
    ```

2.  **Cài Đặt Dependencies:**

    ```bash
    npm install
    ```

3.  **Chạy Ứng Dụng:**

    ```bash
    npm run dev
    ```

    Ứng dụng sẽ chạy tại `http://localhost:5173` 

### Chạy với Docker

1.  **Tạo File `docker-compose.yml`:**

    Tạo một file `docker-compose.yml` trong thư mục gốc của dự án với nội dung sau:

    ```yaml
    version: '3.8'

    services:
      app:
        image: thuanlp/studentservice:latest
        container_name: studentservice
        ports:
          - "5173:5173"
        networks:
          - studentservice

    networks:
      studentservice:
        driver: bridge
    ```

2.  **Chạy Docker Compose:**

    ```bash
    docker-compose up -d
    ```

3.  **Truy Cập Ứng Dụng:**

    Truy cập ứng dụng tại `http://localhost:5173` trong trình duyệt.

