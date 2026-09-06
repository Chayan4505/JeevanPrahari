# PahaarSaathi - Project Analysis & Local Setup Guide

## 📋 Project Overview

**PahaarSaathi** is a production-grade full-stack microservices platform for **Landslide Early Warning & Monitoring** in North East India. It's built with modern technologies designed for resilience, offline-first operations, and multilingual support (9 languages).

**Mission:** Enable early warning systems and incident reporting for landslide-prone regions in the Himalayan foothills.

---

## 🏗️ Architecture Overview

### **Three Independently Deployable Services:**

1. **Frontend (React/TypeScript)** - Port 3000 (dev) / 80 (prod)
   - Single Page Application with Leaflet GIS maps
   - Offline-first PWA (IndexedDB for caching)
   - 9-language multilingual support
   - Real-time hazard heatmaps & incident reporting

2. **Backend (Java Spring Boot)** - Port 8080
   - REST API with JWT authentication
   - OAuth 2.0 integration (Google)
   - Role-based access control (4 roles)
   - Async alert dispatch via RabbitMQ
   - PostGIS spatial queries for landslide zones

3. **ML Microservice (Python/FastAPI)** - Port 8000
   - Real-time risk scoring (Random Forest + XGBoost)
   - Trained on East Khasi Hills, Dima Hasao, Champhai districts
   - Returns risk scores (0-1) for any geographic point
   - Health check & metrics endpoints

### **Infrastructure Services (Docker Compose):**

| Service | Port(s) | Purpose |
|---------|---------|---------|
| PostgreSQL 16 + PostGIS | 5432 | Spatial database (districts, villages, risk grid) |
| Redis 7.2 | 6379 | Session cache, rate limiting |
| RabbitMQ 3.13 | 5672, 15672 | Async alert fanout, SMS/FCM queues |
| MinIO | 9000, 9001 | S3-compatible object storage (photos/videos) |
| Nginx Reverse Proxy | 80 | Gateway (routes /, /api/, /ml/) |

---

## 💻 Tech Stack Breakdown

### **Frontend**
- **React 18.2.0** + TypeScript 5.2.2
- **Vite 5.1.6** - Lightning-fast bundler
- **Leaflet 1.9.4** + React-Leaflet 4.2.1 - GIS mapping
- **Recharts 2.12.3** - Data visualization
- **Tailwind CSS 3.4.1** - Utility-first styling
- **React Router v6** - Client-side routing
- **idb 8.0.0** - IndexedDB wrapper for offline storage
- **Lucide React** - Icon library

### **Backend**
- **Java 21** (latest LTS)
- **Spring Boot 3.2.3**
- **Spring Security** + JWT (io.jsonwebtoken)
- **Spring Data JPA** + Hibernate
- **PostGIS** - Spatial database extension
- **RabbitMQ** - Message queue (async alerts)
- **Redis** - Session cache & rate limiting
- **MinIO** - S3-compatible object storage
- **SpringDoc OpenAPI** - Swagger documentation

### **ML Service**
- **Python 3.11**
- **FastAPI 0.110.0**
- **Scikit-learn** - Random Forest model
- **XGBoost 2.0.0** - Gradient boosting
- **Pandas 2.2.0** - Data processing
- **Pydantic** - Input validation
- **Uvicorn** - ASGI web server

---

## 🚀 Local Setup Instructions

### **Prerequisites**
- ✅ Docker & Docker Compose (v2+)
- ✅ Node.js 18+ & npm
- ✅ Java 21 (optional, if not using Docker for backend)
- ✅ Python 3.11 (optional, if not using Docker for ML service)
- ✅ 4GB RAM available (for all services)
- ✅ Ports available: 3000, 5000, 5173, 8000, 8080, 5432, 6379, 5672, 9000, 9001, 80

### **Step 1: Clone & Environment Setup**

```bash
cd c:\Users\chaya\Desktop\sih2026
# .env already configured - contains default credentials
cat .env  # Verify all required ports and services
```

### **Step 2: Start Infrastructure Services (Docker Compose)**

