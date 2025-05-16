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
import exampleRoute from "#src/routes/example_route.js"
import assignmentRoute from "#src/routes/assignment_route.js"
import examRoute from "#src/routes/exam_route.js"
import courseRouter from "#src/routes/course_router.js"
import todoAssignmentsRoute from "#src/routes/todo_assignments_route.js"
import upcomingExamsRoute from "#src/routes/upcoming_exams_route.js"
import courseMemberRoute from "#src/routes/member_route.js"
import userRoute from "#src/routes/user_routes/user_route.js"
import fileRouter from "#src/routes/file_routes/file_route.js";

// try hit http://localhost:3000/example
app.use("/example", exampleRoute);
app.use("/course", courseRouter);
app.use("/assignments", todoAssignmentsRoute);
app.use("/exams", upcomingExamsRoute);
app.use("/course/member", courseMemberRoute);

app.use("/example", exampleRoute);
app.use("/user", userRoute);
app.use("/file", fileRouter);

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
