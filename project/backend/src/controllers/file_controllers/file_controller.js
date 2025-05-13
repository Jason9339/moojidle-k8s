import FileDBService from "#src/services/file_services/file_db_service.js";

class FileController {
    constructor() {
        this.fileService = new FileDBService();
    }

    upload = async (req, res) => {
        try {
            const result = await this.fileService.uploadFile(req);
            res.status(200).json({
                message: "File uploaded successfully.",
                fileId: result.fileId,
                fileName: result.fileName,
            });
        } catch (error) {
            console.error("Error uploading file:", error.message);
            res.status(500).json({ message: "Upload failed." });
        }
    };
}

export default FileController;
