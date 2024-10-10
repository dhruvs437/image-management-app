# Image Management App

This is an image management application that allows users to upload and manage images with user authentication and integration with Amazon S3 for storage.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** and **npm** installed
- **Python 3.x** installed
- A virtual environment tool (like `venv`)
- An **AWS account** with S3 access

## Getting Started

Follow the steps below to run both the frontend and backend of the application.

### 1. Run the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend/image-management-app
   npm install
   npm run dev
the frontend will typically run on http://localhost:3000.

### 2. Run the Backend

1. Navigate to the backend directory:
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    python3 app.py

The backend will typically run on http://localhost:8000.



