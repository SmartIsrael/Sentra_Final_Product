
import React from "react";
import { CircleOff, Wifi, HardDrive } from "lucide-react"; // Added HardDrive for generic device
import { Progress } from "@/components/ui/progress";
import { Device } from "@/types"; // Use Device type from @/types
import { useDevices } from "@/hooks/useDevices"; // Import the hook

// Helper function to format date (can be moved to a utils file later)
const formatDateDistance = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const getDeviceStatusColor = (status: Device["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "error":
      return "bg-red-100 text-red-800";
    case "maintenance":
      return "bg-amber-100 text-amber-800";
    case "decommissioned":
      return "bg-slate-100 text-slate-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};


const DeviceStatus = () => {
  const { devices, loading, error } = useDevices();

  // For dashboard overview, maybe show a few or summary
  const displayedDevices = devices.slice(0, 5); // Show top 5 for overview

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <HardDrive className="h-5 w-5 text-smartel-green-500" />
        <h3 className="text-lg font-medium">Device Status Overview</h3>
      </div>

      {loading && <p className="text-sm text-smartel-gray-500">Loading devices...</p>}
      {error && <p className="text-sm text-red-500">Error: {error}</p>}
      
      {!loading && !error && displayedDevices.length === 0 && (
        <p className="text-sm text-smartel-gray-500">No devices to display.</p>
      )}

      {!loading && !error && displayedDevices.length > 0 && (
        <div className="space-y-4">
          {displayedDevices.map((device) => (
            <div 
              key={device.id} 
              className="p-3 rounded-lg bg-white/50 border border-white/30"
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium text-sm">{device.serial_number || device.device_type} (ID: {device.id})</h4>
                <div 
                  className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getDeviceStatusColor(device.status)}`}
                >
                  {device.status === "active" ? (
                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                  ) : device.status === "inactive" || device.status === "decommissioned" ? (
                    <CircleOff className="w-3 h-3" />
                  ) : ( // error, maintenance
                    <div className="w-2 h-2 rounded-full bg-amber-600"></div> 
                  )}
                  <span>{device.status.replace('_', ' ')}</span>
                </div>
              </div>
              <p className="text-xs text-smartel-gray-500 mb-1">
                Type: {device.device_type} {device.model && `(${device.model})`}
              </p>
              {/* Battery and Signal Strength removed as they are not in the Device type */}
              <div className="text-right text-xs text-smartel-gray-400">
                Last seen: {formatDateDistance(device.last_seen_at)}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* TODO: Add a "View All Devices" button linking to /devices page */}
    </div>
  );
};

export default DeviceStatus;
