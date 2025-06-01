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
import assignmentRoute from "#src/routes/assignment_route.js"
import examRoute from "#src/routes/exam_route.js"
import courseRoute from "#src/routes/course_router.js"
import courseMemberRoute from "#src/routes/course_member_route.js"
import userRoute from "#src/routes/user_route.js"
import materialRoute from "#src/routes/material_route.js";
import announcementRoute from "#src/routes/announcement_route.js";
import discussionBoardRoute from "#src/routes/discussion_board_route.js"
import postRoute from "#src/routes/post_routes.js"
import submitAssignmentRoute from "#src/routes/submit_assignment_route.js";

app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use("/course/member", courseMemberRoute);
app.use("/discussion-board", discussionBoardRoute);
app.use("/post", postRoute);
app.use("/assignment", assignmentRoute);
app.use("/submit-assignment", submitAssignmentRoute);
app.use("/material", materialRoute);
app.use("/announcement", announcementRoute);
app.use("/exams", examRoute);

// Routes ends --------------------------------------------------------------------------

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send("something is wrong...\n detected in global error handler");
});

// Start server
let server = app.listen(PORT, () => {
    console.log(`Server should be running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
    } else {
        console.error('Server error:', err);
    }
});
