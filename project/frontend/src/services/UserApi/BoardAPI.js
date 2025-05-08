import apiClient from "@/services/apiClient";
import axios from "axios";

async function getCourseDiscussionBoardFake(course_id) {
  const fakeData = {
    course_001: [
      {
        post_id: 1,
        post_by_user_id: 101,
        name:"電腦圖學",
        title: "第一週的作業有問題嗎？",
        post_user_custom_tag: [
          { tag_id: 1, tag_name: "資工系" },
          { tag_id: 2, tag_name: "大三" }
        ],
        description: "請問第一題是要用遞迴還是迴圈？",
        post_date: new Date("2024-05-01T10:00:00Z"),
        public: true,
        comments: [
          {
            comment_by_user_id: 102,
            comment_user_custom_tag: "資工系 大四",
            comment_date: new Date("2024-05-01T12:00:00Z"),
            description: "我用遞迴寫的，好像可以通過測資！"
          }
        ],
        in_b_id: 1,
        post_tags: [
          { tag_id: 101, tag_name: "作業" },
          { tag_id: 102, tag_name: "討論" }
        ]
      },
      {
        post_id: 2,
        post_by_user_id: 103,
        name:"電腦圖學",
        title: "下次報告是什麼時候？",
        post_user_custom_tag: [{ tag_id: 3, tag_name: "通識" }],
        description: "有人記得老師有改時間嗎？",
        post_date: new Date("2024-05-02T15:30:00Z"),
        public: true,
        comments: [],
        in_b_id: 1,
        post_tags: [
          { tag_id: 103, tag_name: "報告" }
        ]
      }
    ],
    course_002: [
      {
        post_id: 3,
        post_by_user_id: 104,
        title: "期中考會考哪些章節？",
        name:"圖論",
        post_user_custom_tag: [{ tag_id: 5, tag_name: "修課" }],
        description: "有沒有人整理期中範圍？",
        post_date: new Date("2024-05-03T09:00:00Z"),
        public: true,
        comments: [],
        in_b_id: 2,
        post_tags: [
          { tag_id: 201, tag_name: "期中考" }
        ]
      }
    ]
  };

  const key = `course_${String(course_id).padStart(3, "0")}`;
  
  return fakeData[key] || [];
}



async function getCoursePosts(courseId) {
  try {
    const response = await axios.get(`http://localhost:3000/post/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch course posts:", error.message);
    throw error;
  }
}

async function getCourseName(courseId) {
  try {
    const response = await axios.get(`http://localhost:3000/post-course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch course name:", error.message);
    throw error;
  }
}

async function getCourse(courseId) {
  try {
    const response = await axios.get(`http://localhost:3000/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch course data:", error.message);
    throw error;
  }
}
export {
  getCoursePosts,
  getCourseDiscussionBoardFake,
  getCourseName,
  getCourse
};

