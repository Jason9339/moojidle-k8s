db.user.insertMany([
  {
    "user_id": 1,
    "name": "User 1",
    "contact_ways": [
      {
        "approach": "phone",
        "details": "555-1398"
      }
    ],
    "email": "user1@example.com",
    "pw": "pw_1",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 2,
    "name": "User 2",
    "contact_ways": [
      {
        "approach": "phone",
        "details": "555-4023"
      },
      {
        "approach": "social_media",
        "details": "@user29"
      }
    ],
    "email": "user2@example.com",
    "pw": "pw_2",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 3,
    "name": "User 3",
    "contact_ways": [
      {
        "approach": "social_media",
        "details": "@user44"
      },
      {
        "approach": "email",
        "details": "user62@example.com"
      }
    ],
    "email": "user3@example.com",
    "pw": "pw_3",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 4,
    "name": "User 4",
    "contact_ways": [
      {
        "approach": "social_media",
        "details": "@user5"
      },
      {
        "approach": "email",
        "details": "user50@example.com"
      }
    ],
    "email": "user4@example.com",
    "pw": "pw_4",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 5,
    "name": "User 5",
    "contact_ways": [
      {
        "approach": "email",
        "details": "user7@example.com"
      }
    ],
    "email": "user5@example.com",
    "pw": "pw_5",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 6,
    "name": "User 6",
    "contact_ways": [
      {
        "approach": "social_media",
        "details": "@user24"
      },
      {
        "approach": "email",
        "details": "user46@example.com"
      }
    ],
    "email": "user6@example.com",
    "pw": "pw_6",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 7,
    "name": "User 7",
    "contact_ways": [
      {
        "approach": "email",
        "details": "user40@example.com"
      }
    ],
    "email": "user7@example.com",
    "pw": "pw_7",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 8,
    "name": "User 8",
    "contact_ways": [
      {
        "approach": "social_media",
        "details": "@user73"
      },
      {
        "approach": "phone",
        "details": "555-8394"
      }
    ],
    "email": "user8@example.com",
    "pw": "pw_8",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 9,
    "name": "User 9",
    "contact_ways": [
      {
        "approach": "email",
        "details": "user62@example.com"
      },
      {
        "approach": "phone",
        "details": "555-6028"
      }
    ],
    "email": "user9@example.com",
    "pw": "pw_9",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 10,
    "name": "User 10",
    "contact_ways": [
      {
        "approach": "email",
        "details": "user55@example.com"
      },
      {
        "approach": "phone",
        "details": "555-2318"
      }
    ],
    "email": "user10@example.com",
    "pw": "pw_10",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 11,
    "name": "User 11",
    "contact_ways": [
      {
        "approach": "phone",
        "details": "555-9838"
      },
      {
        "approach": "social_media",
        "details": "@user30"
      },
      {
        "approach": "email",
        "details": "user7@example.com"
      }
    ],
    "email": "user11@example.com",
    "pw": "pw_11",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 12,
    "name": "User 12",
    "contact_ways": [
      {
        "approach": "phone",
        "details": "555-2483"
      },
      {
        "approach": "social_media",
        "details": "@user54"
      },
      {
        "approach": "email",
        "details": "user16@example.com"
      }
    ],
    "email": "user12@example.com",
    "pw": "pw_12",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 13,
    "name": "User 13",
    "contact_ways": [
      {
        "approach": "phone",
        "details": "555-7622"
      }
    ],
    "email": "user13@example.com",
    "pw": "pw_13",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 14,
    "name": "User 14",
    "contact_ways": [
      {
        "approach": "email",
        "details": "user20@example.com"
      },
      {
        "approach": "phone",
        "details": "555-7054"
      }
    ],
    "email": "user14@example.com",
    "pw": "pw_14",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  },
  {
    "user_id": 15,
    "name": "User 15",
    "contact_ways": [
      {
        "approach": "social_media",
        "details": "@user53"
      },
      {
        "approach": "email",
        "details": "user46@example.com"
      }
    ],
    "email": "user15@example.com",
    "pw": "pw_15",
    "create_date": ISODate("2025-01-01T00:00:00.000Z")
  }
]);

db.course.insertMany([
  {
    "course_id": 1,
    "name": "Course 1",
    "description": "This is the description for course 1.",
    "create_date": ISODate("2025-01-01T00:00:00.000Z"),
    "start_date": ISODate("2025-01-01T00:00:00.000Z"),
    "syllabus": "Syllabus for course 1",
    "invite_link": "http://example.com/course_1/invite",
    "week_num": 18,
    "color": "#4A90E2"
  },
  {
    "course_id": 2,
    "name": "Course 2",
    "description": "This is the description for course 2.",
    "create_date": ISODate("2025-01-01T00:00:00.000Z"),
    "start_date": ISODate("2025-01-01T00:00:00.000Z"),
    "syllabus": "Syllabus for course 2",
    "invite_link": "http://example.com/course_2/invite",
    "week_num": 18,
    "color": "#4A90E2"
  },
  {
    "course_id": 3,
    "name": "Course 3",
    "description": "This is the description for course 3.",
    "create_date": ISODate("2025-01-01T00:00:00.000Z"),
    "start_date": ISODate("2025-01-01T00:00:00.000Z"),
    "syllabus": "Syllabus for course 3",
    "invite_link": "http://example.com/course_3/invite",
    "week_num": 18,
    "color": "#4A90E2"
  },
  {
    "course_id": 4,
    "name": "Course 4",
    "description": "This is the description for course 4.",
    "create_date": ISODate("2025-01-01T00:00:00.000Z"),
    "start_date": ISODate("2025-01-01T00:00:00.000Z"),
    "syllabus": "Syllabus for course 4",
    "invite_link": "http://example.com/course_4/invite",
    "week_num": 18,
    "color": "#4A90E2"
  },
  {
    "course_id": 5,
    "name": "Course 5",
    "description": "This is the description for course 5.",
    "create_date": ISODate("2025-01-01T00:00:00.000Z"),
    "start_date": ISODate("2025-01-01T00:00:00.000Z"),
    "syllabus": "Syllabus for course 5",
    "invite_link": "http://example.com/course_5/invite",
    "week_num": 18,
    "color": "#4A90E2"
  }
]);

db.teach_in.insertMany([
  {
    "user_id": 2,
    "course_id": 4
  },
  {
    "user_id": 2,
    "course_id": 3
  },
  {
    "user_id": 2,
    "course_id": 2
  },
  {
    "user_id": 4,
    "course_id": 2
  },
  {
    "user_id": 5,
    "course_id": 5
  },
  {
    "user_id": 5,
    "course_id": 2
  },
  {
    "user_id": 5,
    "course_id": 3
  },
  {
    "user_id": 6,
    "course_id": 5
  },
  {
    "user_id": 6,
    "course_id": 3
  },
  {
    "user_id": 7,
    "course_id": 3
  },
  {
    "user_id": 8,
    "course_id": 3
  },
  {
    "user_id": 9,
    "course_id": 3
  },
  {
    "user_id": 9,
    "course_id": 1
  },
  {
    "user_id": 12,
    "course_id": 2
  },
  {
    "user_id": 12,
    "course_id": 1
  },
  {
    "user_id": 13,
    "course_id": 3
  },
  {
    "user_id": 13,
    "course_id": 5
  },
  {
    "user_id": 13,
    "course_id": 1
  },
  {
    "user_id": 14,
    "course_id": 5
  },
  {
    "user_id": 14,
    "course_id": 2
  }
]);

db.assist_in.insertMany([
  {
    "user_id": 1,
    "course_id": 4
  },
  {
    "user_id": 3,
    "course_id": 5
  },
  {
    "user_id": 4,
    "course_id": 3
  },
  {
    "user_id": 4,
    "course_id": 1
  },
  {
    "user_id": 7,
    "course_id": 1
  },
  {
    "user_id": 10,
    "course_id": 1
  },
  {
    "user_id": 11,
    "course_id": 1
  },
  {
    "user_id": 11,
    "course_id": 2
  },
  {
    "user_id": 12,
    "course_id": 5
  },
  {
    "user_id": 14,
    "course_id": 1
  },
  {
    "user_id": 14,
    "course_id": 4
  },
  {
    "user_id": 15,
    "course_id": 2
  },
  {
    "user_id": 15,
    "course_id": 3
  }
]);

db.study_in.insertMany([
  {
    "user_id": 1,
    "course_id": 2,
    "student_id": 4276
  },
  {
    "user_id": 2,
    "course_id": 5,
    "student_id": 3806
  },
  {
    "user_id": 2,
    "course_id": 1,
    "student_id": 5508
  },
  {
    "user_id": 3,
    "course_id": 1,
    "student_id": 3506
  },
  {
    "user_id": 3,
    "course_id": 3,
    "student_id": 3435
  },
  {
    "user_id": 4,
    "course_id": 5,
    "student_id": 8624
  },
  {
    "user_id": 6,
    "course_id": 2,
    "student_id": 7163
  },
  {
    "user_id": 6,
    "course_id": 1,
    "student_id": 6192
  },
  {
    "user_id": 6,
    "course_id": 4,
    "student_id": 2550
  },
  {
    "user_id": 7,
    "course_id": 4,
    "student_id": 6605
  },
  {
    "user_id": 7,
    "course_id": 5,
    "student_id": 4852
  },
  {
    "user_id": 8,
    "course_id": 4,
    "student_id": 8511
  },
  {
    "user_id": 8,
    "course_id": 2,
    "student_id": 5688
  },
  {
    "user_id": 9,
    "course_id": 5,
    "student_id": 5165
  },
  {
    "user_id": 10,
    "course_id": 2,
    "student_id": 2825
  },
  {
    "user_id": 10,
    "course_id": 3,
    "student_id": 1320
  },
  {
    "user_id": 11,
    "course_id": 3,
    "student_id": 7195
  },
  {
    "user_id": 11,
    "course_id": 5,
    "student_id": 8280
  },
  {
    "user_id": 12,
    "course_id": 4,
    "student_id": 7239
  },
  {
    "user_id": 14,
    "course_id": 3,
    "student_id": 9961
  },
  {
    "user_id": 15,
    "course_id": 4,
    "student_id": 6961
  },
  {
    "user_id": 15,
    "course_id": 1,
    "student_id": 1938
  }
]);

db.announcement.insertMany([
  {
    "a_id": 1,
    "create_date": ISODate("2025-01-15T00:00:00.000Z"),
    "announce_date": ISODate("2025-01-15T00:00:00.000Z"),
    "context": "Announcement 1 content.",
    "user_id": 10,
    "course_id": 3
  },
  {
    "a_id": 2,
    "create_date": ISODate("2025-01-22T00:00:00.000Z"),
    "announce_date": ISODate("2025-01-22T00:00:00.000Z"),
    "context": "Announcement 2 content.",
    "user_id": 13,
    "course_id": 5
  },
  {
    "a_id": 3,
    "create_date": ISODate("2025-01-29T00:00:00.000Z"),
    "announce_date": ISODate("2025-01-29T00:00:00.000Z"),
    "context": "Announcement 3 content.",
    "user_id": 10,
    "course_id": 3
  },
  {
    "a_id": 4,
    "create_date": ISODate("2025-02-05T00:00:00.000Z"),
    "announce_date": ISODate("2025-02-05T00:00:00.000Z"),
    "context": "Announcement 4 content.",
    "user_id": 8,
    "course_id": 3
  },
  {
    "a_id": 5,
    "create_date": ISODate("2025-02-12T00:00:00.000Z"),
    "announce_date": ISODate("2025-02-12T00:00:00.000Z"),
    "context": "Announcement 5 content.",
    "user_id": 3,
    "course_id": 2
  },
  {
    "a_id": 6,
    "create_date": ISODate("2025-02-19T00:00:00.000Z"),
    "announce_date": ISODate("2025-02-19T00:00:00.000Z"),
    "context": "Announcement 6 content.",
    "user_id": 13,
    "course_id": 5
  },
  {
    "a_id": 7,
    "create_date": ISODate("2025-02-26T00:00:00.000Z"),
    "announce_date": ISODate("2025-02-26T00:00:00.000Z"),
    "context": "Announcement 7 content.",
    "user_id": 10,
    "course_id": 4
  },
  {
    "a_id": 8,
    "create_date": ISODate("2025-03-05T00:00:00.000Z"),
    "announce_date": ISODate("2025-03-05T00:00:00.000Z"),
    "context": "Announcement 8 content.",
    "user_id": 11,
    "course_id": 5
  },
  {
    "a_id": 9,
    "create_date": ISODate("2025-03-12T00:00:00.000Z"),
    "announce_date": ISODate("2025-03-12T00:00:00.000Z"),
    "context": "Announcement 9 content.",
    "user_id": 12,
    "course_id": 2
  },
  {
    "a_id": 10,
    "create_date": ISODate("2025-03-19T00:00:00.000Z"),
    "announce_date": ISODate("2025-03-19T00:00:00.000Z"),
    "context": "Announcement 10 content.",
    "user_id": 11,
    "course_id": 1
  },
  {
    "a_id": 11,
    "create_date": ISODate("2025-03-26T00:00:00.000Z"),
    "announce_date": ISODate("2025-03-26T00:00:00.000Z"),
    "context": "Announcement 11 content.",
    "user_id": 3,
    "course_id": 1
  },
  {
    "a_id": 12,
    "create_date": ISODate("2025-04-02T00:00:00.000Z"),
    "announce_date": ISODate("2025-04-02T00:00:00.000Z"),
    "context": "Announcement 12 content.",
    "user_id": 11,
    "course_id": 5
  },
  {
    "a_id": 13,
    "create_date": ISODate("2025-04-09T00:00:00.000Z"),
    "announce_date": ISODate("2025-04-09T00:00:00.000Z"),
    "context": "Announcement 13 content.",
    "user_id": 13,
    "course_id": 1
  },
  {
    "a_id": 14,
    "create_date": ISODate("2025-04-16T00:00:00.000Z"),
    "announce_date": ISODate("2025-04-16T00:00:00.000Z"),
    "context": "Announcement 14 content.",
    "user_id": 13,
    "course_id": 1
  },
  {
    "a_id": 15,
    "create_date": ISODate("2025-04-23T00:00:00.000Z"),
    "announce_date": ISODate("2025-04-23T00:00:00.000Z"),
    "context": "Announcement 15 content.",
    "user_id": 14,
    "course_id": 1
  }
]);

db.discussion_board.insertMany([
  {
    "board_id": 1,
    "course_id": 1,
    "name": "Discussion Board 1 for Course 1"
  },
  {
    "board_id": 2,
    "course_id": 1,
    "name": "Discussion Board 2 for Course 1"
  },
  {
    "board_id": 3,
    "course_id": 2,
    "name": "Discussion Board 3 for Course 2"
  },
  {
    "board_id": 4,
    "course_id": 2,
    "name": "Discussion Board 4 for Course 2"
  },
  {
    "board_id": 5,
    "course_id": 2,
    "name": "Discussion Board 5 for Course 2"
  },
  {
    "board_id": 6,
    "course_id": 3,
    "name": "Discussion Board 6 for Course 3"
  },
  {
    "board_id": 7,
    "course_id": 3,
    "name": "Discussion Board 7 for Course 3"
  },
  {
    "board_id": 8,
    "course_id": 4,
    "name": "Discussion Board 8 for Course 4"
  },
  {
    "board_id": 9,
    "course_id": 4,
    "name": "Discussion Board 9 for Course 4"
  },
  {
    "board_id": 10,
    "course_id": 4,
    "name": "Discussion Board 10 for Course 4"
  },
  {
    "board_id": 11,
    "course_id": 5,
    "name": "Discussion Board 11 for Course 5"
  },
  {
    "board_id": 12,
    "course_id": 5,
    "name": "Discussion Board 12 for Course 5"
  }
]);

