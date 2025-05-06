import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

//我加的
import post_course_router from "#src/routes/post/post_course_route.js";

// Initialize environment variables
dotenv.config();

// start initializing database server
import TestDBConnection from '#src/database.js';

TestDBConnection();

// Start initializing express server
const app = express();
const PORT = process.env.PORT;

app.use("/post-course", post_course_router);

// Middle Ware
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
}));

// Routes are here ----------------------------------------------------------------------
import exampleRoute from "#src/routes/example_route.js"

// try hit http://localhost:3000/example
app.use("/example", exampleRoute);


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
