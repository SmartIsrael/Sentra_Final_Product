import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the shared backend-services directory
const envPath = path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port: number = process.env.NOTIFICATION_SERVICE_PORT ? parseInt(process.env.NOTIFICATION_SERVICE_PORT, 10) : 3006;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Notification Service is running!');
});

// Placeholder for an internal API endpoint to trigger notifications
app.post('/internal/send-notification', (req: Request, res: Response) => {
  const { type, recipient, message, data } = req.body;
  // In a real service, this would:
  // 1. Validate the request (e.g., from a trusted internal source/IP or with a shared secret)
  // 2. Choose the appropriate channel (email, SMS, push) based on 'type' or recipient preferences
  // 3. Use an SDK (SendGrid, Twilio, FCM) to send the notification
  // 4. Log the attempt and result
  console.log(`Received request to send ${type} notification to ${recipient} with message: "${message}"`, data || '');
  res.status(200).json({ status: 'queued', message: 'Notification request received (placeholder).' });
});


app.listen(port, () => {
  console.log(`Notification Service listening on port ${port}`);
  // This service might not need DATABASE_URL directly unless it logs to DB or fetches templates/preferences
  if (process.env.JWT_SECRET) { // Example check for a common env var
    console.log("Shared environment variables seem loaded for Notification Service.");
  }
});

export default app;