db.exams.insertMany([
  {
    "exam_id": 1,
    "in_course_id": 1,
    "create_by_user_id": 4,
    "exam_name": "Exam 1 for Course 1",
    "start_date": ISODate("2025-01-15T00:00:00.000Z"),
    "end_date": ISODate("2025-01-15T03:00:00.000Z"),
    "create_date": ISODate("2025-01-01T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Exam 1.",
    "attachments": []
  },
  {
    "exam_id": 2,
    "in_course_id": 1,
    "create_by_user_id": 13,
    "exam_name": "Exam 2 for Course 1",
    "start_date": ISODate("2025-01-22T00:00:00.000Z"),
    "end_date": ISODate("2025-01-22T03:00:00.000Z"),
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Exam 2.",
    "attachments": [
      {
        "filename": "exam_2_file_1.pdf",
        "url": "http://example.com/exam_2_file_1.pdf"
      }
    ]
  },
  {
    "exam_id": 3,
    "in_course_id": 2,
    "create_by_user_id": 2,
    "exam_name": "Exam 3 for Course 2",
    "start_date": ISODate("2025-01-15T00:00:00.000Z"),
    "end_date": ISODate("2025-01-15T03:00:00.000Z"),
    "create_date": ISODate("2025-01-01T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Exam 3.",
    "attachments": [
      {
        "filename": "exam_3_file_1.pdf",
        "url": "http://example.com/exam_3_file_1.pdf"
      },
      {
        "filename": "exam_3_file_2.pdf",
        "url": "http://example.com/exam_3_file_2.pdf"
      },
      {
        "filename": "exam_3_file_3.pdf",
        "url": "http://example.com/exam_3_file_3.pdf"
      }
    ]
  },
  {
    "exam_id": 4,
    "in_course_id": 2,
    "create_by_user_id": 5,
    "exam_name": "Exam 4 for Course 2",
    "start_date": ISODate("2025-01-22T00:00:00.000Z"),
    "end_date": ISODate("2025-01-22T03:00:00.000Z"),
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Exam 4.",
    "attachments": []
  },
  {
    "exam_id": 5,
    "in_course_id": 2,
    "create_by_user_id": 14,
    "exam_name": "Exam 5 for Course 2",
    "start_date": ISODate("2025-01-29T00:00:00.000Z"),
    "end_date": ISODate("2025-01-29T03:00:00.000Z"),
    "create_date": ISODate("2025-01-15T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Exam 5.",
    "attachments": [
      {
        "filename": "exam_5_file_1.pdf",
        "url": "http://example.com/exam_5_file_1.pdf"
      },
      {
        "filename": "exam_5_file_2.pdf",
        "url": "http://example.com/exam_5_file_2.pdf"
      },
      {
        "filename": "exam_5_file_3.pdf",
        "url": "http://example.com/exam_5_file_3.pdf"
      }
    ]
  },
  {
    "exam_id": 6,
    "in_course_id": 3,
    "create_by_user_id": 6,
    "exam_name": "Exam 6 for Course 3",
    "start_date": ISODate("2025-01-15T00:00:00.000Z"),
    "end_date": ISODate("2025-01-15T03:00:00.000Z"),
    "create_date": ISODate("2025-01-01T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Exam 6.",
    "attachments": [
      {
        "filename": "exam_6_file_1.pdf",
        "url": "http://example.com/exam_6_file_1.pdf"
      },
      {
        "filename": "exam_6_file_2.pdf",
        "url": "http://example.com/exam_6_file_2.pdf"
      },
      {
        "filename": "exam_6_file_3.pdf",
        "url": "http://example.com/exam_6_file_3.pdf"
      }
    ]
  },
  {
    "exam_id": 7,
    "in_course_id": 4,
    "create_by_user_id": 2,
    "exam_name": "Exam 7 for Course 4",
    "start_date": ISODate("2025-01-15T00:00:00.000Z"),
    "end_date": ISODate("2025-01-15T03:00:00.000Z"),
    "create_date": ISODate("2025-01-01T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Exam 7.",
    "attachments": [
      {
        "filename": "exam_7_file_1.pdf",
        "url": "http://example.com/exam_7_file_1.pdf"
      }
    ]
  },
  {
    "exam_id": 8,
    "in_course_id": 4,
    "create_by_user_id": 1,
    "exam_name": "Exam 8 for Course 4",
    "start_date": ISODate("2025-01-22T00:00:00.000Z"),
    "end_date": ISODate("2025-01-22T03:00:00.000Z"),
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Exam 8.",
    "attachments": [
      {
        "filename": "exam_8_file_1.pdf",
        "url": "http://example.com/exam_8_file_1.pdf"
      },
      {
        "filename": "exam_8_file_2.pdf",
        "url": "http://example.com/exam_8_file_2.pdf"
      },
      {
        "filename": "exam_8_file_3.pdf",
        "url": "http://example.com/exam_8_file_3.pdf"
      }
    ]
  },
  {
    "exam_id": 9,
    "in_course_id": 5,
    "create_by_user_id": 14,
    "exam_name": "Exam 9 for Course 5",
    "start_date": ISODate("2025-01-15T00:00:00.000Z"),
    "end_date": ISODate("2025-01-15T03:00:00.000Z"),
    "create_date": ISODate("2025-01-01T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Exam 9.",
    "attachments": [
      {
        "filename": "exam_9_file_1.pdf",
        "url": "http://example.com/exam_9_file_1.pdf"
      },
      {
        "filename": "exam_9_file_2.pdf",
        "url": "http://example.com/exam_9_file_2.pdf"
      },
      {
        "filename": "exam_9_file_3.pdf",
        "url": "http://example.com/exam_9_file_3.pdf"
      }
    ]
  },
  {
    "exam_id": 10,
    "in_course_id": 5,
    "create_by_user_id": 13,
    "exam_name": "Exam 10 for Course 5",
    "start_date": ISODate("2025-01-22T00:00:00.000Z"),
    "end_date": ISODate("2025-01-22T03:00:00.000Z"),
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Exam 10.",
    "attachments": [
      {
        "filename": "exam_10_file_1.pdf",
        "url": "http://example.com/exam_10_file_1.pdf"
      },
      {
        "filename": "exam_10_file_2.pdf",
        "url": "http://example.com/exam_10_file_2.pdf"
      },
      {
        "filename": "exam_10_file_3.pdf",
        "url": "http://example.com/exam_10_file_3.pdf"
      }
    ]
  }
]);

db.taken_exams.insertMany([
  {
    "t_exam_id": 1,
    "exam_id": 1,
    "taken_by_user_id": 6,
    "taken_user_course_tag": "StudentTag_6",
    "score": 100,
    "graded_by_user_id": 11,
    "attachments": [
      {
        "filename": "taken_exam_1_file_1.pdf",
        "url": "http://example.com/assignments/course_1/taken_exam_1_file_1.pdf"
      }
    ],
    "description": "This is the grade for Exam 1 by User 6."
  },
  {
    "t_exam_id": 2,
    "exam_id": 2,
    "taken_by_user_id": 2,
    "taken_user_course_tag": "StudentTag_2",
    "score": 100,
    "graded_by_user_id": 11,
    "attachments": [
      {
        "filename": "taken_exam_2_file_1.pdf",
        "url": "http://example.com/assignments/course_1/taken_exam_2_file_1.pdf"
      }
    ],
    "description": "This is the grade for Exam 2 by User 2."
  },
  {
    "t_exam_id": 3,
    "exam_id": 3,
    "taken_by_user_id": 1,
    "taken_user_course_tag": "StudentTag_1",
    "score": 100,
    "graded_by_user_id": 4,
    "attachments": [
      {
        "filename": "taken_exam_3_file_1.pdf",
        "url": "http://example.com/assignments/course_2/taken_exam_3_file_1.pdf"
      }
    ],
    "description": "This is the grade for Exam 3 by User 1."
  },
  {
    "t_exam_id": 4,
    "exam_id": 4,
    "taken_by_user_id": 6,
    "taken_user_course_tag": "StudentTag_6",
    "score": 100,
    "graded_by_user_id": 12,
    "attachments": [
      {
        "filename": "taken_exam_4_file_1.pdf",
        "url": "http://example.com/assignments/course_2/taken_exam_4_file_1.pdf"
      }
    ],
    "description": "This is the grade for Exam 4 by User 6."
  },
  {
    "t_exam_id": 5,
    "exam_id": 5,
    "taken_by_user_id": 1,
    "taken_user_course_tag": "StudentTag_1",
    "score": 100,
    "graded_by_user_id": 2,
    "attachments": [
      {
        "filename": "taken_exam_5_file_1.pdf",
        "url": "http://example.com/assignments/course_2/taken_exam_5_file_1.pdf"
      }
    ],
    "description": "This is the grade for Exam 5 by User 1."
  },
  {
    "t_exam_id": 6,
    "exam_id": 6,
    "taken_by_user_id": 11,
    "taken_user_course_tag": "StudentTag_11",
    "score": 100,
    "graded_by_user_id": 15,
    "attachments": [
      {
        "filename": "taken_exam_6_file_1.pdf",
        "url": "http://example.com/assignments/course_3/taken_exam_6_file_1.pdf"
      }
    ],
    "description": "This is the grade for Exam 6 by User 11."
  },
  {
    "t_exam_id": 7,
    "exam_id": 7,
    "taken_by_user_id": 8,
    "taken_user_course_tag": "StudentTag_8",
    "score": 100,
    "graded_by_user_id": 14,
    "attachments": [
      {
        "filename": "taken_exam_7_file_1.pdf",
        "url": "http://example.com/assignments/course_4/taken_exam_7_file_1.pdf"
      }
    ],
    "description": "This is the grade for Exam 7 by User 8."
  },
  {
    "t_exam_id": 8,
    "exam_id": 8,
    "taken_by_user_id": 15,
    "taken_user_course_tag": "StudentTag_15",
    "score": 100,
    "graded_by_user_id": 14,
    "attachments": [
      {
        "filename": "taken_exam_8_file_1.pdf",
        "url": "http://example.com/assignments/course_4/taken_exam_8_file_1.pdf"
      }
    ],
    "description": "This is the grade for Exam 8 by User 15."
  },
  {
    "t_exam_id": 9,
    "exam_id": 9,
    "taken_by_user_id": 9,
    "taken_user_course_tag": "StudentTag_9",
    "score": 100,
    "graded_by_user_id": 5,
    "attachments": [
      {
        "filename": "taken_exam_9_file_1.pdf",
        "url": "http://example.com/assignments/course_5/taken_exam_9_file_1.pdf"
      }
    ],
    "description": "This is the grade for Exam 9 by User 9."
  },
  {
    "t_exam_id": 10,
    "exam_id": 10,
    "taken_by_user_id": 2,
    "taken_user_course_tag": "StudentTag_2",
    "score": 100,
    "graded_by_user_id": 5,
    "attachments": [
      {
        "filename": "taken_exam_10_file_1.pdf",
        "url": "http://example.com/assignments/course_5/taken_exam_10_file_1.pdf"
      }
    ],
    "description": "This is the grade for Exam 10 by User 2."
  }
]);

db.materials.insertMany([
  {
    "m_id": 1,
    "in_course_id": 1,
    "create_by_user_id": 4,
    "m_name": "Material 1 for Course 1",
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "display_date": ISODate("2025-01-08T00:00:00.000Z"),
    "url": "http://example.com/materials/course_1/material_1.pdf"
  },
  {
    "m_id": 2,
    "in_course_id": 1,
    "create_by_user_id": 13,
    "m_name": "Material 2 for Course 1",
    "create_date": ISODate("2025-01-15T00:00:00.000Z"),
    "display_date": ISODate("2025-01-15T00:00:00.000Z"),
    "url": "http://example.com/materials/course_1/material_2.pdf"
  },
  {
    "m_id": 3,
    "in_course_id": 1,
    "create_by_user_id": 10,
    "m_name": "Material 3 for Course 1",
    "create_date": ISODate("2025-01-22T00:00:00.000Z"),
    "display_date": ISODate("2025-01-22T00:00:00.000Z"),
    "url": "http://example.com/materials/course_1/material_3.pdf"
  },
  {
    "m_id": 4,
    "in_course_id": 1,
    "create_by_user_id": 7,
    "m_name": "Material 4 for Course 1",
    "create_date": ISODate("2025-01-29T00:00:00.000Z"),
    "display_date": ISODate("2025-01-29T00:00:00.000Z"),
    "url": "http://example.com/materials/course_1/material_4.pdf"
  },
  {
    "m_id": 5,
    "in_course_id": 2,
    "create_by_user_id": 12,
    "m_name": "Material 5 for Course 2",
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "display_date": ISODate("2025-01-08T00:00:00.000Z"),
    "url": "http://example.com/materials/course_2/material_5.pdf"
  },
  {
    "m_id": 6,
    "in_course_id": 2,
    "create_by_user_id": 12,
    "m_name": "Material 6 for Course 2",
    "create_date": ISODate("2025-01-15T00:00:00.000Z"),
    "display_date": ISODate("2025-01-15T00:00:00.000Z"),
    "url": "http://example.com/materials/course_2/material_6.pdf"
  },
  {
    "m_id": 7,
    "in_course_id": 2,
    "create_by_user_id": 11,
    "m_name": "Material 7 for Course 2",
    "create_date": ISODate("2025-01-22T00:00:00.000Z"),
    "display_date": ISODate("2025-01-22T00:00:00.000Z"),
    "url": "http://example.com/materials/course_2/material_7.pdf"
  },
  {
    "m_id": 8,
    "in_course_id": 2,
    "create_by_user_id": 2,
    "m_name": "Material 8 for Course 2",
    "create_date": ISODate("2025-01-29T00:00:00.000Z"),
    "display_date": ISODate("2025-01-29T00:00:00.000Z"),
    "url": "http://example.com/materials/course_2/material_8.pdf"
  },
  {
    "m_id": 9,
    "in_course_id": 2,
    "create_by_user_id": 11,
    "m_name": "Material 9 for Course 2",
    "create_date": ISODate("2025-02-05T00:00:00.000Z"),
    "display_date": ISODate("2025-02-05T00:00:00.000Z"),
    "url": "http://example.com/materials/course_2/material_9.pdf"
  },
  {
    "m_id": 10,
    "in_course_id": 3,
    "create_by_user_id": 13,
    "m_name": "Material 10 for Course 3",
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "display_date": ISODate("2025-01-08T00:00:00.000Z"),
    "url": "http://example.com/materials/course_3/material_10.pdf"
  },
  {
    "m_id": 11,
    "in_course_id": 3,
    "create_by_user_id": 8,
    "m_name": "Material 11 for Course 3",
    "create_date": ISODate("2025-01-15T00:00:00.000Z"),
    "display_date": ISODate("2025-01-15T00:00:00.000Z"),
    "url": "http://example.com/materials/course_3/material_11.pdf"
  },
  {
    "m_id": 12,
    "in_course_id": 3,
    "create_by_user_id": 6,
    "m_name": "Material 12 for Course 3",
    "create_date": ISODate("2025-01-22T00:00:00.000Z"),
    "display_date": ISODate("2025-01-22T00:00:00.000Z"),
    "url": "http://example.com/materials/course_3/material_12.pdf"
  },
  {
    "m_id": 13,
    "in_course_id": 3,
    "create_by_user_id": 8,
    "m_name": "Material 13 for Course 3",
    "create_date": ISODate("2025-01-29T00:00:00.000Z"),
    "display_date": ISODate("2025-01-29T00:00:00.000Z"),
    "url": "http://example.com/materials/course_3/material_13.pdf"
  },
  {
    "m_id": 14,
    "in_course_id": 4,
    "create_by_user_id": 2,
    "m_name": "Material 14 for Course 4",
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "display_date": ISODate("2025-01-08T00:00:00.000Z"),
    "url": "http://example.com/materials/course_4/material_14.pdf"
  },
  {
    "m_id": 15,
    "in_course_id": 4,
    "create_by_user_id": 2,
    "m_name": "Material 15 for Course 4",
    "create_date": ISODate("2025-01-15T00:00:00.000Z"),
    "display_date": ISODate("2025-01-15T00:00:00.000Z"),
    "url": "http://example.com/materials/course_4/material_15.pdf"
  },
  {
    "m_id": 16,
    "in_course_id": 4,
    "create_by_user_id": 1,
    "m_name": "Material 16 for Course 4",
    "create_date": ISODate("2025-01-22T00:00:00.000Z"),
    "display_date": ISODate("2025-01-22T00:00:00.000Z"),
    "url": "http://example.com/materials/course_4/material_16.pdf"
  },
  {
    "m_id": 17,
    "in_course_id": 4,
    "create_by_user_id": 1,
    "m_name": "Material 17 for Course 4",
    "create_date": ISODate("2025-01-29T00:00:00.000Z"),
    "display_date": ISODate("2025-01-29T00:00:00.000Z"),
    "url": "http://example.com/materials/course_4/material_17.pdf"
  },
  {
    "m_id": 18,
    "in_course_id": 4,
    "create_by_user_id": 1,
    "m_name": "Material 18 for Course 4",
    "create_date": ISODate("2025-02-05T00:00:00.000Z"),
    "display_date": ISODate("2025-02-05T00:00:00.000Z"),
    "url": "http://example.com/materials/course_4/material_18.pdf"
  },
  {
    "m_id": 19,
    "in_course_id": 5,
    "create_by_user_id": 14,
    "m_name": "Material 19 for Course 5",
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "display_date": ISODate("2025-01-08T00:00:00.000Z"),
    "url": "http://example.com/materials/course_5/material_19.pdf"
  },
  {
    "m_id": 20,
    "in_course_id": 5,
    "create_by_user_id": 12,
    "m_name": "Material 20 for Course 5",
    "create_date": ISODate("2025-01-15T00:00:00.000Z"),
    "display_date": ISODate("2025-01-15T00:00:00.000Z"),
    "url": "http://example.com/materials/course_5/material_20.pdf"
  },
  {
    "m_id": 21,
    "in_course_id": 5,
    "create_by_user_id": 3,
    "m_name": "Material 21 for Course 5",
    "create_date": ISODate("2025-01-22T00:00:00.000Z"),
    "display_date": ISODate("2025-01-22T00:00:00.000Z"),
    "url": "http://example.com/materials/course_5/material_21.pdf"
  }
]);

db.assignments.insertMany([
  {
    "ass_id": 1,
    "in_course_id": 1,
    "create_by_user_id": 12,
    "ass_name": "Assignment 1 for Course 1",
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "start_date": ISODate("2025-01-08T00:00:00.000Z"),
    "end_date": ISODate("2025-01-15T00:00:00.000Z"),
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
  {
    "ass_id": 2,
    "in_course_id": 1,
    "create_by_user_id": 7,
    "ass_name": "Assignment 2 for Course 1",
    "create_date": ISODate("2025-01-15T00:00:00.000Z"),
    "start_date": ISODate("2025-01-15T00:00:00.000Z"),
    "end_date": ISODate("2025-01-22T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Assignment 2.",
    "attachments": [
      {
        "filename": "assignment_2_file_1.pdf",
        "url": "http://example.com/assignments/course_1/assignment_2_file_1.pdf"
      },
      {
        "filename": "assignment_2_file_2.pdf",
        "url": "http://example.com/assignments/course_1/assignment_2_file_2.pdf"
      },
      {
        "filename": "assignment_2_file_3.pdf",
        "url": "http://example.com/assignments/course_1/assignment_2_file_3.pdf"
      }
    ]
  },
  {
    "ass_id": 3,
    "in_course_id": 2,
    "create_by_user_id": 12,
    "ass_name": "Assignment 3 for Course 2",
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "start_date": ISODate("2025-01-08T00:00:00.000Z"),
    "end_date": ISODate("2025-01-15T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Assignment 3.",
    "attachments": [
      {
        "filename": "assignment_3_file_1.pdf",
        "url": "http://example.com/assignments/course_2/assignment_3_file_1.pdf"
      },
      {
        "filename": "assignment_3_file_2.pdf",
        "url": "http://example.com/assignments/course_2/assignment_3_file_2.pdf"
      },
      {
        "filename": "assignment_3_file_3.pdf",
        "url": "http://example.com/assignments/course_2/assignment_3_file_3.pdf"
      }
    ]
  },
  {
    "ass_id": 4,
    "in_course_id": 2,
    "create_by_user_id": 15,
    "ass_name": "Assignment 4 for Course 2",
    "create_date": ISODate("2025-01-15T00:00:00.000Z"),
    "start_date": ISODate("2025-01-15T00:00:00.000Z"),
    "end_date": ISODate("2025-01-22T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Assignment 4.",
    "attachments": [
      {
        "filename": "assignment_4_file_1.pdf",
        "url": "http://example.com/assignments/course_2/assignment_4_file_1.pdf"
      },
      {
        "filename": "assignment_4_file_2.pdf",
        "url": "http://example.com/assignments/course_2/assignment_4_file_2.pdf"
      },
      {
        "filename": "assignment_4_file_3.pdf",
        "url": "http://example.com/assignments/course_2/assignment_4_file_3.pdf"
      }
    ]
  },
  {
    "ass_id": 5,
    "in_course_id": 3,
    "create_by_user_id": 6,
    "ass_name": "Assignment 5 for Course 3",
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "start_date": ISODate("2025-01-08T00:00:00.000Z"),
    "end_date": ISODate("2025-01-15T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Assignment 5.",
    "attachments": [
      {
        "filename": "assignment_5_file_1.pdf",
        "url": "http://example.com/assignments/course_3/assignment_5_file_1.pdf"
      }
    ]
  },
  {
    "ass_id": 6,
    "in_course_id": 3,
    "create_by_user_id": 6,
    "ass_name": "Assignment 6 for Course 3",
    "create_date": ISODate("2025-01-15T00:00:00.000Z"),
    "start_date": ISODate("2025-01-15T00:00:00.000Z"),
    "end_date": ISODate("2025-01-22T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Assignment 6.",
    "attachments": [
      {
        "filename": "assignment_6_file_1.pdf",
        "url": "http://example.com/assignments/course_3/assignment_6_file_1.pdf"
      },
      {
        "filename": "assignment_6_file_2.pdf",
        "url": "http://example.com/assignments/course_3/assignment_6_file_2.pdf"
      },
      {
        "filename": "assignment_6_file_3.pdf",
        "url": "http://example.com/assignments/course_3/assignment_6_file_3.pdf"
      }
    ]
  },
  {
    "ass_id": 7,
    "in_course_id": 4,
    "create_by_user_id": 2,
    "ass_name": "Assignment 7 for Course 4",
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "start_date": ISODate("2025-01-08T00:00:00.000Z"),
    "end_date": ISODate("2025-01-15T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Assignment 7.",
    "attachments": [
      {
        "filename": "assignment_7_file_1.pdf",
        "url": "http://example.com/assignments/course_4/assignment_7_file_1.pdf"
      },
      {
        "filename": "assignment_7_file_2.pdf",
        "url": "http://example.com/assignments/course_4/assignment_7_file_2.pdf"
      },
      {
        "filename": "assignment_7_file_3.pdf",
        "url": "http://example.com/assignments/course_4/assignment_7_file_3.pdf"
      }
    ]
  },
  {
    "ass_id": 8,
    "in_course_id": 5,
    "create_by_user_id": 13,
    "ass_name": "Assignment 8 for Course 5",
    "create_date": ISODate("2025-01-08T00:00:00.000Z"),
    "start_date": ISODate("2025-01-08T00:00:00.000Z"),
    "end_date": ISODate("2025-01-15T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Assignment 8.",
    "attachments": [
      {
        "filename": "assignment_8_file_1.pdf",
        "url": "http://example.com/assignments/course_5/assignment_8_file_1.pdf"
      },
      {
        "filename": "assignment_8_file_2.pdf",
        "url": "http://example.com/assignments/course_5/assignment_8_file_2.pdf"
      }
    ]
  },
  {
    "ass_id": 9,
    "in_course_id": 5,
    "create_by_user_id": 5,
    "ass_name": "Assignment 9 for Course 5",
    "create_date": ISODate("2025-01-15T00:00:00.000Z"),
    "start_date": ISODate("2025-01-15T00:00:00.000Z"),
    "end_date": ISODate("2025-01-22T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Assignment 9.",
    "attachments": [
      {
        "filename": "assignment_9_file_1.pdf",
        "url": "http://example.com/assignments/course_5/assignment_9_file_1.pdf"
      }
    ]
  },
  {
    "ass_id": 10,
    "in_course_id": 5,
    "create_by_user_id": 14,
    "ass_name": "Assignment 10 for Course 5",
    "create_date": ISODate("2025-01-22T00:00:00.000Z"),
    "start_date": ISODate("2025-01-22T00:00:00.000Z"),
    "end_date": ISODate("2025-01-29T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Assignment 10.",
    "attachments": [
      {
        "filename": "assignment_10_file_1.pdf",
        "url": "http://example.com/assignments/course_5/assignment_10_file_1.pdf"
      }
    ]
  },
  {
    "ass_id": 11,
    "in_course_id": 5,
    "create_by_user_id": 14,
    "ass_name": "Assignment 11 for Course 5",
    "create_date": ISODate("2025-01-29T00:00:00.000Z"),
    "start_date": ISODate("2025-01-29T00:00:00.000Z"),
    "end_date": ISODate("2025-02-05T00:00:00.000Z"),
    "max_score": 100,
    "percentage": 0.1,
    "description": "This is the description for Assignment 11.",
    "attachments": [
      {
        "filename": "assignment_11_file_1.pdf",
        "url": "http://example.com/assignments/course_5/assignment_11_file_1.pdf"
      }
    ]
  }
]);

db.submitted_ass.insertMany([
  {
    "s_ass_id": 1,
    "ass_id": 1,
    "submit_by_user_id": 2,
    "submit_user_course_tag": "StudentTag_2",
    "submit_date": ISODate("2025-01-15T00:00:00.000Z"),
    "score": 6,
    "graded_by_user_id": 9,
    "attachments": [
      {
        "filename": "submitted_assignment_1_file_1.pdf",
        "url": "http://example.com/assignments/course_1/assignment_1_file_1.pdf"
      },
      {
        "filename": "submitted_assignment_1_file_2.pdf",
        "url": "http://example.com/assignments/course_1/assignment_1_file_2.pdf"
      }
    ],
    "description": "This is the submission for Assignment 1 by User 2."
  },
  {
    "s_ass_id": 2,
    "ass_id": 2,
    "submit_by_user_id": 6,
    "submit_user_course_tag": "StudentTag_6",
    "submit_date": ISODate("2025-01-22T00:00:00.000Z"),
    "score": 12,
    "graded_by_user_id": 4,
    "attachments": [
      {
        "filename": "submitted_assignment_2_file_1.pdf",
        "url": "http://example.com/assignments/course_1/assignment_2_file_1.pdf"
      }
    ],
    "description": "This is the submission for Assignment 2 by User 6."
  },
  {
    "s_ass_id": 3,
    "ass_id": 3,
    "submit_by_user_id": 10,
    "submit_user_course_tag": "StudentTag_10",
    "submit_date": ISODate("2025-01-15T00:00:00.000Z"),
    "score": 68,
    "graded_by_user_id": 5,
    "attachments": [
      {
        "filename": "submitted_assignment_3_file_1.pdf",
        "url": "http://example.com/assignments/course_2/assignment_3_file_1.pdf"
      },
      {
        "filename": "submitted_assignment_3_file_2.pdf",
        "url": "http://example.com/assignments/course_2/assignment_3_file_2.pdf"
      }
    ],
    "description": "This is the submission for Assignment 3 by User 10."
  },
  {
    "s_ass_id": 4,
    "ass_id": 4,
    "submit_by_user_id": 10,
    "submit_user_course_tag": "StudentTag_10",
    "submit_date": ISODate("2025-01-22T00:00:00.000Z"),
    "score": 26,
    "graded_by_user_id": 11,
    "attachments": [],
    "description": "This is the submission for Assignment 4 by User 10."
  },
  {
    "s_ass_id": 5,
    "ass_id": 5,
    "submit_by_user_id": 14,
    "submit_user_course_tag": "StudentTag_14",
    "submit_date": ISODate("2025-01-15T00:00:00.000Z"),
    "score": 49,
    "graded_by_user_id": 13,
    "attachments": [],
    "description": "This is the submission for Assignment 5 by User 14."
  },
  {
    "s_ass_id": 6,
    "ass_id": 6,
    "submit_by_user_id": 3,
    "submit_user_course_tag": "StudentTag_3",
    "submit_date": ISODate("2025-01-22T00:00:00.000Z"),
    "score": 84,
    "graded_by_user_id": 7,
    "attachments": [
      {
        "filename": "submitted_assignment_6_file_1.pdf",
        "url": "http://example.com/assignments/course_3/assignment_6_file_1.pdf"
      }
    ],
    "description": "This is the submission for Assignment 6 by User 3."
  },
  {
    "s_ass_id": 7,
    "ass_id": 7,
    "submit_by_user_id": 8,
    "submit_user_course_tag": "StudentTag_8",
    "submit_date": ISODate("2025-01-15T00:00:00.000Z"),
    "score": 83,
    "graded_by_user_id": 1,
    "attachments": [
      {
        "filename": "submitted_assignment_7_file_1.pdf",
        "url": "http://example.com/assignments/course_4/assignment_7_file_1.pdf"
      },
      {
        "filename": "submitted_assignment_7_file_2.pdf",
        "url": "http://example.com/assignments/course_4/assignment_7_file_2.pdf"
      },
      {
        "filename": "submitted_assignment_7_file_3.pdf",
        "url": "http://example.com/assignments/course_4/assignment_7_file_3.pdf"
      }
    ],
    "description": "This is the submission for Assignment 7 by User 8."
  },
  {
    "s_ass_id": 8,
    "ass_id": 8,
    "submit_by_user_id": 11,
    "submit_user_course_tag": "StudentTag_11",
    "submit_date": ISODate("2025-01-15T00:00:00.000Z"),
    "score": 61,
    "graded_by_user_id": 6,
    "attachments": [],
    "description": "This is the submission for Assignment 8 by User 11."
  },
  {
    "s_ass_id": 9,
    "ass_id": 9,
    "submit_by_user_id": 4,
    "submit_user_course_tag": "StudentTag_4",
    "submit_date": ISODate("2025-01-22T00:00:00.000Z"),
    "score": 15,
    "graded_by_user_id": 14,
    "attachments": [
      {
        "filename": "submitted_assignment_9_file_1.pdf",
        "url": "http://example.com/assignments/course_5/assignment_9_file_1.pdf"
      }
    ],
    "description": "This is the submission for Assignment 9 by User 4."
  },
  {
    "s_ass_id": 10,
    "ass_id": 10,
    "submit_by_user_id": 4,
    "submit_user_course_tag": "StudentTag_4",
    "submit_date": ISODate("2025-01-29T00:00:00.000Z"),
    "score": 48,
    "graded_by_user_id": 12,
    "attachments": [],
    "description": "This is the submission for Assignment 10 by User 4."
  },
  {
    "s_ass_id": 11,
    "ass_id": 11,
    "submit_by_user_id": 7,
    "submit_user_course_tag": "StudentTag_7",
    "submit_date": ISODate("2025-02-05T00:00:00.000Z"),
    "score": 20,
    "graded_by_user_id": 3,
    "attachments": [
      {
        "filename": "submitted_assignment_11_file_1.pdf",
        "url": "http://example.com/assignments/course_5/assignment_11_file_1.pdf"
      },
      {
        "filename": "submitted_assignment_11_file_2.pdf",
        "url": "http://example.com/assignments/course_5/assignment_11_file_2.pdf"
      }
    ],
    "description": "This is the submission for Assignment 11 by User 7."
  }
]);

db.post.insertMany([
  {
    "post_id": 1,
    "post_by_user_id": 6,
    "title": "Post title 1 in Board 1",
    "post_user_custom_tags": [
      {
        "tag_name": "User6's CustomTag_1"
      }
    ],
    "description": "This is the content of post 1 in board 1.",
    "post_date": ISODate("2025-01-15T00:00:00.000Z"),
    "public": false,
    "in_b_id": 1,
    "post_tags": [
      {
        "tag_name": "Tag_68"
      },
      {
        "tag_name": "Tag_67"
      },
      {
        "tag_name": "Tag_19"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-01-15T00:00:00.000Z"),
        "description": "This is a comment on post 1."
      },
      {
        "comment_by_user_id": 15,
        "comment_user_custom_tag": "User15's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 1."
      },
      {
        "comment_by_user_id": 2,
        "comment_user_custom_tag": "User2's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 1."
      }
    ]
  },
  {
    "post_id": 2,
    "post_by_user_id": 6,
    "title": "Post title 2 in Board 1",
    "post_user_custom_tags": [
      {
        "tag_name": "User6's CustomTag_1"
      }
    ],
    "description": "This is the content of post 2 in board 1.",
    "post_date": ISODate("2025-01-22T00:00:00.000Z"),
    "public": false,
    "in_b_id": 1,
    "post_tags": [
      {
        "tag_name": "Tag_28"
      },
      {
        "tag_name": "Tag_51"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 13,
        "comment_user_custom_tag": "User13's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 2."
      }
    ]
  },
  {
    "post_id": 3,
    "post_by_user_id": 15,
    "title": "Post title 3 in Board 1",
    "post_user_custom_tags": [
      {
        "tag_name": "User15's CustomTag_1"
      }
    ],
    "description": "This is the content of post 3 in board 1.",
    "post_date": ISODate("2025-01-29T00:00:00.000Z"),
    "public": false,
    "in_b_id": 1,
    "post_tags": [
      {
        "tag_name": "Tag_93"
      },
      {
        "tag_name": "Tag_86"
      },
      {
        "tag_name": "Tag_27"
      }
    ],
    "comments": []
  },
  {
    "post_id": 4,
    "post_by_user_id": 3,
    "title": "Post title 4 in Board 1",
    "post_user_custom_tags": [
      {
        "tag_name": "User3's CustomTag_1"
      }
    ],
    "description": "This is the content of post 4 in board 1.",
    "post_date": ISODate("2025-02-05T00:00:00.000Z"),
    "public": true,
    "in_b_id": 1,
    "post_tags": [
      {
        "tag_name": "Tag_38"
      },
      {
        "tag_name": "Tag_5"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 10,
        "comment_user_custom_tag": "User10's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 4."
      },
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 4."
      },
      {
        "comment_by_user_id": 5,
        "comment_user_custom_tag": "User5's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 4."
      },
      {
        "comment_by_user_id": 11,
        "comment_user_custom_tag": "User11's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 4."
      },
      {
        "comment_by_user_id": 9,
        "comment_user_custom_tag": "User9's CustomTag_1",
        "comment_date": ISODate("2025-03-05T00:00:00.000Z"),
        "description": "This is a comment on post 4."
      }
    ]
  },
  {
    "post_id": 5,
    "post_by_user_id": 5,
    "title": "Post title 5 in Board 1",
    "post_user_custom_tags": [
      {
        "tag_name": "User5's CustomTag_1"
      }
    ],
    "description": "This is the content of post 5 in board 1.",
    "post_date": ISODate("2025-02-12T00:00:00.000Z"),
    "public": true,
    "in_b_id": 1,
    "post_tags": [],
    "comments": [
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 5."
      }
    ]
  },
  {
    "post_id": 6,
    "post_by_user_id": 10,
    "title": "Post title 6 in Board 1",
    "post_user_custom_tags": [
      {
        "tag_name": "User10's CustomTag_1"
      }
    ],
    "description": "This is the content of post 6 in board 1.",
    "post_date": ISODate("2025-02-19T00:00:00.000Z"),
    "public": true,
    "in_b_id": 1,
    "post_tags": [],
    "comments": [
      {
        "comment_by_user_id": 15,
        "comment_user_custom_tag": "User15's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 6."
      },
      {
        "comment_by_user_id": 5,
        "comment_user_custom_tag": "User5's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 6."
      },
      {
        "comment_by_user_id": 8,
        "comment_user_custom_tag": "User8's CustomTag_1",
        "comment_date": ISODate("2025-03-05T00:00:00.000Z"),
        "description": "This is a comment on post 6."
      },
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-03-12T00:00:00.000Z"),
        "description": "This is a comment on post 6."
      },
      {
        "comment_by_user_id": 13,
        "comment_user_custom_tag": "User13's CustomTag_1",
        "comment_date": ISODate("2025-03-19T00:00:00.000Z"),
        "description": "This is a comment on post 6."
      }
    ]
  },
  {
    "post_id": 7,
    "post_by_user_id": 12,
    "title": "Post title 7 in Board 1",
    "post_user_custom_tags": [
      {
        "tag_name": "User12's CustomTag_1"
      }
    ],
    "description": "This is the content of post 7 in board 1.",
    "post_date": ISODate("2025-02-26T00:00:00.000Z"),
    "public": true,
    "in_b_id": 1,
    "post_tags": [
      {
        "tag_name": "Tag_1"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 4,
        "comment_user_custom_tag": "User4's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 7."
      },
      {
        "comment_by_user_id": 11,
        "comment_user_custom_tag": "User11's CustomTag_1",
        "comment_date": ISODate("2025-03-05T00:00:00.000Z"),
        "description": "This is a comment on post 7."
      }
    ]
  },
  {
    "post_id": 8,
    "post_by_user_id": 13,
    "title": "Post title 8 in Board 1",
    "post_user_custom_tags": [
      {
        "tag_name": "User13's CustomTag_1"
      }
    ],
    "description": "This is the content of post 8 in board 1.",
    "post_date": ISODate("2025-03-05T00:00:00.000Z"),
    "public": true,
    "in_b_id": 1,
    "post_tags": [
      {
        "tag_name": "Tag_6"
      },
      {
        "tag_name": "Tag_56"
      },
      {
        "tag_name": "Tag_26"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-03-05T00:00:00.000Z"),
        "description": "This is a comment on post 8."
      }
    ]
  },
  {
    "post_id": 9,
    "post_by_user_id": 3,
    "title": "Post title 9 in Board 2",
    "post_user_custom_tags": [
      {
        "tag_name": "User3's CustomTag_1"
      }
    ],
    "description": "This is the content of post 9 in board 2.",
    "post_date": ISODate("2025-01-15T00:00:00.000Z"),
    "public": true,
    "in_b_id": 2,
    "post_tags": [
      {
        "tag_name": "Tag_54"
      },
      {
        "tag_name": "Tag_25"
      },
      {
        "tag_name": "Tag_3"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 15,
        "comment_user_custom_tag": "User15's CustomTag_1",
        "comment_date": ISODate("2025-01-15T00:00:00.000Z"),
        "description": "This is a comment on post 9."
      },
      {
        "comment_by_user_id": 1,
        "comment_user_custom_tag": "User1's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 9."
      },
      {
        "comment_by_user_id": 11,
        "comment_user_custom_tag": "User11's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 9."
      }
    ]
  },
  {
    "post_id": 10,
    "post_by_user_id": 3,
    "title": "Post title 10 in Board 2",
    "post_user_custom_tags": [
      {
        "tag_name": "User3's CustomTag_1"
      }
    ],
    "description": "This is the content of post 10 in board 2.",
    "post_date": ISODate("2025-01-22T00:00:00.000Z"),
    "public": false,
    "in_b_id": 2,
    "post_tags": [
      {
        "tag_name": "Tag_94"
      },
      {
        "tag_name": "Tag_36"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 10."
      },
      {
        "comment_by_user_id": 9,
        "comment_user_custom_tag": "User9's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 10."
      },
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 10."
      }
    ]
  },
  {
    "post_id": 11,
    "post_by_user_id": 1,
    "title": "Post title 11 in Board 2",
    "post_user_custom_tags": [
      {
        "tag_name": "User1's CustomTag_1"
      }
    ],
    "description": "This is the content of post 11 in board 2.",
    "post_date": ISODate("2025-01-29T00:00:00.000Z"),
    "public": true,
    "in_b_id": 2,
    "post_tags": [
      {
        "tag_name": "Tag_72"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 12,
        "comment_user_custom_tag": "User12's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 11."
      },
      {
        "comment_by_user_id": 1,
        "comment_user_custom_tag": "User1's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 11."
      },
      {
        "comment_by_user_id": 1,
        "comment_user_custom_tag": "User1's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 11."
      },
      {
        "comment_by_user_id": 8,
        "comment_user_custom_tag": "User8's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 11."
      },
      {
        "comment_by_user_id": 15,
        "comment_user_custom_tag": "User15's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 11."
      }
    ]
  },
  {
    "post_id": 12,
    "post_by_user_id": 14,
    "title": "Post title 12 in Board 2",
    "post_user_custom_tags": [
      {
        "tag_name": "User14's CustomTag_1"
      }
    ],
    "description": "This is the content of post 12 in board 2.",
    "post_date": ISODate("2025-02-05T00:00:00.000Z"),
    "public": true,
    "in_b_id": 2,
    "post_tags": [
      {
        "tag_name": "Tag_95"
      }
    ],
    "comments": []
  },
  {
    "post_id": 13,
    "post_by_user_id": 3,
    "title": "Post title 13 in Board 2",
    "post_user_custom_tags": [
      {
        "tag_name": "User3's CustomTag_1"
      }
    ],
    "description": "This is the content of post 13 in board 2.",
    "post_date": ISODate("2025-02-12T00:00:00.000Z"),
    "public": true,
    "in_b_id": 2,
    "post_tags": [
      {
        "tag_name": "Tag_29"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 13."
      }
    ]
  },
  {
    "post_id": 14,
    "post_by_user_id": 14,
    "title": "Post title 14 in Board 2",
    "post_user_custom_tags": [
      {
        "tag_name": "User14's CustomTag_1"
      }
    ],
    "description": "This is the content of post 14 in board 2.",
    "post_date": ISODate("2025-02-19T00:00:00.000Z"),
    "public": true,
    "in_b_id": 2,
    "post_tags": [],
    "comments": []
  },
  {
    "post_id": 15,
    "post_by_user_id": 8,
    "title": "Post title 15 in Board 2",
    "post_user_custom_tags": [
      {
        "tag_name": "User8's CustomTag_1"
      }
    ],
    "description": "This is the content of post 15 in board 2.",
    "post_date": ISODate("2025-02-26T00:00:00.000Z"),
    "public": false,
    "in_b_id": 2,
    "post_tags": [
      {
        "tag_name": "Tag_33"
      },
      {
        "tag_name": "Tag_70"
      },
      {
        "tag_name": "Tag_21"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 15."
      },
      {
        "comment_by_user_id": 12,
        "comment_user_custom_tag": "User12's CustomTag_1",
        "comment_date": ISODate("2025-03-05T00:00:00.000Z"),
        "description": "This is a comment on post 15."
      },
      {
        "comment_by_user_id": 1,
        "comment_user_custom_tag": "User1's CustomTag_1",
        "comment_date": ISODate("2025-03-12T00:00:00.000Z"),
        "description": "This is a comment on post 15."
      }
    ]
  },
  {
    "post_id": 16,
    "post_by_user_id": 1,
    "title": "Post title 16 in Board 2",
    "post_user_custom_tags": [
      {
        "tag_name": "User1's CustomTag_1"
      }
    ],
    "description": "This is the content of post 16 in board 2.",
    "post_date": ISODate("2025-03-05T00:00:00.000Z"),
    "public": false,
    "in_b_id": 2,
    "post_tags": [
      {
        "tag_name": "Tag_7"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 4,
        "comment_user_custom_tag": "User4's CustomTag_1",
        "comment_date": ISODate("2025-03-05T00:00:00.000Z"),
        "description": "This is a comment on post 16."
      },
      {
        "comment_by_user_id": 8,
        "comment_user_custom_tag": "User8's CustomTag_1",
        "comment_date": ISODate("2025-03-12T00:00:00.000Z"),
        "description": "This is a comment on post 16."
      }
    ]
  },
  {
    "post_id": 17,
    "post_by_user_id": 6,
    "title": "Post title 17 in Board 2",
    "post_user_custom_tags": [
      {
        "tag_name": "User6's CustomTag_1"
      }
    ],
    "description": "This is the content of post 17 in board 2.",
    "post_date": ISODate("2025-03-12T00:00:00.000Z"),
    "public": true,
    "in_b_id": 2,
    "post_tags": [
      {
        "tag_name": "Tag_59"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 7,
        "comment_user_custom_tag": "User7's CustomTag_1",
        "comment_date": ISODate("2025-03-12T00:00:00.000Z"),
        "description": "This is a comment on post 17."
      }
    ]
  },
  {
    "post_id": 18,
    "post_by_user_id": 9,
    "title": "Post title 18 in Board 3",
    "post_user_custom_tags": [
      {
        "tag_name": "User9's CustomTag_1"
      }
    ],
    "description": "This is the content of post 18 in board 3.",
    "post_date": ISODate("2025-01-15T00:00:00.000Z"),
    "public": false,
    "in_b_id": 3,
    "post_tags": [
      {
        "tag_name": "Tag_29"
      },
      {
        "tag_name": "Tag_4"
      },
      {
        "tag_name": "Tag_85"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 15,
        "comment_user_custom_tag": "User15's CustomTag_1",
        "comment_date": ISODate("2025-01-15T00:00:00.000Z"),
        "description": "This is a comment on post 18."
      },
      {
        "comment_by_user_id": 8,
        "comment_user_custom_tag": "User8's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 18."
      }
    ]
  },
  {
    "post_id": 19,
    "post_by_user_id": 10,
    "title": "Post title 19 in Board 3",
    "post_user_custom_tags": [
      {
        "tag_name": "User10's CustomTag_1"
      }
    ],
    "description": "This is the content of post 19 in board 3.",
    "post_date": ISODate("2025-01-22T00:00:00.000Z"),
    "public": true,
    "in_b_id": 3,
    "post_tags": [],
    "comments": [
      {
        "comment_by_user_id": 9,
        "comment_user_custom_tag": "User9's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 19."
      },
      {
        "comment_by_user_id": 15,
        "comment_user_custom_tag": "User15's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 19."
      }
    ]
  },
  {
    "post_id": 20,
    "post_by_user_id": 11,
    "title": "Post title 20 in Board 3",
    "post_user_custom_tags": [
      {
        "tag_name": "User11's CustomTag_1"
      }
    ],
    "description": "This is the content of post 20 in board 3.",
    "post_date": ISODate("2025-01-29T00:00:00.000Z"),
    "public": false,
    "in_b_id": 3,
    "post_tags": [],
    "comments": [
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 20."
      },
      {
        "comment_by_user_id": 4,
        "comment_user_custom_tag": "User4's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 20."
      },
      {
        "comment_by_user_id": 13,
        "comment_user_custom_tag": "User13's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 20."
      },
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 20."
      },
      {
        "comment_by_user_id": 11,
        "comment_user_custom_tag": "User11's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 20."
      }
    ]
  },
  {
    "post_id": 21,
    "post_by_user_id": 6,
    "title": "Post title 21 in Board 3",
    "post_user_custom_tags": [
      {
        "tag_name": "User6's CustomTag_1"
      }
    ],
    "description": "This is the content of post 21 in board 3.",
    "post_date": ISODate("2025-02-05T00:00:00.000Z"),
    "public": true,
    "in_b_id": 3,
    "post_tags": [],
    "comments": [
      {
        "comment_by_user_id": 1,
        "comment_user_custom_tag": "User1's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 21."
      }
    ]
  },
  {
    "post_id": 22,
    "post_by_user_id": 5,
    "title": "Post title 22 in Board 4",
    "post_user_custom_tags": [
      {
        "tag_name": "User5's CustomTag_1"
      }
    ],
    "description": "This is the content of post 22 in board 4.",
    "post_date": ISODate("2025-01-15T00:00:00.000Z"),
    "public": false,
    "in_b_id": 4,
    "post_tags": [
      {
        "tag_name": "Tag_16"
      }
    ],
    "comments": []
  },
  {
    "post_id": 23,
    "post_by_user_id": 6,
    "title": "Post title 23 in Board 4",
    "post_user_custom_tags": [
      {
        "tag_name": "User6's CustomTag_1"
      }
    ],
    "description": "This is the content of post 23 in board 4.",
    "post_date": ISODate("2025-01-22T00:00:00.000Z"),
    "public": true,
    "in_b_id": 4,
    "post_tags": [
      {
        "tag_name": "Tag_11"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 12,
        "comment_user_custom_tag": "User12's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 23."
      },
      {
        "comment_by_user_id": 9,
        "comment_user_custom_tag": "User9's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 23."
      },
      {
        "comment_by_user_id": 5,
        "comment_user_custom_tag": "User5's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 23."
      },
      {
        "comment_by_user_id": 1,
        "comment_user_custom_tag": "User1's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 23."
      }
    ]
  },
  {
    "post_id": 24,
    "post_by_user_id": 14,
    "title": "Post title 24 in Board 5",
    "post_user_custom_tags": [
      {
        "tag_name": "User14's CustomTag_1"
      }
    ],
    "description": "This is the content of post 24 in board 5.",
    "post_date": ISODate("2025-01-15T00:00:00.000Z"),
    "public": true,
    "in_b_id": 5,
    "post_tags": [
      {
        "tag_name": "Tag_34"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 2,
        "comment_user_custom_tag": "User2's CustomTag_1",
        "comment_date": ISODate("2025-01-15T00:00:00.000Z"),
        "description": "This is a comment on post 24."
      },
      {
        "comment_by_user_id": 1,
        "comment_user_custom_tag": "User1's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 24."
      }
    ]
  },
  {
    "post_id": 25,
    "post_by_user_id": 3,
    "title": "Post title 25 in Board 6",
    "post_user_custom_tags": [
      {
        "tag_name": "User3's CustomTag_1"
      }
    ],
    "description": "This is the content of post 25 in board 6.",
    "post_date": ISODate("2025-01-15T00:00:00.000Z"),
    "public": false,
    "in_b_id": 6,
    "post_tags": [
      {
        "tag_name": "Tag_64"
      },
      {
        "tag_name": "Tag_93"
      },
      {
        "tag_name": "Tag_63"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 4,
        "comment_user_custom_tag": "User4's CustomTag_1",
        "comment_date": ISODate("2025-01-15T00:00:00.000Z"),
        "description": "This is a comment on post 25."
      },
      {
        "comment_by_user_id": 7,
        "comment_user_custom_tag": "User7's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 25."
      }
    ]
  },
  {
    "post_id": 26,
    "post_by_user_id": 4,
    "title": "Post title 26 in Board 6",
    "post_user_custom_tags": [
      {
        "tag_name": "User4's CustomTag_1"
      }
    ],
    "description": "This is the content of post 26 in board 6.",
    "post_date": ISODate("2025-01-22T00:00:00.000Z"),
    "public": false,
    "in_b_id": 6,
    "post_tags": [
      {
        "tag_name": "Tag_3"
      }
    ],
    "comments": []
  },
  {
    "post_id": 27,
    "post_by_user_id": 5,
    "title": "Post title 27 in Board 6",
    "post_user_custom_tags": [
      {
        "tag_name": "User5's CustomTag_1"
      }
    ],
    "description": "This is the content of post 27 in board 6.",
    "post_date": ISODate("2025-01-29T00:00:00.000Z"),
    "public": true,
    "in_b_id": 6,
    "post_tags": [],
    "comments": [
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 27."
      }
    ]
  },
  {
    "post_id": 28,
    "post_by_user_id": 12,
    "title": "Post title 28 in Board 6",
    "post_user_custom_tags": [
      {
        "tag_name": "User12's CustomTag_1"
      }
    ],
    "description": "This is the content of post 28 in board 6.",
    "post_date": ISODate("2025-02-05T00:00:00.000Z"),
    "public": false,
    "in_b_id": 6,
    "post_tags": [
      {
        "tag_name": "Tag_62"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 7,
        "comment_user_custom_tag": "User7's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 28."
      },
      {
        "comment_by_user_id": 2,
        "comment_user_custom_tag": "User2's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 28."
      }
    ]
  },
  {
    "post_id": 29,
    "post_by_user_id": 15,
    "title": "Post title 29 in Board 6",
    "post_user_custom_tags": [
      {
        "tag_name": "User15's CustomTag_1"
      }
    ],
    "description": "This is the content of post 29 in board 6.",
    "post_date": ISODate("2025-02-12T00:00:00.000Z"),
    "public": false,
    "in_b_id": 6,
    "post_tags": [
      {
        "tag_name": "Tag_80"
      },
      {
        "tag_name": "Tag_17"
      },
      {
        "tag_name": "Tag_40"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 12,
        "comment_user_custom_tag": "User12's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 29."
      },
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 29."
      },
      {
        "comment_by_user_id": 12,
        "comment_user_custom_tag": "User12's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 29."
      },
      {
        "comment_by_user_id": 7,
        "comment_user_custom_tag": "User7's CustomTag_1",
        "comment_date": ISODate("2025-03-05T00:00:00.000Z"),
        "description": "This is a comment on post 29."
      },
      {
        "comment_by_user_id": 9,
        "comment_user_custom_tag": "User9's CustomTag_1",
        "comment_date": ISODate("2025-03-12T00:00:00.000Z"),
        "description": "This is a comment on post 29."
      }
    ]
  },
  {
    "post_id": 30,
    "post_by_user_id": 15,
    "title": "Post title 30 in Board 6",
    "post_user_custom_tags": [
      {
        "tag_name": "User15's CustomTag_1"
      }
    ],
    "description": "This is the content of post 30 in board 6.",
    "post_date": ISODate("2025-02-19T00:00:00.000Z"),
    "public": false,
    "in_b_id": 6,
    "post_tags": [
      {
        "tag_name": "Tag_86"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 2,
        "comment_user_custom_tag": "User2's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 30."
      },
      {
        "comment_by_user_id": 5,
        "comment_user_custom_tag": "User5's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 30."
      },
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-03-05T00:00:00.000Z"),
        "description": "This is a comment on post 30."
      },
      {
        "comment_by_user_id": 11,
        "comment_user_custom_tag": "User11's CustomTag_1",
        "comment_date": ISODate("2025-03-12T00:00:00.000Z"),
        "description": "This is a comment on post 30."
      },
      {
        "comment_by_user_id": 10,
        "comment_user_custom_tag": "User10's CustomTag_1",
        "comment_date": ISODate("2025-03-19T00:00:00.000Z"),
        "description": "This is a comment on post 30."
      }
    ]
  },
  {
    "post_id": 31,
    "post_by_user_id": 14,
    "title": "Post title 31 in Board 6",
    "post_user_custom_tags": [
      {
        "tag_name": "User14's CustomTag_1"
      }
    ],
    "description": "This is the content of post 31 in board 6.",
    "post_date": ISODate("2025-02-26T00:00:00.000Z"),
    "public": true,
    "in_b_id": 6,
    "post_tags": [
      {
        "tag_name": "Tag_10"
      },
      {
        "tag_name": "Tag_53"
      },
      {
        "tag_name": "Tag_98"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 7,
        "comment_user_custom_tag": "User7's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 31."
      }
    ]
  },
  {
    "post_id": 32,
    "post_by_user_id": 9,
    "title": "Post title 32 in Board 7",
    "post_user_custom_tags": [
      {
        "tag_name": "User9's CustomTag_1"
      }
    ],
    "description": "This is the content of post 32 in board 7.",
    "post_date": ISODate("2025-01-15T00:00:00.000Z"),
    "public": true,
    "in_b_id": 7,
    "post_tags": [
      {
        "tag_name": "Tag_58"
      },
      {
        "tag_name": "Tag_21"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 3,
        "comment_user_custom_tag": "User3's CustomTag_1",
        "comment_date": ISODate("2025-01-15T00:00:00.000Z"),
        "description": "This is a comment on post 32."
      },
      {
        "comment_by_user_id": 11,
        "comment_user_custom_tag": "User11's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 32."
      }
    ]
  },
  {
    "post_id": 33,
    "post_by_user_id": 7,
    "title": "Post title 33 in Board 7",
    "post_user_custom_tags": [
      {
        "tag_name": "User7's CustomTag_1"
      }
    ],
    "description": "This is the content of post 33 in board 7.",
    "post_date": ISODate("2025-01-22T00:00:00.000Z"),
    "public": false,
    "in_b_id": 7,
    "post_tags": [
      {
        "tag_name": "Tag_63"
      },
      {
        "tag_name": "Tag_82"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 3,
        "comment_user_custom_tag": "User3's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 33."
      },
      {
        "comment_by_user_id": 8,
        "comment_user_custom_tag": "User8's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 33."
      },
      {
        "comment_by_user_id": 2,
        "comment_user_custom_tag": "User2's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 33."
      },
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 33."
      },
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 33."
      }
    ]
  },
  {
    "post_id": 34,
    "post_by_user_id": 12,
    "title": "Post title 34 in Board 7",
    "post_user_custom_tags": [
      {
        "tag_name": "User12's CustomTag_1"
      }
    ],
    "description": "This is the content of post 34 in board 7.",
    "post_date": ISODate("2025-01-29T00:00:00.000Z"),
    "public": false,
    "in_b_id": 7,
    "post_tags": [
      {
        "tag_name": "Tag_17"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 5,
        "comment_user_custom_tag": "User5's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 34."
      },
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 34."
      },
      {
        "comment_by_user_id": 4,
        "comment_user_custom_tag": "User4's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 34."
      },
      {
        "comment_by_user_id": 1,
        "comment_user_custom_tag": "User1's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 34."
      },
      {
        "comment_by_user_id": 8,
        "comment_user_custom_tag": "User8's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 34."
      }
    ]
  },
  {
    "post_id": 35,
    "post_by_user_id": 4,
    "title": "Post title 35 in Board 7",
    "post_user_custom_tags": [
      {
        "tag_name": "User4's CustomTag_1"
      }
    ],
    "description": "This is the content of post 35 in board 7.",
    "post_date": ISODate("2025-02-05T00:00:00.000Z"),
    "public": false,
    "in_b_id": 7,
    "post_tags": [
      {
        "tag_name": "Tag_82"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 9,
        "comment_user_custom_tag": "User9's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 35."
      },
      {
        "comment_by_user_id": 3,
        "comment_user_custom_tag": "User3's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 35."
      }
    ]
  },
  {
    "post_id": 36,
    "post_by_user_id": 13,
    "title": "Post title 36 in Board 8",
    "post_user_custom_tags": [
      {
        "tag_name": "User13's CustomTag_1"
      }
    ],
    "description": "This is the content of post 36 in board 8.",
    "post_date": ISODate("2025-01-15T00:00:00.000Z"),
    "public": true,
    "in_b_id": 8,
    "post_tags": [
      {
        "tag_name": "Tag_23"
      },
      {
        "tag_name": "Tag_56"
      },
      {
        "tag_name": "Tag_100"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 3,
        "comment_user_custom_tag": "User3's CustomTag_1",
        "comment_date": ISODate("2025-01-15T00:00:00.000Z"),
        "description": "This is a comment on post 36."
      },
      {
        "comment_by_user_id": 10,
        "comment_user_custom_tag": "User10's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 36."
      }
    ]
  },
  {
    "post_id": 37,
    "post_by_user_id": 8,
    "title": "Post title 37 in Board 8",
    "post_user_custom_tags": [
      {
        "tag_name": "User8's CustomTag_1"
      }
    ],
    "description": "This is the content of post 37 in board 8.",
    "post_date": ISODate("2025-01-22T00:00:00.000Z"),
    "public": true,
    "in_b_id": 8,
    "post_tags": [],
    "comments": [
      {
        "comment_by_user_id": 8,
        "comment_user_custom_tag": "User8's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 37."
      }
    ]
  },
  {
    "post_id": 38,
    "post_by_user_id": 14,
    "title": "Post title 38 in Board 8",
    "post_user_custom_tags": [
      {
        "tag_name": "User14's CustomTag_1"
      }
    ],
    "description": "This is the content of post 38 in board 8.",
    "post_date": ISODate("2025-01-29T00:00:00.000Z"),
    "public": true,
    "in_b_id": 8,
    "post_tags": [
      {
        "tag_name": "Tag_62"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 8,
        "comment_user_custom_tag": "User8's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 38."
      },
      {
        "comment_by_user_id": 5,
        "comment_user_custom_tag": "User5's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 38."
      },
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 38."
      },
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 38."
      },
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 38."
      }
    ]
  },
  {
    "post_id": 39,
    "post_by_user_id": 11,
    "title": "Post title 39 in Board 8",
    "post_user_custom_tags": [
      {
        "tag_name": "User11's CustomTag_1"
      }
    ],
    "description": "This is the content of post 39 in board 8.",
    "post_date": ISODate("2025-02-05T00:00:00.000Z"),
    "public": false,
    "in_b_id": 8,
    "post_tags": [
      {
        "tag_name": "Tag_96"
      },
      {
        "tag_name": "Tag_6"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 9,
        "comment_user_custom_tag": "User9's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 39."
      },
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 39."
      },
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 39."
      }
    ]
  },
  {
    "post_id": 40,
    "post_by_user_id": 2,
    "title": "Post title 40 in Board 9",
    "post_user_custom_tags": [
      {
        "tag_name": "User2's CustomTag_1"
      }
    ],
    "description": "This is the content of post 40 in board 9.",
    "post_date": ISODate("2025-01-15T00:00:00.000Z"),
    "public": true,
    "in_b_id": 9,
    "post_tags": [],
    "comments": [
      {
        "comment_by_user_id": 1,
        "comment_user_custom_tag": "User1's CustomTag_1",
        "comment_date": ISODate("2025-01-15T00:00:00.000Z"),
        "description": "This is a comment on post 40."
      },
      {
        "comment_by_user_id": 1,
        "comment_user_custom_tag": "User1's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 40."
      },
      {
        "comment_by_user_id": 13,
        "comment_user_custom_tag": "User13's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 40."
      },
      {
        "comment_by_user_id": 9,
        "comment_user_custom_tag": "User9's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 40."
      }
    ]
  },
  {
    "post_id": 41,
    "post_by_user_id": 10,
    "title": "Post title 41 in Board 9",
    "post_user_custom_tags": [
      {
        "tag_name": "User10's CustomTag_1"
      }
    ],
    "description": "This is the content of post 41 in board 9.",
    "post_date": ISODate("2025-01-22T00:00:00.000Z"),
    "public": true,
    "in_b_id": 9,
    "post_tags": [
      {
        "tag_name": "Tag_29"
      },
      {
        "tag_name": "Tag_99"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 41."
      },
      {
        "comment_by_user_id": 12,
        "comment_user_custom_tag": "User12's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 41."
      },
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 41."
      },
      {
        "comment_by_user_id": 12,
        "comment_user_custom_tag": "User12's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 41."
      },
      {
        "comment_by_user_id": 7,
        "comment_user_custom_tag": "User7's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 41."
      }
    ]
  },
  {
    "post_id": 42,
    "post_by_user_id": 14,
    "title": "Post title 42 in Board 9",
    "post_user_custom_tags": [
      {
        "tag_name": "User14's CustomTag_1"
      }
    ],
    "description": "This is the content of post 42 in board 9.",
    "post_date": ISODate("2025-01-29T00:00:00.000Z"),
    "public": true,
    "in_b_id": 9,
    "post_tags": [
      {
        "tag_name": "Tag_18"
      },
      {
        "tag_name": "Tag_26"
      },
      {
        "tag_name": "Tag_16"
      }
    ],
    "comments": []
  },
  {
    "post_id": 43,
    "post_by_user_id": 4,
    "title": "Post title 43 in Board 10",
    "post_user_custom_tags": [
      {
        "tag_name": "User4's CustomTag_1"
      }
    ],
    "description": "This is the content of post 43 in board 10.",
    "post_date": ISODate("2025-01-15T00:00:00.000Z"),
    "public": true,
    "in_b_id": 10,
    "post_tags": [
      {
        "tag_name": "Tag_37"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 5,
        "comment_user_custom_tag": "User5's CustomTag_1",
        "comment_date": ISODate("2025-01-15T00:00:00.000Z"),
        "description": "This is a comment on post 43."
      }
    ]
  },
  {
    "post_id": 44,
    "post_by_user_id": 13,
    "title": "Post title 44 in Board 10",
    "post_user_custom_tags": [
      {
        "tag_name": "User13's CustomTag_1"
      }
    ],
    "description": "This is the content of post 44 in board 10.",
    "post_date": ISODate("2025-01-22T00:00:00.000Z"),
    "public": true,
    "in_b_id": 10,
    "post_tags": [],
    "comments": [
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 44."
      },
      {
        "comment_by_user_id": 13,
        "comment_user_custom_tag": "User13's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 44."
      },
      {
        "comment_by_user_id": 9,
        "comment_user_custom_tag": "User9's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 44."
      }
    ]
  },
  {
    "post_id": 45,
    "post_by_user_id": 2,
    "title": "Post title 45 in Board 10",
    "post_user_custom_tags": [
      {
        "tag_name": "User2's CustomTag_1"
      }
    ],
    "description": "This is the content of post 45 in board 10.",
    "post_date": ISODate("2025-01-29T00:00:00.000Z"),
    "public": true,
    "in_b_id": 10,
    "post_tags": [
      {
        "tag_name": "Tag_43"
      },
      {
        "tag_name": "Tag_46"
      },
      {
        "tag_name": "Tag_32"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 15,
        "comment_user_custom_tag": "User15's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 45."
      },
      {
        "comment_by_user_id": 12,
        "comment_user_custom_tag": "User12's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 45."
      }
    ]
  },
  {
    "post_id": 46,
    "post_by_user_id": 1,
    "title": "Post title 46 in Board 10",
    "post_user_custom_tags": [
      {
        "tag_name": "User1's CustomTag_1"
      }
    ],
    "description": "This is the content of post 46 in board 10.",
    "post_date": ISODate("2025-02-05T00:00:00.000Z"),
    "public": true,
    "in_b_id": 10,
    "post_tags": [
      {
        "tag_name": "Tag_27"
      },
      {
        "tag_name": "Tag_20"
      },
      {
        "tag_name": "Tag_100"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 2,
        "comment_user_custom_tag": "User2's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 46."
      },
      {
        "comment_by_user_id": 3,
        "comment_user_custom_tag": "User3's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 46."
      },
      {
        "comment_by_user_id": 4,
        "comment_user_custom_tag": "User4's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 46."
      }
    ]
  },
  {
    "post_id": 47,
    "post_by_user_id": 6,
    "title": "Post title 47 in Board 10",
    "post_user_custom_tags": [
      {
        "tag_name": "User6's CustomTag_1"
      }
    ],
    "description": "This is the content of post 47 in board 10.",
    "post_date": ISODate("2025-02-12T00:00:00.000Z"),
    "public": true,
    "in_b_id": 10,
    "post_tags": [],
    "comments": [
      {
        "comment_by_user_id": 6,
        "comment_user_custom_tag": "User6's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 47."
      },
      {
        "comment_by_user_id": 4,
        "comment_user_custom_tag": "User4's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 47."
      },
      {
        "comment_by_user_id": 5,
        "comment_user_custom_tag": "User5's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 47."
      },
      {
        "comment_by_user_id": 13,
        "comment_user_custom_tag": "User13's CustomTag_1",
        "comment_date": ISODate("2025-03-05T00:00:00.000Z"),
        "description": "This is a comment on post 47."
      },
      {
        "comment_by_user_id": 11,
        "comment_user_custom_tag": "User11's CustomTag_1",
        "comment_date": ISODate("2025-03-12T00:00:00.000Z"),
        "description": "This is a comment on post 47."
      }
    ]
  },
  {
    "post_id": 48,
    "post_by_user_id": 7,
    "title": "Post title 48 in Board 11",
    "post_user_custom_tags": [
      {
        "tag_name": "User7's CustomTag_1"
      }
    ],
    "description": "This is the content of post 48 in board 11.",
    "post_date": ISODate("2025-01-15T00:00:00.000Z"),
    "public": false,
    "in_b_id": 11,
    "post_tags": [
      {
        "tag_name": "Tag_77"
      },
      {
        "tag_name": "Tag_45"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 10,
        "comment_user_custom_tag": "User10's CustomTag_1",
        "comment_date": ISODate("2025-01-15T00:00:00.000Z"),
        "description": "This is a comment on post 48."
      },
      {
        "comment_by_user_id": 10,
        "comment_user_custom_tag": "User10's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 48."
      },
      {
        "comment_by_user_id": 3,
        "comment_user_custom_tag": "User3's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 48."
      },
      {
        "comment_by_user_id": 8,
        "comment_user_custom_tag": "User8's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 48."
      }
    ]
  },
  {
    "post_id": 49,
    "post_by_user_id": 5,
    "title": "Post title 49 in Board 11",
    "post_user_custom_tags": [
      {
        "tag_name": "User5's CustomTag_1"
      }
    ],
    "description": "This is the content of post 49 in board 11.",
    "post_date": ISODate("2025-01-22T00:00:00.000Z"),
    "public": true,
    "in_b_id": 11,
    "post_tags": [
      {
        "tag_name": "Tag_27"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 13,
        "comment_user_custom_tag": "User13's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 49."
      },
      {
        "comment_by_user_id": 4,
        "comment_user_custom_tag": "User4's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 49."
      },
      {
        "comment_by_user_id": 15,
        "comment_user_custom_tag": "User15's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 49."
      },
      {
        "comment_by_user_id": 11,
        "comment_user_custom_tag": "User11's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 49."
      }
    ]
  },
  {
    "post_id": 50,
    "post_by_user_id": 3,
    "title": "Post title 50 in Board 11",
    "post_user_custom_tags": [
      {
        "tag_name": "User3's CustomTag_1"
      }
    ],
    "description": "This is the content of post 50 in board 11.",
    "post_date": ISODate("2025-01-29T00:00:00.000Z"),
    "public": true,
    "in_b_id": 11,
    "post_tags": [],
    "comments": [
      {
        "comment_by_user_id": 8,
        "comment_user_custom_tag": "User8's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 50."
      },
      {
        "comment_by_user_id": 15,
        "comment_user_custom_tag": "User15's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 50."
      }
    ]
  },
  {
    "post_id": 51,
    "post_by_user_id": 2,
    "title": "Post title 51 in Board 11",
    "post_user_custom_tags": [
      {
        "tag_name": "User2's CustomTag_1"
      }
    ],
    "description": "This is the content of post 51 in board 11.",
    "post_date": ISODate("2025-02-05T00:00:00.000Z"),
    "public": true,
    "in_b_id": 11,
    "post_tags": [
      {
        "tag_name": "Tag_52"
      }
    ],
    "comments": []
  },
  {
    "post_id": 52,
    "post_by_user_id": 11,
    "title": "Post title 52 in Board 11",
    "post_user_custom_tags": [
      {
        "tag_name": "User11's CustomTag_1"
      }
    ],
    "description": "This is the content of post 52 in board 11.",
    "post_date": ISODate("2025-02-12T00:00:00.000Z"),
    "public": false,
    "in_b_id": 11,
    "post_tags": [
      {
        "tag_name": "Tag_8"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 13,
        "comment_user_custom_tag": "User13's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 52."
      },
      {
        "comment_by_user_id": 9,
        "comment_user_custom_tag": "User9's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 52."
      }
    ]
  },
  {
    "post_id": 53,
    "post_by_user_id": 12,
    "title": "Post title 53 in Board 12",
    "post_user_custom_tags": [
      {
        "tag_name": "User12's CustomTag_1"
      }
    ],
    "description": "This is the content of post 53 in board 12.",
    "post_date": ISODate("2025-01-15T00:00:00.000Z"),
    "public": true,
    "in_b_id": 12,
    "post_tags": [
      {
        "tag_name": "Tag_76"
      }
    ],
    "comments": []
  },
  {
    "post_id": 54,
    "post_by_user_id": 1,
    "title": "Post title 54 in Board 12",
    "post_user_custom_tags": [
      {
        "tag_name": "User1's CustomTag_1"
      }
    ],
    "description": "This is the content of post 54 in board 12.",
    "post_date": ISODate("2025-01-22T00:00:00.000Z"),
    "public": false,
    "in_b_id": 12,
    "post_tags": [
      {
        "tag_name": "Tag_18"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 14,
        "comment_user_custom_tag": "User14's CustomTag_1",
        "comment_date": ISODate("2025-01-22T00:00:00.000Z"),
        "description": "This is a comment on post 54."
      },
      {
        "comment_by_user_id": 5,
        "comment_user_custom_tag": "User5's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 54."
      }
    ]
  },
  {
    "post_id": 55,
    "post_by_user_id": 4,
    "title": "Post title 55 in Board 12",
    "post_user_custom_tags": [
      {
        "tag_name": "User4's CustomTag_1"
      }
    ],
    "description": "This is the content of post 55 in board 12.",
    "post_date": ISODate("2025-01-29T00:00:00.000Z"),
    "public": false,
    "in_b_id": 12,
    "post_tags": [
      {
        "tag_name": "Tag_50"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 4,
        "comment_user_custom_tag": "User4's CustomTag_1",
        "comment_date": ISODate("2025-01-29T00:00:00.000Z"),
        "description": "This is a comment on post 55."
      },
      {
        "comment_by_user_id": 2,
        "comment_user_custom_tag": "User2's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 55."
      },
      {
        "comment_by_user_id": 13,
        "comment_user_custom_tag": "User13's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 55."
      }
    ]
  },
  {
    "post_id": 56,
    "post_by_user_id": 14,
    "title": "Post title 56 in Board 12",
    "post_user_custom_tags": [
      {
        "tag_name": "User14's CustomTag_1"
      }
    ],
    "description": "This is the content of post 56 in board 12.",
    "post_date": ISODate("2025-02-05T00:00:00.000Z"),
    "public": true,
    "in_b_id": 12,
    "post_tags": [
      {
        "tag_name": "Tag_58"
      },
      {
        "tag_name": "Tag_60"
      },
      {
        "tag_name": "Tag_85"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 4,
        "comment_user_custom_tag": "User4's CustomTag_1",
        "comment_date": ISODate("2025-02-05T00:00:00.000Z"),
        "description": "This is a comment on post 56."
      }
    ]
  },
  {
    "post_id": 57,
    "post_by_user_id": 3,
    "title": "Post title 57 in Board 12",
    "post_user_custom_tags": [
      {
        "tag_name": "User3's CustomTag_1"
      }
    ],
    "description": "This is the content of post 57 in board 12.",
    "post_date": ISODate("2025-02-12T00:00:00.000Z"),
    "public": false,
    "in_b_id": 12,
    "post_tags": [
      {
        "tag_name": "Tag_3"
      },
      {
        "tag_name": "Tag_31"
      },
      {
        "tag_name": "Tag_24"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 7,
        "comment_user_custom_tag": "User7's CustomTag_1",
        "comment_date": ISODate("2025-02-12T00:00:00.000Z"),
        "description": "This is a comment on post 57."
      },
      {
        "comment_by_user_id": 5,
        "comment_user_custom_tag": "User5's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 57."
      },
      {
        "comment_by_user_id": 8,
        "comment_user_custom_tag": "User8's CustomTag_1",
        "comment_date": ISODate("2025-02-26T00:00:00.000Z"),
        "description": "This is a comment on post 57."
      }
    ]
  },
  {
    "post_id": 58,
    "post_by_user_id": 6,
    "title": "Post title 58 in Board 12",
    "post_user_custom_tags": [
      {
        "tag_name": "User6's CustomTag_1"
      }
    ],
    "description": "This is the content of post 58 in board 12.",
    "post_date": ISODate("2025-02-19T00:00:00.000Z"),
    "public": false,
    "in_b_id": 12,
    "post_tags": [
      {
        "tag_name": "Tag_7"
      },
      {
        "tag_name": "Tag_40"
      },
      {
        "tag_name": "Tag_49"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 2,
        "comment_user_custom_tag": "User2's CustomTag_1",
        "comment_date": ISODate("2025-02-19T00:00:00.000Z"),
        "description": "This is a comment on post 58."
      }
    ]
  },
  {
    "post_id": 59,
    "post_by_user_id": 13,
    "title": "Post title 59 in Board 12",
    "post_user_custom_tags": [
      {
        "tag_name": "User13's CustomTag_1"
      }
    ],
    "description": "This is the content of post 59 in board 12.",
    "post_date": ISODate("2025-02-26T00:00:00.000Z"),
    "public": false,
    "in_b_id": 12,
    "post_tags": [],
    "comments": []
  },
  {
    "post_id": 60,
    "post_by_user_id": 7,
    "title": "Post title 60 in Board 12",
    "post_user_custom_tags": [
      {
        "tag_name": "User7's CustomTag_1"
      }
    ],
    "description": "This is the content of post 60 in board 12.",
    "post_date": ISODate("2025-03-05T00:00:00.000Z"),
    "public": false,
    "in_b_id": 12,
    "post_tags": [
      {
        "tag_name": "Tag_22"
      }
    ],
    "comments": []
  },
  {
    "post_id": 61,
    "post_by_user_id": 9,
    "title": "Post title 61 in Board 12",
    "post_user_custom_tags": [
      {
        "tag_name": "User9's CustomTag_1"
      }
    ],
    "description": "This is the content of post 61 in board 12.",
    "post_date": ISODate("2025-03-12T00:00:00.000Z"),
    "public": false,
    "in_b_id": 12,
    "post_tags": [
      {
        "tag_name": "Tag_43"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 13,
        "comment_user_custom_tag": "User13's CustomTag_1",
        "comment_date": ISODate("2025-03-12T00:00:00.000Z"),
        "description": "This is a comment on post 61."
      },
      {
        "comment_by_user_id": 11,
        "comment_user_custom_tag": "User11's CustomTag_1",
        "comment_date": ISODate("2025-03-19T00:00:00.000Z"),
        "description": "This is a comment on post 61."
      }
    ]
  },
  {
    "post_id": 62,
    "post_by_user_id": 2,
    "title": "Post title 62 in Board 12",
    "post_user_custom_tags": [
      {
        "tag_name": "User2's CustomTag_1"
      }
    ],
    "description": "This is the content of post 62 in board 12.",
    "post_date": ISODate("2025-03-19T00:00:00.000Z"),
    "public": false,
    "in_b_id": 12,
    "post_tags": [
      {
        "tag_name": "Tag_97"
      },
      {
        "tag_name": "Tag_66"
      },
      {
        "tag_name": "Tag_10"
      }
    ],
    "comments": [
      {
        "comment_by_user_id": 2,
        "comment_user_custom_tag": "User2's CustomTag_1",
        "comment_date": ISODate("2025-03-19T00:00:00.000Z"),
        "description": "This is a comment on post 62."
      },
      {
        "comment_by_user_id": 3,
        "comment_user_custom_tag": "User3's CustomTag_1",
        "comment_date": ISODate("2025-03-26T00:00:00.000Z"),
        "description": "This is a comment on post 62."
      },
      {
        "comment_by_user_id": 9,
        "comment_user_custom_tag": "User9's CustomTag_1",
        "comment_date": ISODate("2025-04-02T00:00:00.000Z"),
        "description": "This is a comment on post 62."
      },
      {
        "comment_by_user_id": 10,
        "comment_user_custom_tag": "User10's CustomTag_1",
        "comment_date": ISODate("2025-04-09T00:00:00.000Z"),
        "description": "This is a comment on post 62."
      },
      {
        "comment_by_user_id": 1,
        "comment_user_custom_tag": "User1's CustomTag_1",
        "comment_date": ISODate("2025-04-16T00:00:00.000Z"),
        "description": "This is a comment on post 62."
      }
    ]
  }
]);

