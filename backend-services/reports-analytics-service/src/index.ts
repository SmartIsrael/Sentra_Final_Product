import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the shared backend-services directory
const envPath = path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

import express, { Express, Request, Response } from 'express';
import reportRoutes from './routes/reportRoutes'; // We'll create this next

const app: Express = express();
const port: number = process.env.REPORTS_ANALYTICS_SERVICE_PORT ? parseInt(process.env.REPORTS_ANALYTICS_SERVICE_PORT, 10) : 3007;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Reports & Analytics Service is running!');
});

// Placeholder for future routes
app.use('/api/reports', reportRoutes);
// app.use('/api/analytics', analyticsRoutes);


app.listen(port, () => {
  console.log(`Reports & Analytics Service listening on port ${port}`);
  if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL is set for Reports & Analytics Service.");
  } else {
    console.error("Reports & Analytics Service FATAL: DATABASE_URL is NOT set after .env load attempt.");
  }
});

export default app;
