
import React, { useMemo } from "react";
import { Users, Bug, CloudSun, AlertTriangle } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { useFarmers } from "@/hooks/useFarmers"; // Import useFarmers
import { useAlerts } from "@/hooks/useAlerts"; 
import AlertsOverview from "@/components/dashboard/AlertsOverview";
import CropHealthMap from "@/components/dashboard/CropHealthMap";
import DeviceStatus from "@/components/dashboard/DeviceStatus";

const Dashboard = () => {
  const { farmers, loading: farmersLoading, error: farmersError } = useFarmers();
  const { alerts, loading: alertsLoading, error: alertsError } = useAlerts(); // Use all alerts for overview, filter as needed

  const totalFarmers = useMemo(() => farmers.length, [farmers]);
  
  // Active alerts are now derived within useAlerts, but for dashboard counts, let's use all alerts and filter
  const activeAlertsForCount = useMemo(() => 
    alerts.filter(alert => alert.status === 'new' || alert.status === 'acknowledged' || alert.status === 'in_progress'),
    [alerts]
  );

  const activeAlertsCount = useMemo(() => activeAlertsForCount.length, [activeAlertsForCount]);
  
  const pestDetectionsCount = useMemo(() => 
    activeAlertsForCount.filter(alert => alert.alert_type === "pest").length, 
    [activeAlertsForCount]
  );
  const weatherAlertsCount = useMemo(() => 
    activeAlertsForCount.filter(alert => alert.alert_type === "weather").length, 
    [activeAlertsForCount]
  );
  
  // Prepare a subset of alerts for AlertsOverview (e.g., most recent 5 active alerts)
  const overviewAlerts = useMemo(() => {
    return [...activeAlertsForCount] // Create a new array before sorting to avoid mutating the original
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [activeAlertsForCount]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          <p className="mt-1 text-smartel-gray-500">
            Welcome back! Here's an overview of your farming community.
          </p>
        </div>
        <div className="glass-panel px-4 py-2 rounded-lg text-smartel-gray-500">
          <span className="font-medium">Today:</span> April 29, 2025
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Farmers" 
          value={farmersLoading ? "..." : totalFarmers} 
          icon={<Users size={20} />} 
          trend={{ value: 12, isPositive: true }} // Trend remains hardcoded for now
          isLoading={farmersLoading}
          error={farmersError}
        />
        <StatCard 
          title="Active Alerts" 
          value={alertsLoading ? "..." : activeAlertsCount} 
          icon={<AlertTriangle size={20} />} 
          trend={{ value: 5, isPositive: false }} // Trend remains hardcoded
          isLoading={alertsLoading}
          error={alertsError}
        />
        <StatCard 
          title="Pest Detections" 
          value={alertsLoading ? "..." : pestDetectionsCount} 
          icon={<Bug size={20} />} 
          trend={{ value: 3, isPositive: false }} // Trend remains hardcoded
          isLoading={alertsLoading}
          error={alertsError}
        />
        <StatCard 
          title="Weather Alerts" 
          value={alertsLoading ? "..." : weatherAlertsCount} 
          icon={<CloudSun size={20} />} 
          trend={{ value: 1, isPositive: true }} // Trend remains hardcoded
          isLoading={alertsLoading}
          error={alertsError}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CropHealthMap /> {/* Placeholder, needs its own data */}
        </div>
        <div>
          <AlertsOverview alerts={overviewAlerts} loading={alertsLoading} error={alertsError} />
        </div>
      </div>

      <div>
        <DeviceStatus />
      </div>
    </div>
  );
};

export default Dashboard;
