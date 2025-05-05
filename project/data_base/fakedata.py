import random
from datetime import datetime, timedelta
import json
import os

def random_date(start, end):
    return start + timedelta(
        seconds=random.randint(0, int((end - start).total_seconds()))
    )

# Generate random contact ways
def generate_contact_ways():
    """Generate random contact methods."""
    contact_methods = [
        {"approach": "phone", "details": f"555-{random.randint(1000, 9999)}"},
        {"approach": "email", "details": f"user{random.randint(1, 100)}@example.com"},
        {"approach": "social_media", "details": f"@user{random.randint(1, 100)}"}
    ]
    return random.sample(contact_methods, random.randint(1, len(contact_methods)))

def generate_users(n=15):
    """Generate fake data for users."""
    users = []
    for i in range(1, n + 1):
        # 調整 create_date 的範圍，例如從 2019 年到 2023 年
        create_date = random_date(datetime(2019, 1, 1), datetime(2023, 12, 31))
        users.append({
            "user_id": i,
            "name": f"User {i}",
            "contact_ways": generate_contact_ways(),
            "path_to_profile_pic": f"/profiles/{i}.jpg",
            "email": f"user{i}@example.com",
            "pw": f"hashed_password_{i}",
            "create_date": create_date  # 保留為 datetime 對象
        })
    return users

def generate_courses(n=5):
    courses = []
    for i in range(1, n + 1):
        create_date = random_date(datetime(2020, 1, 1), datetime(2023, 1, 1))
        courses.append({
            "course_id": i,
            "name": f"Course {i}",
            "description": f"This is the description for course {i}.",
            "create_date": create_date,  # 保留為 datetime 對象
            "syllabus": f"Syllabus for course {i}",
            "invite_link": f"http://example.com/course_{i}/invite",
        })
    return courses

# # Generate teach_in data
def generate_teach_in(user_count=15, course_count=5, role_tracker=None):
    teach_in = []
    for user_id in range(1, user_count + 1):
        # Each user can teach 0 to 3 courses
        courses = random.sample(range(1, course_count + 1), random.randint(0, 3))
        for course_id in courses:
            if role_tracker and (user_id, course_id) in role_tracker:
                continue  # Skip if the user already has a role in this course
            teach_in.append({
                "user_id": user_id,
                "course_id": course_id
            })
            if role_tracker is not None:
                role_tracker.add((user_id, course_id))
    return teach_in

# # Generate assist_in data
def generate_assist_in(user_count=15, course_count=5, role_tracker=None):
    assist_in = []
    for user_id in range(1, user_count + 1):
        # Each user can assist in 0 to 2 courses
        courses = random.sample(range(1, course_count + 1), random.randint(0, 2))
        for course_id in courses:
            if role_tracker and (user_id, course_id) in role_tracker:
                continue  # Skip if the user already has a role in this course
            assist_in.append({
                "user_id": user_id,
                "course_id": course_id
            })
            if role_tracker is not None:
                role_tracker.add((user_id, course_id))
    return assist_in

# # Generate study_in data
def generate_study_in(user_count=15, course_count=5, role_tracker=None):
    study_in = []
    for user_id in range(1, user_count + 1):
        # Each user can study in 1 to 4 courses
        courses = random.sample(range(1, course_count + 1), random.randint(1, 4))
        for course_id in courses:
            if role_tracker and (user_id, course_id) in role_tracker:
                continue  # Skip if the user already has a role in this course
            study_in.append({
                "user_id": user_id,
                "course_id": course_id,
                "student_id": random.randint(1000, 9999)  # Random student ID
            })
            if role_tracker is not None:
                role_tracker.add((user_id, course_id))
    return study_in

# # Generate announcement data
def generate_announcements(user_count=15, course_count=5, n=20):
    """Generate fake data for announcements"""
    announcements = []
    for i in range(1, n + 1):
        create_date = random_date(datetime(2020, 1, 1), datetime(2023, 1, 1))
        announcements.append({
            "a_id": i,
            "create_date": f'ISODate("{create_date.isoformat()}")',
            "context": f"Announcement {i} content.",
            "user_id": random.randint(1, user_count),  # Random user who created the announcement
            "course_id": random.randint(1, course_count)  # Random course the announcement belongs to
        })
    return announcements

