import express from 'express';
const router = express.Router();

import { CreateCourse,DeleteCourse } from '#src/controllers/course_controller.js';

// the route address start from:
// http://localhost:PORT/course

// for example purpose:
// frontend gives nothing and backend sends an arry of object
// axios are expected to get a array:
//          
//      [
//          {
//              "_id": "6810d7fdbd1eb7784fd861e0",
//              "user_id": 1,
//              "name": "User 1",
//              "contact_ways": [
//                  {
//                      "approach": "email",
//                      "details": "user85@example.com"
//                  },
//                  {
//                      "approach": "social_media",
//                      "details": "@user7"
//                  },
//                  {
//                      "approach": "phone",
//                      "details": "555-8598"
//                  }
//              ],
//              "path_to_profile_pic": "/profiles/1.jpg",
//              "email": "user1@example.com",
//              "pw": "hashed_password_1",
//              "create_date": "2020-10-06T03:57:48.000Z"
//          },
//          ....
router.get("/", async (req, res) => {
    return res.status(200).send("Hello from course router!!");
})
router.post("/create", CreateCourse);
router.delete("/delete/:id", DeleteCourse);

export default router;
