import { useState, useEffect, useCallback } from 'react';
import { FarmerReport } from '@/types';
import axios from 'axios';

export const useFarmerReports = () => {
  const [reports, setReports] = useState<FarmerReport[]>([]);

  const fetchReports = useCallback(async () => {
    try {
      const response = await axios.get('/api/reports/farmer-reports');
      // Always set to array, even if response is not an array
      setReports(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setReports([]); // Ensure reports is always an array on error
      console.error("Error fetching farmer reports:", error);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const addReport = useCallback(async (newReportData: Omit<FarmerReport, 'id' | 'date'>) => {
    try {
      // Assuming the backend handles report creation and ID generation
      await axios.post('/api/reports/farmer-reports', newReportData);
      fetchReports(); // Refresh reports after adding
    } catch (error) {
      console.error("Error adding farmer report:", error);
    }
  }, [fetchReports]);

  const updateReport = useCallback(async (reportId: string, updatedData: Partial<Omit<FarmerReport, 'id'>>) => {
    try {
      await axios.put(`/api/reports/farmer-reports/${reportId}`, updatedData);
      fetchReports(); // Refresh reports after updating
    } catch (error) {
      console.error("Error updating farmer report:", error);
    }
  }, [fetchReports]);

  const deleteReport = useCallback(async (reportId: string) => {
    try {
      await axios.delete(`/api/reports/farmer-reports/${reportId}`);
      fetchReports(); // Refresh reports after deleting
    } catch (error) {
      console.error("Error deleting farmer report:", error);
    }
  }, [fetchReports]);
  
  const getReportById = useCallback((reportId: string): FarmerReport | undefined => {
    return reports.find(report => report.id === reportId);
  }, [reports]);

  const getReportsByFarmerId = useCallback((farmerId: string): FarmerReport[] => {
    return reports.filter(report => report.farmerId === farmerId);
  }, [reports]);

  return {
    reports,
    addReport,
    updateReport,
    deleteReport,
    getReportById,
    getReportsByFarmerId,
    refreshReports: fetchReports,
  };
};
