# GeoIncident
# Global Incident Tracking System

GeoIncident is a web-based application that allows users to track and monitor geographical incidents such as earthquakes. The system provides an interactive map interface for visualizing incident locations and detailed information about each event.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Future Improvements](#future-improvements)


---

## Project Overview
GeoIncident is a web application designed to track and monitor geographical incidents. It allows users to visualize incidents on an interactive map, add new incidents, and manage their statuses

## Features
- Visualize incidents on an interactive global map using Leaflet.js
- Support for different types of incidents (currently focused on earthquakes)
- Incident details including:
    - Location (latitude/longitude)
    - Magnitude
    - Creation and last update timestamps
    - Description
    - Status tracking (e.g., created, monitored)
- Search functionality to locate specific incidents
- Ability to add new incidents through an intuitive interface
- Monitor and reject incident reports
- Responsive design optimized for desktop

## Getting Started

### Tech Stack:
**Backend**
- Python with Flask framework
- Pytest for unit and integration testing
- Docker for containerization and deployment (optional)
 
**Frontend**
- React with TypeScript
- Bootstrap 5 for UI components and responsive design
- Leaflet.js for interactive maps
- State management using State Machine
 
  
 
 ### Installation:
1. Install [asdf](https://asdf-vm.com/guide/getting-started.html)

2. Install asdf plugins:
    ```asdf plugin add nodejs && asdf plugin add python```
3. Install language runtimes using asdf: ```asdf install```

4. Backend
    - Initialize virtual environment and activate it:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
    - Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
    - Initialize the database
    ```bash
    flask --app backend init-db
    ```
5. Frontend
    ```bash
    cd ./frontend && npm install
    ```
 ### To Run the Application:
1. **Backend:** Run the Flask backend server:
```bash
flask --app backend run --debug
```
Once the backend is running, you can access it at http://localhost:5000/api/incidents
<br>

2. **Frontend:** Navigate to the frontend directory and start the development server:
```bash
cd frontend && npm run dev
```
Once the frontend is running, you can access it at http://localhost:5173

 ### To Run the Tests:
```bash
python -m pytest tests
```
 ### To Run Using Docker:
```bash
docker-compose down
docker-compose up --build
```

## API Documentation
```GET /api/incidents``` - Retrieve all incidents <br>
```POST /api/incidents``` - Create a new incident <br>
```PUT /api/incidents/:id``` - Update incident state <br>


## Future Improvements
- Integration with USGS Earthquake API (https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson) for real-time earthquake data
- Automatic data synchronization with external APIs to replace manual database entries
- Use GeoJson format to represent the incidents
- Filter the monitored incidents
