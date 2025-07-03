import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar as CalendarIcon, User, Plus, Edit3, Trash2 } from "lucide-react";
import { useFieldVisits } from "@/hooks/useFieldVisits";
import { useFarmers } from "@/hooks/useFarmers"; // Import useFarmers
import { FieldVisit } from "@/data/mockFieldVisits";
import FieldVisitFormModal from "./FieldVisitFormModal"; 
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";

// Helper to format date and time
const formatVisitDateTime = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusColorClass = (status: FieldVisit["status"]) => {
  switch (status) {
    case "Scheduled": return "bg-blue-100 text-blue-700";
    case "In Progress": return "bg-yellow-100 text-yellow-700";
    case "Completed": return "bg-green-100 text-green-700";
    case "Cancelled": return "bg-red-100 text-red-700";
    case "Postponed": return "bg-orange-100 text-orange-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export const FieldVisitScheduler = () => {
  const { visits, addVisit, updateVisit, deleteVisit } = useFieldVisits();
  const { farmers, getFarmerById } = useFarmers(); // Get all farmers for the modal
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<FieldVisit | null>(null);
  const [visitToDelete, setVisitToDelete] = useState<FieldVisit | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const visitsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return visits.filter(visit => {
      const visitDate = new Date(visit.scheduledDate);
      return (
        visitDate.getFullYear() === selectedDate.getFullYear() &&
        visitDate.getMonth() === selectedDate.getMonth() &&
        visitDate.getDate() === selectedDate.getDate()
      );
    }).sort((a,b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }, [visits, selectedDate]);

  const handleOpenModal = (visit: FieldVisit | null) => {
    setEditingVisit(visit);
    setIsModalOpen(true);
  };
  
  const handleSaveVisit = (visitData: Omit<FieldVisit, 'id'> | FieldVisit) => {
    if ('id' in visitData && visitData.id) { // Editing
      // The modal passes the full visit object for edits
      // The hook expects Partial<Omit<FieldVisit, 'id'>>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...updateData } = visitData;
      updateVisit(id, updateData);
    } else { // Adding
      addVisit(visitData as Omit<FieldVisit, 'id'>);
    }
    setIsModalOpen(false);
    setEditingVisit(null);
  };

  const handleDeleteVisitClick = (visit: FieldVisit) => {
    setVisitToDelete(visit);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeleteVisit = () => {
    if (visitToDelete) {
      deleteVisit(visitToDelete.id);
    }
    setIsConfirmDialogOpen(false);
    setVisitToDelete(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-white/30 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Select Date</h3>
              <Button size="sm" variant="ghost" onClick={() => setSelectedDate(new Date())}>Today</Button>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="border border-white/20 rounded-md bg-white/10"
            />
            <div className="mt-4">
              <Button className="w-full gap-2 bg-smartel-green-500 hover:bg-smartel-green-600" onClick={() => handleOpenModal(null)}>
                <Plus className="h-4 w-4" />
                Schedule New Visit
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-medium">
            Visits for: {selectedDate ? selectedDate.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "No date selected"}
          </h3>
          {visitsForSelectedDate.length === 0 ? (
            <p className="text-muted-foreground">No visits scheduled for this date.</p>
          ) : (
            visitsForSelectedDate.map((visit) => {
              const farmer = getFarmerById(visit.farmerId);
              return (
                <Card key={visit.id} className="glass-card border-white/30 hover:bg-white/10 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4 text-smartel-green-500" />
                          {farmer?.name || 'Unknown Farmer'}
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-smartel-gray-400" />
                          {farmer?.location || 'N/A'}
                        </p>
                         <p className={`mt-1 text-xs px-2 py-0.5 inline-block rounded-full ${getStatusColorClass(visit.status)}`}>
                          Status: {visit.status}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="flex items-center gap-1 text-smartel-teal-500 font-medium text-sm">
                          <CalendarIcon className="h-4 w-4" />
                          {formatVisitDateTime(visit.scheduledDate)}
                        </p>
                        {visit.actualDate && (
                          <p className="text-xs text-muted-foreground mt-0.5">Completed: {formatVisitDateTime(visit.actualDate)}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 mb-3">Purpose: {visit.purpose}</p>
                    {visit.notes && <p className="text-xs bg-white/5 p-2 rounded-md text-muted-foreground">Notes: {visit.notes}</p>}
                    
                    <div className="flex justify-end mt-4 gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenModal(visit)}>
                        <Edit3 className="h-3 w-3 mr-1.5" />
                        Edit/Details
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteVisitClick(visit)}>
                         <Trash2 className="h-3 w-3 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
      <FieldVisitFormModal 
        isOpen={isModalOpen} 
        onClose={() => {setIsModalOpen(false); setEditingVisit(null);}} 
        onSave={handleSaveVisit} 
        visit={editingVisit} 
        farmers={farmers}
        initialDate={editingVisit ? undefined : selectedDate} // Pass selectedDate for new visits
      />
      <ConfirmationDialog 
        isOpen={isConfirmDialogOpen} 
        onClose={() => setIsConfirmDialogOpen(false)} 
        onConfirm={confirmDeleteVisit} 
        title="Confirm Visit Deletion" 
        message={`Are you sure you want to delete this field visit for ${visitToDelete?.purpose && getFarmerById(visitToDelete.farmerId)?.name ? `${visitToDelete.purpose} with ${getFarmerById(visitToDelete.farmerId)?.name}` : 'this visit'}? This action cannot be undone.`}
      />
    </>
  );
};
