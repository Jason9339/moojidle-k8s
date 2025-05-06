import express from "express";
import { GetToDoAssignments } from "#src/controllers/todo_assignments_controller.js";

const router = express.Router();

router.get("/todo", GetToDoAssignments);

export default router;