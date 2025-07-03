import React, { useEffect, useState } from 'react';
import { Device } from '@/data/mockDevices';
import DeviceLocationMap from './DeviceLocationMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface DeviceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deviceData: Omit<Device, 'id'> | Device) => void;
  device?: Device | null; // Device data for editing, null for adding
}

const initialFormData: Omit<Device, 'id' | 'lastSyncTimestamp'> = {
  name: '',
  status: 'offline',
  battery: 0,
  signalStrength: 0,
  farmerId: '',
  location_lat: null,
  location_lon: null,
};

const DeviceFormModal: React.FC<DeviceFormModalProps> = ({ isOpen, onClose, onSave, device }) => {
  const [formData, setFormData] = useState<Omit<Device, 'id' | 'lastSyncTimestamp'>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (device) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, lastSyncTimestamp, ...editableDeviceData } = device;
      setFormData(editableDeviceData);
    } else {
      setFormData(initialFormData);
    }
    setErrors({}); // Clear errors when device or mode changes
  }, [device, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'battery' || name === 'signalStrength' ? parseInt(value, 10) || 0 : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as Device['status'] }));
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Device name is required.";
    if (!formData.farmerId || !formData.farmerId.trim()) newErrors.farmerId = "Farmer ID is required.";
    if (formData.location_lat === null || formData.location_lon === null) newErrors.location = "Location is required (select on map).";
    if (formData.battery < 0 || formData.battery > 100) newErrors.battery = "Battery must be between 0 and 100.";
    if (formData.signalStrength < 0 || formData.signalStrength > 100) newErrors.signalStrength = "Signal strength must be between 0 and 100.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (device) { // Editing existing device
      onSave({ ...device, ...formData });
    } else { // Adding new device
      // lastSyncTimestamp will be set by the hook or backend for new devices
      onSave(formData as Omit<Device, 'id'>); 
    }
    onClose(); // Close modal after save
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative glass-card border-white/30">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Close modal">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-gradient">{device ? 'Edit Device' : 'Add New Device'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Device Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 bg-white/70 border-white/50" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          {/* Device type removed */}
          <div>
            <Label htmlFor="farmerId">Farmer ID</Label>
            <Input id="farmerId" name="farmerId" value={formData.farmerId || ''} onChange={handleChange} className="mt-1 bg-white/70 border-white/50" />
            {errors.farmerId && <p className="text-red-500 text-xs mt-1">{errors.farmerId}</p>}
          </div>
          <div>
            <Label>Device Location</Label>
            <DeviceLocationMap
              lat={formData.location_lat}
              lon={formData.location_lon}
              mapboxToken={import.meta.env.VITE_MAPBOX_TOKEN}
              onChange={(lat, lon) => setFormData(prev => ({ ...prev, location_lat: lat, location_lon: lon }))}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger className="w-full mt-1 bg-white/70 border-white/50">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="decommissioned">Decommissioned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="battery">Battery (%)</Label>
              <Input id="battery" name="battery" type="number" value={formData.battery} onChange={handleChange} className="mt-1 bg-white/70 border-white/50" />
              {errors.battery && <p className="text-red-500 text-xs mt-1">{errors.battery}</p>}
            </div>
            <div>
              <Label htmlFor="signalStrength">Signal Strength (%)</Label>
              <Input id="signalStrength" name="signalStrength" type="number" value={formData.signalStrength} onChange={handleChange} className="mt-1 bg-white/70 border-white/50" />
              {errors.signalStrength && <p className="text-red-500 text-xs mt-1">{errors.signalStrength}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="farmerId">Farmer ID (Optional)</Label>
            <Input id="farmerId" name="farmerId" value={formData.farmerId || ''} onChange={handleChange} className="mt-1 bg-white/70 border-white/50" />
          </div>
          {device && (
            <div>
              <Label>Last Sync Timestamp</Label>
              <p className="text-sm text-gray-600 mt-1">{device.lastSyncTimestamp ? new Date(device.lastSyncTimestamp).toLocaleString() : 'N/A'}</p>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{device ? 'Save Changes' : 'Add Device'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceFormModal;
