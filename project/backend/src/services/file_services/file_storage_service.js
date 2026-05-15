import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Readable } from "stream";
import mongoose from "mongoose";

// 計算 uploads 基本目錄
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.join(__dirname, "../../../");
const bucketName = "uploaded_files";
const gridFsPrefix = "gridfs:";

function GetBucket() {
    if (!mongoose.connection.db) {
        throw new Error("Database connection is not ready");
    }

    return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName
    });
}

function ParseGridFsFileId(fileRef) {
    if (!fileRef || typeof fileRef !== "string" || !fileRef.startsWith(gridFsPrefix)) {
        return null;
    }

    const rawId = fileRef.slice(gridFsPrefix.length);
    if (!mongoose.Types.ObjectId.isValid(rawId)) {
        throw new Error(`Invalid GridFS file id: ${rawId}`);
    }

    return new mongoose.Types.ObjectId(rawId);
}

function BuildLegacyLocalPath(filePath) {
    const sanitizedPath = filePath.replace(/^\/+/, "");
    const fullPath = path.resolve(backendRoot, sanitizedPath);

    if (!fullPath.startsWith(path.resolve(backendRoot))) {
        throw new Error("Invalid file path");
    }

    return fullPath;
}

function EncodeDownloadName(fileName) {
    const fallbackName = "download";
    const safeName = path.basename(fileName || fallbackName).replace(/"/g, "");
    return encodeURIComponent(safeName);
}

function PipeReadableToWritable(readable, writable) {
    return new Promise((resolve, reject) => {
        readable.on("error", reject);
        writable.on("error", reject);
        writable.on("finish", resolve);
        readable.pipe(writable);
    });
}

/**
 * 將檔案 buffer 儲存至 MongoDB GridFS
 * @param {Buffer} buffer - 檔案資料
 * @param {string} originalName - 原始檔名（含副檔名）
 * @param {string} category - 檔案分類 (e.g., "assignment", "material")
 * @param {object} options - 額外 metadata
 * @returns {Promise<object>} 檔案資訊（包含路徑與 id 等）
 */
export async function SaveFile(buffer, originalName, category, options = {}) {
    try {
        const bucket = GetBucket();
        const safeOriginalName = path.basename(originalName || "upload");
        const contentType = options.contentType || "application/octet-stream";
        const readable = Readable.from(buffer);
        const uploadStream = bucket.openUploadStream(safeOriginalName, {
            contentType,
            metadata: {
                originalName: safeOriginalName,
                category,
                uploadedByUserId: options.uploadedByUserId,
                relatedType: options.relatedType,
                relatedId: options.relatedId,
                size: options.size ?? buffer.length
            }
        });

        await PipeReadableToWritable(readable, uploadStream);

        const fileId = uploadStream.id.toString();

        return {
            fileId,
            savedFileName: safeOriginalName,
            relativeUrl: `${gridFsPrefix}${fileId}`,
            originalName: safeOriginalName,
            contentType,
            size: options.size ?? buffer.length
        };
    } catch (error) {
        console.error(`[SaveFile] Error saving file ${originalName} to ${category}:`, error);
        throw new Error(`Failed to save file: ${error.message}`);
    }
}

/**
 * 刪除指定檔案
 * @param {string} filePath - GridFS ref 或 legacy 本機相對路徑
 * @returns {Promise<boolean>} 是否成功刪除
 */
export async function DeleteFile(filePath) {
    try {
        const gridFsFileId = ParseGridFsFileId(filePath);
        if (gridFsFileId) {
            const bucket = GetBucket();
            await bucket.delete(gridFsFileId);
            return true;
        }

        const fullPath = BuildLegacyLocalPath(filePath);
        await fs.promises.access(fullPath, fs.constants.F_OK);
        await fs.promises.unlink(fullPath);
        return true;
    } catch (error) {
        console.error(`刪除檔案失敗: ${filePath}`, error);
        return false;
    }
}

/**
 * 取得檔案 metadata
 * @param {string} filePath - GridFS ref
 * @returns {Promise<object|null>} 檔案 metadata
 */
export async function GetFileInfo(filePath) {
    const gridFsFileId = ParseGridFsFileId(filePath);
    if (!gridFsFileId) {
        return null;
    }

    const files = await mongoose.connection.db
        .collection(`${bucketName}.files`)
        .find({ _id: gridFsFileId })
        .limit(1)
        .toArray();

    return files[0] || null;
}

/**
 * 將檔案輸出至 Express response
 * @param {string} filePath - GridFS ref 或 legacy 本機相對路徑
 * @param {object} res - Express response
 * @param {object} options - 下載選項
 * @returns {Promise<void>}
 */
export async function DownloadFile(filePath, res, options = {}) {
    try {
        const gridFsFileId = ParseGridFsFileId(filePath);
        if (gridFsFileId) {
            const bucket = GetBucket();
            const fileInfo = await GetFileInfo(filePath);

            if (!fileInfo) {
                return res.status(404).json({ message: "File not found" });
            }

            const downloadName = options.downloadName || fileInfo.metadata?.originalName || fileInfo.filename;
            const dispositionType = options.inline ? "inline" : "attachment";

            res.setHeader("Content-Type", fileInfo.contentType || "application/octet-stream");
            res.setHeader("Content-Length", fileInfo.length);
            res.setHeader(
                "Content-Disposition",
                `${dispositionType}; filename*=UTF-8''${EncodeDownloadName(downloadName)}`
            );

            return await new Promise((resolve, reject) => {
                const downloadStream = bucket.openDownloadStream(gridFsFileId);
                downloadStream.on("error", reject);
                res.on("error", reject);
                res.on("finish", resolve);
                downloadStream.pipe(res);
            });
        }

        const fullPath = BuildLegacyLocalPath(filePath);
        await fs.promises.access(fullPath, fs.constants.F_OK);

        const downloadName = options.downloadName || path.basename(fullPath);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename*=UTF-8''${EncodeDownloadName(downloadName)}`
        );

        return res.download(fullPath, downloadName);
    } catch (error) {
        if (error.code === "ENOENT") {
            return res.status(404).json({ message: "File not found" });
        }

        console.error(`[DownloadFile] Error downloading file ${filePath}:`, error);
        return res.status(500).json({ message: "Error downloading file" });
    }
}
