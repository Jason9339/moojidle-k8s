import { MongoClient } from "mongodb";
import FileStorageService from "./file_storage_service.js";

class FileDBService {
    constructor() {
        this.storageService = new FileStorageService();
        this.client = new MongoClient("mongodb://localhost:27017");
    }

    async getNextId(collectionName) {
        const db = this.client.db("moojidle");
        const counter = await db.collection("counter").findOneAndUpdate(
            {},
            { $inc: { [collectionName]: 1 } },
            { returnDocument: "after", upsert: true }
        );
        return counter.value[collectionName];
    }

    async uploadFile(req) {
        await this.client.connect();
        const db = this.client.db("moojidle");

        const { type, courseId, createByUserId, description } = req.body;
        const file = req.file;
        if (!file) throw new Error("No file uploaded");

        const subfolder = type === "assignment" ? "assignment" : "material";
        const savedFile = await this.storageService.saveFile(
            file.buffer,
            decodeURIComponent(file.originalname),
            subfolder
        );

        const now = new Date();
        if (type === "assignment") {
            const { assName, endDate } = req.body;
            const doc = {
                ass_id: await this.getNextId("assignments"),
                in_course_id: parseInt(courseId),
                create_by_user_id: parseInt(createByUserId),
                ass_name: assName,
                description,
                create_date: now,
                end_date: new Date(endDate),
                attachments: [
                    {
                        filename: savedFile.originalName,
                        url: savedFile.relativeUrl,
                    },
                ],
            };
            await db.collection("assignments").insertOne(doc);
        } else {
            const { mName } = req.body;
            const doc = {
                m_id: await this.getNextId("materials"),
                in_course_id: parseInt(courseId),
                create_by_user_id: parseInt(createByUserId),
                m_name: mName,
                description,
                create_date: now,
                path_to_file: savedFile.relativeUrl,
                url: savedFile.relativeUrl,
            };
            await db.collection("materials").insertOne(doc);
        }

        return {
            fileId: savedFile.fileId,
            fileName: savedFile.originalName,
        };
    }
}

export default FileDBService;