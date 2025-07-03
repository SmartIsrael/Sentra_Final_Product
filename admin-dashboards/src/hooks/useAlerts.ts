import { useState, useEffect, useCallback } from 'react';
import { Alert, AlertSeverity, AlertType, AlertStatus } from '@/data/mockAlerts';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const API_BASE_URL = import.meta.env.VITE_ALERTS_API_BASE_URL;

// Custom hook for managing alerts
export const useAlerts = () => {
  const { token, logout } = useAuth(); // Get token from AuthContext
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {}
        // If token expired, log out
        if (
          response.status === 401 &&
          errorData.message &&
          errorData.message.toLowerCase().includes('token has expired')
        ) {
          logout();
        }
        if (response.status === 401 || response.status === 403) setError("Unauthorized or Forbidden.");
        else throw new Error(`HTTP error! status: ${response.status}`);
        setAlerts([]); // Ensure alerts is always an array
        return;
      }
      const data: Alert[] = await response.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setAlerts([]); // Ensure alerts is always an array on error
      console.error("Failed to fetch alerts:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const acknowledgeAlert = useCallback(async (alertId: number) => { // Changed alertId to number
    setError(null);
    if (!token) {
      setError("No authentication token found.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${alertId}`, { // Changed path
        method: 'PUT', // Changed method to PUT
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'acknowledged' as AlertStatus }) // Set status
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) setError("Unauthorized or Forbidden.");
        else throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedAlert: Alert = await response.json();
      setAlerts(prevAlerts =>
        prevAlerts.map(alert => (alert.id === alertId ? updatedAlert : alert))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      console.error("Failed to acknowledge alert:", e);
    }
  }, []);

  const resolveAlert = useCallback(async (alertId: number) => { // Changed alertId to number
    setError(null);
    if (!token) {
      setError("No authentication token found.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${alertId}`, { // Changed path
        method: 'PUT', // Changed method to PUT
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'resolved' as AlertStatus }) // Set status
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) setError("Unauthorized or Forbidden.");
        else throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedAlert: Alert = await response.json();
      setAlerts(prevAlerts =>
        prevAlerts.map(alert => (alert.id === alertId ? updatedAlert : alert))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      console.error("Failed to resolve alert:", e);
    }
  }, []);
  
  // Define a type for the data needed to create an alert, matching backend expectations
  type NewAlertData = {
    alert_type: AlertType;
    severity: AlertSeverity;
    message: string;
    details?: any;
    farmer_id?: number;
    device_id?: number;
    farm_id?: number;
    field_id?: number;
  };

  const addAlert = useCallback(async (newAlertData: NewAlertData) => {
    setError(null);
    if (!token) {
      setError("No authentication token found.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newAlertData),
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) setError("Unauthorized or Forbidden.");
        else throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdAlert: Alert = await response.json();
      setAlerts(prevAlerts => [createdAlert, ...prevAlerts]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      console.error("Failed to add alert:", e);
    }
  }, []);

  // refreshAlerts is now fetchAlerts
  // resetAlertsToMock can be removed or adapted if mock data is still needed for testing

  return {
    alerts,
    // Derive activeAlerts based on status. Adjust as needed.
    activeAlerts: alerts.filter(alert => 
      alert.status === 'new' || alert.status === 'acknowledged' || alert.status === 'in_progress'
    ),
    loading,
    error,
    acknowledgeAlert,
    resolveAlert,
    addAlert,
    refreshAlerts: fetchAlerts, // Renamed for clarity
  };
};
