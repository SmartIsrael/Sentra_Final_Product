
import React, { useState } from "react";
import { Bell, Search, User, X, Calendar, Settings, LogOut } from "lucide-react"; // Added LogOut icon
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TopBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuth(); // Get user and logout from AuthContext

  // Mock notifications
  const notifications = [
    { id: 1, title: "Critical Pest Alert", message: "Detected aphids in John Mwangi's maize field", time: "10 min ago", isRead: false },
    { id: 2, title: "Device Offline", message: "Device #A245 in Kiambu County is offline", time: "1 hour ago", isRead: false },
    { id: 3, title: "Report Generated", message: "Monthly crop health summary available", time: "3 hours ago", isRead: true },
  ];

  return (
    <header className="glass-panel flex items-center justify-between px-6 py-4 border-b border-white/20">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Extension Officer Portal</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {isSearchOpen ? (
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="pl-9 pr-4 py-2 rounded-full text-sm bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-smartel-green-400 w-52 md:w-72"
              onBlur={() => setIsSearchOpen(false)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-smartel-gray-500" />
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4 text-smartel-gray-500" />
            </button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/20 hover:bg-white/30"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5 text-smartel-gray-600" />
          </Button>
        )}
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative bg-white/20 border-white/30 hover:bg-white/30">
              <Bell className="h-5 w-5 text-smartel-gray-600" />
              {notifications.some(n => !n.isRead) && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="glass border-white/30 backdrop-blur-lg bg-white/30">
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <Tabs defaultValue="all" className="mt-6">
              <TabsList className="glass-panel grid grid-cols-3 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-4 rounded-lg border ${notification.isRead ? 'bg-white/10 border-white/20' : 'bg-white/30 border-smartel-teal-300'}`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-smartel-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm mt-1">{notification.message}</p>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="alerts">
                <div className="text-center py-8 text-smartel-gray-500">
                  Filtered alerts will appear here
                </div>
              </TabsContent>
              <TabsContent value="system">
                <div className="text-center py-8 text-smartel-gray-500">
                  System notifications will appear here
                </div>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 bg-white/20 border-white/30 text-smartel-gray-600 hover:bg-white/30">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="glass border-white/30 backdrop-blur-lg bg-white/30">
            <SheetHeader>
              <SheetTitle>Officer Profile</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white/40 flex items-center justify-center">
                  <User className="h-12 w-12 text-smartel-gray-600" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{user?.name || 'User'}</h3>
                <p className="text-smartel-gray-500">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Role'}</p>
              </div>
              
              <div className="space-y-2">
                {/* Placeholder for future Account Settings Link/Button */}
                {/* <Button variant="outline" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Button> */}
                {/* Placeholder for future My Schedule Link/Button */}
                {/* <Button variant="outline" className="w-full justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  My Schedule
                </Button> */}
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" /> {/* Changed icon */}
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default TopBar;