# # Generate discussion_board data
def generate_discussion_boards(course_count=5, max_boards_per_course=3):
    """Generate fake data for discussion boards"""
    discussion_boards = []
    board_id = 1  # Start board IDs from 1
    for course_id in range(1, course_count + 1):
        # Each course can have 1 to max_boards_per_course discussion boards
        num_boards = random.randint(1, max_boards_per_course)
        for _ in range(num_boards):
            discussion_boards.append({
                "board_id": board_id,
                "course_id": course_id,
                "name": f"Discussion Board {board_id} for Course {course_id}"
            })
            board_id += 1
    return discussion_boards

# # Generate custom_tag data
def generate_custom_tags(user_count=15, max_tags_per_user=3):
    """Generate fake data for custom tags"""
    custom_tags = []
    for user_id in range(1, user_count + 1):
        # Each user can have 1 to max_tags_per_user custom tags
        num_tags = random.randint(1, max_tags_per_user)
        for _ in range(num_tags):
            custom_tags.append({
                "user_id": user_id,
                "user_tag": f"CustomTag_{random.randint(1, 100)}"
            })
    return custom_tags

# # Generate course_tag data
def generate_course_tags(user_count=15, course_count=5, max_tags_per_user=3):
    """Generate fake data for course tags"""
    course_tags = []
    for user_id in range(1, user_count + 1):
        # Each user can have tags for 1 to max_tags_per_user courses
        num_tags = random.randint(1, max_tags_per_user)
        courses = random.sample(range(1, course_count + 1), num_tags)
        for course_id in courses:
            course_tags.append({
                "user_id": user_id,
                "course_id": course_id,
                "course_tag": f"CourseTag_{random.randint(1, 100)}"
            })
    return course_tags

def generate_exams(courses, user_count=15, max_exams_per_course=3, max_attachments_per_exam=3):
    """生成考試數據"""
    exams = []
    exam_id = 1  # 開始的考試 ID
    for course in courses:
        course_id = course["course_id"]
        # 確保 course["create_date"] 是 datetime 對象
        if isinstance(course["create_date"], datetime):
            course_create_date = course["create_date"]
        else:
            course_create_date = datetime.strptime(course["create_date"].replace('ISODate("', '').replace('")', ''), "%Y-%m-%dT%H:%M:%S")
        
        # 每門課程可以有 1 到 max_exams_per_course 次考試
        num_exams = random.randint(1, max_exams_per_course)
        for _ in range(num_exams):
            exam_date = random_date(course_create_date, datetime(2023, 12, 31))
            # 生成考試的附件
            num_attachments = random.randint(0, max_attachments_per_exam)
            attachments = [
                {
                    "filename": f"exam_{exam_id}_file_{i + 1}.pdf",
                    "url": f"http://example.com/exam_{exam_id}_file_{i + 1}.pdf"
                }
                for i in range(num_attachments)
            ]
            exams.append({
                "exam_id": exam_id,
                "in_course_id": course_id,
                "create_by_user_id": random.randint(1, user_count),  # 隨機生成創建者
                "exam_name": f"Exam {exam_id} for Course {course_id}",
                "exam_date": f'ISODate("{exam_date.isoformat()}")',  # 將 exam_date 轉換為 ISODate 格式
                "create_date": f'ISODate("{random_date(course_create_date, exam_date).isoformat()}")',  # 將 create_date 轉換為 ISODate 格式
                "description": f"This is the description for Exam {exam_id}.",
                "attachments": attachments
            })
            exam_id += 1
    return exams

