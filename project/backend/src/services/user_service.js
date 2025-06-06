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

async function UpdateUserTags(userId, newTags) {
    try {
        const collection = mongoose.connection.db.collection("custom_tag");


        await collection.deleteMany({ user_id: parseInt(userId) });

        // 如果有新標籤才新增
        if (Array.isArray(newTags) && newTags.length > 0) {
            const toInsert = newTags.map((tagStr) => ({
                user_id: parseInt(userId),
                user_tag: tagStr,
            }));
            const insertResult = await collection.insertMany(toInsert);
            return {
                modifiedCount: insertResult.insertedCount,
                message: "標籤更新成功",
                newIds: Object.values(insertResult.insertedIds).map((id) => id.toString()),
            };
        }

        // 回傳清空標籤的訊息
        return { 
            modifiedCount: 0, 
            message: "已清空所有標籤",
            newIds: []
        };
    } catch (err) {
        console.error("UpdateUserTags error:", err);
        throw new Error(`更新使用者標籤失敗: ${err.message}`);
    }
}



async function UpdateUserProfileData(userId, newContactWays, avatarUrl = null) {
    let result;
    try {
       

        // 驗證 newContactWays 是否為陣列
        if (!Array.isArray(newContactWays)) {
            throw new Error("聯絡方式必須是陣列格式");
        }

        // 如果有聯絡方式，驗證每個聯絡方式的格式
        const validContactWays = newContactWays.map(contact => ({
            approach: (contact.approach || "").trim(),
            details: (contact.details || "").trim()
        })).filter(contact => 
            contact.approach !== "" && 
            contact.details !== ""
        );

        // 準備更新的欄位
        const updateFields = {
            contact_ways: validContactWays
        };        // 如果有提供頭像 URL，則加入更新欄位
        if (avatarUrl !== null && avatarUrl !== undefined && avatarUrl.trim() !== "") {
            updateFields.path_to_profile_pic = avatarUrl.trim();
        }

        // 更新聯絡方式和頭像
        result = await mongoose.connection.db.collection('user').updateOne(
            { user_id: parseInt(userId) },
            {
                $set: updateFields
            }
        );

        return {
            modifiedCount: result.modifiedCount,
            message: result.modifiedCount ? "資料更新成功" : "沒有更新任何資料",
            updatedContactWays: validContactWays,
            updatedAvatar: avatarUrl
        };    } catch (err) {
        console.error("Error updating contact ways and avatar:", err);
        throw new Error(`更新聯絡方式和頭像失敗: ${err.message}`);
    }
}

export {
    RegisterUser,
    LoginUser,
    DeleteUser,
    FindOneUserById,
    FindOnesTagById,
    UpdateUserPassword,
    UpdateUserTags,
    UpdateUserProfileData
}
