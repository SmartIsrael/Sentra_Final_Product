
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FarmerReportsTable } from "@/components/reports/FarmerReportsTable";
import { FieldVisitScheduler } from "@/components/reports/FieldVisitScheduler";
import { RegionalInsightsMap } from "@/components/reports/RegionalInsightsMap";

const Reports = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Rwanda Extension Officer Portal</h1>
        <p className="text-muted-foreground">
          Manage field visits, generate reports, and monitor farmer progress across Rwanda's provinces
        </p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="glass-panel mb-4 grid w-full grid-cols-3 h-12">
          <TabsTrigger value="reports">Farmer Reports</TabsTrigger>
          <TabsTrigger value="visits">Field Visits</TabsTrigger>
          <TabsTrigger value="insights">Rwanda Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="space-y-6">
          <Card className="glass-card border-white/30">
            <CardHeader>
              <CardTitle>Farmer Reports</CardTitle>
              <CardDescription>
                View and manage reports for all farmers across Rwanda's districts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FarmerReportsTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="visits" className="space-y-6">
          <Card className="glass-card border-white/30">
            <CardHeader>
              <CardTitle>Field Visit Schedule</CardTitle>
              <CardDescription>
                Schedule and track field visits across Rwanda's provinces and districts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldVisitScheduler />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <Card className="glass-card border-white/30">
            <CardHeader>
              <CardTitle>Rwanda Agricultural Insights</CardTitle>
              <CardDescription>
                View agricultural data and trends across Rwanda's five provinces
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              <RegionalInsightsMap />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
