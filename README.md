# PahaarSaathi (Mountain Companion)

**Landslide Early Warning, Monitoring & Decision Support System for North East India**  
*Built for the hill communities, travelers, and disaster administrators of the North Eastern Region (NER).*

---

## ACTION NEEDED FROM USER (External API Keys & Credentials)

To enable live external gateways, obtain the free keys below and paste them into your `.env` file. **The application works immediately out-of-the-box using the open fallback services (Open-Meteo, NASA POWER, OpenTopography, OpenStreetMap).**

| Provider | Purpose | Required Action | Free Tier Link |
| :--- | :--- | :--- | :--- |
| **Google Cloud Console** | Google OAuth 2.0 Sign-In | Create an OAuth 2.0 Client ID (Web application) and add `http://localhost:3000` to authorized origins. Set `GOOGLE_CLIENT_ID` in `.env`. *(Demo login buttons work out of the box)* | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| **OpenTopography** | High-resolution 30m SRTM DEM & slope data | Register for a free API key to query terrain elevations dynamically. Set `OPENTOPOGRAPHY_API_KEY` in `.env`. | [OpenTopography API](https://opentopography.org/blog/introducing-api-keys-access-opentopography-global-datasets) |
| **Fast2SMS / Twilio** | SMS Hazard Alerts to Indian phone numbers | Get a free API key for India-focused SMS alert dispatch. Set `FAST2SMS_API_KEY` in `.env`. *(Sandbox mock log active by default)* | [Fast2SMS](https://www.fast2sms.com/) |
| **Firebase (FCM)** | Mobile Push Notifications | Create a Firebase project, download service account JSON, and set `FCM_CREDENTIALS_PATH`. *(In-app alerts active by default)* | [Firebase Console](https://console.firebase.google.com/) |
| **IMD (api.imd.gov.in)** | Official India Meteorological Dept API | Submit IP whitelisting request to IMD for automated radar feeds. *(Open-Meteo API is active default working fallback)* | [IMD Portal](https://api.imd.gov.in/) |

---

## 1. System Architecture

```
                                  [ Citizen / Field Officer / District Admin ]
                                                      │
                                                      ▼
                                       ┌───────────────────────────────┐
                                       │   Nginx Reverse Proxy (:80)   │
                                       └──────────────┬────────────────┘
                                                      │
                       ┌──────────────────────────────┼──────────────────────────────┐
                       │                              │                              │
                       ▼                              ▼                              ▼
          ┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
          │  pahaarsaathi-frontend │     │  pahaarsaathi-backend  │     │   pahaarsaathi-ml      │
          │  React 18 + Vite (PWA) │     │  Java 21 / Spring Boot │     │  Python 3.11 / FastAPI │
          │  Leaflet GIS & Recharts│     │  Security / CAP / REST │     │  RF / XGBoost Scoring  │
          └────────────────────────┘     └────────────┬───────────┘     └────────────┬───────────┘
                                                      │                              │
                                                      │ (Internal REST Calls)        │
                                                      ├──────────────────────────────┘
                                                      │
        ┌───────────────────┬─────────────────────────┼─────────────────────────┬───────────────────┐
        ▼                   ▼                         ▼                         ▼                   ▼
┌───────────────┐   ┌───────────────┐         ┌───────────────┐         ┌───────────────┐   ┌───────────────┐
│  PostgreSQL 16│   │  Redis Cache  │         │   RabbitMQ    │         │  MinIO S3     │   │ External APIs │
│  + PostGIS    │   │  Rate Limits  │         │  Async Fanout │         │  Media Store  │   │ Open-Meteo    │
│  Spatial DB   │   │  & Sessions   │         │  Alert Queue  │         │  Photo/Video  │   │ IMD (Fallback)│
└───────────────┘   └───────────────┘         └───────┬───────┘         └───────────────┘   └───────────────┘
                                                      │
                                             ┌────────┴────────┐
                                             ▼                 ▼
                                     ┌───────────────┐ ┌───────────────┐
                                     │ SMS Gateway   │ │ FCM Push      │
                                     │ (Fast2SMS)    │ │ Notifications │
                                     └───────────────┘ └───────────────┘
```

---

## 2. Key Features

- **Two-Tier Scientific Machine Learning Engine:**
  - *Tier 1 (Static Susceptibility):* Random Forest and XGBoost classifiers scoring terrain slope angles, curvature, elevation, proximity to road-cut excavations, land cover, and lithology.
  - *Tier 2 (Dynamic Trigger):* Empirical antecedent rainfall intensity-duration logistic threshold model (1-day, 3-day, 7-day cumulative precipitation).
  - *Honest Validation:* Trained on East Khasi Hills, Dima Hasao, and Champhai; tested on held-out Gangtok (Sikkim) and Kohima (Nagaland) datasets to prevent spatial autocorrelation inflation.
- **Interactive Leaflet GIS Map:** Real-time hazard heatmaps, arterial mountain highways (NH-6, NH-27, SH-1) status, settlement markers, and coordinate inspector.
- **NDMA OASIS CAP v1.2 Alerts:** Generates and validates official XML alerts conforming to Indian disaster management standards.
- **9 Regional North Eastern Languages:** Pre-translated alert templates for Assamese (অসমীয়া), Bodo (बर'), Khasi (Ka Ktien Khasi), Garo (A·chik), Mizo (Mizo ṭawng), Manipuri (মৈতৈলোন্), Nagamese, Hindi, and English.
- **Offline-First PWA Incident Reporting:** Field officers and citizens in remote mountain valleys can take geo-tagged photos and report slope tension cracks; reports queue in IndexedDB and auto-sync when online.
- **Emergency Decision Matrix:** Dynamic priority ranking for district administrators:
  $$P = \text{CompositeRisk} \times \text{Population} \times \text{Vulnerability}$$

---

## 3. Quick Start (One Command via Docker)

### Prerequisites
- Docker Engine 20.10+ & Docker Compose v2+

### Run with Docker Compose
```bash
# 1. Clone the repository
git clone https://github.com/your-org/pahaarsaathi.git
cd pahaarsaathi

# 2. Copy the environment template
cp .env.example .env

# 3. Build and launch all 8 services
docker compose up --build
```

### Access Points
- **Web GIS Application:** [http://localhost:3000](http://localhost:3000) or [http://localhost](http://localhost)
- **Spring Boot Backend API:** [http://localhost:8080](http://localhost:8080)
- **Swagger API Docs:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Python ML Microservice:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Live Model Metrics:** [http://localhost:8000/model/metrics](http://localhost:8000/model/metrics)
- **MinIO S3 Storage Console:** [http://localhost:9001](http://localhost:9001) (`minioadmin` / `minioadmin`)
- **RabbitMQ Management Dashboard:** [http://localhost:15672](http://localhost:15672) (`guest` / `guest`)

---

## 4. Local Development Setup (Without Docker)

### 1. Python ML Microservice
```bash
cd ml-service
pip install -r requirements.txt
python -m app.training.train_models
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Java Spring Boot Backend
```bash
cd backend
mvn clean spring-boot:run
```

### 3. React Vite Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 5. Instant Demo Roles (One-Click Testing)

Click the **Sign In** button on the top right navigation bar to test with pre-configured role profiles:
1. **District Disaster Admin (Dima Hasao):** Full administrative access to dispatch CAP 1.2 alerts, view emergency evacuation rankings, and inspect audit logs.
2. **Field Officer / SDRF Team (East Khasi Hills):** Review and verify pending citizen reports, tag ground tension cracks.
3. **Local Citizen / Traveler:** Live GIS hazard map, offline incident reporting with camera and GPS.

---

## 6. Project Structure

```
PahaarSaathi/
├── backend/            # Java 21 Spring Boot 3.x backend
│   ├── src/main/java/com/pahaarsaathi/
│   │   ├── auth/       # Google OAuth & Role verification
│   │   ├── config/     # Security, JWT, MinIO, RabbitMQ, Redis
│   │   ├── controller/ # REST Endpoints
│   │   ├── dto/        # Data Transfer Objects
│   │   ├── model/      # JPA Entities & PostGIS Geometries
│   │   ├── repository/ # Spring Data JPA Repositories
│   │   └── service/    # Business logic, CAP XML, Weather
│   └── pom.xml
├── ml-service/         # Python 3.11 FastAPI microservice
│   ├── app/
│   │   ├── models/     # Risk calculator & inference
│   │   ├── routers/    # Predict & Metrics endpoints
│   │   ├── schemas/    # Pydantic validation schemas
│   │   └── training/   # Training pipeline & spatial holdouts
│   ├── trained_artifacts/ # Serialised models & metrics.json
│   └── requirements.txt
├── frontend/           # React 18 + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/ # Header, Footer, GIS Map, Dashboards, Forms
│   │   ├── context/    # Auth, Language (9 langs), Offline, Theme
│   │   ├── i18n/       # Multilingual dictionaries
│   │   ├── pages/      # Home, Map, Report, Alerts, Dashboard, Insights
│   │   └── services/   # API client & IndexedDB offline store
│   └── package.json
├── docker/             # Nginx reverse proxy & PostGIS configs
├── docs/               # ARCHITECTURE.md and MODEL_CARD.md
├── scripts/            # Seed data SQL & loaders
├── docker-compose.yml  # Production Docker Compose stack
└── README.md
```

---

## 7. Security & OWASP Hygiene

- **OAuth2 & JWT:** Short-lived access tokens with refresh token rotation.
- **RBAC API Enforcement:** Method-level security via `@PreAuthorize("hasAnyRole(...)")`.
- **Upload Validation:** Strict MIME-type filtering (JPEG/PNG/MP4 only) and 25MB file size limit.
- **Audit Trail:** Every alert broadcast and report verification is recorded in the `audit_logs` database table.

---

## 8. License & Attribution

- Built under Open Government Data License (OGDL) principles.
- Public data providers credited: India Meteorological Department (IMD), Open-Meteo, ISRO Bhuvan, OpenTopography (SRTM DEM), Geological Survey of India (GSI Bhooskhalan), and OpenStreetMap (OSM).
