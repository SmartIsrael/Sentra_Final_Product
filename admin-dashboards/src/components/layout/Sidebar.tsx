
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  Settings, 
  MapPin, 
  FileText, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Farmers", href: "/farmers", icon: Users },
    { name: "Alerts", href: "/alerts", icon: Bell },
    { name: "Devices", href: "/devices", icon: MapPin },
    { name: "Rwanda Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "glass h-screen flex flex-col bg-smartel-green-500 text-white transition-all duration-300 z-10",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">Rwanda</span>
            <span className="text-xs px-2 py-1 bg-smartel-teal-400 rounded">Sentra Bot</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-4 text-white/80 hover:bg-white/20 transition-colors",
                    isActive ? "bg-white/20 text-white font-medium" : "",
                    collapsed ? "justify-center" : ""
                  )
                }
              >
                <link.icon size={20} />
                {!collapsed && <span className="ml-3">{link.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/20">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
            <Users size={18} />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">Rwanda Extension</p>
              <p className="text-xs text-white/70">Officer</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
