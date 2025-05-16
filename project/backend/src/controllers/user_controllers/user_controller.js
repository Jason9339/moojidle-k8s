import {
    RegisterUser,
    LoginUser,
    DeleteUser,
    FindOneUserById,
    FindOnesTagById,
    UpdateUserPassword
} from "#src/services/user_services/user_service.js";

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

        if (result.insertedId) {
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

    let resultMain = await FindOneUserById(userId);
    const resultTags = await FindOnesTagById(userId);

    resultMain.user_tags = resultTags;

    if (resultMain) {
        res.status(200).send(resultMain);
    } else {
        res.status(404).send({ message: "User not found" });
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

async function SignUpByGoogleApi(userData) {
    let result;

    try {
        // 檢查 email 是否已存在
        const existingUser = await mongoose.connection.db.collection('user').findOne({ email: userData.email });
        if (existingUser) {
            return { alreadyExists: true, user: existingUser };
        }

        // 取得下一個 user_id
        const counter = await mongoose.connection.db.collection('counter').findOne();
        const nextUserId = counter.user + 1;

        // 寫入 user collection
        result = await mongoose.connection.db.collection('user').insertOne({
            user_id: nextUserId,
            name: userData.name,
            email: userData.email,
            pw: "", // Google 註冊不設密碼
            create_date: new Date(),
            contact_ways: [
                {
                    approach: "email",
                    details: userData.email
                }
            ],
            path_to_profile_pic: userData.picture || "" // 可選：Google 頭像
        });

        // 更新 counter
        await mongoose.connection.db.collection('counter').updateOne(
            {},
            { $inc: { user: 1 } }
        );
    } catch (err) {
        console.log(err);
        throw err;
    }

    return result;
}
export {
    Register,
    Login,
    Delete,
    GetUserData,
    GetUserTags,
    UpdatePassword,
}


