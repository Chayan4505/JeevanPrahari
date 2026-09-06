import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  RiskHeatmapPoint,
  RoadSegment,
  Village,
  LandslideReport,
  District
} from '../../types';
import { Layers, Compass, Eye, ShieldAlert, AlertTriangle, Navigation, MapPin } from 'lucide-react';
import { MapLegend } from './MapLegend';

interface GISMapProps {
  heatmapPoints?: RiskHeatmapPoint[];
  roadSegments?: RoadSegment[];
  villages?: Village[];
  reports?: LandslideReport[];
  selectedDistrictId?: string;
  districts?: District[];
  onSelectDistrict?: (distId: string) => void;
}

export const GISMap: React.FC<GISMapProps> = ({
  heatmapPoints = [],
  roadSegments = [],
  villages = [],
  reports = [],
  selectedDistrictId = 'IN-ML-EKH',
  districts = [],
  onSelectDistrict,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [mapStyle, setMapStyle] = useState<'dark' | 'topo' | 'satellite'>('dark');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [showVillages, setShowVillages] = useState<boolean>(true);
  const [showReports, setShowReports] = useState<boolean>(true);
  const [inspectorData, setInspectorData] = useState<any | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [25.5788, 91.8933], // Default Shillong / Meghalaya
        zoom: 9,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      layersGroupRef.current = L.layerGroup().addTo(map);

      // Map Click Inspector
      map.on('click', (e: L.LeafletMouseEvent) => {
        const lat = Math.round(e.latlng.lat * 10000) / 10000;
        const lon = Math.round(e.latlng.lng * 10000) / 10000;
        const estSlope = Math.round(Math.random() * 35 + 20); // 20 - 55 deg
        const estElev = Math.round(Math.random() * 900 + 750); // 750 - 1650m
        const estScore = Math.min(1.0, Math.round(((estSlope / 55) * 0.75 + 0.15) * 100) / 100);
        const level = estScore > 0.75 ? 'VERY_HIGH' : (estScore > 0.55 ? 'HIGH' : (estScore > 0.30 ? 'MODERATE' : 'LOW'));

        setInspectorData({
          latitude: lat,
          longitude: lon,
          slopeAngleDeg: estSlope,
          elevationM: estElev,
          compositeRiskScore: estScore,
          compositeRiskLevel: level,
        });
      });
    }

    return () => {
      // Cleanup handled on unmount
    };
  }, []);

  // Update Base Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';

    if (mapStyle === 'topo') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap &copy; OpenTopoMap (SRTM DEM)';
    } else if (mapStyle === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri &copy; Sentinel-2 & ISRO';
    }

    L.tileLayer(tileUrl, {
      maxZoom: 18,
      attribution,
    }).addTo(map);
  }, [mapStyle]);

  // Center map on District change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (selectedDistrictId === 'IN-AS-DH') {
      map.flyTo([25.1833, 93.0167], 10, { duration: 1.2 });
    } else if (selectedDistrictId === 'IN-SK-GTK') {
      map.flyTo([27.3389, 88.6065], 11, { duration: 1.2 });
    } else if (selectedDistrictId === 'IN-MZ-CHM') {
      map.flyTo([23.4750, 93.3280], 10, { duration: 1.2 });
    } else if (selectedDistrictId === 'IN-NL-KHM') {
      map.flyTo([25.6701, 94.1077], 11, { duration: 1.2 });
    } else {
      map.flyTo([25.5788, 91.8933], 10, { duration: 1.2 });
    }
  }, [selectedDistrictId]);

  // Render Overlays (Heatmap, Roads, Villages, Reports)
  useEffect(() => {
    if (!layersGroupRef.current || !mapInstanceRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    // Helper: Convert lat/lon point to grid rectangle (approximately 5km x 5km cell)
    const createGridCell = (lat: number, lon: number) => {
      const cellSize = 0.05; // ~5km at this latitude (much larger!)
      return [
        [lat - cellSize, lon - cellSize],
        [lat + cellSize, lon - cellSize],
        [lat + cellSize, lon + cellSize],
        [lat - cellSize, lon + cellSize],
      ];
    };

    // 1. Hazard Heatmap - Continuous Heatmap Layer
    if (showHeatmap && heatmapPoints.length > 0) {
      try {
        // Format data for leaflet.heat: [lat, lng, intensity]
        const heatmapData = heatmapPoints.map((point) => {
          let intensity = 0.2;
          if (point.compositeRiskLevel === 'VERY_HIGH') intensity = 1.0;
          else if (point.compositeRiskLevel === 'HIGH') intensity = 0.75;
          else if (point.compositeRiskLevel === 'MODERATE') intensity = 0.5;
          
          return [point.latitude, point.longitude, intensity];
        });

        // Check if heatLayer is available
        if ((window as any).L?.heatLayer) {
          const heatLayer = (window as any).L.heatLayer(heatmapData, {
            radius: 50,
            blur: 35,
            maxZoom: 18,
            minOpacity: 0.3,
            gradient: {
              0.0: '#10b981',   // Green (Low)
              0.3: '#10b981',   // Green
              0.5: '#eab308',   // Yellow (Moderate)
              0.7: '#f97316',   // Orange (High)
              1.0: '#ef4444',   // Red (Very High)
            },
          });

          heatLayer.addTo(group);
        } else {
          // Fallback to circles if heatLayer not available
          heatmapPoints.forEach((point) => {
            let color = '#10b981'; // Green (Low)
            let radius = 3000;

            if (point.compositeRiskLevel === 'VERY_HIGH') {
              color = '#ef4444'; // Red
              radius = 5000;
            } else if (point.compositeRiskLevel === 'HIGH') {
              color = '#f97316'; // Orange
              radius = 4500;
            } else if (point.compositeRiskLevel === 'MODERATE') {
              color = '#eab308'; // Yellow
              radius = 4000;
            }

            const circle = L.circle([point.latitude, point.longitude], {
              color,
              fillColor: color,
              fillOpacity: 0.45,
              weight: 2,
              radius,
            });

            circle.bindPopup(`
              <div class="p-2 space-y-1 text-slate-100 text-xs">
                <div class="flex items-center justify-between gap-2 border-b border-slate-700 pb-1">
                  <span class="font-bold font-heading text-sm text-white">GIS Grid Cell: ${point.cellId}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold" style="background:${color}33; color:${color}">
                    ${point.compositeRiskLevel}
                  </span>
                </div>
                <p><strong>Composite Hazard Score:</strong> ${(point.compositeRiskScore * 100).toFixed(1)}%</p>
                <p><strong>Static Susceptibility:</strong> ${point.staticClass} (${(point.staticScore * 100).toFixed(1)}%)</p>
                <p><strong>Dynamic Trigger:</strong> ${point.dynamicTriggerLevel}</p>
                <p><strong>Slope Angle:</strong> ${point.slopeAngleDeg}° | <strong>Rainfall:</strong> ${point.rainfall1dMm} mm</p>
              </div>
            `);

            group.addLayer(circle);
          });
        }
      } catch (e) {
        console.warn('Heatmap error, using circles fallback:', e);
      }
    }

    // 2. Mountain Road Segments
    if (showRoads && roadSegments.length > 0) {
      roadSegments.forEach((road) => {

        const startLat = Number(road.startLat);
        const startLon = Number(road.startLon);
        const endLat = Number(road.endLat);
        const endLon = Number(road.endLon);

        // Prevent invalid road coordinates from crashing Leaflet
        if (
          !Number.isFinite(startLat) ||
          !Number.isFinite(startLon) ||
          !Number.isFinite(endLat) ||
          !Number.isFinite(endLon)
        ) {
          console.warn('Skipping road with invalid coordinates:', road);
          return;
        }

        let color = '#10b981';
        let weight = 4;
        let dashArray: string | undefined = undefined;

        if (road.status === 'BLOCKED') {
          color = '#dc2626';
          weight = 6;
          dashArray = '6, 6';
        } else if (road.status === 'CRITICAL') {
          color = '#ea580c';
          weight = 5;
        } else if (road.status === 'CAUTION') {
          color = '#f59e0b';
          weight = 4;
        }

        const polyline = L.polyline(
          [
            [startLat, startLon],
            [endLat, endLon],
          ],
          {
            color,
            weight,
            dashArray,
            opacity: 0.9,
          }
        );

        polyline.bindPopup(`
      <div class="p-2 space-y-1.5 text-slate-100 text-xs">
        <div class="flex items-center justify-between gap-2 border-b border-slate-700 pb-1">
          <span class="font-bold font-heading text-sm text-white">
            ${road.roadNumber} - ${road.segmentName}
          </span>

          <span
            class="px-2 py-0.5 rounded text-[10px] font-bold"
            style="background:${color}33; color:${color}"
          >
            ${road.status}
          </span>
        </div>

        <p>
          <strong>Length:</strong> ${road.lengthKm} km |
          <strong>Criticality Index:</strong> ${road.criticalityIndex}/10
        </p>

        ${road.blockageCause
            ? `<p class="text-red-300">
                <strong>Hazard Note:</strong> ${road.blockageCause}
              </p>`
            : ''
          }

        ${road.alternateRouteAdvisory
            ? `<p class="text-amber-300">
                <strong>Advisory:</strong> ${road.alternateRouteAdvisory}
              </p>`
            : ''
          }
      </div>
    `);

        group.addLayer(polyline);
      });
    }

    // 3. Settlement / Village Markers
    if (showVillages && villages.length > 0) {
      villages.forEach((village) => {
        const isVHigh = village.riskLevel === 'VERY_HIGH';
        const customIcon = L.divIcon({
          className: 'custom-village-icon',
          html: `<div style="background:${isVHigh ? '#dc2626' : '#2563eb'}; width:14px; height:14px; border-radius:50%; border:2px solid white; box-shadow:0 0 8px ${isVHigh ? '#ef4444' : '#3b82f6'};"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker([village.latitude, village.longitude], { icon: customIcon });

        marker.bindPopup(`
          <div class="p-2 space-y-1.5 text-slate-700 text-xs bg-white rounded">
            <div class="border-b border-slate-300 pb-1">
              <h4 class="font-bold font-heading text-sm text-slate-900">${village.name}</h4>
              <span class="text-[10px] text-slate-600 font-medium">Pop: ${village.population.toLocaleString()} • Vuln Index: ${village.vulnerabilityIndex}</span>
            </div>
            <p class="text-slate-700"><strong>Hazard Risk Level:</strong> <span class="font-bold text-${isVHigh ? 'red' : 'emerald'}-600">${village.riskLevel}</span></p>
            <p class="text-slate-700"><strong>Priority Evacuation Score:</strong> <span class="font-bold text-slate-900">${village.priorityScore.toFixed(0)}</span></p>
            <p class="text-slate-700"><strong>Nearest Shelter:</strong> <span class="text-slate-900">${village.nearestShelterName} (${village.nearestShelterDistKm} km)</span></p>
            ${village.evacuationRoute ? `<p class="text-emerald-700 text-[11px] font-medium"><strong>Route:</strong> ${village.evacuationRoute}</p>` : ''}
          </div>
        `);

        group.addLayer(marker);
      });
    }

    // 4. Incident Reports
    if (showReports && reports.length > 0) {
      reports.forEach((rep) => {
        const repIcon = L.divIcon({
          className: 'custom-rep-icon',
          html: `<div style="background:#f97316; width:16px; height:16px; border-radius:4px; transform:rotate(45deg); border:2px solid white; box-shadow:0 0 10px #f97316;"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([rep.latitude, rep.longitude], { icon: repIcon });

        marker.bindPopup(`
          <div class="p-2 space-y-2 text-slate-700 text-xs max-w-xs bg-white rounded">
            <div class="border-b border-slate-300 pb-1">
              <span class="text-[10px] uppercase tracking-wider font-bold text-orange-600">Incident: ${rep.landslideType.replace('_', ' ')}</span>
              <h4 class="font-bold text-slate-900">${rep.locationDescription}</h4>
            </div>
            <p class="text-slate-600 text-[11px]">${rep.description || 'No additional details.'}</p>
            ${rep.mediaUrl ? `<img src="${rep.mediaUrl}" alt="Landslide Site" class="w-full h-24 object-cover rounded-lg border border-slate-300" />` : ''}
            <div class="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-slate-300">
              <span class="text-slate-700">By: ${rep.reporterName} (${rep.reporterRole})</span>
              <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold">${rep.status}</span>
            </div>
          </div>
        `);

        group.addLayer(marker);
      });
    }
  }, [heatmapPoints, roadSegments, villages, reports, showHeatmap, showRoads, showVillages, showReports]);

  return (
    <div className="relative w-full h-full min-h-[550px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[550px] z-0" />

      {/* Top Left: Compact District Switcher & Layer Toggles */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 max-w-xs">

        {/* District Selector - Compact */}
        <div className="bg-white shadow-lg rounded-lg border border-gov-saffron-400 p-2 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gov-saffron-100 text-gov-saffron-700">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedDistrictId}
            onChange={(e) => onSelectDistrict && onSelectDistrict(e.target.value)}
            className="flex-1 bg-sky-50 text-slate-900 text-xs font-bold rounded-lg border border-sky-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id} className="bg-white text-slate-900">
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Layer Visibility & Tile Switchers - Compact */}
        <div className="bg-white shadow-lg rounded-lg border border-slate-300 p-2.5 space-y-2">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-bold text-slate-900 text-xs">Layers</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMapStyle('dark')}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${mapStyle === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                D
              </button>
              <button
                onClick={() => setMapStyle('topo')}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${mapStyle === 'topo' ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                T
              </button>
              <button
                onClick={() => setMapStyle('satellite')}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${mapStyle === 'satellite' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                S
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-1.5 space-y-1">
            <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="w-3.5 h-3.5 rounded border border-red-300 text-red-600 cursor-pointer"
              />
              <span className="font-semibold text-slate-900 text-xs flex-1">Heatmap</span>
              <div className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">Risk</div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={showRoads}
                onChange={(e) => setShowRoads(e.target.checked)}
                className="w-3.5 h-3.5 rounded border border-purple-300 text-purple-600 cursor-pointer"
              />
              <span className="font-semibold text-slate-900 text-xs flex-1">Roads</span>
              <div className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">Route</div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={showVillages}
                onChange={(e) => setShowVillages(e.target.checked)}
                className="w-3.5 h-3.5 rounded border border-cyan-300 text-cyan-600 cursor-pointer"
              />
              <span className="font-semibold text-slate-900 text-xs flex-1">Villages</span>
              <div className="px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 text-[10px] font-bold">Pop</div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={showReports}
                onChange={(e) => setShowReports(e.target.checked)}
                className="w-3.5 h-3.5 rounded border border-amber-300 text-amber-600 cursor-pointer"
              />
              <span className="font-semibold text-slate-900 text-xs flex-1">Reports</span>
              <div className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">Inc</div>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Left: Compact Interactive Map Inspector */}
      {inspectorData && (
        <div className="absolute bottom-3 left-3 z-10 max-w-xs bg-white rounded-lg shadow-lg animate-fade-in border-l-4 border-emerald-600 p-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              Inspector
            </span>
            <button
              onClick={() => setInspectorData(null)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            <div className="bg-slate-50 rounded p-1.5">
              <p className="text-slate-600 font-semibold text-[10px] mb-0.5">Coordinates</p>
              <p className="font-mono text-slate-900 font-bold text-[10px]">{inspectorData.latitude}°</p>
              <p className="font-mono text-slate-900 font-bold text-[10px]">{inspectorData.longitude}°</p>
            </div>
            <div className="bg-slate-50 rounded p-1.5">
              <p className="text-slate-600 font-semibold text-[10px] mb-0.5">Elevation & Slope</p>
              <p className="font-bold text-slate-900 text-[10px]">{inspectorData.elevationM}m</p>
              <p className="font-bold text-slate-900 text-[10px]">{inspectorData.slopeAngleDeg}°</p>
            </div>
            <div className="col-span-2 pt-1.5 flex items-center justify-between border-t border-slate-200">
              <span className="text-xs font-bold text-slate-900">Risk:</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${inspectorData.compositeRiskLevel === 'VERY_HIGH' ? 'bg-red-100 text-red-700' :
                inspectorData.compositeRiskLevel === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                  inspectorData.compositeRiskLevel === 'MODERATE' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                {inspectorData.compositeRiskLevel} ({(inspectorData.compositeRiskScore * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Right: GIS Legend */}
      <div className="absolute bottom-4 right-4 z-10 hidden sm:block max-w-xs">
        <MapLegend />
      </div>
    </div>
  );
};
