import mongoose from "mongoose";
import { saveFile } from "./file_storage_service.js";

export const getNextId = async (collectionName) => {
    try {
        const counter = await mongoose.connection.db.collection("counter").findOne();
        const nextId = (counter?.[collectionName] ?? 0) + 1;

        await mongoose.connection.db.collection("counter").updateOne(
            {},
            { $set: { [collectionName]: nextId } },
            { upsert: true }
        );

        return nextId;
    } catch (error) {
        console.error(`Error getting next ID for ${collectionName}:`, error);
        throw error;
    }
};

export const insertAssignmentToDB = async (assignmentDoc) => {
    const result = await mongoose.connection.db.collection("assignments").insertOne(assignmentDoc);
    return result;
};

export const insertMaterialToDB = async (materialDoc) => {
    const result = await mongoose.connection.db.collection("materials").insertOne(materialDoc);
    return result;
};

export const handleUploadAndInsert = async (req) => {
    const { type, courseId, createByUserId, description } = req.body;
    const file = req.file;
    if (!file) throw new Error("No file uploaded");

    const subfolder = type === "assignment" ? "assignment" : "material";
    const savedFile = await saveFile(file.buffer, decodeURIComponent(file.originalname), subfolder);

    const now = new Date();
    if (type === "assignment") {
        const { assName, endDate, startDate } = req.body;
        const doc = {
            ass_id: await getNextId("assignments"),
            in_course_id: parseInt(courseId),
            create_by_user_id: parseInt(createByUserId),
            ass_name: assName,
            start_date: new Date(startDate),
            end_date: new Date(endDate),
            description,
            create_date: now,
            attachments: [
                {
                    filename: savedFile.originalName,
                    url: savedFile.relativeUrl,
                },
            ],
        };
        return await insertAssignmentToDB(doc);
    } else {
        const { mName, displayDate } = req.body;
        const doc = {
            m_id: await getNextId("materials"),
            in_course_id: parseInt(courseId),
            create_by_user_id: parseInt(createByUserId),
            m_name: mName,
            description,
            create_date: now,
            display_date: new Date(displayDate),
            path_to_file: savedFile.relativeUrl,
            url: savedFile.relativeUrl,
        };
        return await insertMaterialToDB(doc);
    }
};
