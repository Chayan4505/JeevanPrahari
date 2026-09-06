# PahaarSaathi Machine Learning Model Card

**Model Name:** PahaarSaathi Two-Tier Landslide Susceptibility & Dynamic Rainfall Trigger Model  
**Version:** `1.2.0-ner-production`  
**Target Geography:** North Eastern Region (NER) of India  
**Last Updated:** August 2026  

---

## 1. Model Description & Architecture

PahaarSaathi implements a two-tier hybrid physical-empirical landslide early warning engine mirroring the methodology of the Geological Survey of India (GSI) Landslide Early Warning System (LEWS):

```
┌──────────────────────────────────────────────┐
│  Tier 1: Static Susceptibility Model         │
│  (Random Forest / XGBoost Classifier)        │
│  Input: Geomorphological DEM & Vector Factors│
│  Output: Baseline Susceptibility (0.0 - 1.0) │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Tier 2: Dynamic Rainfall Trigger Model      │
│  (Intensity-Duration Logistic Threshold)     │
│  Input: 1d, 3d, 7d Antecedent Rainfall       │
│  Output: Dynamic Multiplier & Hazard Level   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
         Composite Risk Level (Low, Moderate, High, Very High)
```

---

## 2. Training & Spatial Validation Methodology

Standard random k-fold cross validation artificially inflates model accuracy on spatial datasets due to spatial autocorrelation between adjacent coordinates. 

To ensure honest, generalizable evaluation:
- **Training Dataset:** 3,569 samples across East Khasi Hills (Meghalaya), Dima Hasao (Assam), and Champhai (Mizoram) spanning 2019–2023.
- **Spatial Holdout Test Dataset:** 2,431 samples strictly held out from Gangtok (Sikkim), Kohima (Nagaland), and the 2024 monsoon season.

---

## 3. Real Performance Evaluation Metrics

### Tier 1 — Static Susceptibility (Random Forest)
- **Spatial Holdout Accuracy:** `73.88%`
- **Macro F1-Score:** `0.5654`
- **Weighted F1-Score:** `0.7407`
- **Multi-Class Weighted ROC-AUC:** `0.8785`

#### Per-Class Performance Breakdown:
| Susceptibility Class | Precision | Recall | F1-Score |
| :--- | :--- | :--- | :--- |
| **Low** | 84.78% | 83.64% | 84.21% |
| **Moderate** | 70.29% | 65.41% | 67.76% |
| **High** | 46.27% | 65.40% | 54.20% |
| **Very High** | 37.50% | 13.64% | 20.00% |

### Tier 2 — Dynamic Rainfall Trigger (Logistic Regression Threshold)
- **Spatial Holdout Accuracy:** `95.43%`
- **Precision:** `95.04%`
- **Recall (Safety-Critical Metric):** `95.60%`
- **F1-Score:** `95.32%`
- **ROC-AUC:** `0.9941`

---

## 4. Input Features & Relative Importances

| Feature Name | Description | Source | Importance Weight |
| :--- | :--- | :--- | :--- |
| `plan_curvature` | Planar curvature (concave slopes concentrate pore water) | SRTM 30m DEM | **28.78%** |
| `slope_angle_deg` | Gradient angle (degrees) | SRTM 30m DEM | **23.34%** |
| `dist_to_road_cut_m` | Distance to highway toe cut excavations | OpenStreetMap | **17.30%** |
| `elevation_m` | Altitude above sea level | SRTM 30m DEM | **7.78%** |
| `historical_density` | Past landslide events per sq km | GSI Bhooskhalan | **7.65%** |
| `slope_aspect_deg` | Orientation (South/SE get heavier monsoon rain) | SRTM 30m DEM | **6.89%** |
| `lithology_class` | Rock strength / formation type | GSI Geology Map | **4.61%** |
| `land_cover_code` | Forest vs Shifting vs Built-up | Satellite LULC | **3.65%** |

---

## 5. Known Limitations & Caveats

1. **Lack of Real-Time Subsurface In-Situ Sensors:** The current system relies on surface rainfall proxies and DEM morphology. Live vibrating-wire piezometers and subsurface borehole inclinometers are not yet deployed in all remote villages.
2. **Extreme Cloudburst Microclimates:** Localized convective cloudbursts in deep Himalayan valleys can produce precipitation spikes that differ from grid-interpolated weather stations.
3. **Intended Use:** PahaarSaathi is a regional early warning and decision support tool for civil administration and hill citizens; it does not replace site-specific geotechnical site investigations.
