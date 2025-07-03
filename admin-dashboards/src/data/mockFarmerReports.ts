export interface FarmerReport {
  id: string;
  farmerId: string; // Link to Farmer.id
  // farmerName and location can be derived by joining with Farmer data if needed for display
  cropType: string;
  reportType: "Pest Detection" | "Disease Analysis" | "Nutrient Deficiency" | "Water Stress" | "Yield Estimation" | "General Observation";
  date: string; // ISO date string
  status: "Pending" | "In Progress" | "Resolved" | "Critical" | "Information";
  title: string; // A concise title for the report
  description: string; // Detailed description or findings
  recommendations?: string; // Optional recommendations
  attachments?: { name: string; url: string }[]; // Optional attachments
}

export const mockFarmerReports: FarmerReport[] = [
  {
    id: "report-001",
    farmerId: "farmer-001", // Corresponds to John Doe in mockFarmers
    cropType: "Maize",
    reportType: "Pest Detection",
    date: "2024-04-15T10:00:00Z",
    status: "Critical",
    title: "Fall Armyworm Outbreak in Field A",
    description: "Significant Fall Armyworm presence detected in the northern section of Field A. Larvae observed on over 60% of plants.",
    recommendations: "Immediate application of recommended bio-pesticide. Monitor adjacent fields.",
  },
  {
    id: "report-002",
    farmerId: "farmer-002", // Corresponds to Jane Smith
    cropType: "Tea",
    reportType: "Disease Analysis",
    date: "2024-04-17T14:30:00Z",
    status: "Resolved",
    title: "Minor Leaf Blight Identified",
    description: "Early signs of leaf blight on a small patch of tea bushes. Samples taken and analyzed.",
    recommendations: "Affected bushes were treated. Area quarantined for 1 week. Condition resolved.",
  },
  {
    id: "report-003",
    farmerId: "farmer-003", // Corresponds to Alice Green
    cropType: "Irish Potatoes",
    reportType: "Nutrient Deficiency",
    date: "2024-04-18T09:15:00Z",
    status: "Pending",
    title: "Suspected Potassium Deficiency",
    description: "Yellowing and curling of lower leaves observed in potato plants. Soil samples collected for analysis.",
  },
  {
    id: "report-004",
    farmerId: "farmer-001", // John Doe again
    cropType: "Beans",
    reportType: "Water Stress",
    date: "2024-04-19T11:00:00Z",
    status: "In Progress",
    title: "Water Stress in Bean Field",
    description: "Bean plants showing signs of wilting due to insufficient moisture. Irrigation system checked.",
    recommendations: "Advised farmer to increase irrigation frequency for the next 7 days.",
  },
  {
    id: "report-005",
    farmerId: "farmer-004", // Bob White
    cropType: "Rice",
    reportType: "Yield Estimation",
    date: "2024-04-20T16:00:00Z",
    status: "Information",
    title: "Pre-Harvest Yield Estimation for Paddy Field 2",
    description: "Based on sample quadrat analysis, estimated yield is 4.5 tons/ha.",
  },
];
