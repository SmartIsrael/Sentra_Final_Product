
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-smartel-green-100 to-smartel-teal-100">
      <div className="glass-card p-10 max-w-md text-center">
        <h1 className="text-6xl font-bold text-smartel-green-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-smartel-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-smartel-green-500 hover:bg-smartel-green-600"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
