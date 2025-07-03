import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Device } from '@/types'; // Import the Device type

const DEVICES_API_BASE_URL = import.meta.env.VITE_DEVICES_API_BASE_URL; // e.g., http://localhost:3002/api

export const useDevices = () => {
  const { token, logout } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${DEVICES_API_BASE_URL}/devices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch devices and parse error' }));
        // If token expired, log out
        if (response.status === 401 && errorData.message && errorData.message.toLowerCase().includes('token has expired')) {
          logout();
        }
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      }
      const data: Device[] = await response.json();
      setDevices(data);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching devices.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (DEVICES_API_BASE_URL) { // Ensure base URL is loaded
        fetchDevices();
    } else {
        setError("Device service API base URL is not configured.");
        setLoading(false);
    }
  }, [fetchDevices]);

  // Placeholder for addDevice function
  // Type for data needed to add a device, omitting auto-generated fields
  type AddDeviceData = Omit<Device, 'id' | 'registered_at' | 'last_seen_at'>; 

  const addDevice = async (deviceData: AddDeviceData) => {
    if (!token) {
      setError("Authentication token not found.");
      return null;
    }
    setLoading(true);
    try {
      // Map frontend camelCase to backend snake_case
      const payload: any = {
        ...deviceData,
        device_type: "SentraBot",
      };

      const response = await fetch(`${DEVICES_API_BASE_URL}/devices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to add device and parse error' }));
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      }
      const newDevice: Device = await response.json();
      setDevices(prev => [...prev, newDevice]);
      return newDevice;
    } catch (err) {
      console.error("Failed to add device:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while adding device.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // TODO: Implement updateDevice if needed

  const deleteDevice = async (deviceId: number) => {
    if (!token) {
      setError("Authentication token not found.");
      return false;
    }
    setLoading(true);
    try {
      const url = `${DEVICES_API_BASE_URL}/devices/${deviceId}`;
      console.log("DELETE request to:", url);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log("DELETE response status:", response.status);
      let responseBody = null;
      try {
        responseBody = await response.json();
        console.log("DELETE response body:", responseBody);
      } catch (e) {
        console.log("DELETE response body could not be parsed as JSON.");
      }
      if (!response.ok) {
        // If 404, remove from UI anyway
        if (response.status === 404) {
          setDevices(prev => prev.filter(device => device.id !== deviceId));
          return true;
        }
        throw new Error((responseBody && responseBody.message) || `HTTP error ${response.status}`);
      }
      setDevices(prev => prev.filter(device => device.id !== deviceId));
      return true;
    } catch (err) {
      console.error("Failed to delete device:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while deleting device.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { devices, loading, error, fetchDevices, addDevice, deleteDevice };
};
