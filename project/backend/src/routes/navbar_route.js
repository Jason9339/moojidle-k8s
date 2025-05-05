import express from "express";
import { GetNavbarData } from "#src/controllers/navbar_controller.js";

const router = express.Router();

// Endpoint: GET /navbar
router.get("/", GetNavbarData);

export default router;