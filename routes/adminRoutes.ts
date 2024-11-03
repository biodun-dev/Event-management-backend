import express from "express";
const router = express.Router();
import { isAdmin } from "../middleware/role";
import {
  getUserCount,
} from "../controllers/UserController";
import { Request, Response } from "express";
import {
  findHighestCenter,
  findLowestCenter,
  findTopPerformingCenters,
  getTotalRegisteredMembers,
  getAllRegisteredMembers
} from "../controllers/UserController";

import authenticateToken from "../middleware/authenticateToken";

router.get("/all-users",  async (req, res) => {
});
router.get("/user-count",isAdmin, getUserCount);

router.get("/centers/highest", async (req, res) => {
  try {
    const highestCenter = await findHighestCenter();
    if (highestCenter.length > 0) {
      res.json({ success: true, highestCenter: highestCenter[0] });
    } else {
      res.json({ success: false, message: "No centers found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching highest center:", error.message);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    } else {
      console.error("Error fetching highest center:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
});

router.get("/centers/lowest", async (req, res) => {
  try {
    const lowestCenter = await findLowestCenter();
    if (lowestCenter.length > 0) {
      res.json({ success: true, lowestCenter: lowestCenter[0] });
    } else {
      res.json({ success: false, message: "No centers found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching lowest center:", error.message);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    } else {
      console.error("Error fetching lowest center:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
});

router.get("/centers/top-performing", async (req: Request, res: Response) => {
  try {
    const topCenters = await findTopPerformingCenters();
    res.json({ success: true, topCenters });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching top performing centers:", error.message);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    } else {
      console.error("Error fetching top performing centers:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: "An unknown error occurred",
      });
    }
  }
});

router.get('/members/total', async (req: Request, res: Response) => {
  try {
    const totalMembers = await getTotalRegisteredMembers();
    res.json({ success: true, totalMembers });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching total registered members:', error.message);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    } else {
      console.error('Error fetching total registered members:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
});


router.get('/members/all', async (req: Request, res: Response) => {
  try {
    const members = await getAllRegisteredMembers();
    res.json({ success: true, members });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching registered members:', error.message);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    } else {
      console.error('Error fetching registered members:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
});

export default router;
