import mongoose from "mongoose";
import { SaveFile } from "./file_storage_service.js";

export const GetNextId = async (collectionName) => {
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

export const InsertAssignmentToDB = async (assignmentDoc) => {
    const result = await mongoose.connection.db.collection("assignments").insertOne(assignmentDoc);
    return result;
};

export const InsertMaterialToDB = async (materialDoc) => {
    const result = await mongoose.connection.db.collection("materials").insertOne(materialDoc);
    return result;
};

export const HandleUploadAndInsert = async (req) => {
    const { type, courseId, createByUserId, description } = req.body;
    const file = req.file;
    if (!file) throw new Error("No file uploaded");

    const subfolder = type === "assignment" ? "assignment" : "material";
    const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), subfolder);

    const now = new Date();
    if (type === "assignment") {
        const { assName, endDate, startDate } = req.body;
        const doc = {
            ass_id: await GetNextId("assignments"),
            in_course_id: parseInt(courseId),
            create_by_user_id: parseInt(createByUserId),
            ass_name: assName,
            start_date: new Date(startDate),
            end_date: new Date(endDate),
            description,
            create_date: now,
            max_score: 100,
            percentage: 0,
            attachments: [
                {
                    filename: savedFile.originalName,
                    path_to_file: savedFile.relativeUrl
                },
            ],
        };
        return await InsertAssignmentToDB(doc);
    } else {
        const { mName, displayDate } = req.body;
        const doc = {
            m_id: await GetNextId("materials"),
            in_course_id: parseInt(courseId),
            create_by_user_id: parseInt(createByUserId),
            m_name: mName,
            description,
            create_date: now,
            display_date: new Date(displayDate),
            path_to_file: savedFile.relativeUrl,
            url: savedFile.relativeUrl, // 修正：新增 url 欄位，與 path_to_file 相同
        };
        return await InsertMaterialToDB(doc);
    }
};
