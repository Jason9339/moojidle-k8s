import mongoose from 'mongoose';

// this file is to input our CONSTANT SEED into the mongoDB running on out memory
// NOTICE!!!!!!!!!! this files's seed DOES NOT need to be the same as our /database/Seed.js

async function CounterSeed() {
    await mongoose.connection.db.collection('counter').insertOne({
        announcement: 1,
        assignments: 1,
        assist_in: 1,
        course: 2,
        course_tag: 3,
        custom_tag: 3,
        discussion_board: 1,
        exams: 1,
        mailbox: 1,
        materials: 1,
        post: 1,
        study_in: 1,
        submitted_ass: 1,
        teach_in: 1,
        user: 4,
        notification: 1,
        notified : 2,
        taken_exams : 1
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
        },
        {
            user_id: 3,
            name: "User 3",
            contact_ways: [
                {
                    approach: "email",
                    details: "user76@example.com"
                }
            ],
            path_to_profile_pic: "/profiles/3.jpg",
            email: "user3@example.com",
            pw: "hashed_password_3",
            create_date: new Date("2025-01-01T00:00:00.000Z")
        },

        {
            user_id: 4,
            name: "Calendar User",
            contact_ways: [
                {
                    approach: "email",
                    details: "calendaruser@example.com"
                }
            ],
            path_to_profile_pic: "/profiles/4.jpg",
            email: "calendaruser@example.com",
            pw: "hashed_password_4",
            create_date: new Date("2025-01-01T00:00:00.000Z")
        }


    ]);
}

async function Custom_tagSeed() {
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
        },
        {
            user_id: 3,
            user_tag: "User3's CustomTag_1"
        }
    ]);
}

async function CourseSeed() {
    await mongoose.connection.db.collection('course').insertMany([
        {
            "course_id": 1,
            "name": "Course 1",
            "description": "This is the description for course 1.",
            "create_date": new Date("2025-01-01T00:00:00.000Z"),
            "start_date": new Date("2025-01-01T00:00:00.000Z"),
            "syllabus": "Syllabus for course 1",
            "invite_link": "http://example.com/course_1/invite",
            "week_num": 18,
            "color": "#4A90E2"
        },
        {

            "course_id": 2,
            "name": "Calendar Course",
            "description": "This is the description for course 2.",
            "create_date": new Date("2025-01-01T00:00:00.000Z"),
            "start_date": new Date("2025-01-01T00:00:00.000Z"),
            "syllabus": "Syllabus for course 2",
            "invite_link": "http://example.com/course_2/invite",
            "week_num": 16,
            "color": "#00FF00"
        }
    ]);
}

async function Teach_inSeed() {
    await mongoose.connection.db.collection('teach_in').insertMany([
        {
            "user_id": 1,
            "course_id": 1
        },

        // Calendar
        {
            "user_id": 4,
            "course_id": 2,
            "student_id": 1
        }
    ]);
}

async function Assist_inSeed() {
    await mongoose.connection.db.collection('assist_in').insertMany([
        {
            "user_id": 2,
            "course_id": 1
        },
    ]);
}

async function Study_inSeed() {
    await mongoose.connection.db.collection('study_in').insertMany([
        {
            "user_id": 3,
            "course_id": 1,
            "student_id": 1
        },


    ]);
}

async function AnnouncementSeed() {
    await mongoose.connection.db.collection('announcement').insertMany([
        {
            "a_id": 1,
            "create_date": new Date("2025-01-15T00:00:00.000Z"),
            "announce_date": new Date("2025-01-15T00:00:00.000Z"),
            "context": "Announcement 1 content.",
            "user_id": 1,
            "course_id": 1
        },
    ]);
}

async function Discussion_boardSeed() {
    await mongoose.connection.db.collection('discussion_board').insertMany([
        {
            "board_id": 1,
            "course_id": 1,
            "name": "Discussion Board 1 for Course 1"
        },
    ]);
}

async function ExamsSeed() {
    await mongoose.connection.db.collection('exams').insertMany([
        {
            "exam_id": 1,
            "in_course_id": 1,
            "create_by_user_id": 1,
            "exam_name": "Exam 1 for Course 1",
            "start_date": new Date("2025-01-15T00:00:00.000Z"),
            "end_date": new Date("2025-01-15T03:00:00.000Z"),
            "create_date": new Date("2025-01-01T00:00:00.000Z"),
            "max_score": 100,
            "percentage": 0.1,
            "description": "This is the description for Exam 1.",
            "attachments": []
        },
    ]);
}

async function Taken_examsSeed() {
    await mongoose.connection.db.collection('taken_exams').insertMany([
        {
            "t_exam_id": 1,
            "exam_id": 1,
            "taken_by_user_id": 3,
            "taken_user_course_tag": "User3's CustomTag_1",
            "score": 100,
            "graded_by_user_id": 1,
            "attachments": [],
            "description": "This is the grade for Exam 1 by User 3."
        },
    ]);
}