db.custom_tag.insertMany([
  {
    "user_id": 1,
    "user_tag": "User1's CustomTag_1"
  },
  {
    "user_id": 1,
    "user_tag": "User1's CustomTag_2"
  },
  {
    "user_id": 1,
    "user_tag": "User1's CustomTag_3"
  },
  {
    "user_id": 2,
    "user_tag": "User2's CustomTag_1"
  },
  {
    "user_id": 3,
    "user_tag": "User3's CustomTag_1"
  },
  {
    "user_id": 3,
    "user_tag": "User3's CustomTag_2"
  },
  {
    "user_id": 3,
    "user_tag": "User3's CustomTag_3"
  },
  {
    "user_id": 4,
    "user_tag": "User4's CustomTag_1"
  },
  {
    "user_id": 4,
    "user_tag": "User4's CustomTag_2"
  },
  {
    "user_id": 4,
    "user_tag": "User4's CustomTag_3"
  },
  {
    "user_id": 5,
    "user_tag": "User5's CustomTag_1"
  },
  {
    "user_id": 5,
    "user_tag": "User5's CustomTag_2"
  },
  {
    "user_id": 5,
    "user_tag": "User5's CustomTag_3"
  },
  {
    "user_id": 6,
    "user_tag": "User6's CustomTag_1"
  },
  {
    "user_id": 6,
    "user_tag": "User6's CustomTag_2"
  },
  {
    "user_id": 6,
    "user_tag": "User6's CustomTag_3"
  },
  {
    "user_id": 7,
    "user_tag": "User7's CustomTag_1"
  },
  {
    "user_id": 7,
    "user_tag": "User7's CustomTag_2"
  },
  {
    "user_id": 8,
    "user_tag": "User8's CustomTag_1"
  },
  {
    "user_id": 8,
    "user_tag": "User8's CustomTag_2"
  },
  {
    "user_id": 9,
    "user_tag": "User9's CustomTag_1"
  },
  {
    "user_id": 10,
    "user_tag": "User10's CustomTag_1"
  },
  {
    "user_id": 10,
    "user_tag": "User10's CustomTag_2"
  },
  {
    "user_id": 11,
    "user_tag": "User11's CustomTag_1"
  },
  {
    "user_id": 11,
    "user_tag": "User11's CustomTag_2"
  },
  {
    "user_id": 12,
    "user_tag": "User12's CustomTag_1"
  },
  {
    "user_id": 12,
    "user_tag": "User12's CustomTag_2"
  },
  {
    "user_id": 13,
    "user_tag": "User13's CustomTag_1"
  },
  {
    "user_id": 13,
    "user_tag": "User13's CustomTag_2"
  },
  {
    "user_id": 14,
    "user_tag": "User14's CustomTag_1"
  },
  {
    "user_id": 14,
    "user_tag": "User14's CustomTag_2"
  },
  {
    "user_id": 15,
    "user_tag": "User15's CustomTag_1"
  }
]);

