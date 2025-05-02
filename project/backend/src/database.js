import mongoose from "mongoose";
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

function TestDBConnection(){
    mongoose.connect(process.env.DATA_BASE_URL);

    const db = mongoose.connection;
    db.on('error', (error) => {
        console.log(error);
    });
    db.once('open', () => {
        console.log("Database connection successful");
    });
}

export default TestDBConnection;