async function MaterialsSeed() {
    await mongoose.connection.db.collection('materials').insertMany([
        {
            "m_id": 1,
            "in_course_id": 1,
            "create_by_user_id": 1,
            "m_name": "Material 1 for Course 1",
            "create_date": new Date("2025-01-08T00:00:00.000Z"),
            "display_date": new Date("2025-01-08T00:00:00.000Z"),
            "url": "http://example.com/materials/course_1/material_1.pdf"
        },
    ]);
}

async function AssignmentsSeed() {
    await mongoose.connection.db.collection('assignments').insertMany([
        {
            "ass_id": 1,
            "in_course_id": 1,
            "create_by_user_id": 1,
            "ass_name": "Assignment 1 for Course 1",
            "create_date": new Date("2025-01-08T00:00:00.000Z"),
            "start_date": new Date("2025-01-08T00:00:00.000Z"),
            "end_date": new Date("2025-01-15T00:00:00.000Z"),
            "max_score": 100,
            "percentage": 0.1,
            "description": "This is the description for Assignment 1.",
            "attachments": [
                {
                    "filename": "assignment_1_file_1.pdf",
                    "url": "http://example.com/assignments/course_1/assignment_1_file_1.pdf"
                }
            ]
        },
    ]);
}

async function Submitted_assSeed() {
    await mongoose.connection.db.collection('submitted_ass').insertMany([
        {
            "s_ass_id": 1,
            "ass_id": 1,
            "submit_by_user_id": 3,
            "submit_user_course_tag": "User3's CustomTag_1",
            "submit_date": new Date("2025-01-14T00:00:00.000Z"),
            "score": 100,
            "graded_by_user_id": 2,
            "attachments": [
                {
                    "filename": "submitted_assignment_1_file_1.pdf",
                    "url": "http://example.com/assignments/course_1/assignment_1_file_1.pdf"
                }
            ],
            "description": "This is the submission for Assignment 1 by User 3."
        },
    ]);
}

async function PostSeed() {
    await mongoose.connection.db.collection('post').insertMany([
        {
            "post_id": 1,
            "post_by_user_id": 2,
            "title": "Post title 1 in Board 1",
            "post_user_custom_tags": [
                {
                    "tag_name": "User2's CustomTag_1"
                }
            ],
            "description": "This is the content of post 1 in board 1.",
            "post_date": new Date("2025-01-15T00:00:00.000Z"),
            "public": false,
            "in_b_id": 1,
            "post_tags": [
                {
                    "tag_name": "Tag_1"
                }
            ],
            "comments": [
                {
                    "comment_by_user_id": 1,
                    "comment_user_custom_tag": "User1's CustomTag_1",
                    "comment_date": new Date("2025-01-15T00:00:00.000Z"),
                    "description": "This is a comment on post 1 by user 1."
                },
                {
                    "comment_by_user_id": 3,
                    "comment_user_custom_tag": "User3's CustomTag_1",
                    "comment_date": new Date("2025-01-22T00:00:00.000Z"),
                    "description": "This is a comment on post 1 by user 3."
                }
            ]
        },
    ]);
}

async function Course_tagSeed() {
    await mongoose.connection.db.collection('course_tag').insertMany([
        {
            "user_id": 1,
            "course_id": 1,
            "course_tag": "User1 in Course1's CourseTag_1"
        },
        {
            "user_id": 2,
            "course_id": 1,
            "course_tag": "User2 in Course1's CourseTag_2"
        },
        {
            "user_id": 3,
            "course_id": 1,
            "course_tag": "User3 in Course1's CourseTag_3"
        },
    ]);
}

async function NotificationSeed() {
    await mongoose.connection.db.collection('notification').insertMany([
        {
            "n_id": 1,
            "event_id": 1,
            "event_category": "course",
            "context": "Successfully enrolled in a course",
            "notified_date": new Date("2025-01-08T00:00:00.000Z")
        }
    ]);
}

async function NotifiedSeed() {
    await mongoose.connection.db.collection('notified').insertMany([
        {
            "n_id": 1,
            "user_id": 2,
            "is_read": false
        },
        {
            "n_id": 1,
            "user_id": 3,
            "is_read": false
        },
    ]);
}

async function MailboxSeed() {
    await mongoose.connection.db.collection('mailbox').insertMany([
        {
            "mail_id": 1,
            "sender_id": 1,
            "receiver_id": 2,
            "subject": "Subject of Mail 1",
            "content": "This is the content of mail 1 from User 1 to User 2.",
            "send_date": new Date("2025-02-05T00:00:00.000Z")
        },
    ]);
}

export {
    CounterSeed,
    UserSeed,
    Custom_tagSeed,
    CourseSeed,
    Teach_inSeed,
    Assist_inSeed,
    Study_inSeed,
    AnnouncementSeed,
    Discussion_boardSeed,
    ExamsSeed,
    Taken_examsSeed,
    MaterialsSeed,
    AssignmentsSeed,
    Submitted_assSeed,
    PostSeed,
    Course_tagSeed,
    NotificationSeed,
    NotifiedSeed,
    MailboxSeed,
}