db.course_tag.insertMany([
  {
    "user_id": 1,
    "course_id": 2,
    "course_tag": "User1 in Course2's CourseTag_1"
  },
  {
    "user_id": 1,
    "course_id": 4,
    "course_tag": "User1 in Course4's CourseTag_1"
  },
  {
    "user_id": 2,
    "course_id": 1,
    "course_tag": "User2 in Course1's CourseTag_1"
  },
  {
    "user_id": 2,
    "course_id": 2,
    "course_tag": "User2 in Course2's CourseTag_1"
  },
  {
    "user_id": 2,
    "course_id": 3,
    "course_tag": "User2 in Course3's CourseTag_1"
  },
  {
    "user_id": 2,
    "course_id": 4,
    "course_tag": "User2 in Course4's CourseTag_1"
  },
  {
    "user_id": 2,
    "course_id": 5,
    "course_tag": "User2 in Course5's CourseTag_1"
  },
  {
    "user_id": 3,
    "course_id": 1,
    "course_tag": "User3 in Course1's CourseTag_1"
  },
  {
    "user_id": 3,
    "course_id": 3,
    "course_tag": "User3 in Course3's CourseTag_1"
  },
  {
    "user_id": 3,
    "course_id": 5,
    "course_tag": "User3 in Course5's CourseTag_1"
  },
  {
    "user_id": 4,
    "course_id": 1,
    "course_tag": "User4 in Course1's CourseTag_1"
  },
  {
    "user_id": 4,
    "course_id": 2,
    "course_tag": "User4 in Course2's CourseTag_1"
  },
  {
    "user_id": 4,
    "course_id": 3,
    "course_tag": "User4 in Course3's CourseTag_1"
  },
  {
    "user_id": 4,
    "course_id": 5,
    "course_tag": "User4 in Course5's CourseTag_1"
  },
  {
    "user_id": 5,
    "course_id": 2,
    "course_tag": "User5 in Course2's CourseTag_1"
  },
  {
    "user_id": 5,
    "course_id": 3,
    "course_tag": "User5 in Course3's CourseTag_1"
  },
  {
    "user_id": 5,
    "course_id": 5,
    "course_tag": "User5 in Course5's CourseTag_1"
  },
  {
    "user_id": 6,
    "course_id": 1,
    "course_tag": "User6 in Course1's CourseTag_1"
  },
  {
    "user_id": 6,
    "course_id": 2,
    "course_tag": "User6 in Course2's CourseTag_1"
  },
  {
    "user_id": 6,
    "course_id": 3,
    "course_tag": "User6 in Course3's CourseTag_1"
  },
  {
    "user_id": 6,
    "course_id": 4,
    "course_tag": "User6 in Course4's CourseTag_1"
  },
  {
    "user_id": 6,
    "course_id": 5,
    "course_tag": "User6 in Course5's CourseTag_1"
  },
  {
    "user_id": 7,
    "course_id": 1,
    "course_tag": "User7 in Course1's CourseTag_1"
  },
  {
    "user_id": 7,
    "course_id": 3,
    "course_tag": "User7 in Course3's CourseTag_1"
  },
  {
    "user_id": 7,
    "course_id": 4,
    "course_tag": "User7 in Course4's CourseTag_1"
  },
  {
    "user_id": 7,
    "course_id": 5,
    "course_tag": "User7 in Course5's CourseTag_1"
  },
  {
    "user_id": 8,
    "course_id": 2,
    "course_tag": "User8 in Course2's CourseTag_1"
  },
  {
    "user_id": 8,
    "course_id": 3,
    "course_tag": "User8 in Course3's CourseTag_1"
  },
  {
    "user_id": 8,
    "course_id": 4,
    "course_tag": "User8 in Course4's CourseTag_1"
  },
  {
    "user_id": 9,
    "course_id": 1,
    "course_tag": "User9 in Course1's CourseTag_1"
  },
  {
    "user_id": 9,
    "course_id": 3,
    "course_tag": "User9 in Course3's CourseTag_1"
  },
  {
    "user_id": 9,
    "course_id": 5,
    "course_tag": "User9 in Course5's CourseTag_1"
  },
  {
    "user_id": 10,
    "course_id": 1,
    "course_tag": "User10 in Course1's CourseTag_1"
  },
  {
    "user_id": 10,
    "course_id": 2,
    "course_tag": "User10 in Course2's CourseTag_1"
  },
  {
    "user_id": 10,
    "course_id": 3,
    "course_tag": "User10 in Course3's CourseTag_1"
  },
  {
    "user_id": 11,
    "course_id": 1,
    "course_tag": "User11 in Course1's CourseTag_1"
  },
  {
    "user_id": 11,
    "course_id": 2,
    "course_tag": "User11 in Course2's CourseTag_1"
  },
  {
    "user_id": 11,
    "course_id": 3,
    "course_tag": "User11 in Course3's CourseTag_1"
  },
  {
    "user_id": 11,
    "course_id": 5,
    "course_tag": "User11 in Course5's CourseTag_1"
  },
  {
    "user_id": 12,
    "course_id": 1,
    "course_tag": "User12 in Course1's CourseTag_1"
  },
  {
    "user_id": 12,
    "course_id": 2,
    "course_tag": "User12 in Course2's CourseTag_1"
  },
  {
    "user_id": 12,
    "course_id": 4,
    "course_tag": "User12 in Course4's CourseTag_1"
  },
  {
    "user_id": 12,
    "course_id": 5,
    "course_tag": "User12 in Course5's CourseTag_1"
  },
  {
    "user_id": 13,
    "course_id": 1,
    "course_tag": "User13 in Course1's CourseTag_1"
  },
  {
    "user_id": 13,
    "course_id": 3,
    "course_tag": "User13 in Course3's CourseTag_1"
  },
  {
    "user_id": 13,
    "course_id": 5,
    "course_tag": "User13 in Course5's CourseTag_1"
  },
  {
    "user_id": 14,
    "course_id": 1,
    "course_tag": "User14 in Course1's CourseTag_1"
  },
  {
    "user_id": 14,
    "course_id": 2,
    "course_tag": "User14 in Course2's CourseTag_1"
  },
  {
    "user_id": 14,
    "course_id": 3,
    "course_tag": "User14 in Course3's CourseTag_1"
  },
  {
    "user_id": 14,
    "course_id": 4,
    "course_tag": "User14 in Course4's CourseTag_1"
  },
  {
    "user_id": 14,
    "course_id": 5,
    "course_tag": "User14 in Course5's CourseTag_1"
  },
  {
    "user_id": 15,
    "course_id": 1,
    "course_tag": "User15 in Course1's CourseTag_1"
  },
  {
    "user_id": 15,
    "course_id": 2,
    "course_tag": "User15 in Course2's CourseTag_1"
  },
  {
    "user_id": 15,
    "course_id": 3,
    "course_tag": "User15 in Course3's CourseTag_1"
  },
  {
    "user_id": 15,
    "course_id": 4,
    "course_tag": "User15 in Course4's CourseTag_1"
  }
]);

