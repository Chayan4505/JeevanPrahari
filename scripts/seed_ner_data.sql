-- ==============================================================================
-- PahaarSaathi - North Eastern Region (NER) Spatial Seed Dataset
-- PostgreSQL 16 + PostGIS
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Districts
INSERT INTO districts (id, name, state, latitude, longitude, population, area_sq_km, emergency_helpline, current_rainfall24h, cumulative_rainfall3d, cumulative_rainfall7d, current_risk_level, trigger_status)
VALUES 
('IN-ML-EKH', 'East Khasi Hills (Shillong)', 'Meghalaya', 25.5788, 91.8933, 825922, 2748.0, '1077 / 0364-2222277', 78.5, 215.0, 440.0, 'HIGH', 'WARNING'),
('IN-AS-DH', 'Dima Hasao (Haflong)', 'Assam', 25.1833, 93.0167, 214102, 4888.0, '1077 / 03673-236222', 112.0, 320.0, 610.0, 'VERY_HIGH', 'ALERT'),
('IN-SK-GTK', 'Gangtok', 'Sikkim', 27.3389, 88.6065, 281293, 954.0, '1070 / 03592-202720', 45.0, 120.0, 250.0, 'MODERATE', 'WATCH'),
('IN-MZ-CHM', 'Champhai', 'Mizoram', 23.4750, 93.3280, 125745, 3185.0, '1077 / 03831-234200', 32.0, 95.0, 180.0, 'LOW', 'NORMAL'),
('IN-NL-KHM', 'Kohima', 'Nagaland', 25.6701, 94.1077, 267988, 1463.0, '1077 / 0370-2290022', 54.0, 145.0, 290.0, 'HIGH', 'WARNING')
ON CONFLICT (id) DO NOTHING;

-- 2. Settlements / Villages
INSERT INTO villages (name, district_id, latitude, longitude, population, vulnerability_index, nearest_shelter_name, nearest_shelter_dist_km, evacuation_route, composite_risk_score, risk_level, priority_score)
VALUES
('Cherrapunji (Sohra) Rim', 'IN-ML-EKH', 25.2986, 91.7203, 11722, 0.88, 'Sohra Community Hall Shelter', 1.2, 'North via Sohra-Shella Road to Highland Relief Camp 1', 0.82, 'VERY_HIGH', 8450.0),
('Mawsynram Khas', 'IN-ML-EKH', 25.2974, 91.5828, 6420, 0.85, 'Mawsynram Higher Secondary School', 0.8, 'East toward Mawsynram Block HQ via Ridge Highway', 0.79, 'HIGH', 4310.0),
('Pynursla Ridge Sector', 'IN-ML-EKH', 25.3090, 91.8950, 4850, 0.78, 'Pynursla BDO Complex', 1.5, 'North toward Smit via Bypass', 0.71, 'HIGH', 2680.0),
('Haflong Hill Cut Colony', 'IN-AS-DH', 25.1667, 93.0167, 14500, 0.92, 'Haflong Govt College Ground', 1.0, 'Upward toward Circuit House Hilltop via Fiangpui bypass', 0.88, 'VERY_HIGH', 11720.0),
('Jatinga Pass Ridge', 'IN-AS-DH', 25.1200, 93.0400, 3200, 0.90, 'Jatinga High School Shelter', 0.6, 'Immediate retreat to Jatinga High Ridge Shelter', 0.91, 'VERY_HIGH', 2620.0),
('Harangajao Valley Toe', 'IN-AS-DH', 25.1050, 92.8650, 5400, 0.95, 'Harangajao Railway Station Hall', 0.4, 'Evacuate valley floor towards Upper Harangajao Railway Yard', 0.94, 'VERY_HIGH', 4830.0)
ON CONFLICT DO NOTHING;

-- 3. Mountain Road Segments
INSERT INTO road_segments (road_number, segment_name, district_id, start_lat, start_lon, end_lat, end_lon, length_km, criticality_index, status, blockage_cause, alternate_route_advisory, current_hazard_score)
VALUES
('NH-06', 'Shillong - Jowai Ghat Cut Section', 'IN-ML-EKH', 25.5500, 91.9500, 25.4800, 92.1500, 28.5, 10, 'CAUTION', 'Multiple debris slips along cut slope km 34-38', 'Light vehicles only via Mawryngkneng bypass', 0.68),
('SH-01', 'Shillong - Pynursla - Dawki International Corridor', 'IN-ML-EKH', 25.5200, 91.8800, 25.2000, 91.9200, 44.0, 8, 'CRITICAL', 'Tension cracks of 15cm width developed across both lanes at Wahkhen ghat', 'Heavy freight trucks diverted via Umkiang-Ratacherra', 0.85),
('NH-27', 'Haflong - Lumding Hill Section (E-W Corridor)', 'IN-AS-DH', 25.2000, 93.0200, 25.7500, 93.1800, 68.0, 10, 'BLOCKED', 'Massive mudslide over 120 meters at Dihangi; track and road submerged', 'All vehicular movement halted. NHIDCL earthmovers deployed.', 0.96),
('NH-54E', 'Jatinga - Harangajao Ghat Bypass', 'IN-AS-DH', 25.1200, 93.0400, 25.1000, 92.8600, 24.5, 9, 'BLOCKED', 'Bridge approach washed away by Flash debris flow near Migrendisa', 'Strict road closure by District Administration Dima Hasao', 0.98)
ON CONFLICT DO NOTHING;
