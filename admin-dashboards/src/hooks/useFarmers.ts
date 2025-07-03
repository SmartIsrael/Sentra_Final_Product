import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types'; // Assuming User type is defined here

const USERS_API_BASE_URL = import.meta.env.VITE_USERS_API_BASE_URL;

interface Farmer extends User {
  // Add any farmer-specific properties if they differ from the base User type
  // For now, we assume Farmer is a User with role 'farmer'
}

export const useFarmers = () => {
  const { token, logout } = useAuth();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFarmers = useCallback(async () => {
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${USERS_API_BASE_URL}/users?role=farmer`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch farmers and parse error' }));
        // If token expired, log out
        if (response.status === 401 && errorData.message && errorData.message.toLowerCase().includes('token has expired')) {
          logout();
        }
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      }
      const data: Farmer[] = await response.json();
      setFarmers(data);
    } catch (err) {
      console.error("Failed to fetch farmers:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching farmers.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  // Type for data needed to add a farmer (plain password)
  type AddFarmerData = Omit<Farmer, 'id' | 'created_at' | 'password_hash'> & { password?: string };

  const addFarmer = async (farmerData: AddFarmerData) => {
    if (!token) {
      setError("Authentication token not found.");
      return null;
    }
    setLoading(true);
    try {
      // Prepare payload for backend
      const payload = {
        name: farmerData.name,
        phone_number: farmerData.phone_number,
        password: farmerData.password,
        role: 'farmer',
        location_address: farmerData.location_address,
        location_lat: farmerData.location_lat,
        location_lon: farmerData.location_lon,
      };

      const response = await fetch(`${USERS_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to add farmer and parse error' }));
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      }
      const newFarmer = await response.json();
      if (newFarmer.user) {
        setFarmers(prev => [...prev, newFarmer.user]);
        return newFarmer.user;
      } else {
        fetchFarmers();
        return null;
      }
    } catch (err) {
      console.error("Failed to add farmer:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while adding farmer.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // TODO: Implement updateFarmer and deleteFarmer if needed

  // Helper to get a farmer by ID
  const getFarmerById = (id: string | number) => {
    return farmers.find(farmer => String(farmer.id) === String(id));
  };

  return { farmers, loading, error, fetchFarmers, addFarmer, getFarmerById };
};
