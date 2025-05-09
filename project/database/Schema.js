// Drop the database if it exists
db = db.getSiblingDB("moojidle");
db.dropDatabase();

// Recreate the database
db = db.getSiblingDB("moojidle");

db.createCollection("user", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "name", "contact_ways", "email", "pw"], 
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
                    bsonType: "array",
                    items: { 
                        bsonType: "object",
                        properties: {
                            approach: { 
                                bsonType: "string", 
                                description: "use social media(need to provide which) or phone calls" 
                            },
                            details: { 
                                bsonType: "string", 
                                description: "Details of the contact method(such as phone number or social media handle)" 
                            }
                        }
                    }
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
                }
            }
        }
    }
});

db.createCollection("teach_in", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "course_id"],
            properties: {
                user_id: { bsonType: "int" },
                course_id: { bsonType: "int" }
            }
        }
    }
});

db.createCollection("assist_in", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "course_id"],
            properties: {
                user_id: { bsonType: "int" },
                course_id: { bsonType: "int" }
            }
        }
    }
});

db.createCollection("study_in", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "course_id", "student_id"],
            properties: {
                user_id: { bsonType: "int" },
                course_id: { bsonType: "int" },
                student_id: { bsonType: "int" }
            }
        }
    }
});

db.createCollection("announcement", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["a_id", "create_date", "context", "user_id", "course_id"],
            properties: {
                a_id: { bsonType: "int" },
                create_date: { bsonType: "date" },
                context: { bsonType: "string" },
                user_id: { bsonType: "int" },
                course_id: { bsonType: "int"},
            }
        }
    }
});

db.createCollection("course", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["course_id", "name", "description", "create_date", "syllabus"],
            properties: {
                course_id: { bsonType: "int" },
                name: { bsonType: "string" },
                description: { bsonType: "string" },
                create_date: { bsonType: "date" },
                start_date: { bsonType: "date" },
                syllabus: { bsonType: "string" },
                invite_link: { bsonType: "string" },
                week_num: { bsonType: "int" },
                color: { bsonType: "string" }
            } 
        }
    }
});

db.createCollection("discussion_board", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["board_id", "course_id", "name"],
            properties: {
                board_id: { bsonType: "int" },
                course_id: { bsonType: "int" },
                name: { bsonType: "string" },
            }
        }
    }
});

db.createCollection("custom_tag", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "user_tag"],
            properties: {
                user_id: { bsonType: "int" },
                user_tag: { bsonType: "string" }
            }
        }
    }
});

db.createCollection("course_tag", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "course_id", "course_tag"],
            properties: {
                user_id: { bsonType: "int" },
                course_id: { bsonType: "int" },
                course_tag: { bsonType: "string" }
            }
        }
    }
});

db.createCollection("exams", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["exam_id", "in_course_id", "create_by_user_id", "exam_name", "exam_date", "create_date", "description"],
            properties: {
                exam_id: { bsonType: "int", description: "Primary key: Unique identifier for the exam" },
                in_course_id: { bsonType: "int", description: "Foreign key: ID of the course the exam belongs to" },
                create_by_user_id: { bsonType: "int", description: "Foreign key: User ID of the creator" },
                exam_name: { bsonType: "string", description: "Name of the exam" },
                exam_date: { bsonType: "date", description: "Date when the exam will be held" },
                create_date: { bsonType: "date", description: "Date when the exam was created" },
                description: { bsonType: "string", description: "Description of the exam" },
                attachments: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        properties: {
                            filename: { bsonType: "string", description: "Name of the attached file" },
                            url: { bsonType: "string", description: "URL of the attached file" }
                        }
                    },
                    description: "Attachments related to the exam (optional)"
                }
            }
        }
    }
});

db.createCollection("materials", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["m_id", "in_course_id", "create_by_user_id", "m_name", "create_date"],
            properties: {
                m_id: { bsonType: "int" },
                in_course_id: { bsonType: "int" },
                create_by_user_id: { bsonType: "int" },
                m_name: { bsonType: "string" },
                create_date: { bsonType: "date" },
                path_to_file: { bsonType: "string" },
                url: { bsonType: "string" },
                description: { bsonType: "string" }
            }
        }
    }
});

