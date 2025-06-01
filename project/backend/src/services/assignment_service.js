import mongoose from "mongoose";
import GetNextCounterId from '#src/utils/get_next_counter_id.js';

// Fetch unsubmitted assignments for a specific user
async function GetToDoAssignmentsByUserId(user_id) {
    try {
        const db = mongoose.connection.db;
        // user_id is of type string
        const parsedUserId = parseInt(user_id);

        // Define a fixed current time for testing
        const current_time = new Date("2025-01-08T00:00:00Z"); // Set to a date in 2025
        // const current_time = new Date(); // Comment this out for testing

        const result = await db.collection("assignments").aggregate([
            // Match assignments for courses the user is studying in
            {
                $lookup: {
                    from: "study_in", // Join with the study_in collection
                    localField: "in_course_id", // Match course_id in assignments
                    foreignField: "course_id", // Match course_id in study_in
                    as: "study_data"
                }
            },
            {
                $unwind: "$study_data" // De-normalize study_data
            },
            {
                $match: {
                    "study_data.user_id": parsedUserId, // Filter by user_id
                }
            },
            // Exclude assignments that have been submitted by the current user
            {
                $lookup: {
                    from: "submitted_ass", // Join with submitted_ass collection
                    let: { ass_id: "$ass_id", user_id: parsedUserId }, // Pass ass_id and user_id to the pipeline
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$ass_id", "$$ass_id"] }, // Match ass_id
                                        { $eq: ["$submit_by_user_id", "$$user_id"] } // Match user_id
                                    ]
                                }
                            }
                        }
                    ],
                    as: "submitted_data"
                }
            },
            {
                $match: {
                    submitted_data: { $size: 0 } // Only unsubmitted assignments
                }
            },
            // Join with the course collection to get course details
            {
                $lookup: {
                    from: "course",
                    localField: "in_course_id",
                    foreignField: "course_id",
                    as: "course_data"
                }
            },
            {
                $unwind: "$course_data" // De-normalize course_data
            },
            // Project only the required fields
            {
                $project: {
                    _id: 0,
                    title: "$ass_name", // Map to frontend's "title"
                    course: "$course_data.name", // Map to frontend's "course"
                    start_date: "$start_date", // Map to frontend's "start_date"
                    due: "$end_date", // Map to frontend's "due"
                    points: { $literal: 100 } // Add a placeholder value for "points"
                }
            }
        ]).toArray();

        return result;
    } catch (error) {
        console.error("Error in FetchToDoAssignments:", error);
        throw error;
    }
}

async function FindAssignmentsByCourseId(courseId) {
    try {
        courseId = parseInt(courseId);
        const assignments = await mongoose.connection.db.collection('assignments')
        .find({ in_course_id: parseInt(courseId) })
        .sort({ end_date: 1 }) // 依截止日期升序排列
        .toArray();

        return assignments;
    } catch (error) {
        console.error(`[getAssignmentsByCourseId] Error fetching assignments for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course assignments: ${error.message}`);
    }
}

// 取得某用戶針對某作業的繳交時間
async function GetAssignmentSubmissionTime(assignmentId, userId) {
    const db = mongoose.connection.db;
    const parsedAssignmentId = parseInt(assignmentId);
    const parsedUserId = parseInt(userId);

    const submission = await db.collection("submitted_ass").findOne({
        ass_id: parsedAssignmentId,
        submit_by_user_id: parsedUserId
    });

    return submission ? submission.submit_date : null;
}

const InsertAssignmentToDB = async (assignmentData) => {
    try {
        // 生成下一個 assignment ID
        const nextAssignmentId = await GetNextCounterId("assignments");
        
        // 準備要插入的文檔
        const assignmentDoc = {
            ass_id: nextAssignmentId,
            ...assignmentData
        };
        
        const result = await mongoose.connection.db.collection("assignments").insertOne(assignmentDoc);
        return result;
    } catch (error) {
        console.error(`[InsertAssignmentToDB] Error inserting assignment:`, error);
        throw new Error(`Failed to insert assignment: ${error.message}`);
    }
};

