# Student Management


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
        image: thuanlp/studentservice
        container_name: studentservice
        volumes:
          - .:/app
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

