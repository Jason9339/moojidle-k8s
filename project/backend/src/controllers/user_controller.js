import {
    RegisterUser,
    LoginUser,
    DeleteUser,
    FindOneUserById,
    FindOnesTagById,
    UpdateUserPassword,
    UpdateUserContactWay,
    UpdateUserTags
} from "#src/services/user_service.js";

import{
    SendNotification, SendNotified
} from "#src/services/notification_service.js"

import { SaveFile, DeleteFile } from "#src/services/file_services/file_storage_service.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 獲取當前檔案的目錄
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register a new user in the database
// In Postman send this json format in the body
// {
//     "name": "John Doe",
//     "email": "john@exmple.com",
//     "password": "securepassword"
// }

async function Register(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send({ message: "All fields are required" });
    }

    try {
        const result = await RegisterUser({ name, email, password });

        if (result && result.insertedId) {
            res.status(201).send({ message: "User registered successfully" });
        } else {
            res.status(500).send({ message: "Failed to register user" });
        }
    } catch (err) {
        res.status(500).send({ message: "An error occurred", error: err.message });
    }
}
// If a matching user is found, return the user data
//  {   
//     "user_id": 2,
//     "name": "User 2",
//     "email": "user2@example.com"
// }
async function Login(req, res) {
    if (!req.body.email || !req.body.pw) {
        return res.status(400).send({ message: "Email and password are required" });
    }

    try {
        const user = await LoginUser(req.body.email, req.body.pw);

        if (user) {
            const notificationData = {
                event_id : 0,
                event_category : "login",
                context: `您有新的登入 ${new Date().toLocaleString('zh-TW', { hour12: false })}`
            };
            const notificationres = await SendNotification(notificationData);
            await SendNotified(notificationres.notification.n_id, [
                    {
                        user_id: user.user_id
                    }
                ])
            
            res.status(200).send({
                user_id: user.user_id,
                name: user.name,
                email: user.email
            });
        } else {
            res.status(401).send({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).send({ message: "An error occurred", error: err.message });
    }
}

// Delete user data by user ID 
async function Delete(req, res) {
    const userId = req.params.id;

    try {
        const result = await DeleteUser(userId);

        if (result.deletedCount > 0) {
            res.status(200).send({ message: "User deleted successfully" });
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).send({ message: "An error occurred", error: err.message });
    }
}

async function GetUserData(req, res) {
    const userId = req.params.userId;

    try {
        let resultMain = await FindOneUserById(userId);

        if (!resultMain) {
            return res.status(404).send({ message: "User not found" });
        }

        const resultTags = await FindOnesTagById(userId);
        resultMain.user_tags = resultTags;

        res.status(200).send(resultMain);
    } catch (err) {
        res.status(500).send({ message: "An error occurred", error: err.message });
    }
}

async function GetUserTags(req, res) {
    const userId = req.params.userId;

    const tags = await FindOnesTagById(userId);

    if (!tags) {
        res.status(404).send({ message: "User tags not found" });
    }

    res.status(200).send(tags);
}
async function UpdatePassword(req, res) {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).send({ message: "Current password and new password are required" });
    }

    try {
        // check if user exists
        const user = await FindOneUserById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // authenticate current password
        if (user.pw !== currentPassword) {
            return res.status(401).send({ message: "Current password is incorrect" });
        }

        // update password
        const result = await UpdateUserPassword(userId, newPassword);
        if (result.modifiedCount > 0) {
            res.status(200).send({ message: "Password updated successfully" });
        } else {
            res.status(500).send({ message: "Failed to update password" });
        }
    } catch (err) {
        res.status(500).send({ message: "An error occurred", error: err.message });
    }
}

async function UpdateTags(req, res) {
    const userId = parseInt(req.params.id, 10);
    const { tags } = req.body;

    // 驗證 tags 是否為陣列
    if (!Array.isArray(tags)) {
        return res.status(400).send({
            message: "標籤必須是陣列格式",
            example: ["標籤1", "標籤2"],
        });
    }

    // 如果陣列不為空，驗證每個標籤
    if (tags.length > 0) {
        for (const tag of tags) {
            if (typeof tag !== "string" || tag.trim() === "") {
                return res.status(400).send({
                    message: "每個標籤都必須是非空的字串",
                    example: ["標籤1", "標籤2"],
                });
            }
        }
    }

    try {
        // 確認使用者是否存在
        const user = await FindOneUserById(userId);
        if (!user) {
            return res.status(404).send({ message: "找不到使用者" });
        }

        // 更新標籤
        const result = await UpdateUserTags(userId, tags);

        return res.status(200).send({
            message: "成功更新標籤",
            insertedCount: result.newIds ? result.newIds.length : 0,
            // newIds: result.newIds || [],
        });
    } catch (err) {
        console.error("UpdateTags error:", err);
        return res.status(500).send({
            message: "更新標籤失敗",
            error: err.message
        });
    }
}

