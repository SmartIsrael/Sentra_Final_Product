export interface Farmer {
  id: string;
  name: string;
  location: string;
  joinDate: string;
  isActive: boolean;
  crops: string[];
}

export const mockFarmers: Farmer[] = [
  { id: "farmer-001", name: "John Doe", location: "Eastern Province", joinDate: "2023-01-15", isActive: true, crops: ["Maize", "Beans"] },
  { id: "farmer-002", name: "Jane Smith", location: "Western Province", joinDate: "2023-03-22", isActive: true, crops: ["Tea", "Coffee"] },
  { id: "farmer-003", name: "Alice Green", location: "Northern Province", joinDate: "2023-05-10", isActive: false, crops: ["Irish Potatoes"] },
  { id: "farmer-004", name: "Bob White", location: "Southern Province", joinDate: "2023-07-01", isActive: true, crops: ["Rice", "Vegetables"] },
  { id: "farmer-005", name: "Chris Black", location: "Kigali City", joinDate: "2023-09-18", isActive: true, crops: ["Vegetables"] },
];