// 學生繳交作業 - 支援多檔案上傳和修改
async function SubmitAssignmentService(assignmentId, submitByUserId, description, savedFiles, keepFiles = null) {
    try {
        const db = mongoose.connection.db;
        const now = new Date();
        
        console.log(`[SubmitAssignmentService] 開始處理學生作業提交: assignmentId=${assignmentId}, submitByUserId=${submitByUserId}, 檔案數量=${savedFiles.length}, keepFiles=${keepFiles ? 'provided' : 'null'}`);
        
        // 檢查是否已有提交紀錄
        const existingSubmission = await db.collection("submitted_ass").findOne({
            ass_id: parseInt(assignmentId),
            submit_by_user_id: parseInt(submitByUserId)
        });
        
        if (existingSubmission) {
            // 更新現有提交
            let updatedAttachments;
            
            // 處理檔案邏輯
            if (keepFiles && Array.isArray(keepFiles)) {
                // 如果提供了 keepFiles，直接使用 keepFiles 作為保留的檔案，再加上新檔案
                console.log(`[SubmitAssignmentService] 使用 keepFiles 模式，保留 ${keepFiles.length} 個檔案`);
                updatedAttachments = [...keepFiles, ...savedFiles];
            } else {
                // 傳統模式：合併現有檔案和新檔案
                console.log(`[SubmitAssignmentService] 使用傳統模式，合併現有檔案和新檔案`);
                updatedAttachments = [...(existingSubmission.attachments || []), ...savedFiles];
            }
            
            const finalDescription = description !== undefined ? description : existingSubmission.description;
            
            // 檢查更新後的內容是否完全為空
            const hasDescription = finalDescription && finalDescription.trim() !== '';
            const hasFiles = updatedAttachments.length > 0;
            
            if (!hasDescription && !hasFiles) {
                // 描述為空且沒有檔案，完全刪除提交記錄
                await db.collection("submitted_ass").deleteOne({
                    ass_id: parseInt(assignmentId),
                    submit_by_user_id: parseInt(submitByUserId)
                });
                
                console.log(`[SubmitAssignmentService] 提交記錄已完全刪除（描述和檔案都為空）`);
                
                return { 
                    deleted: true,
                    reason: "描述和檔案都為空" 
                };
            }
            
            const updateData = {
                submit_date: now, // 更新提交時間為最後修改時間
                attachments: updatedAttachments,
                description: finalDescription
            };
            
            await db.collection("submitted_ass").updateOne(
                { 
                    ass_id: parseInt(assignmentId),
                    submit_by_user_id: parseInt(submitByUserId)
                },
                { $set: updateData }
            );
            
            console.log(`[SubmitAssignmentService] 作業更新成功，s_ass_id: ${existingSubmission.s_ass_id}`);
            
            const updatedSubmission = { ...existingSubmission, ...updateData };
            return updatedSubmission;
        } else {
            // 新建提交紀錄
            const last = await db.collection("submitted_ass").find().sort({ s_ass_id: -1 }).limit(1).toArray();
            const nextSAssId = last.length > 0 ? last[0].s_ass_id + 1 : 1;
            
            const submit_user_course_tag = `StudentTag_${submitByUserId}`;
            
            const submission = {
                s_ass_id: nextSAssId,
                ass_id: parseInt(assignmentId),
                submit_by_user_id: parseInt(submitByUserId),
                submit_user_course_tag,
                submit_date: now,
                attachments: savedFiles,
                description: description || ""
            };
            
            console.log(`[SubmitAssignmentService] 準備寫入資料庫的submission:`, submission);
            
            await db.collection("submitted_ass").insertOne(submission);
            
            console.log(`[SubmitAssignmentService] 作業繳交成功，s_ass_id: ${nextSAssId}`);
            
            return submission;
        }
    } catch (error) {
        console.error("SubmitAssignmentService 錯誤:", error);
        throw error;
    }
}

// 取得某學生針對某作業的繳交紀錄
async function GetAssignmentSubmissionService(assignmentId, userId) {
    try {
        const db = mongoose.connection.db;
        const submission = await db.collection("submitted_ass").findOne({
            ass_id: parseInt(assignmentId),
            submit_by_user_id: parseInt(userId)
        });
        
        return submission;
    } catch (error) {
        console.error("GetAssignmentSubmissionService 錯誤:", error);
        throw error;
    }
}

