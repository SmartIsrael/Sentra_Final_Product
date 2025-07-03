
import express, { Express, Request, Response } from 'express';
import cors from 'cors'; // Import cors
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig'; // Import the swagger configuration
import userRoutes from './routes/userRoutes'; // Import the user routes

const app: Express = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001; // User service on port 3001

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:8082', // Allow requests from your frontend origin
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// A simple root route
app.get('/', (req: Request, res: Response) => {
  res.send('User Service is running!');
});

// Use the user routes
app.use('/api', userRoutes);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`User Service listening on port ${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
});

export default app;