// 統一的個人資料更新端點 - 支援同時更新聯絡方式和頭像
async function UpdateUserProfile(req, res) {
    const userId = req.params.id;

    try {
        // 檢查使用者是否存在
        const user = await FindOneUserById(userId);
        if (!user) {
            return res.status(404).send({ message: "使用者不存在" });
        }

        // 從請求中取得聯絡方式資料
        let contactWays = [];
        if (req.body.contactWays) {
            try {
                // 如果是字串，嘗試解析為 JSON
                contactWays = typeof req.body.contactWays === 'string' 
                    ? JSON.parse(req.body.contactWays) 
                    : req.body.contactWays;
            } catch (parseError) {
                return res.status(400).send({ 
                    message: "聯絡方式格式錯誤，請確認資料格式正確" 
                });
            }
        } else {
            // 如果沒有提供聯絡方式，保持原有的
            contactWays = user.contact_ways || [];
        }

        // 驗證聯絡方式格式
        if (!Array.isArray(contactWays)) {
            return res.status(400).send({
                message: "聯絡方式必須是陣列格式",
                example: [{
                    approach: "email",
                    details: "example@email.com"
                }]
            });
        }        let avatarUrl = null;

        // 檢查是否有新頭像上傳
        const uploadedFile = req.file || (req.files && req.files[0]);
        if (uploadedFile) {
            // 如果使用者已有頭像，先刪除舊的
            if (user.path_to_profile_pic && user.path_to_profile_pic.trim() !== "") {
                try {
                    await DeleteFile(user.path_to_profile_pic);
                } catch (deleteError) {
                    console.warn("刪除舊頭像失敗，但繼續上傳新頭像:", deleteError.message);
                }
            }

            // 儲存新頭像到 profiles 資料夾
            const savedFile = await SaveFile(uploadedFile.buffer, decodeURIComponent(uploadedFile.originalname), "profiles");
            avatarUrl = savedFile.relativeUrl;
        }

        // 更新資料庫
        const result = await UpdateUserContactWay(userId, contactWays, avatarUrl);

        if (result.modifiedCount > 0) {
            return res.status(200).send({                message: "個人資料更新成功",
                updatedContactWays: result.updatedContactWays,
                updatedAvatar: result.updatedAvatar || user.path_to_profile_pic,
                hasNewAvatar: !!uploadedFile
            });
        } else {
            return res.status(200).send({                message: "沒有資料需要更新",
                updatedContactWays: result.updatedContactWays,
                updatedAvatar: result.updatedAvatar || user.path_to_profile_pic,
                hasNewAvatar: !!uploadedFile
            });
        }

    } catch (err) {
        console.error("更新個人資料錯誤:", err);
        return res.status(500).send({
            message: "更新個人資料失敗",
            error: err.message
        });
    }
}

// 安全的頭像檔案獲取 API
async function GetUserAvatar(req, res) {
    const { path: avatarPath } = req.query;
    
    try {
        // 預設頭像路徑 - 從前端 public 目錄獲取
        const defaultPath = path.join(__dirname, '../../../frontend/public/user_pfp/default.png');
        
        // 如果沒有提供路徑或為預設路徑，返回預設頭像
        if (!avatarPath || avatarPath === '/user_pfp/default.png' || avatarPath.trim() === '') {
            return res.sendFile(defaultPath);
        }
        
        // 從路徑中提取檔案名稱
        const filename = avatarPath.split('/').pop();
        if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return res.sendFile(defaultPath);
        }
        
        // 構建安全的檔案路徑
        const uploadsDir = path.join(__dirname, '../../uploads/profiles');
        const filePath = path.join(uploadsDir, filename);
        
        // 檢查檔案是否存在
        if (!fs.existsSync(filePath)) {
            return res.sendFile(defaultPath);
        }
        
        // 檢查檔案類型
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const fileExtension = path.extname(filename).toLowerCase();
        
        if (!allowedExtensions.includes(fileExtension)) {
            return res.sendFile(defaultPath);
        }
        
        // 發送檔案
        res.sendFile(filePath);
        
    } catch (err) {
        console.error("獲取頭像檔案錯誤:", err);
        // 錯誤時也返回預設頭像
        const defaultPath = path.join(__dirname, '../../../frontend/public/user_pfp/default.png');
        return res.sendFile(defaultPath);
    }
}


export {
    Register,
    Login,
    Delete,
    GetUserData,
    GetUserTags,
    UpdatePassword,
    UpdateTags,
    UpdateUserProfile,
    GetUserAvatar
}