db.notification.insertMany([
  {
    "n_id": 1,
    "event_id": 1,
    "event_category": "course",
    "context": "Successfully enrolled in a course",
    "notified_date": ISODate("2025-01-08T00:00:00.000Z")
  }
]);

db.notified.insertMany([
  {
    "n_id": 1,
    "user_id": 1,
    "is_read": false
  },
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
  {
    "n_id": 1,
    "user_id": 4,
    "is_read": false
  },
  {
    "n_id": 1,
    "user_id": 5,
    "is_read": false
  },
  {
    "n_id": 1,
    "user_id": 6,
    "is_read": false
  },
  {
    "n_id": 1,
    "user_id": 7,
    "is_read": false
  },
  {
    "n_id": 1,
    "user_id": 8,
    "is_read": false
  },
  {
    "n_id": 1,
    "user_id": 9,
    "is_read": false
  },
  {
    "n_id": 1,
    "user_id": 10,
    "is_read": false
  },
  {
    "n_id": 1,
    "user_id": 11,
    "is_read": false
  },
  {
    "n_id": 1,
    "user_id": 12,
    "is_read": false
  },
  {
    "n_id": 1,
    "user_id": 13,
    "is_read": false
  },
  {
    "n_id": 1,
    "user_id": 14,
    "is_read": false
  },
  {
    "n_id": 1,
    "user_id": 15,
    "is_read": false
  }
]);