```bash
# Start all infrastructure (PostgreSQL, Redis, RabbitMQ, MinIO, ML service, backend)
docker-compose up -d

# Verify services are running
docker-compose ps

# View logs (if needed)
docker-compose logs -f
```

**Wait for all services to reach "healthy" state (~30-60 seconds)**

### **Step 3: Start Frontend (npm/Vite)**

```bash
cd frontend

# Install dependencies
npm install

# Start development server (will run on http://localhost:5173)
npm run dev

# Or use the configured frontend port (3000) via Docker Compose
```

### **Step 4: Verify All Services**

Once everything is running, access:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main React app (redirects from 5173 if via Nginx) |
| **Backend API** | http://localhost:8080 | REST API endpoint |
| **Swagger Docs** | http://localhost:8080/swagger-ui.html | API documentation |
| **ML Service** | http://localhost:8000 | Risk scoring microservice |
| **RabbitMQ Console** | http://localhost:15672 | Queue management (guest/guest) |
| **MinIO Console** | http://localhost:9001 | Object storage (minioadmin/minioadmin) |
| **Redis CLI** | `redis-cli -p 6379` | Cache/session store |
| **PostgreSQL** | `psql -h localhost -U pahaarsaathi_user -d pahaarsaathi_db` | Spatial database |

---

## 📦 Service Dependencies & Startup Order

**Startup Sequence (Docker Compose handles this automatically):**

```
PostgreSQL (5432) ✓ Ready
    ↓
RabbitMQ (5672) ✓ Ready
    ↓
Redis (6379) ✓ Ready
    ↓
MinIO (9000) ✓ Ready
    ↓
Backend (8080) ✓ Waits for ^ then starts
    ↓
ML Service (8000) ✓ Independent
    ↓
Frontend (3000/5173) ✓ Can start anytime
```

---

## 🔑 Key Configuration Files

