import express, { Router, Request, Response } from 'express';
import { db } from '../db';

const router: Router = express.Router();

router.get('/farmer-reports', async (req: Request, res: Response) => {
  try {
    const farmerReports = await db.query('SELECT * FROM farmerReport');
    res.json(farmerReports.rows || []);
  } catch (error) {
    console.error("Error fetching farmer reports:", error);
    res.status(500).json({ error: "Failed to fetch farmer reports" });
  }
});

export default router;
