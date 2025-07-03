import React, { useEffect, useState } from 'react';
import { FarmerReport } from '@/data/mockFarmerReports';
import { Farmer } from '@/data/mockFarmers'; // To select farmer
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface FarmerReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reportData: Omit<FarmerReport, 'id' | 'date'> | FarmerReport) => void;
  report?: FarmerReport | null; // Report data for editing, null for adding
  farmers: Farmer[]; // List of farmers to select from
}

const reportTypes: FarmerReport["reportType"][] = ["Pest Detection", "Disease Analysis", "Nutrient Deficiency", "Water Stress", "Yield Estimation", "General Observation"];
const reportStatuses: FarmerReport["status"][] = ["Pending", "In Progress", "Resolved", "Critical", "Information"];

const initialFormData: Omit<FarmerReport, 'id' | 'date'> = {
  farmerId: '',
  cropType: '',
  reportType: 'General Observation',
  status: 'Pending',
  title: '',
  description: '',
  recommendations: '',
  attachments: [],
};

const FarmerReportDetailModal: React.FC<FarmerReportDetailModalProps> = ({ isOpen, onClose, onSave, report, farmers }) => {
  const [formData, setFormData] = useState<Omit<FarmerReport, 'id' | 'date'>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (report) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, date, ...editableReportData } = report;
      setFormData(editableReportData);
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [report, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Omit<FarmerReport, 'id' | 'date'>, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Report title is required.";
    if (!formData.farmerId) newErrors.farmerId = "Farmer selection is required.";
    if (!formData.cropType.trim()) newErrors.cropType = "Crop type is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (report) { // Editing
      onSave({ ...report, ...formData });
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
        <h2 className="text-2xl font-semibold mb-6 text-gradient">{report ? 'Edit Farmer Report' : 'New Farmer Report'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Report Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} className="mt-1 bg-white/70 border-white/50" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="farmerId">Farmer</Label>
              <Select name="farmerId" value={formData.farmerId} onValueChange={(value) => handleSelectChange('farmerId', value)}>
                <SelectTrigger className="w-full mt-1 bg-white/70 border-white/50">
                  <SelectValue placeholder="Select farmer" />
                </SelectTrigger>
                <SelectContent>
                  {farmers.map(f => <SelectItem key={f.id} value={f.id}>{f.name} - {f.location}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.farmerId && <p className="text-red-500 text-xs mt-1">{errors.farmerId}</p>}
            </div>
            <div>
              <Label htmlFor="cropType">Crop Type</Label>
              <Input id="cropType" name="cropType" value={formData.cropType} onChange={handleChange} className="mt-1 bg-white/70 border-white/50" />
              {errors.cropType && <p className="text-red-500 text-xs mt-1">{errors.cropType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select name="reportType" value={formData.reportType} onValueChange={(value) => handleSelectChange('reportType', value as FarmerReport["reportType"])}>
                <SelectTrigger className="w-full mt-1 bg-white/70 border-white/50"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>{reportTypes.map(rt => <SelectItem key={rt} value={rt}>{rt}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value as FarmerReport["status"])}>
                <SelectTrigger className="w-full mt-1 bg-white/70 border-white/50"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>{reportStatuses.map(rs => <SelectItem key={rs} value={rs}>{rs}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="mt-1 bg-white/70 border-white/50 min-h-[100px]" />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div>
            <Label htmlFor="recommendations">Recommendations (Optional)</Label>
            <Textarea id="recommendations" name="recommendations" value={formData.recommendations || ''} onChange={handleChange} className="mt-1 bg-white/70 border-white/50 min-h-[80px]" />
          </div>

          {report && (
            <div>
              <Label>Report Date</Label>
              <p className="text-sm text-gray-600 mt-1">{new Date(report.date).toLocaleString()}</p>
            </div>
          )}

          {/* Attachments WIP - simple display for now if present */}
          {report?.attachments && report.attachments.length > 0 && (
            <div>
              <Label>Attachments</Label>
              <ul className="list-disc list-inside mt-1">
                {report.attachments.map(att => <li key={att.name} className="text-sm"><a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{att.name}</a></li>)}
              </ul>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{report ? 'Save Changes' : 'Create Report'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerReportDetailModal;
