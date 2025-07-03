import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FarmerLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  lat?: number;
  lon?: number;
}

const FarmerLocationModal: React.FC<FarmerLocationModalProps> = ({
  isOpen,
  onClose,
  address,
  lat,
  lon,
}) => {
  if (!isOpen) return null;

  const mapUrl =
    lat && lon
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01}%2C${lat - 0.01}%2C${lon + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lon}`
      : "";

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
        <h2 className="text-2xl font-semibold mb-4 text-gradient">Farmer Location</h2>
        <div className="mb-2">
          <strong>Address:</strong> {address || "N/A"}
        </div>
        {lat && lon ? (
          <iframe
            title="Farmer Location Map"
            width="100%"
            height="350"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={mapUrl}
            style={{ borderRadius: "8px" }}
          ></iframe>
        ) : (
          <div className="text-red-500">No coordinates available for this farmer.</div>
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

export default FarmerLocationModal;
