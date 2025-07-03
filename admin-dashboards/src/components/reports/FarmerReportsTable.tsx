import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Filter, Eye, Edit3, Trash2 } from "lucide-react"; // Added Edit3, Trash2
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFarmerReports } from "@/hooks/useFarmerReports";
import { useFarmers } from "@/hooks/useFarmers";
import { FarmerReport } from "@/data/mockFarmerReports";
import FarmerReportDetailModal from "./FarmerReportDetailModal";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";

// Helper to format date
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(); // Simple date format
};

const getStatusColorClass = (status: FarmerReport["status"]) => {
  switch (status) {
    case "Critical": return "bg-red-500/70 text-white";
    case "Resolved": return "bg-green-500/70 text-white";
    case "Pending": return "bg-yellow-500/70 text-black";
    case "In Progress": return "bg-blue-500/70 text-white";
    case "Information": return "bg-gray-500/70 text-white";
    default: return "bg-gray-200 text-gray-800";
  }
};

export const FarmerReportsTable = () => {
  const { reports, addReport, updateReport, deleteReport } = useFarmerReports();
  const { farmers, getFarmerById } = useFarmers();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<FarmerReport | null>(null);
  const [reportToDelete, setReportToDelete] = useState<FarmerReport | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  const handleOpenModal = (report: FarmerReport | null) => {
    setEditingReport(report);
    setIsModalOpen(true);
  };

  const handleSaveReport = (reportData: Omit<FarmerReport, 'id' | 'date'> | FarmerReport) => {
    if ('id' in reportData && reportData.id) { // Editing
      // The modal passes the full report object for edits
      // The hook expects Partial<Omit<FarmerReport, 'id'>>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, date, ...updateData } = reportData; // date is not directly editable via form
      updateReport(id, updateData);
    } else { // Adding
      addReport(reportData as Omit<FarmerReport, 'id' | 'date'>);
    }
    setIsModalOpen(false);
    setEditingReport(null);
  };

  const handleDeleteReportClick = (report: FarmerReport) => {
    setReportToDelete(report);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (reportToDelete) {
      deleteReport(reportToDelete.id);
    }
    setIsConfirmDialogOpen(false);
    setReportToDelete(null);
  };
  
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1 bg-white/60 border-white/30">
            <Filter className="h-4 w-4" />
            Filter (WIP)
          </Button>
          <Button size="sm" variant="outline" className="gap-1 bg-white/60 border-white/30">
            <Download className="h-4 w-4" />
            Export (WIP)
          </Button>
        </div>
        <Button variant="default" size="sm" className="gap-1 bg-smartel-green-500 hover:bg-smartel-green-600" onClick={() => handleOpenModal(null)}>
          <FileText className="h-4 w-4" />
          New Report
        </Button>
      </div>
      
      <div className="rounded-md border border-white/30 overflow-hidden">
        <Table>
          <TableHeader className="bg-white/10">
            <TableRow>
              <TableHead>Report ID</TableHead>
              <TableHead>Farmer</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Crop Type</TableHead>
              <TableHead>Report Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentReports.map((report) => {
              const farmer = getFarmerById(report.farmerId);
              return (
                <TableRow key={report.id} className="hover:bg-white/10">
                  <TableCell className="font-medium truncate max-w-[100px]" title={report.id}>{report.id.substring(0,10)}...</TableCell>
                  <TableCell>{farmer?.name || 'N/A'}</TableCell>
                  <TableCell>{farmer?.location || 'N/A'}</TableCell>
                  <TableCell>{report.cropType}</TableCell>
                  <TableCell>{report.reportType}</TableCell>
                  <TableCell>{formatDate(report.date)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full inline-block ${getStatusColorClass(report.status)}`}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(report)} title="View/Edit Report">
                      <Eye className="h-4 w-4" />
                    </Button>
                     <Button variant="ghost" size="icon" onClick={() => handleOpenModal(report)} title="Edit Report">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteReportClick(report)} title="Delete Report" className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {currentReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-smartel-gray-500 py-8">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-smartel-gray-500">
            Page {currentPage} of {totalPages} (Showing {currentReports.length} of {reports.length} reports)
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

      <FarmerReportDetailModal 
        isOpen={isModalOpen}
        onClose={() => {setIsModalOpen(false); setEditingReport(null);}}
        report={editingReport}
        onSave={handleSaveReport}
        farmers={farmers}
      />
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Report Deletion"
        message={`Are you sure you want to delete report "${reportToDelete?.title || reportToDelete?.id}"? This action cannot be undone.`}
      />
    </div>
  );
};
