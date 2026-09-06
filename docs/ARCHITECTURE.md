# PahaarSaathi Technical Architecture Document

**Product Name:** PahaarSaathi (Hindi/regional: "Mountain Companion")  
**Target Geography:** North Eastern Region (NER) of India (Meghalaya, Assam, Sikkim, Mizoram, Nagaland, Arunachal Pradesh, Manipur, Tripura)  
**Standard Compliance:** NDMA OASIS Common Alerting Protocol (CAP v1.2) XML  

---

## 1. System Overview & Architecture Diagram

PahaarSaathi is built as a three-tier, decoupled, event-driven microservices architecture containerized via Docker.

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

## 2. Tier 1: Java Spring Boot Backend

- **Runtime:** Java 21, Spring Boot 3.2.x
- **Modules:**
  - **Auth & Security:** Google OAuth2 ID Token Verification (`GoogleTokenVerifier`), short-lived JWT generation (`JwtTokenProvider`) with HMAC-SHA256, RBAC (`ROLE_CITIZEN`, `ROLE_FIELD_OFFICER`, `ROLE_DISTRICT_ADMIN`, `ROLE_SUPER_ADMIN`).
  - **Risk Orchestration:** Coordinates with Python ML engine, calculates composite hazard indices, and computes emergency response prioritization ranking:
    $$P = \text{CompositeRisk} \times \text{Population} \times \text{Vulnerability}$$
  - **Weather & Rainfall Adapter:** Open-Meteo API integration for live 24h, 3-day, and 7-day rainfall with swappable IMD adapter interface.
  - **OASIS CAP 1.2 XML Engine:** Generates official disaster warning XML payloads adhering to National Disaster Management Authority (NDMA) India standards.
  - **Multilingual Templates:** Pre-translated alerts in 9 regional languages (English, Hindi, Assamese, Bodo, Khasi, Garo, Mizo, Manipuri, Nagamese).
  - **Audit Logging:** Logs administrative alerts, overrides, and user role modifications for government accountability.

---

## 3. Tier 2: Python ML Microservice

- **Runtime:** Python 3.11, FastAPI, Scikit-Learn, XGBoost, pandas, joblib
- **Prediction Pipeline:**
  - **Tier 1 — Static Susceptibility:** Models DEM slope angle, plan curvature, elevation, distance to road excavations, land cover, and rock lithology. Trained with Random Forest & XGBoost classifiers.
  - **Tier 2 — Dynamic Rainfall Trigger:** Empirical rainfall intensity-duration threshold logistic model taking 1d, 3d, 7d cumulative precipitation to produce dynamic multipliers (Normal, Watch, Warning, Alert).
  - **Spatial Holdout Splitting:** Trained on East Khasi Hills, Dima Hasao, Champhai (2019–2023) and tested on held-out Gangtok (Sikkim) and Kohima (Nagaland) 2024 data to prevent spatial autocorrelation leakage.
  - **Endpoints:**
    - `POST /predict/static-risk`
    - `POST /predict/dynamic-trigger`
    - `POST /predict/composite-grid`
    - `GET /model/metrics`

---

## 4. Tier 3: React Vite GIS Frontend & PWA

- **Stack:** React 18, TypeScript, TailwindCSS, Leaflet.js, Recharts, Lucide React, IndexedDB (`idb`)
- **Key Features:**
  - **Leaflet GIS Map:** Topographic, Dark Matter, and Satellite raster tiles with color-coded landslide hazard grid cells, mountain road connectivity lines, and settlement vulnerability markers.
  - **Offline PWA Citizen Reporting:** Uses HTML5 Geolocation, camera capture, and IndexedDB queuing. Automatically synchronizes reports when mobile signal is restored.
  - **District Command Center:** Decision matrix, settlement evacuation priorities, active road blockages, and one-click NDMA CAP alert broadcaster.
  - **Live Scientific Model Card:** Consumes `/model/metrics` directly to display true holdout precision, recall, and feature importances.
