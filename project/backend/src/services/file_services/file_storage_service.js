import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

class FileStorageService {
    constructor() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        this.basePath = path.join(__dirname, "../../../uploads");
    }

    async saveFile(buffer, originalName, subfolder) {
        const ext = path.extname(originalName);
        const fileId = randomUUID();
        const savedFileName = `${fileId}${ext}`;
        const folderPath = path.join(this.basePath, subfolder);

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
}

export default FileStorageService;