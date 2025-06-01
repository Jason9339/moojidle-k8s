import {
    RegisterUser,
    LoginUser,
    DeleteUser,
    FindOneUserById,
    FindOnesTagById,
    UpdateUserPassword,
    UpdateUserTags,
    UpdateUserContactWay
} from "#src/services/user_service.js";

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
// Update user password by user ID
// In Postman send this json format in the body
// {
//     "currentPassword": "old_password",
//     "newPassword": "new_secure_password"
// }
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


async function UpdateData(req, res) {
    const userId = req.params.id;
    const { contactWays } = req.body;

    if (!Array.isArray(contactWays) || contactWays.length === 0) { // 確保 `contactWays` 為陣列
        return res.status(400).send({ message: "Contact ways must be a non-empty array" });
    }

    try {
        // 檢查用戶是否存在
        const user = await FindOneUserById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let updatedCount = 0;
        for (const newContactWay of contactWays) { // 遍歷每個 contact way 進行更新
            const result = await UpdateUserContactWay(userId, newContactWay);
            if (result.modifiedCount > 0) {
                updatedCount += result.modifiedCount;
            }
        }

        if (updatedCount > 0) {
            res.status(200).send({ message: "Contact ways updated successfully" });
        } else {
            res.status(500).send({ message: "Failed to update contact ways" });
        }
    } catch (err) {
        console.error("Error processing request:", err);
        res.status(500).send({ message: "An error occurred", error: err.message });
    }
}


async function UpdateTags(req, res) {
    const userId = parseInt(req.params.id, 10);
    const { tags } = req.body;

    if (!tags) {
        return res.status(400).send({ message: "Tags are required" });
    }

    try {
        // check if user exists
        const user = await FindOneUserById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        // update tags
        const result = await UpdateUserTags(userId, tags);
        if (result.modifiedCount > 0) {
            res.status(200).send({ message: "Tags updated successfully" });
        } else {
            res.status(500).send({ message: "Failed to update tags" });
        }
    } catch (err) {
        res.status(500).send({ message: "An error occurred", error: err.message });
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
    UpdateData
}


