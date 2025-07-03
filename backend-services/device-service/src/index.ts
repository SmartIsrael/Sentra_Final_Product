
import express, { Express, Request, Response } from 'express';
import cors from 'cors'; // Import cors
import deviceRoutes from './routes/deviceRoutes'; // Import the device routes
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:8082', // Allow requests from Vite dev server (admin-dashboards)
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

// It's good practice to get the port from an environment variable for flexibility
// We'll use a different port for the device service, e.g., 3002
const port: number = process.env.DEVICE_SERVICE_PORT ? parseInt(process.env.DEVICE_SERVICE_PORT, 10) : 3002;

// Middleware to parse JSON bodies
app.use(express.json());

// A simple root route
app.get('/', (req: Request, res: Response) => {
  res.send('Device Management Service is running!');
});

// Use the device routes
app.use('/api/devices', deviceRoutes);

app.listen(port, () => {
  console.log(`Device Management Service listening on port ${port}`);
  // Attempt to log database connection status after server starts
  // This requires db.ts to have been initialized by now.
  // If db.ts itself logs connection, this might be redundant or could be a check.
  if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL is set for Device Service.");
  } else {
    console.error("FATAL: DATABASE_URL is NOT set for Device Service after .env load attempt.");
  }
});

export default app;
