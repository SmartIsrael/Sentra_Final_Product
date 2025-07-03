import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, ChevronDown, Search, X, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAlerts } from "@/hooks/useAlerts";
import { Alert, AlertSeverity, AlertStatus, AlertType } from "@/data/mockAlerts"; // Import additional types
import AlertDetailModal from "@/components/alerts/AlertDetailModal";

// Helper to format date (consistent with other components)
const formatDate = (dateString: string | undefined | null, options?: Intl.DateTimeFormatOptions): string => {
  if (!dateString) return 'N/A';
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  };
  return new Date(dateString).toLocaleString(undefined, options || defaultOptions);
};

// Determine status string based on alert properties
const getAlertStatusText = (status: AlertStatus): "New" | "Acknowledged" | "In Progress" | "Resolved" | "Closed" => {
  switch (status) {
    case "new": return "New";
    case "acknowledged": return "Acknowledged";
    case "in_progress": return "In Progress";
    case "resolved": return "Resolved";
    case "closed": return "Closed";
    default: return "New"; // Fallback
  }
};

const getSeverityColorClass = (severity: AlertSeverity) => {
  switch (severity) {
    case "critical":
    case "high":
      return "bg-red-100 text-red-700 border-red-300";
    case "medium":
      return "bg-amber-100 text-amber-700 border-amber-300";
    case "low":
      return "bg-blue-100 text-blue-700 border-blue-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const getStatusColorClass = (status: AlertStatus) => {
  switch (status) {
    case "new":
      return "bg-smartel-teal-100 text-smartel-teal-700 border-smartel-teal-300";
    case "acknowledged":
      return "bg-purple-100 text-purple-700 border-purple-300";
    case "in_progress":
      return "bg-yellow-100 text-yellow-700 border-yellow-300"; // Added for in_progress
    case "resolved":
    case "closed":
      return "bg-green-100 text-green-700 border-green-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const getTypeIcon = (alertType: AlertType) => { // Changed parameter name
  switch (alertType) {
    case "pest": return "🐛";
    case "weather": return "🌧️";
    case "crop_health": return "🌱";
    case "system": return "⚙️";
    default:
      return "❓"; 
  }
};

const AlertsPage = () => {
  const { alerts, acknowledgeAlert, resolveAlert, loading, error } = useAlerts(); // Added loading and error
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'active' | 'all'>('active'); 

  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 5;

  const processedAlerts = useMemo(() => {
    let processed = [...alerts];

    if (statusFilter === 'active') {
      processed = processed.filter(alert => 
        alert.status === 'new' || alert.status === 'acknowledged' || alert.status === 'in_progress'
      );
    }

    if (searchTerm) {
      processed = processed.filter(alert => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          alert.message.toLowerCase().includes(lowerSearchTerm) ||
          String(alert.id).toLowerCase().includes(lowerSearchTerm) ||
          (alert.farmer_id && String(alert.farmer_id).toLowerCase().includes(lowerSearchTerm)) ||
          (alert.device_id && String(alert.device_id).toLowerCase().includes(lowerSearchTerm)) ||
          alert.alert_type.toLowerCase().includes(lowerSearchTerm)
        );
      });
    }
    
    return processed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [alerts, searchTerm, statusFilter]);

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = processedAlerts.slice(indexOfFirstAlert, indexOfLastAlert);
  const totalPages = Math.ceil(processedAlerts.length / alertsPerPage);

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  const handleAcknowledge = (alertId: number) => {
    acknowledgeAlert(alertId);
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert(prev => prev ? { ...prev, status: 'acknowledged', acknowledged_at: new Date().toISOString() } : null);
    }
  };

  const handleResolve = (alertId: number) => {
    resolveAlert(alertId);
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert(prev => prev ? { ...prev, status: 'resolved', resolved_at: new Date().toISOString() } : null);
    }
  };
  
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Alerts</h1>
            <p className="mt-1 text-smartel-gray-500">
              Manage and respond to detected issues across all monitored farms.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/60 border-white/30">
              <Bell className="h-4 w-4 mr-2" />
              Subscribe (WIP)
            </Button>
            <Button variant="outline" className="bg-white/60 border-white/30">
              <Clock className="h-4 w-4 mr-2" />
              History (WIP)
            </Button>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-smartel-gray-500" />
              <input
                type="text"
                placeholder="Search alerts by message, ID, type..."
                className="pl-9 pr-4 py-2 w-full rounded-lg text-sm bg-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-smartel-green-400"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white/60 border-white/30 text-smartel-gray-700 px-3 py-1 flex items-center gap-2 cursor-pointer" onClick={() => console.log("Type filter clicked - WIP")}>
                Type: All <X className="h-3 w-3" />
              </Badge>
              <Badge 
                variant="outline" 
                className="bg-white/60 border-white/30 text-smartel-gray-700 px-3 py-1 flex items-center gap-2 cursor-pointer"
                onClick={() => {setStatusFilter(prev => prev === 'active' ? 'all' : 'active'); setCurrentPage(1);}}
              >
                Status: {statusFilter === 'active' ? 'Active' : 'All'} <X className="h-3 w-3" />
              </Badge>
              <Button variant="outline" className="bg-white/60 border-white/30 h-7 px-3">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading && <p className="text-center text-smartel-gray-500 py-8">Loading alerts...</p>}
          {error && <p className="text-center text-red-500 py-8">Error fetching alerts: {error}</p>}
          
          {!loading && !error && currentAlerts.length === 0 && (
            <p className="text-center text-smartel-gray-500 py-8">No alerts match your criteria.</p>
          )}

          {!loading && !error && currentAlerts.length > 0 && (
            <div className="space-y-4">
              {currentAlerts.map((alert) => {
                const statusText = getAlertStatusText(alert.status);
                return (
                  <div
                    key={alert.id}
                    className="p-4 rounded-lg bg-white/60 border border-white/30 hover:bg-white/80 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 sm:col-span-7">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-smartel-green-100 text-lg">
                            {getTypeIcon(alert.alert_type)}
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">{alert.message.substring(0, 60)}{alert.message.length > 60 ? '...' : ''}</h4>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColorClass(alert.severity)}`}>
                                {alert.severity} severity
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(alert.status)}`}>
                                {statusText}
                              </span>
                            </div>
                            <div className="text-sm text-smartel-gray-500">
                              {alert.details && typeof alert.details === 'object' && Object.keys(alert.details).length > 0 ? (
                                Object.entries(alert.details).map(([key, value]) => (
                                  <p key={key} className="truncate" title={`${key}: ${String(value)}`}>
                                    <span className="font-medium">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span> {String(value)}
                                  </p>
                                ))
                              ) : alert.details ? (
                                <p className="truncate" title={String(alert.details)}>Details: {String(alert.details)}</p>
                              ) : null}
                              {alert.farmer_id && <div>Farmer ID: {alert.farmer_id}</div>}
                              {alert.device_id && <div>Device ID: {alert.device_id}</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-12 sm:col-span-5">
                        <div className="h-full flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="text-xs text-smartel-gray-500">
                              Detected: {formatDate(alert.created_at)}
                            </div>
                            {alert.resolved_at && (
                              <div className="text-xs text-smartel-gray-500">
                                Resolved: {formatDate(alert.resolved_at)}
                              </div>
                            )}
                            {alert.acknowledged_at && !alert.resolved_at && (
                               <div className="text-xs text-smartel-gray-500">
                                Acknowledged: {formatDate(alert.acknowledged_at)}
                              </div>
                            )}
                            {(alert.status !== 'resolved' && alert.status !== 'closed') && (
                              <div className="pt-1">
                                <div className="flex justify-between items-center text-xs text-smartel-gray-500 mb-1">
                                  <span>Resolution progress</span>
                                  <span>{alert.status === "new" ? "0%" : alert.status === "acknowledged" ? "50%" : alert.status === "in_progress" ? "75%" : "100%"}</span>
                                </div>
                                <Progress value={alert.status === "new" ? 5 : alert.status === "acknowledged" ? 50 : alert.status === "in_progress" ? 75 : 100} className="h-1.5" />
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end gap-2 mt-3">
                            {alert.status === "new" && (
                              <Button size="sm" variant="outline" className="bg-white/60 border-white/30" onClick={() => handleAcknowledge(alert.id)}>
                                Acknowledge
                              </Button>
                            )}
                            {(alert.status === "acknowledged" || alert.status === "in_progress") && (
                              <Button size="sm" variant="default" className="bg-smartel-green-500 hover:bg-smartel-green-600" onClick={() => handleResolve(alert.id)}>
                                Resolve
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => handleViewDetails(alert)}>
                               View Details <ExternalLink className="h-3 w-3 ml-1.5"/>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-smartel-gray-500">
                Page {currentPage} of {totalPages} (Showing {currentAlerts.length} of {processedAlerts.length} alerts)
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-white/60 border-white/30" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-white/60 border-white/30" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <AlertDetailModal
        alert={selectedAlert}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAcknowledge={handleAcknowledge}
        onResolve={handleResolve}
      />
    </>
  );
};

export default AlertsPage;
