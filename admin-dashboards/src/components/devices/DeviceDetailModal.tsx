import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeviceLocationMap from "./DeviceLocationMap";
import { Device } from "@/types";

interface DeviceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  mapboxToken: string;
}

const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  isOpen,
  onClose,
  device,
  mapboxToken,
}) => {
  if (!isOpen || !device) return null;
  // Debug: log device object
  // eslint-disable-next-line
  console.log("DeviceDetailModal device:", device);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl relative glass-card border-white/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-gradient">Device Details</h2>
        <div className="mb-2">
          <strong>Device Name:</strong> {device.name}
        </div>
        <div className="mb-2">
          <strong>Serial Number:</strong> {device.serial_number || "N/A"}
        </div>
        <div className="mb-2">
          <strong>Status:</strong> {device.status}
        </div>
        <div className="mb-2">
          <strong>Farmer ID:</strong> {device.farmer_id}
        </div>
        <div className="mb-2">
          <strong>Battery:</strong> {device.battery}%
        </div>
        <div className="mb-2">
          <strong>Signal Strength:</strong> {device.signalStrength}%
        </div>
        <div className="mb-2">
          <strong>Location:</strong>{" "}
          {typeof device.location_lat === "number" && typeof device.location_lon === "number"
            ? `${Number(device.location_lat).toFixed(6)}, ${Number(device.location_lon).toFixed(6)}`
            : "N/A"}
        </div>
        {device.location_lat && device.location_lon && !isNaN(Number(device.location_lat)) && !isNaN(Number(device.location_lon)) && (
          <DeviceLocationMap
            lat={Number(device.location_lat)}
            lon={Number(device.location_lon)}
            mapboxToken={mapboxToken}
            readOnly={true}
          />
        )}
        <div className="flex justify-end pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailModal;
