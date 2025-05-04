import express from 'express'
const router = express.Router()

import { 
    GetUserData
} from "#src/controllers/user_controllers/user_controller.js";

// the route address start from:
// http://localhost:PORT/user/get-user-by-id/:userId

// frontend gives userId and backend sends an object
// axios are expected to get an object:
//          
// {
//     _id: ObjectId('6810d7fdbd1eb7784fd861e1'),
//     user_id: 2,
//     name: 'User 2',
//     contact_ways: [ { approach: 'social_media', details: '@user39' } ],
//     path_to_profile_pic: '/profiles/2.jpg',
//     email: 'user2@example.com',
//     pw: 'hashed_password_2',
//     create_date: ISODate('2023-12-01T23:02:43.000Z')
// }

router.get("/get-user-by-id/:userId", GetUserData);

export default router;