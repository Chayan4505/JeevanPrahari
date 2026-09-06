"""
PahaarSaathi - Synthetic Empirical Landslide Dataset Generator for North Eastern Region (NER)
Mirrors GSI Bhooskhalan & NRSC Landslide Susceptibility methodologies.
"""

import numpy as np
import pandas as pd

def generate_ner_landslide_dataset(num_samples: int = 5000, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)

    # 5 NER Districts with realistic regional geological profiles
    districts = [
        {"name": "East Khasi Hills", "lat_center": 25.57, "lon_center": 91.89, "weight": 0.25, "mean_elev": 1500, "rain_multiplier": 1.4},
        {"name": "Dima Hasao", "lat_center": 25.18, "lon_center": 93.02, "weight": 0.25, "mean_elev": 750, "rain_multiplier": 1.1},
        {"name": "Champhai", "lat_center": 23.47, "lon_center": 93.32, "weight": 0.20, "mean_elev": 1200, "rain_multiplier": 0.95},
        {"name": "Gangtok", "lat_center": 27.33, "lon_center": 88.61, "weight": 0.15, "mean_elev": 1700, "rain_multiplier": 1.25}, # Spatial holdout
        {"name": "Kohima", "lat_center": 25.67, "lon_center": 94.11, "weight": 0.15, "mean_elev": 1440, "rain_multiplier": 1.05}, # Spatial holdout
    ]

    records = []
    district_probs = [d["weight"] for d in districts]

    years = np.random.choice([2019, 2020, 2021, 2022, 2023, 2024], size=num_samples, p=[0.15, 0.15, 0.20, 0.20, 0.15, 0.15])

    for i in range(num_samples):
        dist_idx = np.random.choice(len(districts), p=district_probs)
        dist = districts[dist_idx]
        year = years[i]

        lat = dist["lat_center"] + np.random.normal(0, 0.08)
        lon = dist["lon_center"] + np.random.normal(0, 0.08)

        # Geomorphological Static Factors
        # Slope angle: Beta distribution skewed toward moderate-steep slopes in Himalayas/Meghalaya
        slope_angle = float(np.clip(np.random.beta(2.5, 3.5) * 65.0 + 5.0, 5.0, 75.0))
        # Slope aspect: 0 - 360 degrees (South and Southeast facing slopes get more monsoon rain/erosion in NER)
        slope_aspect = float(np.random.uniform(0.0, 360.0))
        # Curvature: negative = concave (water converges, higher risk), positive = convex
        plan_curvature = float(np.random.normal(0.0, 1.2))
        # Elevation
        elevation = float(np.clip(dist["mean_elev"] + np.random.normal(0, 350), 150, 4200))
        # Distance to road cut / excavation (cut slopes along mountain highways NH-6, NH-27 are primary failure triggers)
        dist_to_road = float(np.clip(np.random.exponential(scale=320), 5.0, 3000.0))
        # Land cover (1: Dense Forest, 2: Shifting/Jhum, 3: Built-up/Road, 4: Barren/Steep Rocky, 5: Agri)
        land_cover = int(np.random.choice([1, 2, 3, 4, 5], p=[0.40, 0.22, 0.13, 0.10, 0.15]))
        # Lithology / Rock strength (1: Hard Granite/Gneiss, 2: Sandstone/Shale, 3: Soft Alluvium, 4: Highly Fractured Schist)
        lithology = int(np.random.choice([1, 2, 3, 4], p=[0.20, 0.40, 0.15, 0.25]))
        # Historical landslide density (events / sq km)
        hist_density = float(np.clip(np.random.gamma(shape=1.5, scale=0.8), 0.0, 6.0))

        # Dynamic Meteorological Factors (Monsoon vs dry season simulation)
        is_monsoon = np.random.choice([True, False], p=[0.65, 0.35])
        if is_monsoon:
            rain_1d = float(np.clip(np.random.gamma(shape=2.5, scale=25.0) * dist["rain_multiplier"], 0.0, 320.0))
            rain_3d = float(np.clip(rain_1d * 2.2 + np.random.gamma(shape=2.0, scale=20.0), rain_1d, 650.0))
            rain_7d = float(np.clip(rain_3d * 1.8 + np.random.gamma(shape=3.0, scale=25.0), rain_3d, 1100.0))
            rain_rate_change = float(np.random.normal(2.5, 4.0))
        else:
            rain_1d = float(np.clip(np.random.exponential(scale=4.0), 0.0, 45.0))
            rain_3d = float(np.clip(rain_1d + np.random.exponential(scale=8.0), rain_1d, 90.0))
            rain_7d = float(np.clip(rain_3d + np.random.exponential(scale=15.0), rain_3d, 180.0))
            rain_rate_change = float(np.random.normal(0.0, 0.8))

        # Empirical Ground Truth Formulation based on standard GSI/ISRO landslide susceptibility indexing
        # Slope factor (exponential increase past 28-35 degrees)
        f_slope = (slope_angle / 50.0) ** 1.8
        # Proximity to road cut (human toe-cutting destabilization)
        f_road = np.exp(-dist_to_road / 250.0) * 1.6
        # Lithology multiplier
        lith_weights = {1: 0.4, 2: 1.0, 3: 1.3, 4: 1.5}
        f_lith = lith_weights[lithology]
        # Land cover multiplier (Forest stabilizes with roots, Jhum/Barren destabilizes)
        lc_weights = {1: 0.5, 2: 1.3, 3: 1.2, 4: 1.4, 5: 0.9}
        f_lc = lc_weights[land_cover]
        # Curvature effect (concave slope collects pore water)
        f_curv = 0.3 if plan_curvature < -0.5 else (-0.1 if plan_curvature > 0.5 else 0.0)
        # History factor
        f_hist = (hist_density / 4.0) * 0.8

        # Static Latent Susceptibility Index
        static_latent = 0.35 * f_slope + 0.22 * f_road + 0.18 * f_lith + 0.12 * f_lc + 0.08 * f_hist + f_curv + np.random.normal(0, 0.12)
        static_latent_norm = 1.0 / (1.0 + np.exp(-3.5 * (static_latent - 0.95))) # Sigmoid mapping to 0 - 1

        # Class categorisation (GSI 4-tier zone classification)
        if static_latent_norm < 0.28:
            static_class = "Low"
            static_class_num = 0
        elif static_latent_norm < 0.58:
            static_class = "Moderate"
            static_class_num = 1
        elif static_latent_norm < 0.80:
            static_class = "High"
            static_class_num = 2
        else:
            static_class = "Very High"
            static_class_num = 3

        # Dynamic trigger ground truth: Landslide occurrence event (0 or 1)
        # Empirical Caine / Guzzetti intensity-duration rainfall threshold model
        pore_pressure_proxy = (rain_1d * 0.5) + (rain_3d * 0.3) + (rain_7d * 0.1)
        trigger_threshold = 95.0 * (1.2 - (static_latent_norm * 0.7)) # Higher susceptibility lowers required rain threshold

        trigger_latent = (pore_pressure_proxy - trigger_threshold) / 25.0 + (static_latent_norm * 1.2) + np.random.normal(0, 0.3)
        trigger_prob = 1.0 / (1.0 + np.exp(-trigger_latent))
        landslide_event = 1 if (trigger_prob > 0.50 and (rain_3d > 45.0 or slope_angle > 40.0)) else 0

        # Dynamic tier category
        if pore_pressure_proxy < 35.0:
            dynamic_tier = "NORMAL"
        elif pore_pressure_proxy < 75.0:
            dynamic_tier = "WATCH"
        elif pore_pressure_proxy < 140.0:
            dynamic_tier = "WARNING"
        else:
            dynamic_tier = "ALERT"

        records.append({
            "sample_id": f"S-{i:05d}",
            "district": dist["name"],
            "year": year,
            "latitude": lat,
            "longitude": lon,
            "slope_angle_deg": slope_angle,
            "slope_aspect_deg": slope_aspect,
            "plan_curvature": plan_curvature,
            "elevation_m": elevation,
            "dist_to_road_cut_m": dist_to_road,
            "land_cover_code": land_cover,
            "lithology_class": lithology,
            "historical_landslide_density": hist_density,
            "rainfall_1d_mm": rain_1d,
            "rainfall_3d_mm": rain_3d,
            "rainfall_7d_mm": rain_7d,
            "rainfall_rate_change": rain_rate_change,
            "static_latent_score": static_latent_norm,
            "static_class": static_class,
            "static_class_num": static_class_num,
            "landslide_event": landslide_event,
            "dynamic_tier": dynamic_tier
        })

    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    df = generate_ner_landslide_dataset(5000)
    print("Generated NER Dataset:", df.shape)
    print(df["static_class"].value_counts())
    print("Landslide event distribution:\n", df["landslide_event"].value_counts())
