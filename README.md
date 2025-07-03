# Sentra: AI-Powered Agricultural Intelligence Platform

Sentra is a comprehensive, multi-component platform designed to provide advanced agricultural intelligence. It leverages a microservices-based backend, a web-based administrative dashboard, a mobile application for farmers, and a sophisticated machine learning model for crop health analysis.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Components](#components)
  - [Backend Services](#backend-services)
  - [Admin Dashboard](#admin-dashboard)
  - [Mobile App](#mobile-app)
  - [Machine Learning Model](#machine-learning-model)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Running the Backend Services](#running-the-backend-services)
  - [Running the Admin Dashboard](#running-the-admin-dashboard)
  - [Running the Mobile App](#running-the-mobile-app)
  - [Running the Machine Learning Model](#running-the-machine-learning-model)
- [Environment Variables](#environment-variables)

## Project Overview

Sentra is designed to empower farmers and agricultural businesses with data-driven insights. The platform integrates IoT device data, user-provided information, and advanced machine learning to provide real-time monitoring, alerts, and analytics for crop health and farm management.

## Architecture

The Sentra platform is built on a distributed architecture, with several key components working together:

- **Backend Services**: A set of microservices responsible for handling business logic, data processing, and API endpoints.
- **Admin Dashboard**: A web application for administrators to manage users, devices, and view analytics.
- **Mobile App**: A cross-platform mobile application for farmers to interact with the system, receive alerts, and view their farm data.
- **Machine Learning Model**: A Python-based service that provides crop health analysis, disease detection, and other AI-powered insights.

## Components

### Backend Services

The backend is a collection of Node.js microservices, containerized with Docker.

![Backend Services](readme-images/backend-services/Screenshot%202025-07-03%20at%209.40.20%E2%80%AFPM.png)

- **Services**:
  - `user-service`: Manages user authentication and profiles.
  - `device-service`: Handles IoT device registration, data ingestion, and management.
  - `farm-crop-service`: Manages farm and crop data.
  - `alerts-service`: Generates and manages alerts based on device data and model insights.
  - `reports-analytics-service`: Provides data analytics and reporting features.
  - `notification-service`: Sends notifications to users via various channels.
- **Technology**: Node.js, Express, TypeScript, Docker.
- **Database**: Assumes an external PostgreSQL database (e.g., Neon).

### Admin Dashboard

A web-based dashboard for administrative tasks.


![Admin Dashboard](readme-images/admin-dashboard/Screenshot%202025-07-03%20at%209.41.24%E2%80%AFPM.png)
![Admin Dashboard](readme-images/admin-dashboard/Screenshot%202025-07-03%20at%209.42.22%E2%80%AFPM.png)
![Admin Dashboard](readme-images/admin-dashboard/Screenshot%202025-07-03%20at%209.42.35%E2%80%AFPM.png)
![Admin Dashboard](readme-images/admin-dashboard/Screenshot%202025-07-03%20at%209.42.54%E2%80%AFPM.png)
![Admin Dashboard](readme-images/admin-dashboard/Screenshot%202025-07-03%20at%209.43.21%E2%80%AFPM.png)

- **Features**: User management, device management, farm and crop monitoring, analytics and reporting.
- **Technology**: React, Vite, TypeScript, Tailwind CSS, Shadcn UI.

### Mobile App

A cross-platform mobile application for farmers.

<table>
  <tr>
    <td><img src="readme-images/mobile-app/Simulator%20Screenshot%20-%20iPhone%2016%20-%202025-07-03%20at%2021.50.11.png" alt="Mobile App" height="300"></td>
    <td><img src="readme-images/mobile-app/Simulator%20Screenshot%20-%20iPhone%2016%20-%202025-07-03%20at%2021.50.17.png" alt="Mobile App" height="300"></td>
    <td><img src="readme-images/mobile-app/Simulator%20Screenshot%20-%20iPhone%2016%20-%202025-07-03%20at%2021.50.21.png" alt="Mobile App" height="300"></td>
  </tr>
  <tr>
    <td><img src="readme-images/mobile-app/Simulator%20Screenshot%20-%20iPhone%2016%20-%202025-07-03%20at%2021.50.58.png" alt="Mobile App" height="300"></td>
    <td><img src="readme-images/mobile-app/Simulator%20Screenshot%20-%20iPhone%2016%20-%202025-07-03%20at%2021.51.03.png" alt="Mobile App" height="300"></td>
    <td><img src="readme-images/mobile-app/Simulator%20Screenshot%20-%20iPhone%2016%20-%202025-07-03%20at%2021.51.17.png" alt="Mobile App" height="300"></td>
  </tr>
  <tr>
    <td><img src="readme-images/mobile-app/Simulator%20Screenshot%20-%20iPhone%2016%20-%202025-07-03%20at%2021.51.25.png" alt="Mobile App" height="300"></td>
    <td><img src="readme-images/mobile-app/Simulator%20Screenshot%20-%20iPhone%2016%20-%202025-07-03%20at%2021.51.40.png" alt="Mobile App" height="300"></td>
    <td><img src="readme-images/mobile-app/Simulator%20Screenshot%20-%20iPhone%2016%20-%202025-07-03%20at%2021.51.54.png" alt="Mobile App" height="300"></td>
  </tr>
</table>

- **Features**: Real-time alerts, crop health status, farm data visualization, and interaction with the backend services.
- **Technology**: React Native, Expo, Expo Router.

### Machine Learning Model

A Python-based service that provides AI-powered insights.

- **Features**: Crop disease detection (YOLO), health scoring, and a RAG agent for providing contextual information.
- **Technology**: Python, FastAPI, PyTorch, ultralytics, OpenAI, Anthropic.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v18 or later)
- npm or yarn
- Python (v3.9 or later)
- A PostgreSQL database (e.g., a free tier Neon database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/__/sentra.git
   cd sentra
   ```

2. **Set up environment variables:**
   - Create a `.env` file in the `backend-services` directory by copying the example file (`.env.example` if it exists) and fill in the required values, especially the `DATABASE_URL`.
   - Create a `.env` file in the `admin-dashboards` directory for frontend-specific environment variables.

3. **Install dependencies for each component:**
   ```bash
   # For the admin dashboard
   cd admin-dashboards
   npm install
   cd ..

   # For the mobile app
   cd mobile-app
   npm install
   cd ..

   # For the machine learning model
   cd model
   pip install -r requirements.txt
   cd ..
   ```

## Usage

### Running the Backend Services

The backend services are orchestrated using Docker Compose.

```bash
cd backend-services
docker-compose up --build
```

This will build and start all the microservices defined in the `docker-compose.yml` file. The services will be accessible on their respective ports (3001-3006).

### Running the Admin Dashboard

```bash
cd admin-dashboards
npm run dev
```

The admin dashboard will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Running the Mobile App

```bash
cd mobile-app
npm start
```

This will start the Metro bundler. You can then run the app on an iOS simulator, Android emulator, or on your physical device using the Expo Go app.

### Running the Machine Learning Model

The machine learning model is served via a FastAPI application.

```bash
cd model
uvicorn main:app --reload
```

The model's API will be available at `http://localhost:8000`.

## Environment Variables

Each component may require specific environment variables. Please refer to the respective directories for `.env.example` files or further documentation on required environment variables. A central `.env` file in `backend-services` is used for all microservices.
# smartel-capstone
