import mongoose from "mongoose";

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