db.mailbox.insertMany([
  {
    "mail_id": 1,
    "sender_id": 11,
    "receiver_id": 1,
    "subject": "Subject of Mail 1",
    "content": "This is the content of mail 1 from User 11 to User 1.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 2,
    "sender_id": 2,
    "receiver_id": 1,
    "subject": "Subject of Mail 2",
    "content": "This is the content of mail 2 from User 2 to User 1.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 3,
    "sender_id": 13,
    "receiver_id": 1,
    "subject": "Subject of Mail 3",
    "content": "This is the content of mail 3 from User 13 to User 1.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 4,
    "sender_id": 3,
    "receiver_id": 1,
    "subject": "Subject of Mail 4",
    "content": "This is the content of mail 4 from User 3 to User 1.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 5,
    "sender_id": 3,
    "receiver_id": 1,
    "subject": "Subject of Mail 5",
    "content": "This is the content of mail 5 from User 3 to User 1.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 6,
    "sender_id": 15,
    "receiver_id": 1,
    "subject": "Subject of Mail 6",
    "content": "This is the content of mail 6 from User 15 to User 1.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 7,
    "sender_id": 14,
    "receiver_id": 1,
    "subject": "Subject of Mail 7",
    "content": "This is the content of mail 7 from User 14 to User 1.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 8,
    "sender_id": 9,
    "receiver_id": 1,
    "subject": "Subject of Mail 8",
    "content": "This is the content of mail 8 from User 9 to User 1.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 9,
    "sender_id": 3,
    "receiver_id": 2,
    "subject": "Subject of Mail 9",
    "content": "This is the content of mail 9 from User 3 to User 2.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 10,
    "sender_id": 11,
    "receiver_id": 2,
    "subject": "Subject of Mail 10",
    "content": "This is the content of mail 10 from User 11 to User 2.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 11,
    "sender_id": 4,
    "receiver_id": 3,
    "subject": "Subject of Mail 11",
    "content": "This is the content of mail 11 from User 4 to User 3.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 12,
    "sender_id": 8,
    "receiver_id": 3,
    "subject": "Subject of Mail 12",
    "content": "This is the content of mail 12 from User 8 to User 3.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 13,
    "sender_id": 5,
    "receiver_id": 3,
    "subject": "Subject of Mail 13",
    "content": "This is the content of mail 13 from User 5 to User 3.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 14,
    "sender_id": 12,
    "receiver_id": 4,
    "subject": "Subject of Mail 14",
    "content": "This is the content of mail 14 from User 12 to User 4.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 15,
    "sender_id": 9,
    "receiver_id": 5,
    "subject": "Subject of Mail 15",
    "content": "This is the content of mail 15 from User 9 to User 5.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 16,
    "sender_id": 15,
    "receiver_id": 5,
    "subject": "Subject of Mail 16",
    "content": "This is the content of mail 16 from User 15 to User 5.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 17,
    "sender_id": 3,
    "receiver_id": 5,
    "subject": "Subject of Mail 17",
    "content": "This is the content of mail 17 from User 3 to User 5.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 18,
    "sender_id": 8,
    "receiver_id": 5,
    "subject": "Subject of Mail 18",
    "content": "This is the content of mail 18 from User 8 to User 5.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 19,
    "sender_id": 8,
    "receiver_id": 5,
    "subject": "Subject of Mail 19",
    "content": "This is the content of mail 19 from User 8 to User 5.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 20,
    "sender_id": 7,
    "receiver_id": 5,
    "subject": "Subject of Mail 20",
    "content": "This is the content of mail 20 from User 7 to User 5.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 21,
    "sender_id": 2,
    "receiver_id": 5,
    "subject": "Subject of Mail 21",
    "content": "This is the content of mail 21 from User 2 to User 5.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 22,
    "sender_id": 8,
    "receiver_id": 6,
    "subject": "Subject of Mail 22",
    "content": "This is the content of mail 22 from User 8 to User 6.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 23,
    "sender_id": 4,
    "receiver_id": 6,
    "subject": "Subject of Mail 23",
    "content": "This is the content of mail 23 from User 4 to User 6.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 24,
    "sender_id": 7,
    "receiver_id": 6,
    "subject": "Subject of Mail 24",
    "content": "This is the content of mail 24 from User 7 to User 6.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 25,
    "sender_id": 5,
    "receiver_id": 6,
    "subject": "Subject of Mail 25",
    "content": "This is the content of mail 25 from User 5 to User 6.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 26,
    "sender_id": 12,
    "receiver_id": 6,
    "subject": "Subject of Mail 26",
    "content": "This is the content of mail 26 from User 12 to User 6.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 27,
    "sender_id": 11,
    "receiver_id": 6,
    "subject": "Subject of Mail 27",
    "content": "This is the content of mail 27 from User 11 to User 6.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 28,
    "sender_id": 1,
    "receiver_id": 7,
    "subject": "Subject of Mail 28",
    "content": "This is the content of mail 28 from User 1 to User 7.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 29,
    "sender_id": 6,
    "receiver_id": 7,
    "subject": "Subject of Mail 29",
    "content": "This is the content of mail 29 from User 6 to User 7.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 30,
    "sender_id": 10,
    "receiver_id": 7,
    "subject": "Subject of Mail 30",
    "content": "This is the content of mail 30 from User 10 to User 7.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 31,
    "sender_id": 5,
    "receiver_id": 7,
    "subject": "Subject of Mail 31",
    "content": "This is the content of mail 31 from User 5 to User 7.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 32,
    "sender_id": 9,
    "receiver_id": 8,
    "subject": "Subject of Mail 32",
    "content": "This is the content of mail 32 from User 9 to User 8.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 33,
    "sender_id": 10,
    "receiver_id": 8,
    "subject": "Subject of Mail 33",
    "content": "This is the content of mail 33 from User 10 to User 8.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 34,
    "sender_id": 10,
    "receiver_id": 8,
    "subject": "Subject of Mail 34",
    "content": "This is the content of mail 34 from User 10 to User 8.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 35,
    "sender_id": 12,
    "receiver_id": 8,
    "subject": "Subject of Mail 35",
    "content": "This is the content of mail 35 from User 12 to User 8.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 36,
    "sender_id": 5,
    "receiver_id": 8,
    "subject": "Subject of Mail 36",
    "content": "This is the content of mail 36 from User 5 to User 8.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 37,
    "sender_id": 3,
    "receiver_id": 8,
    "subject": "Subject of Mail 37",
    "content": "This is the content of mail 37 from User 3 to User 8.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 38,
    "sender_id": 4,
    "receiver_id": 8,
    "subject": "Subject of Mail 38",
    "content": "This is the content of mail 38 from User 4 to User 8.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 39,
    "sender_id": 15,
    "receiver_id": 9,
    "subject": "Subject of Mail 39",
    "content": "This is the content of mail 39 from User 15 to User 9.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 40,
    "sender_id": 8,
    "receiver_id": 9,
    "subject": "Subject of Mail 40",
    "content": "This is the content of mail 40 from User 8 to User 9.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 41,
    "sender_id": 11,
    "receiver_id": 9,
    "subject": "Subject of Mail 41",
    "content": "This is the content of mail 41 from User 11 to User 9.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 42,
    "sender_id": 11,
    "receiver_id": 9,
    "subject": "Subject of Mail 42",
    "content": "This is the content of mail 42 from User 11 to User 9.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 43,
    "sender_id": 14,
    "receiver_id": 9,
    "subject": "Subject of Mail 43",
    "content": "This is the content of mail 43 from User 14 to User 9.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 44,
    "sender_id": 11,
    "receiver_id": 9,
    "subject": "Subject of Mail 44",
    "content": "This is the content of mail 44 from User 11 to User 9.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 45,
    "sender_id": 5,
    "receiver_id": 9,
    "subject": "Subject of Mail 45",
    "content": "This is the content of mail 45 from User 5 to User 9.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 46,
    "sender_id": 4,
    "receiver_id": 9,
    "subject": "Subject of Mail 46",
    "content": "This is the content of mail 46 from User 4 to User 9.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 47,
    "sender_id": 7,
    "receiver_id": 10,
    "subject": "Subject of Mail 47",
    "content": "This is the content of mail 47 from User 7 to User 10.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 48,
    "sender_id": 13,
    "receiver_id": 11,
    "subject": "Subject of Mail 48",
    "content": "This is the content of mail 48 from User 13 to User 11.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 49,
    "sender_id": 4,
    "receiver_id": 11,
    "subject": "Subject of Mail 49",
    "content": "This is the content of mail 49 from User 4 to User 11.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 50,
    "sender_id": 8,
    "receiver_id": 11,
    "subject": "Subject of Mail 50",
    "content": "This is the content of mail 50 from User 8 to User 11.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 51,
    "sender_id": 7,
    "receiver_id": 12,
    "subject": "Subject of Mail 51",
    "content": "This is the content of mail 51 from User 7 to User 12.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 52,
    "sender_id": 6,
    "receiver_id": 12,
    "subject": "Subject of Mail 52",
    "content": "This is the content of mail 52 from User 6 to User 12.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 53,
    "sender_id": 15,
    "receiver_id": 12,
    "subject": "Subject of Mail 53",
    "content": "This is the content of mail 53 from User 15 to User 12.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 54,
    "sender_id": 11,
    "receiver_id": 12,
    "subject": "Subject of Mail 54",
    "content": "This is the content of mail 54 from User 11 to User 12.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 55,
    "sender_id": 6,
    "receiver_id": 12,
    "subject": "Subject of Mail 55",
    "content": "This is the content of mail 55 from User 6 to User 12.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 56,
    "sender_id": 7,
    "receiver_id": 12,
    "subject": "Subject of Mail 56",
    "content": "This is the content of mail 56 from User 7 to User 12.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 57,
    "sender_id": 10,
    "receiver_id": 12,
    "subject": "Subject of Mail 57",
    "content": "This is the content of mail 57 from User 10 to User 12.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 58,
    "sender_id": 13,
    "receiver_id": 12,
    "subject": "Subject of Mail 58",
    "content": "This is the content of mail 58 from User 13 to User 12.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 59,
    "sender_id": 6,
    "receiver_id": 13,
    "subject": "Subject of Mail 59",
    "content": "This is the content of mail 59 from User 6 to User 13.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 60,
    "sender_id": 15,
    "receiver_id": 13,
    "subject": "Subject of Mail 60",
    "content": "This is the content of mail 60 from User 15 to User 13.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 61,
    "sender_id": 3,
    "receiver_id": 13,
    "subject": "Subject of Mail 61",
    "content": "This is the content of mail 61 from User 3 to User 13.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 62,
    "sender_id": 14,
    "receiver_id": 13,
    "subject": "Subject of Mail 62",
    "content": "This is the content of mail 62 from User 14 to User 13.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 63,
    "sender_id": 4,
    "receiver_id": 13,
    "subject": "Subject of Mail 63",
    "content": "This is the content of mail 63 from User 4 to User 13.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 64,
    "sender_id": 8,
    "receiver_id": 13,
    "subject": "Subject of Mail 64",
    "content": "This is the content of mail 64 from User 8 to User 13.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 65,
    "sender_id": 7,
    "receiver_id": 13,
    "subject": "Subject of Mail 65",
    "content": "This is the content of mail 65 from User 7 to User 13.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 66,
    "sender_id": 11,
    "receiver_id": 13,
    "subject": "Subject of Mail 66",
    "content": "This is the content of mail 66 from User 11 to User 13.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 67,
    "sender_id": 11,
    "receiver_id": 14,
    "subject": "Subject of Mail 67",
    "content": "This is the content of mail 67 from User 11 to User 14.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 68,
    "sender_id": 15,
    "receiver_id": 14,
    "subject": "Subject of Mail 68",
    "content": "This is the content of mail 68 from User 15 to User 14.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 69,
    "sender_id": 15,
    "receiver_id": 14,
    "subject": "Subject of Mail 69",
    "content": "This is the content of mail 69 from User 15 to User 14.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 70,
    "sender_id": 12,
    "receiver_id": 14,
    "subject": "Subject of Mail 70",
    "content": "This is the content of mail 70 from User 12 to User 14.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 71,
    "sender_id": 2,
    "receiver_id": 15,
    "subject": "Subject of Mail 71",
    "content": "This is the content of mail 71 from User 2 to User 15.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 72,
    "sender_id": 14,
    "receiver_id": 15,
    "subject": "Subject of Mail 72",
    "content": "This is the content of mail 72 from User 14 to User 15.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 73,
    "sender_id": 9,
    "receiver_id": 15,
    "subject": "Subject of Mail 73",
    "content": "This is the content of mail 73 from User 9 to User 15.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 74,
    "sender_id": 7,
    "receiver_id": 15,
    "subject": "Subject of Mail 74",
    "content": "This is the content of mail 74 from User 7 to User 15.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 75,
    "sender_id": 2,
    "receiver_id": 15,
    "subject": "Subject of Mail 75",
    "content": "This is the content of mail 75 from User 2 to User 15.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 76,
    "sender_id": 9,
    "receiver_id": 15,
    "subject": "Subject of Mail 76",
    "content": "This is the content of mail 76 from User 9 to User 15.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  },
  {
    "mail_id": 77,
    "sender_id": 9,
    "receiver_id": 15,
    "subject": "Subject of Mail 77",
    "content": "This is the content of mail 77 from User 9 to User 15.",
    "send_date": ISODate("2025-02-05T00:00:00.000Z")
  }
]);

db.counter.insertOne({
  "announcement": 15,
  "assignments": 11,
  "assist_in": 13,
  "course": 5,
  "course_tag": 55,
  "custom_tag": 32,
  "discussion_board": 12,
  "exams": 10,
  "taken_exams": 10,
  "mailbox": 77,
  "materials": 21,
  "notification": 1,
  "notified": 15,
  "post": 62,
  "study_in": 22,
  "submitted_ass": 11,
  "teach_in": 20,
  "user": 15
});

