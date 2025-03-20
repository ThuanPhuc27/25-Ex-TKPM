# Student Management

Group25-Ex-TKPM

## Group members

| Student Id | Name           |
| ---------- | -------------- |
| 2212 0358  | Phạm Chí Thuần |
| 2212 0360  | Lê Phúc Thuận  |
| 2212 0363  | Phan Hồng Thức |


# Student Management

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
Sau khi chạy migration xong, bạn có thể cấu hình các dịch vụ (frontend và backend) trong docker-compose.yml như sau:
    ```
    services:
        frontend:
            image: thuanlp/studentmanagerment_fe:latest
            container_name: frontend
            ports:
              - "5731:5731"
            networks:
              - app-network
            depends_on:
              - backend
            environment:
              - REACT_APP_BACKEND_URL=http://backend:3001

        backend:
            image: thuanlp/studentmanagerment_be:latest
            container_name: backend
            ports:
              - "3001:3001"
            networks:
              - app-network
            environment:
              - DB_HOST=mongodb
              - DB_PORT=27017
              - DB_USER=user
              - DB_PASSWORD=pass
              - DB_NAME=studentmanagerment

        volumes:
          mongodb_data:

        networks:
          app-network:
            driver: bridge

    ```
Ứng dụng sẽ chạy tại `http://localhost:5173` 
