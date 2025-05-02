import express from 'express';
const router = express.Router();

import {
    GetAllUserData,
    GetUserProfileData, 
    UpdateUserPassword,
    Register,
    Login,
    Logout
} from '#src/controllers/user_controller.js';

router.get("/", GetAllUserData);
router.get("/user-profile/:id", GetUserProfileData);

router.put("/update-password/:id", UpdateUserPassword);

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);

export default router;