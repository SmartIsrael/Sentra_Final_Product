import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Search, Settings, RefreshCw, Trash2, Edit3, HardDrive, CircleOff } from "lucide-react";
import { useDevices } from "@/hooks/useDevices";
import { Device, DeviceStatus } from "@/types"; 
import DeviceFormModal from "@/components/devices/DeviceFormModal";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import DeviceDetailModal from "@/components/devices/DeviceDetailModal";

// Helper function to format date (consistent with other components)
const formatDateDistance = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const getStatusColorClass = (status: DeviceStatus) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "inactive": return "bg-gray-200 text-gray-800";
    case "error": return "bg-red-100 text-red-800";
    case "maintenance": return "bg-amber-100 text-amber-800";
    case "decommissioned": return "bg-slate-100 text-slate-800";
    default: return "bg-gray-100 text-gray-700";
  }
};

const DevicesPage = () => {
  const { devices, loading, error, fetchDevices, addDevice, deleteDevice } = useDevices(); 
  const [searchTerm, setSearchTerm] = useState("");

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

  // State for device detail modal
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; device: Device | null }>({ isOpen: false, device: null });

  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 4; // Or any number you prefer

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      if (!device) return false; 
      const lowerSearchTerm = searchTerm.toLowerCase();
      const checkString = (val: string | null | undefined) => val?.toLowerCase().includes(lowerSearchTerm);
      const checkNumber = (val: number | null | undefined) => val !== null && val !== undefined && String(val).toLowerCase().includes(lowerSearchTerm);

      return (
        checkString(device.serial_number) ||
        checkString(device.device_type) ||
        checkString(device.model) ||
        checkString(device.manufacturer) ||
        checkNumber(device.id) ||
        checkNumber(device.farmer_id) ||
        checkNumber(device.farm_id) ||
        checkString(device.status)
      );
    }).sort((a,b) => (a.serial_number || String(a.id)).localeCompare(b.serial_number || String(b.id)));
  }, [devices, searchTerm]);

  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice);
  const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);

  const handleAddDeviceClick = () => {
    setEditingDevice(null);
    setIsFormModalOpen(true);
  };

  const handleConfigureDeviceClick = (device: Device) => {
    setEditingDevice(device);
    setIsFormModalOpen(true);
  };
  
  const handleDeleteDeviceClick = (device: Device) => {
    setDeviceToDelete(device);
    setIsConfirmDialogOpen(true);
  };

  const handleSaveDevice = async (deviceData: Omit<Device, 'id'>) => { 
    await addDevice(deviceData);
    await fetchDevices();
    setIsFormModalOpen(false);
    setEditingDevice(null);
  };
  
  const confirmDeleteDevice = async () => {
    if (deviceToDelete) {
      console.log("Attempting to delete device with ID:", deviceToDelete.id);
      await deleteDevice(deviceToDelete.id);
      await fetchDevices();
    }
    setIsConfirmDialogOpen(false);
    setDeviceToDelete(null);
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Devices</h1>
            <p className="mt-1 text-smartel-gray-500">
              Monitor and manage all deployed Sentra Bot devices in the field.
            </p>
          </div>
          <Button className="bg-smartel-green-500 hover:bg-smartel-green-600" onClick={handleAddDeviceClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>

        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-64 md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-smartel-gray-500" />
              <input
                type="text"
                placeholder="Search devices..."
                className="pl-9 pr-4 py-2 w-full rounded-lg text-sm bg-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-smartel-green-400"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="text-smartel-gray-600 bg-white/60 border-white/30" onClick={fetchDevices}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          {loading && <p className="text-center text-smartel-gray-500 py-8">Loading devices...</p>}
          {error && <p className="text-center text-red-500 py-8">Error: {error}</p>}
          {!loading && !error && currentDevices.length === 0 && (
             <p className="text-center text-smartel-gray-500 py-8">
              {searchTerm ? "No devices match your search." : "No devices found."}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!loading && !error && currentDevices.map((device) => (
              <div
                key={device.id}
                className="p-5 rounded-lg bg-white/60 border border-white/30 hover:bg-white/80 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-smartel-teal-100 text-smartel-teal-600">
                        {device.status === 'active' ? <HardDrive className="h-5 w-5" /> : <CircleOff className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="font-medium">{device.serial_number || `Device ${device.id}`}</h3>
                        <p className="text-sm text-smartel-gray-500">
                          {device.location_lat && device.location_lon 
                            ? `Lat: ${device.location_lat}, Lon: ${device.location_lon}` 
                            : "Location N/A"}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(device.status)}`}>
                      {device.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
                    {/* Device type removed */}
                    <div>
                      <p className="text-xs text-smartel-gray-500">Model</p>
                      <p className="font-medium">{device.model || 'N/A'}</p>
                    </div>
                    {device.farmer_id && (
                      <div>
                        <p className="text-xs text-smartel-gray-500">Farmer ID</p>
                        <p className="font-medium">{device.farmer_id}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-smartel-gray-500">Last Seen</p>
                      <p>{formatDateDistance(device.last_seen_at)}</p>
                    </div>
                     <div>
                      <p className="text-xs text-smartel-gray-500">Registered</p>
                      <p className="truncate" title={new Date(device.registered_at).toLocaleString()}>{new Date(device.registered_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-auto">
                  <Button size="sm" variant="outline" className="bg-white/60 border-white/30" onClick={() => setDetailModal({ isOpen: true, device })} title="View Details">
                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/60 border-white/30" onClick={() => handleConfigureDeviceClick(device)} title="Configure">
                    <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                    Configure
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteDeviceClick(device)} title="Delete">
                     <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {!loading && !error && totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-smartel-gray-500">
                Page {currentPage} of {totalPages} (Showing {currentDevices.length} of {filteredDevices.length} devices)
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-white/60 border-white/30" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-white/60 border-white/30" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeviceFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => {setIsFormModalOpen(false); setEditingDevice(null);}}
        device={editingDevice}
        onSave={handleSaveDevice} 
      />
      <DeviceDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, device: null })}
        device={detailModal.device}
        mapboxToken={import.meta.env.VITE_MAPBOX_TOKEN}
      />
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDeleteDevice}
        title="Confirm Deletion"
        message={`Are you sure you want to delete device "${deviceToDelete?.serial_number || deviceToDelete?.id}"? This action cannot be undone.`}
      />
    </>
  );
};

export default DevicesPage;
