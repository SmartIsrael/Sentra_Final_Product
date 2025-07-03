import React, { useState, useMemo } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertType, AlertSeverity } from "@/data/mockAlerts"; // Import AlertType and AlertSeverity
import AlertDetailModal from "@/components/alerts/AlertDetailModal";
import { useAlerts } from "@/hooks/useAlerts"; // Keep for acknowledge/resolve actions

// Helper function to format date (can be moved to a utils file later)
const formatDateDistance = (dateString: string): string => {
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

const getSeverityColor = (severity: Alert["severity"]) => {
  switch (severity) {
    case "high":
    case "critical": // Added critical to match Alert interface
      return "bg-red-100 text-red-700 border-red-300";
    case "medium":
      return "bg-amber-100 text-amber-700 border-amber-300";
    case "low":
      return "bg-blue-100 text-blue-700 border-blue-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const getTypeIcon = (alertType: AlertType) => { // Changed parameter name
  switch (alertType) {
    case "pest":
      return "🐛";
    case "weather":
      return "🌧️";
    case "crop_health":
      return "🌱";
    case "system":
      return "⚙️";
    default:
      // const _exhaustiveCheck: never = alertType; // This will error if alertType is 'string'
      return "❓";
  }
};

interface AlertsOverviewProps {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
}

const AlertsOverview: React.FC<AlertsOverviewProps> = ({ alerts: displayedAlerts, loading, error }) => {
  // acknowledgeAlert and resolveAlert still come from useAlerts hook for actions
  const { acknowledgeAlert, resolveAlert } = useAlerts(); 
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // The `alerts` prop (aliased to displayedAlerts) is already sorted and sliced by Dashboard.tsx
  // No need for further sorting/slicing here if Dashboard.tsx handles it.

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  const handleAcknowledgeAlert = (alertId: number) => { // Changed to number
    acknowledgeAlert(alertId);
    if (selectedAlert && selectedAlert.id === alertId) {
      // Optimistically update status for the modal
      setSelectedAlert(prev => prev ? { ...prev, status: 'acknowledged', acknowledged_at: new Date().toISOString() } : null);
    }
  };

  const handleResolveAlert = (alertId: number) => { // Changed to number
    resolveAlert(alertId);
    if (selectedAlert && selectedAlert.id === alertId) {
      // Optimistically update status for the modal
      setSelectedAlert(prev => prev ? { ...prev, status: 'resolved', resolved_at: new Date().toISOString() } : null);
    }
    // The `displayedAlerts` list (passed as prop) will update when Dashboard.tsx re-renders.
    // If the modal is open and shows this alert, it should reflect the new `isActive: false` status.
    // If the alert is resolved, it will naturally disappear from the `displayedAlerts` list.
    // We might want to close the modal if the alert is resolved and no longer in displayedAlerts.
    // For now, let the modal handle its visibility. If it's still the selectedAlert, it will show its updated state.
    // If it's resolved, the "Resolve" button in modal should become disabled.
  };

  return (
    <>
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-smartel-green-500" />
            <h3 className="text-lg font-medium">Recent Alerts</h3>
          </div>
          <Button variant="outline" size="sm" className="text-xs bg-white/50 border-white/30">
            View All Alerts
          </Button>
        </div>

        <div className="space-y-4">
          {loading && <p className="text-sm text-smartel-gray-500">Loading alerts...</p>}
          {error && <p className="text-sm text-red-500">Error: {error}</p>}
          {!loading && !error && displayedAlerts.length === 0 && (
            <p className="text-sm text-smartel-gray-500">No recent active alerts.</p>
          )}
          {!loading && !error && displayedAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-4 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors border border-white/30 cursor-pointer"
              onClick={() => handleAlertClick(alert)}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-smartel-green-100">
                <span className="text-lg">{getTypeIcon(alert.alert_type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-smartel-gray-800 truncate" title={alert.message}>{alert.message.substring(0,35)}{alert.message.length > 35 ? "..." : ""}</h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-smartel-gray-500 truncate" title={alert.details ? JSON.stringify(alert.details) : alert.message}>
                    {alert.farmer_id ? `Farmer: ${alert.farmer_id}` : (alert.device_id ? `Device: ${alert.device_id}` : 'General Alert')}
                  </p>
                  <p className="text-xs text-smartel-gray-400">{formatDateDistance(alert.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AlertDetailModal
        alert={selectedAlert}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAcknowledge={handleAcknowledgeAlert}
        onResolve={handleResolveAlert}
      />
    </>
  );
};

export default AlertsOverview;
