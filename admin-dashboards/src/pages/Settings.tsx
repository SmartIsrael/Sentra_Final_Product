import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  // Example settings state
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  // Placeholder for update logic
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update admin settings
    setSuccess("Settings saved (not yet connected to backend).");
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Admin Name</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Admin Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
              />
            </div>
            <Button type="submit" className="w-full">
              Save Settings
            </Button>
            {success && (
              <div className="text-green-600 text-sm mt-2">{success}</div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;
