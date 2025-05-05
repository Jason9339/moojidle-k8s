import express from 'express';
const router = express.Router();

import {
    GetAllUserData,
    Register,
    Login,
    Delete
} from '#src/controllers/user_controllers/user_controller.js';

router.get("/", GetAllUserData);

router.post("/register", Register);
router.post("/login", Login);

router.delete("/delete/:id", Delete);

export default router;