# # Generate materials data
def generate_materials(courses, teach_in, assist_in, max_materials_per_course=5):
    """Generate fake data for materials"""
    materials = []
    material_id = 1  # Start material IDs from 1

    # Create a mapping of course_id to eligible users (teachers and assistants)
    eligible_users = {}
    for entry in teach_in:
        course_id = entry["course_id"]
        user_id = entry["user_id"]
        if course_id not in eligible_users:
            eligible_users[course_id] = set()
        eligible_users[course_id].add(user_id)

    for entry in assist_in:
        course_id = entry["course_id"]
        user_id = entry["user_id"]
        if course_id not in eligible_users:
            eligible_users[course_id] = set()
        eligible_users[course_id].add(user_id)

    # Generate materials for each course
    for course in courses:
        course_id = course["course_id"]
        course_create_date = course["create_date"] if isinstance(course["create_date"], datetime) else datetime.strptime(
            course["create_date"].replace('ISODate("', '').replace('")', ''), "%Y-%m-%dT%H:%M:%S"
        )
        # Each course can have 1 to max_materials_per_course materials
        num_materials = random.randint(1, max_materials_per_course)
        for _ in range(num_materials):
            create_date = random_date(course_create_date, datetime(2023, 12, 31))
            # Select a random eligible user for this course
            if course_id in eligible_users and eligible_users[course_id]:
                create_by_user_id = random.choice(list(eligible_users[course_id]))
            else:
                # If no eligible users, skip this material
                continue
            materials.append({
                "m_id": material_id,
                "in_course_id": course_id,
                "create_by_user_id": create_by_user_id,
                "m_name": f"Material {material_id} for Course {course_id}",
                "create_date": f'ISODate("{create_date.isoformat()}")',  # 將 create_date 轉換為 ISODate 格式
                "path_to_file": f"/materials/course_{course_id}/material_{material_id}.pdf",
                "url": f"http://example.com/materials/course_{course_id}/material_{material_id}.pdf",
                "description": f"This is the description for Material {material_id}."
            })
            material_id += 1
    return materials

# # # Generate assignments data
def generate_assignments(courses, teach_in, assist_in, max_assignments_per_course=5, max_attachments_per_assignment=3):
    """Generate fake data for assignments"""
    assignments = []
    assignment_id = 1  # Start assignment IDs from 1

    # Create a mapping of course_id to eligible users (teachers and assistants)
    eligible_users = {}
    for entry in teach_in:
        course_id = entry["course_id"]
        user_id = entry["user_id"]
        if course_id not in eligible_users:
            eligible_users[course_id] = set()
        eligible_users[course_id].add(user_id)

    for entry in assist_in:
        course_id = entry["course_id"]
        user_id = entry["user_id"]
        if course_id not in eligible_users:
            eligible_users[course_id] = set()
        eligible_users[course_id].add(user_id)

    # Generate assignments for each course
    for course in courses:
        course_id = course["course_id"]
        course_create_date = course["create_date"] if isinstance(course["create_date"], datetime) else datetime.strptime(
            course["create_date"].replace('ISODate("', '').replace('")', ''), "%Y-%m-%dT%H:%M:%S"
        )
        # Each course can have 1 to max_assignments_per_course assignments
        num_assignments = random.randint(1, max_assignments_per_course)
        for _ in range(num_assignments):
            # Select a random eligible user for this course
            if course_id in eligible_users and eligible_users[course_id]:
                create_by_user_id = random.choice(list(eligible_users[course_id]))
            else:
                # If no eligible users, skip this assignment
                continue

            # Generate create_date and end_date
            create_date = random_date(course_create_date, datetime(2023, 12, 31))
            end_date = random_date(create_date, datetime(2024, 12, 31))

            # Generate attachments for the assignment
            num_attachments = random.randint(0, max_attachments_per_assignment)  # 0 to max_attachments_per_assignment
            attachments = [
                {
                    "filename": f"assignment_{assignment_id}_file_{i + 1}.pdf",
                    "url": f"http://example.com/assignments/course_{course_id}/assignment_{assignment_id}_file_{i + 1}.pdf"
                }
                for i in range(num_attachments)
            ]

            # Add the assignment to the list
            assignments.append({
                "ass_id": assignment_id,
                "in_course_id": course_id,
                "create_by_user_id": create_by_user_id,
                "ass_name": f"Assignment {assignment_id} for Course {course_id}",
                "create_date": f'ISODate("{create_date.isoformat()}")',  # 將 create_date 轉換為 ISODate 格式
                "end_date": f'ISODate("{end_date.isoformat()}")',  # 將 end_date 轉換為 ISODate 格式
                "description": f"This is the description for Assignment {assignment_id}.",
                "attachments": attachments
            })
            assignment_id += 1
    return assignments

