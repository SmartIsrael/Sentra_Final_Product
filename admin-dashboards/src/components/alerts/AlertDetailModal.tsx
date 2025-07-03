import React from "react";
import { Alert } from "@/data/mockAlerts"; // Assuming Alert interface is here
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AlertDetailModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge?: (alertId: number) => void; // Changed to number
  onResolve?: (alertId: number) => void;    // Changed to number
}

const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  isOpen,
  onClose,
  onAcknowledge,
  onResolve,
}) => {
  if (!isOpen || !alert) {
    return null;
  }

  // Helper to format severity for display
  const formatSeverity = (severity: Alert["severity"]) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  // Helper to format type for display
  const formatType = (alertType: Alert["alert_type"]) => { // Changed parameter name
    return alertType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const getStatusText = (status: Alert["status"]): string => {
    switch (status) {
      case "new": return "New";
      case "acknowledged": return "Acknowledged";
      case "in_progress": return "In Progress";
      case "resolved": return "Resolved";
      case "closed": return "Closed";
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative glass-card border-white/30">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gradient">{alert.message.substring(0,60)}{alert.message.length > 60 ? "..." : ""}</h2>

        <div className="space-y-3 text-sm mb-6">
          <p><strong>ID:</strong> {alert.id}</p>
          <p><strong>Type:</strong> {formatType(alert.alert_type)}</p>
          <p><strong>Severity:</strong> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            alert.severity === "high" || alert.severity === "critical" ? "bg-red-100 text-red-700" :
            alert.severity === "medium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
          }`}>{formatSeverity(alert.severity)}</span></p>
          <p><strong>Detected:</strong> {new Date(alert.created_at).toLocaleString()}</p>
          <p><strong>Message:</strong> {alert.message}</p>
          {alert.details && typeof alert.details === 'object' && Object.keys(alert.details).length > 0 ? (
            Object.entries(alert.details).map(([key, value]) => (
              <p key={key}><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {String(value)}</p>
            ))
          ) : alert.details ? (
            <p><strong>Details:</strong> {String(alert.details)}</p>
          ) : null}
          {alert.farmer_id && <p><strong>Farmer ID:</strong> {alert.farmer_id}</p>}
          {alert.device_id && <p><strong>Device ID:</strong> {alert.device_id}</p>}
          <p><strong>Status:</strong> {getStatusText(alert.status)}</p>
          {alert.acknowledged_at && (
            <p><strong>Acknowledged:</strong> {new Date(alert.acknowledged_at).toLocaleString()}</p>
          )}
           {alert.resolved_at && (
            <p><strong>Resolved:</strong> {new Date(alert.resolved_at).toLocaleString()}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          {alert.status === "new" && onAcknowledge && (
            <Button variant="outline" onClick={() => onAcknowledge(alert.id)}>
              Acknowledge
            </Button>
          )}
          {(alert.status === "acknowledged" || alert.status === "in_progress") && onResolve && (
            <Button onClick={() => onResolve(alert.id)}>
              Resolve
            </Button>
          )}
          {(alert.status === "resolved" || alert.status === "closed") && (
             <p className="text-sm text-gray-600">This alert is {alert.status}.</p>
          )}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailModal;
