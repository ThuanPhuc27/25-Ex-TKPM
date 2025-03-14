# Student Management

Ứng dụng quản lý sinh viên cho phép người dùng thêm, sửa, xóa và xem danh sách sinh viên. Dự án được xây dựng bằng React, Vite và Tailwind CSS.

Các tính năng chính bao gồm:

* Thêm sinh viên mới.
* Xem danh sách sinh viên.
* Sửa thông tin sinh viên.
* Xóa sinh viên.
* Tìm kiếm sinh viên.

## Cấu Trúc Thư Mục
```
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
├── tailwind.config.cjs # Cấu hình Tailwind CSS
└── vite.config.js      # Cấu hình Vite
```
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
