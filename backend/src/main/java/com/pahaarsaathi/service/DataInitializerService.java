package com.pahaarsaathi.service;

import com.pahaarsaathi.auth.Role;
import com.pahaarsaathi.model.*;
import com.pahaarsaathi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class DataInitializerService implements CommandLineRunner {

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private VillageRepository villageRepository;

    @Autowired
    private RoadSegmentRepository roadSegmentRepository;

    @Autowired
    private RiskGridCellRepository riskGridCellRepository;

    @Autowired
    private AlertTemplateRepository alertTemplateRepository;

    @Autowired
    private LandslideReportRepository landslideReportRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CAPXmlService capXmlService;

    @Override
    public void run(String... args) throws Exception {
        if (districtRepository.count() > 0) {
            System.out.println("[PahaarSaathi Seed] Database already seeded. Skipping initial data injection.");
            return;
        }

        System.out.println("[PahaarSaathi Seed] Initializing NER Geographical, Vulnerability, and Multilingual seed data...");

        seedDistricts();
        seedVillages();
        seedRoadSegments();
        seedRiskGridCells();
        seedMultilingualTemplates();
        seedSampleReportsAndAlerts();
        seedDefaultUsers();

        System.out.println("[PahaarSaathi Seed] [OK] North Eastern Region seed dataset successfully loaded.");
    }

    private void seedDistricts() {
        List<District> districts = Arrays.asList(
                new District("IN-ML-EKH", "East Khasi Hills (Shillong)", "Meghalaya", 25.5788, 91.8933, 825922, 2748.0, "1077 / 0364-2222277"),
                new District("IN-AS-DH", "Dima Hasao (Haflong)", "Assam", 25.1833, 93.0167, 214102, 4888.0, "1077 / 03673-236222"),
                new District("IN-SK-GTK", "Gangtok", "Sikkim", 27.3389, 88.6065, 281293, 954.0, "1070 / 03592-202720"),
                new District("IN-MZ-CHM", "Champhai", "Mizoram", 23.4750, 93.3280, 125745, 3185.0, "1077 / 03831-234200"),
                new District("IN-NL-KHM", "Kohima", "Nagaland", 25.6701, 94.1077, 267988, 1463.0, "1077 / 0370-2290022"),
                new District("IN-AR-PPR", "Papum Pare (Itanagar)", "Arunachal Pradesh", 27.1000, 93.6167, 176523, 2875.0, "1077 / 0360-2212375"),
                new District("IN-MN-IPW", "Imphal West", "Manipur", 24.8170, 93.9368, 517992, 519.0, "1077 / 0385-2450021")
        );

        districts.get(0).setCurrentRainfall24h(78.5);
        districts.get(0).setCumulativeRainfall3d(215.0);
        districts.get(0).setCumulativeRainfall7d(440.0);
        districts.get(0).setCurrentRiskLevel("HIGH");
        districts.get(0).setTriggerStatus("WARNING");

        districts.get(1).setCurrentRainfall24h(112.0);
        districts.get(1).setCumulativeRainfall3d(320.0);
        districts.get(1).setCumulativeRainfall7d(610.0);
        districts.get(1).setCurrentRiskLevel("VERY_HIGH");
        districts.get(1).setTriggerStatus("ALERT");

        districtRepository.saveAll(districts);
    }

    private void seedVillages() {
        List<Village> villages = Arrays.asList(
                // East Khasi Hills settlements
                new Village("Cherrapunji (Sohra) Rim", "IN-ML-EKH", 25.2986, 91.7203, 11722, 0.88, "Sohra Community Hall Shelter", 1.2),
                new Village("Mawsynram Khas", "IN-ML-EKH", 25.2974, 91.5828, 6420, 0.85, "Mawsynram Higher Secondary School", 0.8),
                new Village("Pynursla Ridge Sector", "IN-ML-EKH", 25.3090, 91.8950, 4850, 0.78, "Pynursla BDO Complex", 1.5),
                new Village("Mawlynnong Escarpment", "IN-ML-EKH", 25.2014, 91.9056, 1200, 0.65, "Mawlynnong Community Center", 0.5),
                new Village("Nongkrem Hills", "IN-ML-EKH", 25.4950, 91.8840, 3100, 0.55, "Smit Royal Court Ground", 2.0),
                new Village("Upper Shillong Forest Fringe", "IN-ML-EKH", 25.5340, 91.8350, 8900, 0.45, "5th Mile Multi-Purpose Hall", 1.1),

                // Dima Hasao settlements
                new Village("Haflong Hill Cut Colony", "IN-AS-DH", 25.1667, 93.0167, 14500, 0.92, "Haflong Govt College Ground", 1.0),
                new Village("Jatinga Pass Ridge", "IN-AS-DH", 25.1200, 93.0400, 3200, 0.90, "Jatinga High School Shelter", 0.6),
                new Village("Harangajao Valley Toe", "IN-AS-DH", 25.1050, 92.8650, 5400, 0.95, "Harangajao Railway Station Hall", 0.4),
                new Village("Maibang Old Town", "IN-AS-DH", 25.3000, 93.1600, 8200, 0.70, "Maibang Indoor Stadium", 1.3),
                new Village("Umrangso Reservoir Slopes", "IN-AS-DH", 25.5167, 92.7833, 6700, 0.60, "NEEPCO Recreation Hall", 2.2),

                // Gangtok & Sikkim settlements
                new Village("Burtuk Steep Gorge", "IN-SK-GTK", 27.3500, 88.6180, 4100, 0.82, "Burtuk Helipad Ground", 1.8),
                new Village("Ranipool River Bank", "IN-SK-GTK", 27.2880, 88.5860, 7800, 0.75, "Ranipool Community Shelter", 0.9),
                new Village("Tadong 5th Mile", "IN-SK-GTK", 27.3150, 88.5990, 11200, 0.60, "Sikkim Manipal Auditorium", 1.0)
        );

        villages.get(0).setCompositeRiskScore(0.82);
        villages.get(0).setRiskLevel("VERY_HIGH");
        villages.get(0).setPriorityScore(8450.0);
        villages.get(0).setEvacuationRoute("North via Sohra-Shella Road to Highland Relief Camp 1");

        villages.get(1).setCompositeRiskScore(0.79);
        villages.get(1).setRiskLevel("HIGH");
        villages.get(1).setPriorityScore(4310.0);
        villages.get(1).setEvacuationRoute("East toward Mawsynram Block HQ via Ridge Highway");

        villages.get(6).setCompositeRiskScore(0.88);
        villages.get(6).setRiskLevel("VERY_HIGH");
        villages.get(6).setPriorityScore(11720.0);
        villages.get(6).setEvacuationRoute("Upward toward Circuit House Hilltop via Fiangpui bypass");

        villages.get(7).setCompositeRiskScore(0.91);
        villages.get(7).setRiskLevel("VERY_HIGH");
        villages.get(7).setPriorityScore(2620.0);
        villages.get(7).setEvacuationRoute("Immediate retreat to Jatinga High Ridge Shelter");

        villages.get(8).setCompositeRiskScore(0.94);
        villages.get(8).setRiskLevel("VERY_HIGH");
        villages.get(8).setPriorityScore(4830.0);
        villages.get(8).setEvacuationRoute("Evacuate valley floor towards Upper Harangajao Railway Yard");

        villageRepository.saveAll(villages);
    }

    private void seedRoadSegments() {
        List<RoadSegment> roads = Arrays.asList(
                // Meghalaya Roads
                new RoadSegment("NH-06", "Shillong - Jowai Ghat Cut Section", "IN-ML-EKH", 25.5500, 91.9500, 25.4800, 92.1500, 28.5, 10, "CAUTION"),
                new RoadSegment("SH-01", "Shillong - Pynursla - Dawki International Corridor", "IN-ML-EKH", 25.5200, 91.8800, 25.2000, 91.9200, 44.0, 8, "CRITICAL"),
                new RoadSegment("MDR-12", "Sohra - Shella Valley Link", "IN-ML-EKH", 25.3000, 91.7200, 25.1800, 91.6800, 18.2, 6, "PASSABLE"),

                // Assam - Dima Hasao Roads
                new RoadSegment("NH-27", "Haflong - Lumding Hill Section (E-W Corridor)", "IN-AS-DH", 25.2000, 93.0200, 25.7500, 93.1800, 68.0, 10, "BLOCKED"),
                new RoadSegment("NH-54E", "Jatinga - Harangajao Ghat Bypass", "IN-AS-DH", 25.1200, 93.0400, 25.1000, 92.8600, 24.5, 9, "BLOCKED"),
                new RoadSegment("SH-17", "Haflong - Umrangso Industrial Road", "IN-AS-DH", 25.2000, 93.0000, 25.5100, 92.7800, 52.0, 7, "CAUTION"),

                // Sikkim Roads
                new RoadSegment("NH-10", "Sevoke - Gangtok Arterial Highway", "IN-SK-GTK", 27.2000, 88.5200, 27.3300, 88.6100, 32.0, 10, "CAUTION"),
                new RoadSegment("JN-Road", "Gangtok - Tsomgo Lake Hill Pass", "IN-SK-GTK", 27.3400, 88.6200, 27.3800, 88.7500, 26.0, 7, "PASSABLE")
        );

        roads.get(0).setBlockageCause("Multiple debris slips along cut slope km 34-38");
        roads.get(0).setAlternateRouteAdvisory("Light vehicles only via Mawryngkneng bypass");
        roads.get(0).setCurrentHazardScore(0.68);

        roads.get(1).setBlockageCause("Tension cracks of 15cm width developed across both lanes at Wahkhen ghat");
        roads.get(1).setAlternateRouteAdvisory("Heavy freight trucks diverted via Umkiang-Ratacherra");
        roads.get(1).setCurrentHazardScore(0.85);

        roads.get(3).setBlockageCause("Massive mudslide over 120 meters at Dihangi; track and road submerged");
        roads.get(3).setAlternateRouteAdvisory("All vehicular movement halted. NHIDCL earthmovers deployed.");
        roads.get(3).setCurrentHazardScore(0.96);

        roads.get(4).setBlockageCause("Bridge approach washed away by Flash debris flow near Migrendisa");
        roads.get(4).setAlternateRouteAdvisory("Strict road closure by District Administration Dima Hasao");
        roads.get(4).setCurrentHazardScore(0.98);

        roadSegmentRepository.saveAll(roads);
    }

    private void seedRiskGridCells() {
        List<RiskGridCell> cells = Arrays.asList(
                // East Khasi Hills Grids
                createGrid("cell-ekh-001", "IN-ML-EKH", 25.5780, 91.8930, 48.5, 135.0, 1520.0, 35.0, 2, 4, 0.84, "Very High", 0.88, "VERY_HIGH", "ALERT"),
                createGrid("cell-ekh-002", "IN-ML-EKH", 25.5620, 91.8810, 38.0, 180.0, 1460.0, 120.0, 2, 2, 0.68, "High", 0.74, "HIGH", "WARNING"),
                createGrid("cell-ekh-003", "IN-ML-EKH", 25.3020, 91.7250, 56.0, 160.0, 1380.0, 15.0, 4, 4, 0.91, "Very High", 0.93, "VERY_HIGH", "ALERT"),
                createGrid("cell-ekh-004", "IN-ML-EKH", 25.2950, 91.5850, 42.0, 190.0, 1420.0, 80.0, 2, 2, 0.72, "High", 0.79, "HIGH", "WARNING"),
                createGrid("cell-ekh-005", "IN-ML-EKH", 25.3120, 91.8900, 36.5, 140.0, 1250.0, 65.0, 2, 3, 0.65, "High", 0.71, "HIGH", "WARNING"),
                createGrid("cell-ekh-006", "IN-ML-EKH", 25.5900, 91.9100, 22.0, 45.0, 1580.0, 350.0, 1, 1, 0.28, "Low", 0.32, "LOW", "NORMAL"),
                createGrid("cell-ekh-007", "IN-ML-EKH", 25.5450, 91.8500, 29.0, 220.0, 1620.0, 220.0, 1, 2, 0.44, "Moderate", 0.49, "MODERATE", "WATCH"),

                // Dima Hasao Grids
                createGrid("cell-dh-001", "IN-AS-DH", 25.1700, 93.0200, 52.0, 175.0, 780.0, 20.0, 2, 4, 0.89, "Very High", 0.94, "VERY_HIGH", "ALERT"),
                createGrid("cell-dh-002", "IN-AS-DH", 25.1250, 93.0450, 54.5, 165.0, 690.0, 10.0, 4, 4, 0.93, "Very High", 0.97, "VERY_HIGH", "ALERT"),
                createGrid("cell-dh-003", "IN-AS-DH", 25.1080, 92.8700, 46.0, 195.0, 450.0, 18.0, 3, 4, 0.86, "Very High", 0.92, "VERY_HIGH", "ALERT"),
                createGrid("cell-dh-004", "IN-AS-DH", 25.2950, 93.1550, 35.0, 120.0, 610.0, 140.0, 2, 2, 0.62, "High", 0.70, "HIGH", "WARNING"),
                createGrid("cell-dh-005", "IN-AS-DH", 25.5100, 92.7900, 28.0, 80.0, 580.0, 280.0, 1, 2, 0.39, "Moderate", 0.46, "MODERATE", "WATCH"),

                // Gangtok Grids
                createGrid("cell-gtk-001", "IN-SK-GTK", 27.3520, 88.6200, 49.0, 150.0, 1750.0, 25.0, 3, 4, 0.85, "Very High", 0.89, "VERY_HIGH", "ALERT"),
                createGrid("cell-gtk-002", "IN-SK-GTK", 27.2900, 88.5900, 37.0, 210.0, 1120.0, 95.0, 2, 2, 0.66, "High", 0.73, "HIGH", "WARNING"),
                createGrid("cell-gtk-003", "IN-SK-GTK", 27.3200, 88.6050, 26.0, 30.0, 1680.0, 300.0, 1, 1, 0.31, "Moderate", 0.36, "MODERATE", "WATCH")
        );

        riskGridCellRepository.saveAll(cells);
    }

    private RiskGridCell createGrid(String id, String distId, double lat, double lon, double slope, double aspect, double elev, double roadDist, int lc, int lith, double staticScore, String staticClass, double compScore, String compLevel, String trigger) {
        RiskGridCell c = new RiskGridCell();
        c.setId(id);
        c.setDistrictId(distId);
        c.setLatitude(lat);
        c.setLongitude(lon);
        c.setSlopeAngleDeg(slope);
        c.setSlopeAspectDeg(aspect);
        c.setElevationM(elev);
        c.setDistToRoadCutM(roadDist);
        c.setLandCoverCode(lc);
        c.setLithologyClass(lith);
        c.setStaticScore(staticScore);
        c.setStaticClass(staticClass);
        c.setCompositeRiskScore(compScore);
        c.setCompositeRiskLevel(compLevel);
        c.setDynamicTriggerLevel(trigger);
        c.setRainfall1dMm(distId.contains("DH") ? 112.0 : (distId.contains("EKH") ? 78.5 : 45.0));
        c.setRainfall3dMm(distId.contains("DH") ? 320.0 : (distId.contains("EKH") ? 215.0 : 120.0));
        c.setRainfall7dMm(distId.contains("DH") ? 610.0 : (distId.contains("EKH") ? 440.0 : 250.0));
        c.setLastEvaluatedAt(LocalDateTime.now());
        return c;
    }

    private void seedMultilingualTemplates() {
        List<AlertTemplate> templates = Arrays.asList(
                // 1. English
                new AlertTemplate("LANDSLIDE_RED_ALERT", "en", "English", "Extreme",
                        "CRITICAL: Extreme Landslide Hazard Warning - Immediate Evacuation",
                        "Continuous heavy monsoon rainfall has critically saturated slope soil profiles. Landslide failure is imminent along steep road-cuts and valley flanks.",
                        "Evacuate immediately to designated relief shelters. Avoid mountain roads NH-6 and NH-27. Call 1077 / 112 for emergency rescue staging."),

                new AlertTemplate("LANDSLIDE_ORANGE_WARNING", "en", "English", "Severe",
                        "WARNING: High Landslide Susceptibility Alert",
                        "High antecedent rainfall levels detected. Slope creep and tension cracks reported in upper hill reaches.",
                        "Stay alert for sudden muddy stream flow, tilting trees, or road subsidence. Relocate elderly and children to safe masonry structures."),

                // 2. Hindi
                new AlertTemplate("LANDSLIDE_RED_ALERT", "hi", "हिन्दी (Hindi)", "Extreme",
                        "अत्यंत गंभीर: भूस्खलन का उच्च जोखिम - तुरंत सुरक्षित स्थान पर जाएं",
                        "लगातार भारी बारिश के कारण पहाड़ी ढलानों पर मिट्टी का कटाव और भूस्खलन की अत्यधिक संभावना है।",
                        "नागरिक तुरंत चिन्हित राहत शिविरों में जाएं। पहाड़ी मार्गों और राजमार्गों पर यात्रा तुरंत रोकें। आपातकालीन सहायता के लिए 1077 या 112 डायल करें।"),

                // 3. Assamese
                new AlertTemplate("LANDSLIDE_RED_ALERT", "as", "অসমীয়া (Assamese)", "Extreme",
                        "জৰুৰী সতৰ্কবাৰ্তা: প্ৰচণ্ড ভূমিস্খলনৰ আশংকা - তাৎক্ষণিকভাৱে সুৰক্ষিত স্থানলৈ যাওক",
                        "ধাৰাসাৰ বৰষুণৰ ফলত পাহাৰৰ ঢালবোৰত মাটি খহি পৰাৰ প্ৰবল সম্ভাৱনা দেখা দিছে। পাহাৰীয়া ৰাস্তাসমূহত যাতায়াত বিপদজনক হৈ পৰিছে।",
                        "তাত্ক্ষণিকভাৱে ওচৰৰ নিৰাপদ সাহায্য শিবিৰলৈ যাওক। পাহাৰৰ কাষৰ ৰাস্তা আৰু সুৰংগ এৰাই চলক। জৰুৰী সাহাৰ্যৰ বাবে ১০৭৭ নম্বৰত যোগাযোগ কৰক।"),

                // 4. Bodo
                new AlertTemplate("LANDSLIDE_RED_ALERT", "bodo", "बर' (Bodo)", "Extreme",
                        "गोख्रों सांग्रांथि: हाबां बाहाग्लिनायनि गिथावना खैफोद - थाबनो रैखाथि जायगायाव थां",
                        "अखाय अखा हाबाय थानायनि जाहोनाव हाजोनि हाबां बाहाग्लिनायनि गोख्रों खैफोद सोमजिखांदों।",
                        "गावनि नखरजों रैखाथि केंपसिम थाबनो थां। हाजो गाखोनाय लामाफोरावनो थाबायनाय थाद'। हेफाजाबनि थाखाय 1077 फन खालाम।"),

                // 5. Khasi
                new AlertTemplate("LANDSLIDE_RED_ALERT", "khasi", "Khasi (Ka Ktien Khasi)", "Extreme",
                        "JINGMAHAM BA JUR: Ka Jingkylla Khyndew Ba Khraw - Kynriah Noh Sha Ki Jakashngain",
                        "Namap ka slap ba jur kaba la lynsher jur, ka khyndew lum ka lah ban kyllon noh ha ki bynta ba shonglum bad ki surok bah.",
                        "Kynriah mardor sha ki jaka rieh ba la buh kyrpang. Ki bor pyniaid district ki kyntu ban ym leit jngoh sha surok lum. Phone 1077 ban ioh jingiarap."),

                // 6. Garo
                new AlertTemplate("LANDSLIDE_RED_ALERT", "garo", "Garo (A·chik)", "Extreme",
                        "MIKRAKANI GIMIN: A·bri Bil·chani Kenani - Bakbak Katbo",
                        "Mikka jimeniko man·ahani a·sel a·brirango a·bri chim·ongani ong·na amenga. Gadi rama re·ani kenani ong·a.",
                        "Jemangan kenchakani donggipa biaprango donga, bilsi gitchamgipa biapona katbo. Dakchakanina 1077-ko ring·bo."),

                // 7. Mizo
                new AlertTemplate("LANDSLIDE_RED_ALERT", "mizo", "Mizo (Mizo ṭawng)", "Extreme",
                        "FIMKHURNA THUCHUAH: Min Rawn Tlah Tur Hlauhawm - Inthiarfihlim Vat Rawh U",
                        "Ruahtui tlak nasat avangin tlangpang leh kawngsirte a min theihna dinhmun hlauhawmah a ding mek a ni.",
                        "Chhiatrupna thlen theihna hmun atangin insaseng vat ula, sorkar relief camp lam pan rawh u. Emergency atan 1077 be pawp rawh u."),

                // 8. Manipuri
                new AlertTemplate("LANDSLIDE_RED_ALERT", "manipuri", "মৈতৈলোন্ (Manipuri)", "Extreme",
                        "অকুপ্পা চেকশিনৱা: চীং মায়থুং চৎপগী অচৌবা খুদোংথিবা - য়ারিবমখৈ থুনা নিংথিংবা মফমদা চৎলু",
                        "নোং কন্না চুবাগী মরমদগী চীংগী চীংমাইশিং থুং চৎপগী অচৌবা খুদোংথিবা থোক্লক্লে। চীংগী লম্বীশিংদা চৎপদা অচৌবা অকায়বা লৈরে।",
                        "মীওইবশিংনা য়ারিবমখৈ থুনা রিলিফ কেম্পতা চৎলু। লম্বীদা মী পুবা থিংগনি। তেংবাংগীদমক্তা ১০৭৭ দা ফৌন তৌরো।"),

                // 9. Nagamese
                new AlertTemplate("LANDSLIDE_RED_ALERT", "nagamese", "Nagamese", "Extreme",
                        "DANGER KHOBOR: Pahad Mati Bhangibo Paare - Jaldi Bhal Jagate Jabi",
                        "Bisi borokha hoa karne pahad pora mati giribole ahe. Rastate gari cholaile bisi dangor bipod ahe.",
                        "Nijor ghor chari kene relief camp te jabi. Pahad rasta NH-29 logote ghuriye na-thakibi. Help lage koile 1077 dial koribi.")
        );

        alertTemplateRepository.saveAll(templates);
    }

    private void seedSampleReportsAndAlerts() {
        // Sample Incident Reports
        LandslideReport r1 = new LandslideReport();
        r1.setDistrictId("IN-AS-DH");
        r1.setLatitude(25.1220);
        r1.setLongitude(93.0420);
        r1.setLocationDescription("NH-54E Ghat near Jatinga Viewpoint");
        r1.setLandslideType("DEBRIS_FLOW");
        r1.setSeverity("SEVERE");
        r1.setDescription("Large mass of saturated clay and fractured shale collapsed across both highway lanes. Heavy boulders blocking stream culvert.");
        r1.setMediaUrl("https://images.unsplash.com/photo-1541888946425-d0fbb18f15f0?w=600");
        r1.setReporterName("Sub-Inspector D. Thaosen");
        r1.setReporterPhone("+91 94350 28192");
        r1.setReporterRole("FIELD_OFFICER");
        r1.setStatus("VERIFIED");
        r1.setVerifiedBy("district.admin@pahaarsaathi.ner.gov.in");
        r1.setRoadBlocked(true);
        r1.setTimestamp(LocalDateTime.now().minusHours(2));
        landslideReportRepository.save(r1);

        LandslideReport r2 = new LandslideReport();
        r2.setDistrictId("IN-ML-EKH");
        r2.setLatitude(25.3040);
        r2.setLongitude(91.7220);
        r2.setLocationDescription("Sohra Rim Hill Section km 12");
        r2.setLandslideType("TENSION_CRACK");
        r2.setSeverity("MODERATE");
        r2.setDescription("New continuous longitudinal crack observed spanning 40 meters along road verge above village houses.");
        r2.setMediaUrl("https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=600");
        r2.setReporterName("K. Nongrum (Resident)");
        r2.setReporterRole("CITIZEN");
        r2.setStatus("PENDING_VERIFICATION");
        r2.setRoadBlocked(false);
        r2.setTimestamp(LocalDateTime.now().minusMinutes(45));
        landslideReportRepository.save(r2);

        // Sample Live Alert
        Alert alert1 = new Alert();
        alert1.setIdentifier("CAP-2026-IN-NER-891023-412");
        alert1.setSender("PahaarSaathi Early Warning System");
        alert1.setSentAt(LocalDateTime.now().minusHours(1));
        alert1.setStatus("Actual");
        alert1.setMsgType("Alert");
        alert1.setScope("Public");
        alert1.setCategory("Geo");
        alert1.setEvent("Landslide Hazard Warning");
        alert1.setUrgency("Immediate");
        alert1.setSeverity("Severe");
        alert1.setCertainty("Observed");
        alert1.setHeadline("CRITICAL: Severe Landslide Hazard Triggered for Dima Hasao District");
        alert1.setDescription("Cumulative 3-day precipitation of 320mm has breached the regional stability threshold across Jatinga, Harangajao, and Haflong road-cut sectors.");
        alert1.setInstruction("Evacuate low-lying and toe settlement areas. Non-essential vehicular traffic on NH-27 suspended.");
        alert1.setDistrictId("IN-AS-DH");
        alert1.setAffectedAreaName("Dima Hasao (Haflong, Jatinga, Harangajao)");
        alert1.setLanguage("en");
        alert1.setDispatchedChannels("SMS,PUSH,IN_APP");
        alert1.setRecipientsCount(840);
        alert1.setCreatedBy("district.admin@pahaarsaathi.ner.gov.in");
        alert1.setCapXml(capXmlService.buildCapXml(alert1));
        alertRepository.save(alert1);
    }

    private void seedDefaultUsers() {
        User admin = new User(
                "district.admin@pahaarsaathi.ner.gov.in",
                "Dima Hasao Disaster Admin",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                Role.ROLE_DISTRICT_ADMIN,
                "en"
        );
        admin.setDistrictId("IN-AS-DH");
        admin.setPhoneNumber("+91 94350 11001");
        userRepository.save(admin);

        User officer = new User(
                "field.officer@pahaarsaathi.ner.gov.in",
                "Officer T. Sangma (SDRF)",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                Role.ROLE_FIELD_OFFICER,
                "en"
        );
        officer.setDistrictId("IN-ML-EKH");
        officer.setPhoneNumber("+91 94361 22002");
        userRepository.save(officer);

        User citizen = new User(
                "citizen.ner@gmail.com",
                "R. Khongwir (Citizen)",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                Role.ROLE_CITIZEN,
                "khasi"
        );
        citizen.setDistrictId("IN-ML-EKH");
        citizen.setPhoneNumber("+91 98620 33003");
        userRepository.save(citizen);
    }
}
