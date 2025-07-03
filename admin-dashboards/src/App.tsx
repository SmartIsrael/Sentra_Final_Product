
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Import ProtectedRoute
import LoginPage from "./pages/LoginPage"; // Import LoginPage
// import RegistrationPage from "./pages/RegistrationPage"; // Remove import
import Dashboard from "./pages/Dashboard";
import Farmers from "./pages/Farmers";
import Alerts from "./pages/Alerts";
import Devices from "./pages/Devices";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import AdminSettingsPage from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/register" element={<RegistrationPage />} /> Remove registration route */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/farmers" element={<Farmers />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<AdminSettingsPage />} />
              <Route path="/settings/:section" element={<AdminSettingsPage />} /> 
              

            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