def generate_submitted_assignments(assignments, study_in, teach_in, assist_in, max_submissions_per_assignment=5):
    """Generate fake data for submitted assignments"""
    submitted_assignments = []
    submission_id = 1  # Start submission IDs from 1

    # Create a mapping of course_id to eligible graders (teachers and assistants)
    eligible_graders = {}
    for entry in teach_in:
        course_id = entry["course_id"]
        user_id = entry["user_id"]
        if course_id not in eligible_graders:
            eligible_graders[course_id] = set()
        eligible_graders[course_id].add(user_id)

    for entry in assist_in:
        course_id = entry["course_id"]
        user_id = entry["user_id"]
        if course_id not in eligible_graders:
            eligible_graders[course_id] = set()
        eligible_graders[course_id].add(user_id)

    # Create a mapping of course_id to students
    eligible_students = {}
    for entry in study_in:
        course_id = entry["course_id"]
        user_id = entry["user_id"]
        if course_id not in eligible_students:
            eligible_students[course_id] = set()
        eligible_students[course_id].add(user_id)

    # Generate submissions for each assignment
    for assignment in assignments:
        ass_id = assignment["ass_id"]
        course_id = assignment["in_course_id"]
        create_date = datetime.strptime(assignment["create_date"].replace('ISODate("', '').replace('")', ''), "%Y-%m-%dT%H:%M:%S")
        end_date = datetime.strptime(assignment["end_date"].replace('ISODate("', '').replace('")', ''), "%Y-%m-%dT%H:%M:%S")

        # Each assignment can have 1 to max_submissions_per_assignment submissions
        num_submissions = random.randint(1, max_submissions_per_assignment)
        for _ in range(num_submissions):
            # Select a random student for this course
            if course_id in eligible_students and eligible_students[course_id]:
                submit_by_user_id = random.choice(list(eligible_students[course_id]))
            else:
                # If no eligible students, skip this submission
                continue

            # Generate submission date (must be between create_date and end_date)
            submit_date = random_date(create_date, end_date)

            # Select a random grader for this course
            if course_id in eligible_graders and eligible_graders[course_id]:
                graded_by_user_id = random.choice(list(eligible_graders[course_id]))
            else:
                graded_by_user_id = None  # No grader assigned

            # Generate points (score)
            points = random.randint(0, 100) if graded_by_user_id else None

            # Add the submission to the list
            submitted_assignments.append({
                "s_ass_id": submission_id,
                "ass_id": ass_id,
                "submit_by_user_id": submit_by_user_id,
                "submit_user_course_tag": f"StudentTag_{submit_by_user_id}",
                "submit_date": f'ISODate("{submit_date.isoformat()}")',  # 將 submit_date 轉換為 ISODate 格式
                "points": points,
                "graded_by_user_id": graded_by_user_id,
                "description": f"This is the submission for Assignment {ass_id} by User {submit_by_user_id}."
            })
            submission_id += 1

    return submitted_assignments

# # # Generate posts data
def generate_posts(discussion_boards, users, max_posts_per_board=10):
    """Generate fake data for posts in discussion boards"""
    posts = []
    post_id = 1  # Start post IDs from 1

    # Use the create_date field directly as a datetime object
    user_create_dates = {
        user["user_id"]: user["create_date"] for user in users
    }

    # Generate posts for each discussion board
    for board in discussion_boards:
        board_id = board["board_id"]
        # Each discussion board can have 1 to max_posts_per_board posts
        num_posts = random.randint(1, max_posts_per_board)
        for _ in range(num_posts):
            user_id = random.randint(1, len(users))  # Random user who created the post
            user_create_date = user_create_dates[user_id]  # Get the user's create_date
            post_date = random_date(user_create_date, datetime(2023, 12, 31))  # Generate a random post date

            posts.append({
                "post_id": post_id,
                "post_by_user_id": user_id,
                "title": f"Post title {post_id} in Board {board_id}",
                "post_user_custom_tag": [
                    {
                        "tag_id": random.randint(1, 100),
                        "tag_name": f"Tag_{random.randint(1, 100)}"
                    }
                    for _ in range(random.randint(0, 3))
                ],
                "description": f"This is the content of post {post_id} in board {board_id}.",
                "post_date": f'ISODate("{post_date.isoformat()}")',  # Convert post_date to ISODate format
                "public": random.choice([True, False]),  # Randomly set the post as public or private
                "in_b_id": board_id,
                "post_tags": [
                    {
                        "tag_id": random.randint(1, 100),
                        "tag_name": f"Tag_{random.randint(1, 100)}"
                    }
                    for _ in range(random.randint(0, 3))  # Randomly generate 0 to 3 tags
                ],
                "comments": [
                    {
                        "comment_id": random.randint(1, 1000),
                        "comment_by_user_id": random.randint(1, len(users)),
                        "comment_user_custom_tag": f"CustomTag_{random.randint(1, 100)}",
                        "comment_date": f'ISODate("{random_date(post_date, datetime(2023, 12, 31)).isoformat()}")',
                        "description": f"This is a comment on post {post_id}."
                    }
                    for _ in range(random.randint(0, 5))  # Randomly generate 0 to 5 comments
                ]
            })
            post_id += 1
    return posts

