import { useState, useEffect, useCallback } from 'react';
import { FieldVisit, mockFieldVisits as initialMockVisits } from '@/data/mockFieldVisits';

const VISITS_STORAGE_KEY = 'smartelDashboardFieldVisits';

const getStoredFieldVisits = (): FieldVisit[] => {
  const stored = localStorage.getItem(VISITS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const initialVisits = JSON.parse(JSON.stringify(initialMockVisits));
  localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(initialVisits));
  return initialVisits;
};

export const useFieldVisits = () => {
  const [visits, setVisits] = useState<FieldVisit[]>(getStoredFieldVisits());

  useEffect(() => {
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(visits));
  }, [visits]);

  const refreshVisits = useCallback(() => {
    setVisits(getStoredFieldVisits());
  }, []);

  const addVisit = useCallback((newVisitData: Omit<FieldVisit, 'id'>) => {
    setVisits(prevVisits => {
      const newVisit: FieldVisit = {
        ...newVisitData,
        id: `visit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      // Keep sorted by scheduledDate
      return [...prevVisits, newVisit].sort((a,b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
    });
  }, []);

  const updateVisit = useCallback((visitId: string, updatedData: Partial<Omit<FieldVisit, 'id'>>) => {
    setVisits(prevVisits =>
      prevVisits.map(visit =>
        visit.id === visitId ? { ...visit, ...updatedData } : visit
      ).sort((a,b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    );
  }, []);

  const deleteVisit = useCallback((visitId: string) => {
    setVisits(prevVisits => prevVisits.filter(visit => visit.id !== visitId));
  }, []);
  
  const getVisitById = useCallback((visitId: string): FieldVisit | undefined => {
    return visits.find(visit => visit.id === visitId);
  }, [visits]);

  const getVisitsByFarmerId = useCallback((farmerId: string): FieldVisit[] => {
    return visits.filter(visit => visit.farmerId === farmerId)
                 .sort((a,b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }, [visits]);

  // Function to reset to initial mock data (for testing/dev)
  const resetVisitsToMock = useCallback(() => {
    const initialData = JSON.parse(JSON.stringify(initialMockVisits));
    setVisits(initialData);
  }, []);

  return {
    visits: visits.sort((a,b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()), // Always return sorted
    addVisit,
    updateVisit,
    deleteVisit,
    getVisitById,
    getVisitsByFarmerId,
    refreshVisits,
    resetVisitsToMock,
  };
};
