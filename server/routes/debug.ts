import { Router, Request, Response } from 'express';

const router = Router();

// Simple debug endpoint to log client-submitted payloads
router.post('/log', (req: Request, res: Response) => {
  try {
    console.log('DEBUG LOG:', JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('DEBUG LOG ERROR:', err);
    res.status(500).json({ success: false });
  }
});

export default router;
