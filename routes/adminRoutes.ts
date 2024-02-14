import express from 'express';
const router = express.Router();

import authenticateToken from '../middleware/authenticateToken';

// Example admin route
router.get('/admin/all-users', authenticateToken, async (req, res) => {
  // Logic to list all users
});

export default router;
