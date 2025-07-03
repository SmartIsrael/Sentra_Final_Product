import React, { useEffect, useState } from 'react';
import { User as Farmer } from '@/types'; // Use User type from @/types
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
// Switch and Textarea for crops are removed as these fields are not on the base User model

// Define the shape of data the form will handle and pass to onSave
// For adding, password is required. For editing, it's optional.
type FarmerFormData = {
  name: string;
  phone_number: string;
  password?: string;
  location_address: string;
  location_lat?: number;
  location_lon?: number;
};

interface FarmerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (farmerData: FarmerFormData) => void; // Updated onSave type
  farmer?: Farmer | null; // Farmer data for editing, null for adding
}

const initialFormData: FarmerFormData = {
  name: '',
  phone_number: '',
  password: '',
  location_address: '',
  location_lat: undefined,
  location_lon: undefined,
};

const FarmerFormModal: React.FC<FarmerFormModalProps> = ({ isOpen, onClose, onSave, farmer }) => {
  const [formData, setFormData] = useState<FarmerFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (farmer) { // Editing existing farmer
      setFormData({
        name: farmer.name,
        phone_number: farmer.phone_number || '',
        password: '',
        location_address: farmer.location_address || '',
        location_lat: farmer.location_lat,
        location_lon: farmer.location_lon,
      });
    } else { // Adding new farmer
      setFormData(initialFormData);
    }
    setErrors({}); // Clear errors when modal opens or farmer changes
  }, [farmer, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Farmer name is required.";
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required.";
    } else if (!/^\+?\d{10,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number is invalid.";
    }
    if (!formData.location_address.trim()) {
      newErrors.location_address = "Address is required.";
    }
    // Password is required only when adding a new farmer (not editing)
    if (!farmer && !formData.password) {
      newErrors.password = "Password is required for new farmers.";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Geocode address using OpenStreetMap Nominatim API
  const geocodeAddress = async (address: string): Promise<{ lat: number; lon: number } | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Geocode the address before saving
    let coords = { lat: formData.location_lat, lon: formData.location_lon };
    if (formData.location_address && (!formData.location_lat || !formData.location_lon)) {
      const geocoded = await geocodeAddress(formData.location_address);
      if (geocoded) {
        coords = geocoded;
      } else {
        setErrors(prev => ({
          ...prev,
          location_address: "Could not geocode address. Please enter a valid address."
        }));
        return;
      }
    }

    // Prepare data for onSave. If editing and password is empty, don't send it.
    const dataToSave: FarmerFormData = {
      ...formData,
      location_lat: coords.lat,
      location_lon: coords.lon,
    };
    if (farmer && !formData.password) {
      delete dataToSave.password;
    }

    onSave(dataToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative glass-card border-white/30 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Close modal">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-gradient">{farmer ? 'Edit Farmer Profile' : 'Add New Farmer'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 bg-white/70 border-white/50" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input id="phone_number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} className="mt-1 bg-white/70 border-white/50" placeholder="+2507XXXXXXXX" />
            {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
          </div>
          <div>
            <Label htmlFor="location_address">Farm Address</Label>
            <Input id="location_address" name="location_address" value={formData.location_address} onChange={handleChange} className="mt-1 bg-white/70 border-white/50" placeholder="Enter farm address" />
            {errors.location_address && <p className="text-red-500 text-xs mt-1">{errors.location_address}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={formData.password || ''} 
              onChange={handleChange} 
              className="mt-1 bg-white/70 border-white/50" 
              placeholder={farmer ? "Leave blank to keep current password" : "Enter password"}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          {/* Fields like location, crops, isActive, joinDate are removed as they are not part of the base User model */}
          {/* These would be managed elsewhere, e.g., in a separate Farm details section if needed */}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{farmer ? 'Save Changes' : 'Add Farmer'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerFormModal;
