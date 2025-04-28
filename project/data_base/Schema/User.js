db.createCollection("user", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            properties: {
                user_id: {
                    bsonType: "int",
                    description: "PK: User ID"
                },
                name: {
                    bsonType: "string",
                    description: "User name"
                },
                contact_ways: {
                    bsonType: "string",
                    description: "User contact ways"
                },
                path_to_profile_pic: {
                    bsonType: "string",
                    description: "User profile picture path"
                },
                email: {
                    bsonType: "string",
                    pattern: "^.+@.+$",
                    description: "User email"
                },
                pw: {
                    bsonType: "string",
                    description: "User password"
                },
                assist_in_courses: {
                    properties: {
                        user_id: {
                            bsonType: "int",
                            description: "FK: User ID"
                        },
                        course_id: {
                            bsonType: "int",
                            description: "FK: Course ID"
                        }
                    }
                },
                study_in_courses: {
                    properties: {
                        user_id: {
                            bsonType: "int",
                            description: "FK: User ID"
                        },
                        course_id: {
                            bsonType: "int",
                            description: "FK: Course ID"
                        }
                    }
                },
                teach_in_courses: {
                    properties: {
                        user_id: {
                            bsonType: "int",
                            description: "FK: User ID"
                        },
                        course_id: {
                            bsonType: "int",
                            description: "FK: Course ID"
                        }
                    }
                },
                announcement: {
                    properties: {
                        a_id: {
                            bsonType: "int",
                            description: "PK: Announcement ID"
                        },
                        user_id: {
                            bsonType: "int",
                            description: "FK: User ID"
                        }
                    }
                }
            },
            required: ["user_id"]
        }
    }
});

db.createCollection("course", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["course_id"],
            properties: {
                course_id: { bsonType: "int" },
                name: { bsonType: "string" },
                description: { bsonType: "string" },
                create_date: { bsonType: "date" },
                syllabus: { bsonType: "string" },
                discussion_board: {
                    properties: {
                        board_id: { bsonType: "int" },
                        course_id: { bsonType: "int" }
                    }
                },
                assignments: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["ass_id", "ass_name", "in_course_id", "content", "create_by_user_id", "create_date", "end_date"],
                        properties: {
                            ass_id: { bsonType: "int" },
                            ass_name: { bsonType: "string" },
                            in_course_id: { bsonType: "int" },
                            create_by_user_id: { bsonType: "int" },
                            description: { bsonType: "string" },
                            content: { bsonType: "string" },
                            create_date: { bsonType: "date" },
                            end_date: { bsonType: "date" },
                            attachments: {
                                bsonType: "object",
                                properties: {
                                    filename: { bsonType: "string" },
                                    url: { bsonType: "string" }
                                }
                            }
                        }
                    }
                },
                announcements: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["a_id"],
                        properties: {
                            a_id: { bsonType: "int" },
                            create_date: { bsonType: "date" },
                            context: { bsonType: "string" }
                        }
                    }
                }
            }
        }
    }
});