import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

// 計算 uploads 基本目錄
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, "../../../uploads");

/**
 * 將檔案 buffer 寫入指定子資料夾
 * @param {Buffer} buffer - 檔案資料
 * @param {string} originalName - 原始檔名（含副檔名）
 * @param {string} subfolder - 要儲存的子資料夾 (e.g., "assignment", "material")
 * @returns {Promise<object>} 檔案資訊（包含路徑與 id 等）
 */
export async function SaveFile(buffer, originalName, subfolder) {
    const ext = path.extname(originalName);
    const fileId = randomUUID();
    const savedFileName = `${fileId}${ext}`;
    const folderPath = path.join(basePath, subfolder);

    await fs.promises.mkdir(folderPath, { recursive: true });

    const fullPath = path.join(folderPath, savedFileName);
    await fs.promises.writeFile(fullPath, buffer);

    return {
        fileId,
        savedFileName,
        fullPath,
        relativeUrl: `/uploads/${subfolder}/${savedFileName}`,
        originalName,
    };
}
