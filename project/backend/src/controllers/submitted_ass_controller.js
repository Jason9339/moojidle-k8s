import GetNextCounterId from '#src/utils/get_next_counter_id.js';

import {
    GetAssignmentSubmissionService,
    CreateAssignmentSubmissionService,
    UpdateAssignmentSubmissionService,
    // DeleteSubmittedFileService,
    DeleteSubmissionRecordService
} from '#src/services/submitted_ass_service.js';

import {
    SaveFile,
    DeleteFile
} from '#src/services/file_services/file_storage_service.js';

import { FindOneUserById } from '#src/services/user_service.js';
import { FindAssignmentById } from '#src/services/assignment_service.js';

async function GetAssignmentSubmission(req, res) {
    try {
        const userId = parseInt(req.params.userId);
        const assId = parseInt(req.params.assignmentId);

        // check if user exist
        const user = await FindOneUserById(userId);
        if (!user) {
            res.status(404).send("user not find while finding sub ass for a user");
            return;
        }

        // check if ass exist
        const ass = await FindAssignmentById(assId);
        if (!ass) {
            res.status(404).send("assignment not find while finding sub ass for a user");
            return;
        }

        const submission = await GetAssignmentSubmissionService(assId, userId);

        if(submission.length == 0) {
            res.status(200).send(null);
            return;
        }

        // send back the newest one if have muiltiple
        res.status(200).json(submission.at(-1));
    } catch (error) {
        console.error(`[GetAssignmentSubmission] 錯誤:`, error);
        res.status(500).json({ message: error.message });
    }
}

async function DeleteSubmissionRecord(req, res) {
    try {
        const userId = parseInt(req.params.userId);
        const assId = parseInt(req.params.assignmentId);

        // check if user exist
        const user = await FindOneUserById(userId);
        if (!user) {
            res.status(404).send("user not find while deleting sub ass for a user");
            return;
        }

        // check if ass exist
        const ass = await FindAssignmentById(assId);
        if (!ass) {
            res.status(404).send("assignment not find while deleting sub ass for a user");
            return;
        }

        // handle file deletion
        const currentSubAss = await GetAssignmentSubmissionService(assId, userId);
        for(let subAss of currentSubAss){
            for(let attachment of subAss.attachments){
                const result = await DeleteFile(attachment.path_to_file);

                // since seed has a lot of invalid path, i dont do error handle here,
                // just assume everything is deleted
            }
        }

        const result = await DeleteSubmissionRecordService(assId, userId);
        if (result) {
            res.status(200).json("delete sub ass successfully");
        } else {
            res.status(500).send("internal error when delete sub ass");
        }
    } catch (error) {
        console.error("DeleteSubmissionRecord 錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

async function CreateAssignmentSubmission(req, res) {
    try {
        const userId = parseInt(req.params.userId);
        const assId = parseInt(req.params.assignmentId);
        const { userTags, description } = req.body;

        // since using multer to parse the nody we have req.files to use
        const files = req.files || [];

        // check if user exist
        const user = await FindOneUserById(userId);
        if (!user) {
            res.status(404).send("user not find while creating sub ass for a user");
            return;
        }

        // check if ass exist
        const ass = await FindAssignmentById(assId);
        if (!ass) {
            res.status(404).send("assignment not find while creating sub ass for a user");
            return;
        }

        // handle file storage
        const savedFiles = [];
        for (const file of files) {
            const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "submitted_assignment");
            savedFiles.push({
                filename: savedFile.originalName,
                path_to_file: savedFile.relativeUrl
            });
        }

        const nextSAssId = await GetNextCounterId("submitted_ass");

        const submission = {
            s_ass_id: nextSAssId,
            ass_id: assId,
            submit_by_user_id: userId,
            submit_user_course_tag: userTags || [],
            submit_date: new Date(),
            attachments: savedFiles,
            description: description || ""
        };

        const result = await CreateAssignmentSubmissionService(submission);

        if (result) {
            res.status(200).json("create sub ass successfully");
        } else {
            res.status(500).send("internal error when creating sub ass");
        }
    } catch (error) {
        console.error("[CreateAssignmentSubmission] 錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

async function UpdateAssignmentSubmission(req, res) {
    try {
        const { assignmentId, userId } = req.params;
        const { description, attachments } = req.body;

        const updateData = {
            ass_id: parseInt(assignmentId),
            submit_by_user_id: parseInt(userId),
            submit_date: new Date(),
            description: description || "",
            attachments: attachments || []
        };

        await UpdateAssignmentSubmissionService(
            parseInt(assignmentId),
            parseInt(userId),
            {
                submit_date: new Date(),
                description: description || "",
                attachments: attachments || []
            }
        );

        res.status(200).json({ message: "更新作業提交成功", data: updateData });
    } catch (error) {
        console.error("[UpdateAssignmentSubmission] 錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

export {
    GetAssignmentSubmission,
    CreateAssignmentSubmission,
    UpdateAssignmentSubmission,
    DeleteSubmissionRecord
};
