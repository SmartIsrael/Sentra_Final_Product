
import express, { Express, Request, Response } from 'express';
import { farmRoutes } from './routes/farmRoutes'; // Changed to named import
import fieldRoutes from './routes/fieldRoutes'; // Assuming fieldRoutes still uses default export

const app: Express = express();
const port: number = process.env.FARM_CROP_SERVICE_PORT ? parseInt(process.env.FARM_CROP_SERVICE_PORT, 10) : 3003;

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req: Request, res: Response) => {
  res.send('Farm & Crop Service is running!');
});

// Use the farm and field routes
app.use('/api/farms', farmRoutes); // Base path for farms
farmRoutes.use('/:farmId/fields', fieldRoutes); // Nested fields routes under /api/farms/:farmId/fields

app.listen(port, () => {
  console.log(`Farm & Crop Service listening on port ${port}`);
  if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL is set for Farm & Crop Service.");
    // db.ts should log its own connection message
  } else {
    console.error("Farm & Crop Service FATAL: DATABASE_URL is NOT set after .env load attempt.");
  }
});

export default app;
