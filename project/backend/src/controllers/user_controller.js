import { 
    AllUserData,
    UserProfileData,
    UserUpdatePassword,
    RegisterUser,
    LoginUser
} from "#src/services/user_service.js";

async function GetAllUserData(req, res) {
    let result = await AllUserData();

    res.status(200).send(result);
   
}

async function GetUserProfileData(req, res) {
    const userId = req.params.id;
    let result = await UserProfileData(userId);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send({ message: "User not found" });
    }
}

async function UpdateUserPassword(req, res) {
    const userId = req.params.id; 
    const { newPassword } = req.body; 

    if (!newPassword) {
        return res.status(400).send({ message: "New password is required" });
    }

    try {
        const result = await UserUpdatePassword(userId, newPassword);

        if (result.modifiedCount > 0) {
            res.status(200).send({ message: "Password updated successfully" });
        } else {
            res.status(404).send({ message: "User not found or password not updated" });
        }
    } catch (err) {
        res.status(500).send({ message: "An error occurred", error: err.message });
    }
}

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

async function Login(req, res) {
    if (!req.body.email || !req.body.pw) {
        return res.status(400).send({ message: "Email and password are required" });
    }

    try {
        const user = await LoginUser(req.body.email, req.body.pw);

        if (user) {
            // If a matching user is found, return the user data
            res.status(200).send({
                message: "Login successful",
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email
                }
            });
        } else {
            // If no matching user is found, return an error
            res.status(401).send({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).send({ message: "An error occurred", error: err.message });
    }
}

async function Logout(req, res) {
    res.status(200).send({ message: "Logged out successfully" });
}

export {
    GetAllUserData,
    GetUserProfileData,
    UpdateUserPassword,
    Register,
    Login,
    Logout
}