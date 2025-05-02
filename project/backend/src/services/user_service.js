import mongoose from "mongoose"

async function AllUserData() {
    let result;
    try {
        result = await mongoose.connection.db.collection('user').find().toArray();
    } catch (err) {
        console.log(err);
    }

    return result;
}

// Get user profile data by user ID
// Example response format:
// {
//     "name": "User 1",
//     "contact_ways": [
//       {
//         "approach": "phone",
//         "details": "555-3791"
//       }
//     ],
//     "path_to_profile_pic": "/profiles/1.jpg",
//     "email": "user1@example.com",
//     "create_date": "2022-08-14T05:41:30.000Z"
//   }
async function UserProfileData(userId) {
    let result;
    try {
        // Query the database for a user with the specified user_id
        result = await mongoose.connection.db.collection('user').findOne(
            { user_id: parseInt(userId) },
            { projection: { name: 1, contact_ways: 1, path_to_profile_pic: 1, email: 1, create_date: 1 } }
        );
    } catch (err) {
        console.log(err);
    }

    return result;
}
// In Postman send this json format in the body
// {
//     "newPassword": "your_new_password"
// }
async function UserUpdatePassword(userId, newPassword) {
    let result;
    
    // Update the user's password in the database
    result = await mongoose.connection.db.collection('user').updateOne(
        { user_id: parseInt(userId) },
        { $set: { pw: newPassword } }
    );

    return result;
}

async function RegisterUser(userData) {
    let result;

    try {
        // Find the highest user_id in the database
        const lastUser = await mongoose.connection.db.collection('user').find().sort({ user_id: -1 }).limit(1).toArray();
        const nextUserId = lastUser.length > 0 ? lastUser[0].user_id + 1 : 1; // Start from 1 if no users exist

        // Insert the new user with the next user_id
        result = await mongoose.connection.db.collection('user').insertOne({
            user_id: nextUserId, // Incremented user_id
            name: userData.name,
            email: userData.email,
            pw: userData.password, 
            create_date: new Date(),
            contact_ways: [
                {
                    approach: "phone",
                    details: "555-3791"
                }
            ]
        });
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function LoginUser(email, password) {
    let result;

    try {
        // Query the database for a user with the specified email and password
        result = await mongoose.connection.db.collection('user').findOne({
            email: email,
            pw: password
        });
    } catch (err) {
        console.log(err);
    }

    return result; 
}

export {
    AllUserData,
    UserProfileData,
    UserUpdatePassword,
    RegisterUser,
    LoginUser
}