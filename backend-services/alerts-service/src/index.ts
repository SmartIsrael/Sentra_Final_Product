
import express, { Express, Request, Response } from 'express';
import cors from 'cors'; // Import cors
import alertRoutes from './routes/alertRoutes'; // Import the alert routes

const app: Express = express();
const port: number = process.env.ALERTS_SERVICE_PORT ? parseInt(process.env.ALERTS_SERVICE_PORT, 10) : 3004;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:8082', // Updated to match frontend origin
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Alerts Service is running!');
});

// Use the alert routes
app.use('/api/alerts', alertRoutes);

app.listen(port, () => {
  console.log(`Alerts Service listening on port ${port}`);
  if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL is set for Alerts Service.");
    // db.ts should log its own connection message
  } else {
    console.error("Alerts Service FATAL: DATABASE_URL is NOT set after .env load attempt.");
  }
});

export default app;
