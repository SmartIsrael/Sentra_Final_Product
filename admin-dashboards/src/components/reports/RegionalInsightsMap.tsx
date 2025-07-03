
import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Rwanda province data
const rwandaProvinces: {
  name: string;
  center: [number, number];
  status: string;
  statusColor: string;
  details: {
    majorCrops: string;
    farmersRegistered: number;
    technicalOfficers: number;
    activeSensors: number;
  };
}[] = [
  {
    name: "Eastern Province (Iburasirazuba)",
    center: [30.7395, -1.8159] as [number, number],
    status: "Healthy",
    statusColor: "green",
    details: {
      majorCrops: "Maize, Beans, Bananas",
      farmersRegistered: 32450,
      technicalOfficers: 129,
      activeSensors: 218
    }
  },
  {
    name: "Western Province (Iburengerazuba)",
    center: [29.3665, -2.1169] as [number, number],
    status: "Caution",
    statusColor: "yellow",
    details: {
      majorCrops: "Tea, Coffee, Cassava",
      farmersRegistered: 28760,
      technicalOfficers: 98,
      activeSensors: 183
    }
  },
  {
    name: "Northern Province (Amajyaruguru)",
    center: [29.7246, -1.5134] as [number, number],
    status: "Healthy",
    statusColor: "green",
    details: {
      majorCrops: "Irish Potatoes, Wheat, Peas",
      farmersRegistered: 24390,
      technicalOfficers: 87,
      activeSensors: 156
    }
  },
  {
    name: "Southern Province (Amajyepfo)",
    center: [29.7456, -2.5979] as [number, number],
    status: "Caution",
    statusColor: "yellow",
    details: {
      majorCrops: "Coffee, Rice, Vegetables",
      farmersRegistered: 26870,
      technicalOfficers: 103,
      activeSensors: 192
    }
  },
  {
    name: "Kigali City (Umujyi wa Kigali)",
    center: [30.0587, -1.9441] as [number, number],
    status: "Healthy",
    statusColor: "green",
    details: {
      majorCrops: "Urban Agriculture, Vegetables",
      farmersRegistered: 9860,
      technicalOfficers: 45,
      activeSensors: 73
    }
  }
];

export const RegionalInsightsMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<typeof rwandaProvinces[0] | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const mapboxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;

  useEffect(() => {
    if (!mapboxApiKey || !mapContainer.current) return;
    
    // Initialize the map
    mapboxgl.accessToken = mapboxApiKey;
    
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [29.8739, -2.0277], // Center of Rwanda
      zoom: 7.5,
      pitchWithRotate: false,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl({
      visualizePitch: false,
    }), "top-right");

    // Disable terrain/3D for simplicity
    map.current.dragRotate.disable();
    map.current.touchZoomRotate.disableRotation();

    // Add markers for each province
    map.current.on("load", () => {
      // Clear any existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Add markers for each province
      rwandaProvinces.forEach((province) => {
        const statusColor = province.statusColor === "green" ? "#10b981" : "#eab308";
        
        // Create custom marker element
        const markerEl = document.createElement("div");
        markerEl.className = "province-marker";
        markerEl.innerHTML = `
          <div class="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-lg cursor-pointer">
            <div class="w-3 h-3 rounded-full" style="background-color: ${statusColor};"></div>
          </div>
        `;
        
        // Create marker
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat(province.center)
          .addTo(map.current as mapboxgl.Map);
          
        // Add click handler
        markerEl.addEventListener("click", () => {
          setSelectedProvince(province);
          
          // Fly to the province
          map.current?.flyTo({
            center: province.center,
            zoom: 8.5,
            duration: 1500,
          });
        });
        
        markersRef.current.push(marker);
      });
      
      // Add Rwanda outline
      try {
        map.current?.addSource("rwanda-outline", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [30.4699, -1.0567],
                  [30.8345, -1.6409],
                  [30.7592, -2.0494],
                  [30.4664, -2.4097],
                  [30.0707, -2.5738],
                  [29.5726, -2.8483],
                  [29.2187, -2.8162],
                  [29.0249, -2.3848],
                  [29.1175, -1.8983],
                  [29.4535, -1.3601],
                  [29.8227, -1.3033],
                  [30.4699, -1.0567]
                ]
              ]
            },
            properties: {}
          }
        });
        
        map.current?.addLayer({
          id: "rwanda-outline",
          type: "line",
          source: "rwanda-outline",
          paint: {
            "line-color": "#10b981",
            "line-width": 3
          }
        });
        
        map.current?.addLayer({
          id: "rwanda-fill",
          type: "fill",
          source: "rwanda-outline",
          paint: {
            "fill-color": "#10b981",
            "fill-opacity": 0.1
          }
        });
      } catch (error) {
        console.error("Error adding Rwanda outline:", error);
      }
    });

    // Cleanup function
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxApiKey]);

  const handleProvinceClick = (province: typeof rwandaProvinces[0]) => {
    setSelectedProvince(province);
    
    // Fly to province
    if (map.current) {
      map.current.flyTo({
        center: province.center,
        zoom: 8.5,
        duration: 1500,
      });
    }
  };

  return (
    <div className="h-full w-full relative bg-smartel-green-200/30 rounded-lg overflow-hidden border border-white/30">
      {!mapboxApiKey ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-medium">Rwanda Agricultural Insights Map</h3>
          <p className="text-muted-foreground mb-4">
            Mapbox API key is missing. Please ensure VITE_MAPBOX_API_KEY is set in your .env file.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            You can obtain a Mapbox access token from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>.
          </p>
        </div>
      ) : (
        <>
          <div ref={mapContainer} className="absolute inset-0" />

          {/* Rwanda provinces sidebar */}
          <div className="absolute top-4 left-4 z-10">
            <div className="glass-card border-white/30 p-2">
              <h4 className="font-medium mb-2 text-sm">Rwanda Provinces</h4>
              <div className="space-y-1 text-xs">
                {rwandaProvinces.map((province) => (
                  <div 
                    key={province.name}
                    className="flex items-center justify-between gap-2 p-1 rounded hover:bg-white/20 cursor-pointer transition-colors"
                    onClick={() => handleProvinceClick(province)}
                  >
                    <span>{province.name}</span>
                    <span className={`px-1.5 py-0.5 ${
                      province.statusColor === "green" ? "bg-green-500/20 text-green-700" :
                      "bg-yellow-500/20 text-yellow-700"
                    } rounded text-xs`}>
                      {province.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-4 right-4 z-10">
            <div className="glass-card border-white/30 p-2 text-sm">
              <div className="font-medium mb-2">Legend</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="block w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Healthy Crops</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="block w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span>Minor Issues</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="block w-3 h-3 bg-red-500 rounded-full"></span>
                  <span>Critical Conditions</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Selected province details */}
          {selectedProvince && (
            <div className="absolute top-4 right-4 z-10 max-w-xs">
              <div className="glass-card border-white/30 p-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">{selectedProvince.name}</h4>
                  <span className={`px-1.5 py-0.5 ${
                    selectedProvince.statusColor === "green" ? "bg-green-500/20 text-green-700" :
                    "bg-yellow-500/20 text-yellow-700"
                  } rounded text-xs`}>
                    {selectedProvince.status}
                  </span>
                </div>
                
                <div className="mt-2 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Major Crops:</span>
                    <span>{selectedProvince.details.majorCrops}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Farmers Registered:</span>
                    <span>{selectedProvince.details.farmersRegistered.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Technical Officers:</span>
                    <span>{selectedProvince.details.technicalOfficers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Sensors:</span>
                    <span>{selectedProvince.details.activeSensors}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
