import mongoose from 'mongoose';

// this file is to input our CONSTANT SEED into the mongoDB running on out memory
// NOTICE!!!!!!!!!! this files's seed DOES NOT need to be the same as our /database/Seed.js

async function CounterSeed() {
    await mongoose.connection.db.collection('counter').insertOne({
        announcement: 0,
        assignments: 0,
        assist_in: 0,
        course: 0,
        course_tag: 0,
        custom_tag: 0,
        discussion_board: 0,
        exams: 0,
        mailbox: 0,
        materials: 0,
        post: 0,
        study_in: 0,
        submitted_ass: 0,
        teach_in: 0,
        user: 2
    });
}

async function UserSeed() {
    // 創建測試用戶數據，與 Seed.js 中的前兩個用戶保持一致
    await mongoose.connection.db.collection('user').insertMany([
        {
            user_id: 1,
            name: "User 1",
            contact_ways: [
                {
                    approach: "phone",
                    details: "555-5491"
                },
                {
                    approach: "social_media",
                    details: "@user49"
                }
            ],
            path_to_profile_pic: "/profiles/1.jpg",
            email: "user1@example.com",
            pw: "hashed_password_1",
            create_date: new Date("2025-01-01T00:00:00.000Z")
        },
        {
            user_id: 2,
            name: "User 2",
            contact_ways: [
                {
                    approach: "social_media",
                    details: "@user7"
                },
                {
                    approach: "phone",
                    details: "555-5864"
                },
                {
                    approach: "email",
                    details: "user76@example.com"
                }
            ],
            path_to_profile_pic: "/profiles/2.jpg",
            email: "user2@example.com",
            pw: "hashed_password_2",
            create_date: new Date("2025-01-01T00:00:00.000Z")
        }
    ]);
}

async function UserTagSeed() {
    await mongoose.connection.db.collection('custom_tag').insertMany([
        {
            user_id: 1,
            user_tag: "User1's CustomTag_1"
        },
        {
            user_id: 2,
            user_tag: "User2's CustomTag_1"
        },
        {
            user_id: 2,
            user_tag: "User2's CustomTag_2"
        }
    ]);
}

export {
    CounterSeed,
    UserSeed,
    UserTagSeed
}