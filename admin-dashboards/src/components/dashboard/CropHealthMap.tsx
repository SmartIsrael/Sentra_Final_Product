import React, { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Example dynamic data for crop health
const cropLocations = [
  {
    id: 1,
    lat: -1.9577,
    lon: 30.1127,
    status: "healthy",
    label: "Farm A",
  },
  {
    id: 2,
    lat: -1.9500,
    lon: 30.0600,
    status: "warning",
    label: "Farm B",
  },
  {
    id: 3,
    lat: -1.9400,
    lon: 30.1000,
    status: "critical",
    label: "Farm C",
  },
  {
    id: 4,
    lat: -1.9650,
    lon: 30.1300,
    status: "healthy",
    label: "Farm D",
  },
  {
    id: 5,
    lat: -1.9300,
    lon: 30.0800,
    status: "warning",
    label: "Farm E",
  },
];

// Map status to color
const statusColor = {
  healthy: "#22c55e",
  warning: "#eab308",
  critical: "#ef4444",
};

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ""; // Place your Mapbox token in .env

const CropHealthMap = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Only initialize map once
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [30.1, -1.95],
        zoom: 12,
      });

      // Add navigation controls
      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add markers
      cropLocations.forEach((loc) => {
        const el = document.createElement("div");
        el.style.background = statusColor[loc.status as keyof typeof statusColor];
        el.style.width = "18px";
        el.style.height = "18px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid #fff";
        el.style.boxShadow = "0 0 4px rgba(0,0,0,0.2)";
        el.title = loc.label;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([loc.lon, loc.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="font-weight:bold">${loc.label}</div>
               <div>Status: <span style="color:${statusColor[loc.status as keyof typeof statusColor]}">${loc.status}</span></div>`
            )
          )
          .addTo(mapRef.current!);
      });
    }

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <MapPin className="h-5 w-5 text-smartel-green-500" />
          Crop Health Map
        </h3>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Healthy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Warning</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Critical</span>
          </div>
        </div>
      </div>

      <div className="relative bg-white/30 rounded-lg border border-white/30 h-[300px] flex items-center justify-center">
        <div
          ref={mapContainer}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "0.5rem",
            minHeight: 300,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />
        <p className="text-smartel-gray-500 text-sm italic absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
          Interactive map showing crop health status across monitored farms
        </p>
      </div>
    </div>
  );
};

export default CropHealthMap;
