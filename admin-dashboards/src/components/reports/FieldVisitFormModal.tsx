import React, { useEffect, useState } from 'react';
import { FieldVisit } from '@/data/mockFieldVisits';
import { Farmer } from '@/data/mockFarmers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar'; // For date picking
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // For date picker
import { CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // For Popover button styling

interface FieldVisitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (visitData: Omit<FieldVisit, 'id'> | FieldVisit) => void;
  visit?: FieldVisit | null;
  farmers: Farmer[];
  initialDate?: Date; // To prefill scheduledDate when adding new
}

const visitStatuses: FieldVisit["status"][] = ["Scheduled", "In Progress", "Completed", "Cancelled", "Postponed"];

const initialFormData: Omit<FieldVisit, 'id'> = {
  farmerId: '',
  scheduledDate: new Date().toISOString(),
  status: 'Scheduled',
  purpose: '',
  notes: '',
  assignedOfficerId: '',
  actualDate: undefined,
};

const FieldVisitFormModal: React.FC<FieldVisitFormModalProps> = ({ isOpen, onClose, onSave, visit, farmers, initialDate }) => {
  const [formData, setFormData] = useState<Omit<FieldVisit, 'id'>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visit) {
      setFormData({
        farmerId: visit.farmerId,
        scheduledDate: visit.scheduledDate,
        actualDate: visit.actualDate,
        status: visit.status,
        purpose: visit.purpose,
        notes: visit.notes || '',
        assignedOfficerId: visit.assignedOfficerId || '',
      });
    } else {
      setFormData({
        ...initialFormData,
        scheduledDate: initialDate ? initialDate.toISOString() : new Date().toISOString(),
      });
    }
    setErrors({});
  }, [visit, isOpen, initialDate]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Omit<FieldVisit, 'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: 'scheduledDate' | 'actualDate', date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: date.toISOString() }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.farmerId) newErrors.farmerId = "Farmer is required.";
    if (!formData.scheduledDate) newErrors.scheduledDate = "Scheduled date is required.";
    if (!formData.purpose.trim()) newErrors.purpose = "Purpose of visit is required.";
    if (formData.actualDate && new Date(formData.actualDate) < new Date(formData.scheduledDate) && formData.status === "Completed") {
      newErrors.actualDate = "Actual date cannot be before scheduled date for completed visits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (visit) { // Editing
      onSave({ ...visit, ...formData });
    } else { // Adding
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative glass-card border-white/30 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Close modal">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-gradient">{visit ? 'Edit Field Visit' : 'Schedule New Field Visit'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="farmerId">Farmer</Label>
            <Select name="farmerId" value={formData.farmerId} onValueChange={(value) => handleSelectChange('farmerId', value)}>
              <SelectTrigger className="w-full mt-1 bg-white/70 border-white/50"><SelectValue placeholder="Select farmer" /></SelectTrigger>
              <SelectContent>{farmers.map(f => <SelectItem key={f.id} value={f.id}>{f.name} - {f.location}</SelectItem>)}</SelectContent>
            </Select>
            {errors.farmerId && <p className="text-red-500 text-xs mt-1">{errors.farmerId}</p>}
          </div>

          <div>
            <Label htmlFor="purpose">Purpose of Visit</Label>
            <Input id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} className="mt-1 bg-white/70 border-white/50" />
            {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal mt-1 bg-white/70 border-white/50", !formData.scheduledDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduledDate ? new Date(formData.scheduledDate).toLocaleDateString() : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={new Date(formData.scheduledDate)} onSelect={(date) => handleDateChange('scheduledDate', date)} initialFocus /></PopoverContent>
              </Popover>
              {errors.scheduledDate && <p className="text-red-500 text-xs mt-1">{errors.scheduledDate}</p>}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value as FieldVisit["status"])}>
                <SelectTrigger className="w-full mt-1 bg-white/70 border-white/50"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>{visitStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {formData.status === 'Completed' && (
            <div>
              <Label htmlFor="actualDate">Actual Visit Date (if different)</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal mt-1 bg-white/70 border-white/50", !formData.actualDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.actualDate ? new Date(formData.actualDate).toLocaleDateString() : <span>Pick actual date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.actualDate ? new Date(formData.actualDate) : undefined} onSelect={(date) => handleDateChange('actualDate', date)} /></PopoverContent>
              </Popover>
              {errors.actualDate && <p className="text-red-500 text-xs mt-1">{errors.actualDate}</p>}
            </div>
          )}

          <div>
            <Label htmlFor="assignedOfficerId">Assigned Officer ID (Optional)</Label>
            <Input id="assignedOfficerId" name="assignedOfficerId" value={formData.assignedOfficerId || ''} onChange={handleChange} className="mt-1 bg-white/70 border-white/50" />
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} className="mt-1 bg-white/70 border-white/50 min-h-[100px]" />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{visit ? 'Save Changes' : 'Schedule Visit'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldVisitFormModal;