db.createCollection("assignments", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["ass_id", "in_course_id", "create_by_user_id", "ass_name", "create_date", "end_date"],
            properties: {
                ass_id: {
                    bsonType: "int",
                    description: "Primary key: Unique identifier for the assignment"
                },
                in_course_id: {
                    bsonType: "int",
                    description: "Foreign key: ID of the course the assignment belongs to"
                },
                create_by_user_id: {
                    bsonType: "int",
                    description: "Foreign key: User ID of the creator"
                },
                ass_name: {
                    bsonType: "string",
                    description: "Name of the assignment"
                },
                create_date: {
                    bsonType: "date",
                    description: "Date when the assignment was created"
                },
                end_date: {
                    bsonType: "date",
                    description: "Deadline for the assignment"
                },
                description: {
                    bsonType: "string",
                    description: "Description of the assignment (optional)"
                },
                attachments: {
                    bsonType: "array",
                    items: { 
                        bsonType: "object",
                        properties: {
                            filename: { bsonType: "string", description: "Name of the attached file" },
                            url: { bsonType: "string", description: "URL of the attached file" }
                        }
                    }
                }
            }
        }
    }
});
  
db.createCollection("submitted_ass", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["s_ass_id", "ass_id", "submit_by_user_id", "submit_user_course_tag", "submit_date"],
            properties: {
                s_ass_id: {
                    bsonType: "int",
                    description: "Primary key: Unique identifier for the submission record"
                },
                ass_id: {
                    bsonType: "int",
                    description: "Foreign key: Corresponding assignment ID"
                },
                submit_by_user_id: {
                    bsonType: "int",
                    description: "Foreign key: User ID of the submitter"
                },
                submit_user_course_tag: {
                    bsonType: "string",
                    description: "Tag identifying the submitter in the course"
                },
                submit_date: {
                    bsonType: "date",
                    description: "Date of submission"
                },
                points: {
                    bsonType: "number",
                    description: "Score (added later)"
                },
                graded_by_user_id: {
                    bsonType: "int",
                    description: "Foreign key: User ID of the grader (added later)"
                },
                description: {
                    bsonType: "string",
                    description: "Additional notes (optional)"
                }
            }
        }
    }
});
  
db.createCollection("post", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["post_id", "post_by_user_id", "post_user_custom_tag", "description", "post_date", "public"],
            properties: {
                post_id: {
                    bsonType: "int",
                    description: "Primary key: Unique identifier for the post"
                },
                post_by_user_id: {
                    bsonType: "int",
                    description: "Foreign key: User ID of the post creator"
                },
                title: {
                    bsonType: "string",
                    description: "Title of the post"
                },
                post_user_custom_tag: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        properties: {
                            tag_id: { bsonType: "int" },
                            tag_name: { bsonType: "string" }
                        },
                        required: ["tag_id", "tag_name"]
                    }
                },
                description: {
                    bsonType: "string",
                    description: "Content of the post"
                },
                post_date: {
                    bsonType: "date",
                    description: "Date when the post was created"
                },
                public: {
                    bsonType: "bool",
                    description: "Indicates whether the post is public or private"
                },
                comments:{
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        properties: {
                            comment_by_user_id: { bsonType: "int" },
                            comment_user_custom_tag: { bsonType: "string" },
                            comment_date: { bsonType: "date" },
                            description: { bsonType: "string" }
                        },
                        required: ["comment_by_user_id", "comment_user_custom_tag", "comment_date", "description"]
                    },
                    description: "Comments on the post (optional)"
                },
                in_b_id: {
                    bsonType: "int",
                    description: "Foreign key: Board ID where the post belongs"
                },
                post_tags: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        properties: {
                            tag_id: { bsonType: "int" },
                            tag_name: { bsonType: "string" }
                        },
                        required: ["tag_id", "tag_name"]
                    },
                    description: "Tags associated with the post (optional)"
                }
            }
        }
    }
});
  
db.createCollection("mailbox", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["mail_id", "sender_id", "receiver_id", "subject", "content", "send_date"],
            properties: {
                mail_id: { bsonType: "int" },
                sender_id: { bsonType: "int" },
                receiver_id: { bsonType: "int" },
                subject: { bsonType: "string" },
                content: { bsonType: "string" },
                send_date: { bsonType: "date" }
            }
        }
    }
});

db.createCollection("counter", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            properties: {
                announcement: {bsonType: "int"},
                assignments: {bsonType: "int"},
                assist_in: {bsonType: "int"},
                counter: {bsonType: "int"},
                course: {bsonType: "int"},
                course_tag: {bsonType: "int"},
                custom_tag: {bsonType: "int"},
                discussion_board: {bsonType: "int"},
                exams: {bsonType: "int"},
                mailbox: {bsonType: "int"},
                materials: {bsonType: "int"},
                post: {bsonType: "int"},
                study_in: {bsonType: "int"},
                submitted_ass: {bsonType: "int"},
                teach_in: {bsonType: "int"},
                user: {bsonType: "int"}
            }
        }
    }
});
