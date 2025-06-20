1.  **Set Up Database:**
In the docker-compose.yml file, configure the MongoDB service as follows:
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

1.  **Run MigrationData:**

    ```bash
    git clone [https://github.com/ThuanPhuc27/25-Ex-TKPM.git
    cd 25-Ex-TKPM/backend
    npm install
    ```

    Create a .env file in the backend directory. You can replace localhost with the IP address of the MongoDB container if needed (or keep localhost if running everything locally):

    ```
    PORT=3001
    DB_CONNECTION_STRING="mongodb://user:pass@localhost:27017/studentmanagerment?authSource=admin"
    DB_NAME="studentmanagerment"
    ```
    Run the following command to run migrations and create initial data:

    ```
    npx migrate-mongo up
    ```


2.  **Run the Application:**

#####  After running the migration, you can configure the services (frontend and backend):
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
The application will run at `http://localhost:5173`
