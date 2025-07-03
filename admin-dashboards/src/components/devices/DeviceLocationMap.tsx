import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

interface DeviceLocationMapProps {
  lat: number | null;
  lon: number | null;
  onChange?: (lat: number, lon: number) => void;
  mapboxToken: string;
  readOnly?: boolean;
}

const DeviceLocationMap: React.FC<DeviceLocationMapProps> = ({
  lat,
  lon,
  onChange,
  mapboxToken,
  readOnly = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    mapboxgl.accessToken = mapboxToken;

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lon || 30.0, lat || -1.95],
        zoom: 12,
      });

      if (!readOnly && onChange) {
        mapRef.current.on("click", (e) => {
          const { lng, lat } = e.lngLat;
          if (markerRef.current) {
            markerRef.current.setLngLat([lng, lat]);
          } else {
            markerRef.current = new mapboxgl.Marker({ draggable: true })
              .setLngLat([lng, lat])
              .addTo(mapRef.current!);
            markerRef.current.on("dragend", () => {
              const lngLat = markerRef.current!.getLngLat();
              onChange(lngLat.lat, lngLat.lng);
            });
          }
          onChange(lat, lng);
        });
      }
    }

    // Set marker if lat/lon provided
    if (lat && lon && mapRef.current) {
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({ draggable: !readOnly })
          .setLngLat([lon, lat])
          .addTo(mapRef.current);
        if (!readOnly && onChange) {
          markerRef.current.on("dragend", () => {
            const lngLat = markerRef.current!.getLngLat();
            onChange(lngLat.lat, lngLat.lng);
          });
        }
      } else {
        markerRef.current.setLngLat([lon, lat]);
      }
      mapRef.current.setCenter([lon, lat]);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line
  }, [mapboxToken]);

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "300px", borderRadius: "8px" }} />
      <p className="text-xs text-gray-500 mt-2">
        Click on the map to set the device location. Drag the marker to adjust.
      </p>
    </div>
  );
};

export default DeviceLocationMap;
