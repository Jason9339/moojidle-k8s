import mongoose from "mongoose"

async function FindOneUserById(user_id) {
    let result;

    try {
        result = await mongoose.connection.db.collection('user').findOne(
            // { _id: mongoose.Types.ObjectId.createFromHexString(user_id) }
            { user_id: parseInt(user_id) }
        );
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function RegisterUser(userData) {
    let result;

    try {
        // Check if the email already exists in the database
        const existingUser = await mongoose.connection.db.collection('user').findOne({ email: userData.email });
        if (existingUser) {
            return null;
        }

        // Find the highest user_id in the database and calculate the next user_id
        // we get this my querying into counter document
        const counter = await mongoose.connection.db.collection('counter').findOne();
        if (!counter) {
            throw new Error("Counter document not found. Please initialize your counter collection.");
        }
        const nextUserId = counter.user + 1;

        // Insert the new user into the database
        result = await mongoose.connection.db.collection('user').insertOne({
            user_id: nextUserId, // Auto-incremented user_id
            name: userData.name,
            email: userData.email,
            pw: userData.password, // Store the password (consider hashing for security)
            create_date: new Date(), // Set the current date as the creation date
            contact_ways: [
                {
                    approach: "email", // Default contact method
                    details: userData.email // Default phone number
                }
            ]
        });

        await mongoose.connection.db.collection('counter').updateOne(
            {},
            { $inc: { user: 1 } }
        );
    } catch (err) {
        console.log(err); // Log any errors that occur
        throw err; // Re-throw the error to be handled by the controller
    }

    return result; // Return the result of the insert operation
}

// Authenticate a user by email and password
// In Postman send this json format in the body
// {
//     "email": "user2@example.com",
//     "pw": "hashed_password_2"
// }
async function LoginUser(email, password) {
    let result;

    try {
        // Query the 'user' collection to find a user with the specified email and password
        result = await mongoose.connection.db.collection('user').findOne({
            email: email,
            pw: password
        });
    } catch (err) {
        console.log(err); // Log any errors that occur
    }

    return result; // Return the user document if found, otherwise null
}

// Delete a user by user ID
async function DeleteUser(userId) {
    let result;

    try {
        // Delete the user from the database
        result = await mongoose.connection.db.collection('user').deleteOne({ user_id: parseInt(userId) });
    } catch (err) {
        console.log(err); // Log any errors that occur
    }

    return result; // Return the result of the delete operation
}

async function FindOnesTagById(user_id) {
    let result;

    try {
        result = await mongoose.connection.db.collection('custom_tag').find(
            { user_id: parseInt(user_id) }
        ).toArray();
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function UpdateUserPassword(userId, newPassword) {
    let result;

    try {
        result = await mongoose.connection.db.collection('user').updateOne(
            { user_id: parseInt(userId) },
            { $set: { pw: newPassword } }
        );
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function UpdateUserTags(userId, _id, newTags) {
    let result;
    try {
        // 確認該 _id 存在
        const existingTag = await mongoose.connection.db.collection('custom_tag').findOne({
            user_id: parseInt(userId),
            _id: new mongoose.Types.ObjectId(_id) // 確保 _id 是合法的 ObjectId
        });

        if (!existingTag) {
            return { modifiedCount: 0, message: "Tag not found" };
        }

        // 針對指定 _id 修改 `user_tag`
        result = await mongoose.connection.db.collection('custom_tag').updateOne(
            { user_id: parseInt(userId), _id: new mongoose.Types.ObjectId(_id) },
            { $set: { user_tag: newTags } }
        );
    } catch (err) {
        console.error("Error updating user tags:", err);
        return { modifiedCount: 0, message: "An error occurred", error: err.message };
    }

    return result;
}

async function UpdateUserContactWay(userId, newContactWay) {
    let result;
    try {
        result = await mongoose.connection.db.collection('user').updateOne(
            { user_id: parseInt(userId), "contact_ways.approach": newContactWay.approach }, // 確保匹配的數據存在
            { 
                $set: { 
                    "contact_ways.$.approach": newContactWay.approach, 
                    "contact_ways.$.details": newContactWay.details 
                } 
            }
        );
    } catch (err) {
        console.error("Error updating contact ways:", err);
    }

    return result;
}


export {
    RegisterUser,
    LoginUser,
    DeleteUser,
    FindOneUserById,
    FindOnesTagById,
    UpdateUserPassword,
    UpdateUserTags,
    UpdateUserContactWay
}
