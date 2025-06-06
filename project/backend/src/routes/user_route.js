import express from 'express';
const router = express.Router();

import {
    GetUserData,
    Register,
    Login,
    Delete,
    UpdatePassword,
    GetUserTags,
    UpdateTags,
    UpdateUserProfile,
    GetUserAvatar
} from '#src/controllers/user_controller.js';

import { 
    uploadAvatar,
    MulterErrorHandling 
} from '#src/utils/multer_config.js';

// the route address start from:
// http://localhost:PORT/user/get-user-by-id/:userId

// frontend gives userId and backend sends an object
// axios are expected to get an object:
//          
// {
//     "_id": "6819fb8f1575974c1ed861e1",
//     "user_id": 2,
//     "name": "User 2",
//     "contact_ways": [
//         {
//             "approach": "phone",
//             "details": "555-7694"
//         }
//     ],
//     "path_to_profile_pic": "/profiles/2.jpg",
//     "email": "user2@example.com",
//     "pw": "hashed_password_2",
//     "create_date": "2025-01-01T00:00:00",
//     "user_tags": [
//         {
//             "_id": "6819fb8f1575974c1ed862c4",
//             "user_id": 2,
//             "user_tag": "CustomTag_25"
//         }
//     ]
// }

router.get("/get-user-by-id/:userId", GetUserData);
router.get("/get-user-tags-by-id/:userId", GetUserTags);

// 安全的頭像獲取路由
router.get("/avatar/:filename", GetUserAvatar);

router.post("/register", Register);
router.post("/login", Login);

router.delete("/delete/:id", Delete);

router.put("/update-password/:id", UpdatePassword)

router.put("/update-user-tags/:id", UpdateTags);

// 統一的個人資料更新路由 - 支援同時更新聯絡方式和頭像
router.put("/update-profile/:id", uploadAvatar, UpdateUserProfile, MulterErrorHandling);

export default router;