// 刪除學生提交的單個檔案
async function DeleteSubmittedFileService(assignmentId, submitByUserId, fileUrl) {
    try {
        const db = mongoose.connection.db;
        const now = new Date();
        
        console.log(`[DeleteSubmittedFileService] 刪除檔案: assignmentId=${assignmentId}, submitByUserId=${submitByUserId}, fileUrl=${fileUrl}`);
        
        // 查找現有提交紀錄
        const submission = await db.collection("submitted_ass").findOne({
            ass_id: parseInt(assignmentId),
            submit_by_user_id: parseInt(submitByUserId)
        });
        
        if (!submission) {
            throw new Error("未找到提交紀錄");
        }
        
        // 從附件列表中移除指定檔案
        const updatedAttachments = submission.attachments.filter(att => att.url !== fileUrl);
        
        // 找到要刪除的檔案資訊
        const fileToDelete = submission.attachments.find(att => att.url === fileUrl);
        const deleteFilePath = fileToDelete?.path_to_file || fileToDelete?.url || fileUrl;
        
        // 檢查是否需要完全刪除提交記錄
        const hasDescription = submission.description && submission.description.trim() !== '';
        const hasOtherFiles = updatedAttachments.length > 0;
        
        if (!hasDescription && !hasOtherFiles) {
            // 描述為空且沒有其他檔案，完全刪除提交記錄
            await db.collection("submitted_ass").deleteOne({
                ass_id: parseInt(assignmentId),
                submit_by_user_id: parseInt(submitByUserId)
            });
            
            console.log(`[DeleteSubmittedFileService] 提交記錄已完全刪除（無描述且無其他檔案）`);
            
            return { 
                deleted: true,
                reason: "無描述且無其他檔案",
                deleteFilePath
            };
        } else {
            // 仍有描述或其他檔案，僅更新附件列表
            await db.collection("submitted_ass").updateOne(
                { 
                    ass_id: parseInt(assignmentId),
                    submit_by_user_id: parseInt(submitByUserId)
                },
                { 
                    $set: { 
                        attachments: updatedAttachments,
                        submit_date: now // 更新最後修改時間
                    }
                }
            );
            
            console.log(`[DeleteSubmittedFileService] 檔案刪除成功，提交記錄已更新`);
            
            return { 
                attachments: updatedAttachments,
                deleted: false,
                deleteFilePath
            };
        }
        
    } catch (error) {
        console.error("DeleteSubmittedFileService 錯誤:", error);
        throw error;
    }
}

// 完全刪除學生的作業提交記錄
async function DeleteSubmissionRecordService(assignmentId, submitByUserId) {
    try {
        const db = mongoose.connection.db;
        
        console.log(`[DeleteSubmissionRecordService] 刪除提交記錄: assignmentId=${assignmentId}, submitByUserId=${submitByUserId}`);
        
        // 查找現有提交紀錄
        const submission = await db.collection("submitted_ass").findOne({
            ass_id: parseInt(assignmentId),
            submit_by_user_id: parseInt(submitByUserId)
        });
        
        if (!submission) {
            throw new Error("未找到提交紀錄");
        }
        
        // 刪除提交記錄
        await db.collection("submitted_ass").deleteOne({
            ass_id: parseInt(assignmentId),
            submit_by_user_id: parseInt(submitByUserId)
        });
        
        console.log(`[DeleteSubmissionRecordService] 提交記錄已完全刪除`);
        
        return { 
            deleted: true,
            attachments: submission.attachments || []
        };
        
    } catch (error) {
        console.error("DeleteSubmissionRecordService 錯誤:", error);
        throw error;
    }
}

// 創建作業服務 - 用於老師創建新作業
async function CreateAssignmentService(assignmentData) {
    try {
        const result = await InsertAssignmentToDB(assignmentData);
        return result;
    } catch (error) {
        console.error(`[CreateAssignmentService] Error creating assignment:`, error);
        throw error;
    }
}

// 取得課程作業列表服務
async function GetCourseAssignmentsService(courseId) {
    try {
        const assignments = await FindAssignmentsByCourseId(courseId);
        return assignments;
    } catch (error) {
        console.error(`[GetCourseAssignmentsService] Error fetching course assignments:`, error);
        throw error;
    }
}

// 取得作業提交時間服務
async function GetAssignmentSubmissionTimeService(assignmentId, userId) {
    try {
        const submitTime = await GetAssignmentSubmissionTime(assignmentId, userId);
        return submitTime;
    } catch (error) {
        console.error(`[GetAssignmentSubmissionTimeService] Error:`, error);
        throw error;
    }
}

export {
    GetToDoAssignmentsByUserId,
    FindAssignmentsByCourseId,
    GetAssignmentSubmissionTime,
    InsertAssignmentToDB,
    CreateAssignmentService,
    GetCourseAssignmentsService,
    GetAssignmentSubmissionTimeService,
    SubmitAssignmentService,
    GetAssignmentSubmissionService,
    DeleteSubmittedFileService,
    DeleteSubmissionRecordService
};