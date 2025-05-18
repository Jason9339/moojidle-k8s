import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// start initializing database server
import TestDBConnection from '#src/database.js';

TestDBConnection();

// Start initializing express server
const app = express();
const PORT = process.env.PORT;

// Middle Ware
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
}));

// Routes are here ----------------------------------------------------------------------

// course group
import assignmentRoute from "#src/routes/course_routes/assignment_route.js"
import examRoute from "#src/routes/course_routes/exam_route.js"
import courseRoute from "#src/routes/course_routes/course_router.js"
import courseMemberRoute from "#src/routes/course_routes/course_member_route.js"
import userRoute from "#src/routes/user_routes/user_route.js"
import fileRoute from "#src/routes/file_routes/file_route.js";
import materialRoute from "#src/routes/course_routes/material_route.js";
import announcementRoute from "#src/routes/course_routes/announcement_route.js";

// discussion group
// import courseRoute from "#src/routes/discussion_routes/course_route.js"
import discussionBoardRoute from "#src/routes/discussion_routes/discussion_board_route.js"
import postRoute from "#src/routes/discussion_routes/post_routes.js"

// user route
app.use("/user", userRoute);

// course route
// app.use("/course", courseRoute);

// discussion-board route
app.use("/discussion-board", discussionBoardRoute);

// post route
app.use("/post", postRoute);

// try hit http://localhost:3000/example
app.use("/course", courseRoute);
app.use("/assignment", assignmentRoute);
app.use("/material", materialRoute);
app.use("/announcement", announcementRoute);

app.use("/exams", examRoute);
app.use("/course/member", courseMemberRoute);
app.use("/file", fileRoute);

// Routes ends --------------------------------------------------------------------------

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send("something is wrong...\n detected in global error handler");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
