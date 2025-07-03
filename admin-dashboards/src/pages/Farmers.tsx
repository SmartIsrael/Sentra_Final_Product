import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, User, Edit3, Trash2 } from "lucide-react"; // Removed ChevronDown for now
import { useFarmers } from "@/hooks/useFarmers";
import { User as Farmer } from "@/types"; // Use User type from @/types and alias as Farmer
import FarmerFormModal from "@/components/farmers/FarmerFormModal";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
// import { Badge } from "@/components/ui/badge"; // For isActive status - remove for now

// Helper to format date
const formatDate = (dateString: string | undefined | null): string => { // Allow null
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

import FarmerLocationModal from "@/components/farmers/FarmerLocationModal";

const FarmersPage = () => {
  const { farmers, addFarmer, loading, error } = useFarmers(); // Removed updateFarmer, deleteFarmer for now
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [farmerToDelete, setFarmerToDelete] = useState<Farmer | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const farmersPerPage = 10;

  // State for location modal
  const [locationModal, setLocationModal] = useState<{
    isOpen: boolean;
    address: string;
    lat?: number;
    lon?: number;
  }>({ isOpen: false, address: "", lat: undefined, lon: undefined });

  const filteredFarmers = useMemo(() => {
    return farmers.filter(farmer => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        farmer.name.toLowerCase().includes(lowerSearchTerm) ||
        farmer.email.toLowerCase().includes(lowerSearchTerm) || // Search by email as well
        String(farmer.id).toLowerCase().includes(lowerSearchTerm) // ID is number
      );
    }).sort((a,b) => a.name.localeCompare(b.name));
  }, [farmers, searchTerm]);

  const indexOfLastFarmer = currentPage * farmersPerPage;
  const indexOfFirstFarmer = indexOfLastFarmer - farmersPerPage;
  const currentFarmers = filteredFarmers.slice(indexOfFirstFarmer, indexOfLastFarmer);
  const totalPages = Math.ceil(filteredFarmers.length / farmersPerPage);

  const handleAddFarmerClick = () => {
    setEditingFarmer(null);
    setIsFormModalOpen(true);
  };

  const handleEditFarmerClick = (farmer: Farmer) => {
    setEditingFarmer(farmer);
    setIsFormModalOpen(true);
  };
  
  const handleDeleteFarmerClick = (farmer: Farmer) => {
    setFarmerToDelete(farmer);
    setIsConfirmDialogOpen(true);
  };

  const handleSaveFarmer = async (farmerData: any) => {
    // Pass the full form data directly to addFarmer (should include phone_number, location_address, etc.)
    await addFarmer(farmerData);
    setIsFormModalOpen(false);
    setEditingFarmer(null);
  };
  
  const confirmDeleteFarmer = () => {
    if (farmerToDelete) {
      // deleteFarmer(farmerToDelete.id); // deleteFarmer not implemented yet
      console.log("Delete farmer functionality to be implemented.");
    }
    setIsConfirmDialogOpen(false);
    setFarmerToDelete(null);
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Farmers</h1>
            <p className="mt-1 text-smartel-gray-500">
              Manage and monitor all registered farmers.
            </p>
          </div>
          <Button className="bg-smartel-green-500 hover:bg-smartel-green-600" onClick={handleAddFarmerClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Farmer
          </Button>
        </div>

        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-64 md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-smartel-gray-500" />
              <input
                type="text"
                placeholder="Search farmers by name, location, crops..."
                className="pl-9 pr-4 py-2 w-full rounded-lg text-sm bg-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-smartel-green-400"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
            {/* Placeholder for filters if needed later */}
            {/* <div className="flex gap-2">
              <Button variant="outline" className="text-smartel-gray-600 bg-white/60 border-white/30">
                Location <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div> */}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-smartel-gray-600 border-b border-white/30">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone Number</th>
                  <th className="px-4 py-3 font-medium">Farm Address</th>
                  <th className="px-4 py-3 font-medium">Coordinates</th>
                  <th className="px-4 py-3 font-medium">View Location</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                {loading && (
                  <tr>
                    <td colSpan={4} className="text-center text-smartel-gray-500 py-8">Loading farmers...</td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={4} className="text-center text-red-500 py-8">Error: {error}</td>
                  </tr>
                )}
                {!loading && !error && currentFarmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-white/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full flex items-center justify-center bg-smartel-green-100 text-smartel-green-500">
                          <User className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{farmer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-smartel-gray-600">{farmer.phone_number || 'N/A'}</td>
                    <td className="px-4 py-4 text-smartel-gray-600">{farmer.location_address || 'N/A'}</td>
                    <td className="px-4 py-4 text-smartel-gray-600">
                      {farmer.location_lat && farmer.location_lon
                        ? `${farmer.location_lat.toFixed(6)}, ${farmer.location_lon.toFixed(6)}`
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      {farmer.location_lat && farmer.location_lon ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setLocationModal({
                              isOpen: true,
                              address: farmer.location_address || "",
                              lat: farmer.location_lat,
                              lon: farmer.location_lon,
                            })
                          }
                        >
                          View Location
                        </Button>
                      ) : (
                        <span className="text-smartel-gray-400">N/A</span>
                      )}
                    </td>
                    {/* <td className="px-4 py-4 text-center">
                      <Badge variant={"default"} className={"bg-green-100 text-green-700"}>
                        Active
                      </Badge>
                    </td> */}
                    <td className="px-4 py-4 text-right space-x-1">
                       <Button variant="ghost" size="icon" onClick={() => handleEditFarmerClick(farmer)} title="Edit Farmer (WIP)">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteFarmerClick(farmer)} title="Delete Farmer (WIP)" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {!loading && !error && currentFarmers.length === 0 && farmers.length > 0 && (
                   <tr>
                    <td colSpan={4} className="text-center text-smartel-gray-500 py-8">No farmers match your current search/filter.</td>
                  </tr>
                )}
                 {!loading && !error && farmers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-smartel-gray-500 py-8">No farmers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && !error && totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-smartel-gray-500">
                Page {currentPage} of {totalPages} (Showing {currentFarmers.length} of {filteredFarmers.length} farmers)
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

      <FarmerFormModal
        isOpen={isFormModalOpen}
        onClose={() => {setIsFormModalOpen(false); setEditingFarmer(null);}}
        farmer={editingFarmer}
        onSave={handleSaveFarmer}
      />
      <FarmerLocationModal
        isOpen={locationModal.isOpen}
        onClose={() => setLocationModal({ isOpen: false, address: "", lat: undefined, lon: undefined })}
        address={locationModal.address}
        lat={locationModal.lat}
        lon={locationModal.lon}
      />
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDeleteFarmer}
        title="Confirm Farmer Deletion"
        message={`Are you sure you want to delete farmer "${farmerToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  );
};

export default FarmersPage;
