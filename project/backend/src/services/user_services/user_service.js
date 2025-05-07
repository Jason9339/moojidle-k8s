import mongoose from "mongoose"

// Fetch all user data from the database
async function AllUserData() {
    
    let result = await mongoose.connection.db.collection('user').find().toArray();

    return result;
}

async function RegisterUser(userData) {
    let result;

    try {
        // Check if the email already exists in the database
        const existingUser = await mongoose.connection.db.collection('user').findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("Email already exists"); // Throw an error if the email is already registered
        }

        // Find the highest user_id in the database and calculate the next user_id
        // The idea is that if the user_id is 16, the next user_id will be 17
        // If no users exist, start from 1
        const lastUser = await mongoose.connection.db.collection('user').find().sort({ user_id: -1 }).limit(1).toArray();
        const nextUserId = lastUser.length > 0 ? lastUser[0].user_id + 1 : 1; // Start from 1 if no users exist

        // Insert the new user into the database
        result = await mongoose.connection.db.collection('user').insertOne({
            user_id: nextUserId, // Auto-incremented user_id
            name: userData.name,
            email: userData.email,
            pw: userData.password, // Store the password (consider hashing for security)
            create_date: new Date(), // Set the current date as the creation date
            contact_ways: [
                {
                    approach: "phone", // Default contact method
                    details: "555-3791" // Default phone number
                }
            ]
        });
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

export {
    AllUserData,
    RegisterUser,
    LoginUser,
    DeleteUser
}