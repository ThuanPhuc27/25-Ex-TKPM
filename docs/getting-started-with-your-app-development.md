# Getting Started with Your App Development

This guide will help you set up and run the Student Management System application on your local development environment.

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- Git

## Setup Instructions

### 1. Set Up Database

In the `docker-compose.yml` file, configure the MongoDB service as follows:

```yaml
services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: user # Replace with your desired username
      MONGO_INITDB_ROOT_PASSWORD: pass # Replace with your desired password
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

Start the MongoDB container:

```powershell
docker-compose up -d mongodb
```

### 2. Clone and Setup Project

Clone the repository and install backend dependencies:

```powershell
git clone https://github.com/ThuanPhuc27/25-Ex-TKPM.git
cd 25-Ex-TKPM\backend
npm install
```

Create a `.env` file in the backend directory with the following configuration:

```env
PORT=3001
DB_CONNECTION_STRING="mongodb://user:pass@localhost:27017/studentmanagerment?authSource=admin"
DB_NAME="studentmanagement"
```

> **Note**: You can replace `localhost` with the IP address of the MongoDB container if needed, or keep `localhost` if running everything locally.

### 3. Run Database Migrations

Run the following command to execute migrations and create initial data:

```powershell
npx migrate-mongo up
```

### 4. Run the Application

After running the migration, you can start both the frontend and backend services:

#### Backend

```powershell
cd backend
npm install
npm run dev
```

The backend API will be available at `http://localhost:3001`

#### Frontend

Open a new terminal window and run:

```powershell
cd frontend
npm install
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## Verification

Once both services are running, you can verify the setup by:

1. Opening your browser and navigating to `http://localhost:5173`
2. Checking that the application loads without errors
3. Testing basic functionality like viewing student lists or adding new records

## Troubleshooting

### Common Issues

- **Database Connection Error**: Ensure MongoDB container is running and the connection string in `.env` is correct
- **Port Conflicts**: Make sure ports 3001 (backend) and 5173 (frontend) are not in use by other applications
- **Migration Failures**: Check that the database is accessible and has proper permissions

### Logs

Check application logs for detailed error information:

- Backend logs will appear in the terminal where you ran `npm run dev`
- Frontend logs will appear in both the terminal and browser console
