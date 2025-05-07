import { 
    AllUserData,
    RegisterUser,
    LoginUser,
    DeleteUser
} from "#src/services/user_services/user_service.js";

async function GetAllUserData(req, res) {
    let result = await AllUserData();

    res.status(200).send(result);
   
}

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
        if (err.message === "Email already exists") {
            res.status(409).send({ message: "Email already exists. Please use a different email." }); // 409 Conflict
        } else {
            res.status(500).send({ message: "An error occurred", error: err.message });
        }
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
export {
    GetAllUserData,
    Register,
    Login,
    Delete
}