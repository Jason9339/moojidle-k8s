import express from "express";
import { getAnnouncements } from "#src/controllers/announcements_controller.js";

const router = express.Router();

router.get("/:courseId", getAnnouncements);

export default router;