### **Frontend**
- `frontend/vite.config.ts` - Vite config with API proxy (routes `/api/*` to `http://localhost:8080`)
- `frontend/tsconfig.json` - TypeScript strict mode for development
- `frontend/tailwind.config.js` - Custom theme, path aliases (@/*)
- `frontend/src/App.tsx` - Main router setup

### **Backend**
- `backend/pom.xml` - Maven dependencies and build config
- `backend/src/main/resources/application.properties` - Spring config (database, JWT, CORS, RabbitMQ)
- `backend/src/main/java/com/pahaarsaathi/config/` - Security, JWT, CORS, RabbitMQ config

### **ML Service**
- `ml-service/app/main.py` - FastAPI application
- `ml-service/app/models/risk_calculator.py` - ML inference engine
- `ml-service/requirements.txt` - Python dependencies
- `ml-service/app/training/train_models.py` - Model training pipeline (runs on Docker build)

### **Infrastructure**
- `docker-compose.yml` - Defines all 8 services (PostgreSQL, Redis, RabbitMQ, MinIO, Backend, ML, Frontend, Nginx)
- `.env` - Environment variables for all services

---

## 🌐 API Endpoints

### **Authentication**
- `POST /api/auth/google` - Verify Google OAuth token & issue JWT
- `POST /api/auth/refresh` - Refresh expired JWT access token

### **Risk & Monitoring**
- `GET /api/risk/grid` - Get risk grid cells for a bounding box
- `POST /ml/predict` - ML risk scoring for coordinates + rainfall
- `GET /api/weather/current` - Current weather data

### **Alerts & Dispatch**
- `GET /api/alerts` - List active alerts
- `POST /api/alerts` - Dispatch new CAP 1.2 alert (admin-only)
- `GET /api/dashboard/priority` - Priority ranking matrix

### **Incident Reports**
- `POST /api/reports` - Submit citizen landslide report (with geo-tagging)
- `GET /api/reports` - List reports (admin view with verification status)
- `PUT /api/reports/{id}` - Verify report (field officer)

### **Media Upload**
- `POST /api/reports/{id}/media` - Upload incident photos/videos (25MB limit)

### **Audit & Admin**
- `GET /api/admin/audit-logs` - Alert dispatch & verification audit trail

---

## 🗄️ Database Schema (PostGIS)

### **Core Entities:**

1. **User** - OAuth identity, roles (CITIZEN, FIELD_OFFICER, DISTRICT_ADMIN, SUPER_ADMIN)
2. **District** - Admin boundaries (Kamrup, East Khasi Hills, Dima Hasao, etc.)
3. **Village** - Sub-division of districts with geometry
4. **RiskGridCell** - Static susceptibility scores (RF+XGBoost predictions)
5. **LandslideReport** - Citizen/officer incident reports with geometry, status
6. **Alert** - CAP 1.2 alert records
7. **AlertTemplate** - Multilingual alert templates (9 languages)
8. **WeatherData** - Time-series precipitation, temperature
9. **RoadSegment** - Arterial highways (NH-6, NH-27, SH-1) linestrings
10. **AuditLog** - Admin action trail (alerts dispatched, reports verified)

### **Spatial Queries Example:**
```sql
-- Find villages within 5km of a landslide report
SELECT v.name FROM villages v, landslide_reports r 
WHERE ST_DWithin(v.geometry, r.geometry, 5000);

-- Get risk cells intersecting a district
SELECT * FROM risk_grid_cells 
WHERE ST_Intersects(geometry, (SELECT geometry FROM districts WHERE name='Dima Hasao'));
```

---

## 🔐 Security Architecture

### **Authentication**
- **OAuth 2.0 + JWT** - Google Sign-In with server-side verification
- **Short-lived Access Tokens** - 15 minutes (configurable)
- **Refresh Token Rotation** - Invalidates old tokens on refresh

### **Authorization**
- **Role-Based Access Control (RBAC)**
  - `CITIZEN` - Can submit reports, view public alerts
  - `FIELD_OFFICER` - Can verify reports, view district-level data
  - `DISTRICT_ADMIN` - Can dispatch alerts, manage officers
  - `SUPER_ADMIN` - Full system access

### **Data Protection**
- **File Upload Validation** - MIME-type whitelist (JPEG/PNG/MP4), 25MB limit
- **Audit Trail** - All alert dispatches and verifications logged
- **CORS** - Restricted to frontend origin (localhost:3000 in dev)
- **JWT in Authorization Header** - Bearer token validation

### **Infrastructure Security**
- **Non-root Containers** - Java/Python services run as unprivileged users
- **Network Isolation** - RabbitMQ and Redis on internal network
- **HTTPS-Ready** - Nginx config supports SSL termination (commented in dev mode)

---

## 🛠️ Common Development Tasks

### **Run Frontend Only (Fast Development)**
```bash
cd frontend
npm install
npm run dev
# Opens http://localhost:5173 with Vite hot reload
```

### **Run Backend Only (with Docker Compose infra)**
```bash
docker-compose up -d postgres redis rabbitmq minio
# Wait for services to be healthy
mvn clean spring-boot:run -f backend/pom.xml
```

### **Build Frontend for Production**
```bash
cd frontend
npm run build
# Creates optimized bundle in frontend/dist/
```

### **View RabbitMQ Console**
```
http://localhost:15672
Username: guest
Password: guest
```

### **View MinIO Console**
```
http://localhost:9001
Username: minioadmin
Password: minioadmin
```

### **Check Database Status**
```bash
psql -h localhost -U pahaarsaathi_user -d pahaarsaathi_db -c "SELECT version();"
```

---

## 📝 Environment Variables Guide

### **Database Configuration**
```
POSTGRES_DB=pahaarsaathi_db              # Database name
POSTGRES_USER=pahaarsaathi_user          # DB user
POSTGRES_PASSWORD=pahaarsaathi_secure_pass_2026
POSTGRES_PORT=5432
```

### **Cache & Message Queue**
```
REDIS_PORT=6379
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_PORT=5672
RABBITMQ_MGMT_PORT=15672
```

### **Object Storage**
```
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_PORT=9000
MINIO_CONSOLE_PORT=9001
```

### **Service Ports**
```
GATEWAY_PORT=80          # Nginx reverse proxy
FRONTEND_PORT=3000       # Next.js/React server
BACKEND_PORT=8080        # Spring Boot
ML_PORT=8000             # FastAPI
```

### **Security**
```
JWT_SECRET=pahaarsaathi_ultra_secure_jwt_secret_key_ner_disaster_management_2026_x89
GOOGLE_CLIENT_ID=291927177694-n73kk8f597oar8gh72ef5nhgiglvmt0h.apps.googleusercontent.com
```

### **External APIs (Optional - With Fallbacks)**
```
OPENTOPOGRAPHY_API_KEY=         # For DEM queries (fallback: Open-Meteo)
FAST2SMS_API_KEY=               # For SMS dispatch
FCM_CREDENTIALS_PATH=           # For mobile push notifications
IMD_API_KEY=                    # India Meteorological Dept (fallback: Open-Meteo)
SENTINEL_HUB_CLIENT_ID=         # For satellite imagery
SENTINEL_HUB_CLIENT_SECRET=
```

---

## 🔍 Troubleshooting

### **Port Already in Use**
```bash
# Find process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F  # Kill the process
# Or change port in .env
```

### **Docker Services Not Starting**
```bash
# Check Docker logs
docker-compose logs <service_name>

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### **Frontend Can't Connect to Backend**
- Verify backend is running: `http://localhost:8080/swagger-ui.html`
- Check CORS config in `backend/src/main/resources/application.properties`
- Vite proxy should route `/api/*` to `http://localhost:8080`

### **Database Connection Errors**
```bash
# Check PostgreSQL container
docker-compose logs postgres

# Connect directly
psql -h localhost -U pahaarsaathi_user -d pahaarsaathi_db
```

### **ML Service Not Available**
```bash
# Check if service is running
curl http://localhost:8000/health

# View logs
docker-compose logs ml-service
```

---

## 📊 Performance & Monitoring

### **Frontend Performance**
- Vite provides instant HMR (hot module replacement)
- TypeScript type checking for development safety
- Production build: ~200KB gzipped (optimized with tree-shaking)

### **Backend Performance**
- Spring Boot actuator endpoints for health checks
- Redis caching for risk grid cells (5-minute TTL)
- RabbitMQ async processing for alerts (non-blocking)

### **ML Service Performance**
- Joblib-serialized models load in <500ms
- Risk prediction: <50ms per request
- Can handle ~1000 concurrent predictions

---

## 🚢 Production Deployment (Docker)

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Push to registry (e.g., Docker Hub)
docker tag pahaarsaathi-frontend:latest myregistry/pahaarsaathi-frontend:latest
docker push myregistry/pahaarsaathi-frontend:latest

# Deploy to Kubernetes or Docker Swarm
docker-compose -f docker-compose.yml up -d
```

---

## 📚 Key Project Files Reference

| File | Purpose |
|------|---------|
| `frontend/src/App.tsx` | React router & main layout |
| `frontend/src/pages/RiskMapPage.tsx` | Leaflet GIS map component |
| `frontend/src/services/api.ts` | REST API client |
| `backend/src/main/java/com/pahaarsaathi/controller/RiskController.java` | Risk grid endpoint |
| `backend/src/main/java/com/pahaarsaathi/config/SecurityConfig.java` | JWT & CORS setup |
| `backend/src/main/java/com/pahaarsaathi/service/AlertDispatchService.java` | RabbitMQ alert fanout |
| `ml-service/app/models/risk_calculator.py` | ML inference logic |
| `docker-compose.yml` | Infrastructure orchestration |
| `.env` | Environment secrets & configuration |

---

## 🎯 Next Steps

1. **Verify Docker Compose is running** → All 8 services healthy
2. **Install frontend dependencies** → `npm install` in `frontend/`
3. **Start frontend dev server** → `npm run dev`
4. **Access the app** → http://localhost:3000 or http://localhost:5173
5. **Test an API call** → View Swagger docs at http://localhost:8080/swagger-ui.html
6. **Check database** → `psql -h localhost -U pahaarsaathi_user -d pahaarsaathi_db`

---

**Happy developing! 🚀**

For questions or issues, check the troubleshooting section or review the Docker logs.
