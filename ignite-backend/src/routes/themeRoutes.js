import express from "express";
import {
  createTheme,
  getThemes,
  getThemeById,
  deleteTheme,
} from "../controllers/themeController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getThemes);
router.get("/:id", getThemeById);

// Admin only
router.post("/", protect, admin, createTheme);
router.delete("/:id", protect, admin, deleteTheme);

export default router;