# # # Generate mailbox data
def generate_mailbox(users, max_messages_per_user=10):
    """Generate fake data for the mailbox collection."""
    mailboxes = []
    mail_id = 1  # Start mail IDs from 1

    for user in users:
        receiver_id = user["user_id"]
        num_messages = random.randint(1, max_messages_per_user)  # Each user can have 1 to max_messages_per_user messages

        for _ in range(num_messages):
            sender_id = random.randint(1, len(users))  # Random sender ID
            while sender_id == receiver_id:
                sender_id = random.randint(1, len(users))  # Ensure sender is not the same as the receiver

            send_date = random_date(datetime(2020, 1, 1), datetime(2023, 12, 31))  # Random send date

            mailboxes.append({
                "mail_id": mail_id,
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "subject": f"Subject of Mail {mail_id}",
                "content": f"This is the content of mail {mail_id} from User {sender_id} to User {receiver_id}.",
                "send_date": f'ISODate("{send_date.isoformat()}")'  # Convert send_date to ISODate format
            })

            mail_id += 1

    return mailboxes

def write_seed_file():
    role_tracker = set()  # Track (user_id, course_id) combinations to avoid duplicates
    users = generate_users()
    courses = generate_courses()
    teach_in = generate_teach_in(role_tracker=role_tracker)
    assist_in = generate_assist_in(role_tracker=role_tracker)
    study_in = generate_study_in(role_tracker=role_tracker)
    announcements = generate_announcements()
    discussion_boards = generate_discussion_boards()
    exams = generate_exams(courses)
    materials = generate_materials(courses, teach_in, assist_in)
    assignments = generate_assignments(courses, teach_in, assist_in)
    submitted_assignments = generate_submitted_assignments(assignments, study_in, teach_in, assist_in)
    posts = generate_posts(discussion_boards, users)
    custom_tags = generate_custom_tags(len(users))  # Generate custom tags
    course_tags = generate_course_tags(len(users), len(courses))  # Generate course tags
    mailboxes = generate_mailbox(users)  # Generate mailbox data

    seed_data = {
        "user": users,
        "course": courses,
        "teach_in": teach_in,
        "assist_in": assist_in,
        "study_in": study_in,
        "announcement": announcements,
        "discussion_board": discussion_boards,
        "exams": exams,
        "materials": materials,
        "assignments": assignments,
        "submitted_ass": submitted_assignments,
        "post": posts,
        "custom_tag": custom_tags,
        "course_tag": course_tags,
        "mailbox": mailboxes  # Add mailbox data
    }

    output_dir = "/Users/kaiden/Local/Projects/moojidle/project/data_base"
    output_file = os.path.join(output_dir, "Seed.js")

    def convert_datetime_to_iso(data):
        """Recursively convert all datetime objects to ISODate format."""
        if isinstance(data, list):
            return [convert_datetime_to_iso(item) for item in data]
        elif isinstance(data, dict):
            return {key: convert_datetime_to_iso(value) for key, value in data.items()}
        elif isinstance(data, datetime):
            return f"ISODate(\"{data.isoformat()}\")"
        else:
            return data

    with open(output_file, "w") as f:
        for collection, data in seed_data.items():
            if collection in ["course", "announcement", "exams", "materials", "assignments", "submitted_ass", "post", "user", "custom_tag", "course_tag", "mailbox"]:  # Handle collections with ISODate
                collection_data = json.dumps(convert_datetime_to_iso(data), indent=2)
                collection_data = collection_data.replace('"ISODate(', 'ISODate(').replace(')"', ')')
                f.write(f"db.{collection}.insertMany({collection_data});\n\n")
            else:
                f.write(f"db.{collection}.insertMany({json.dumps(data, indent=2)});\n\n")

    print(f"Seed.js has been successfully generated at \n{output_file}!")
    
# Execute the script
if __name__ == "__main__":
    write_seed_file()