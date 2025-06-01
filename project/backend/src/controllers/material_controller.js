import {
    DeleteMaterialById,
    FindMaterialsByCourseId,
    FindMaterialById,
    UpdateMaterialById,
    InsertMaterialToDB
} from '#src/services/material_service.js';

import {
    FindCourseById
} from '#src/services/course_service.js';

import {
    SaveFile,
    DeleteFile
} from '#src/services/file_services/file_storage_service.js';

import CalculateWeek from '#src/utils/calculate_week.js';

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// 模擬 __dirname，因為使用的是 ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 取得特定課程的檔案
async function GetCourseFiles(req, res) {
    try {
        let { courseId } = req.params;
        courseId = parseInt(courseId);

        let course = await FindCourseById(courseId);

        const courseStartDate = course.start_date || course.create_date;
        const courseWeekNum = course.week_num || 16;

        let materials = await FindMaterialsByCourseId(courseId);
        materials = materials.map((material) => {
            const materialDate = material.display_date || material.create_date;
            const week = CalculateWeek(courseStartDate, materialDate, courseWeekNum);
            return {
                id: material.m_id,
                name: material.m_name,
                url: material.url || material.path_to_file,
                description: material.description,
                displayDate: material.display_date || material.create_date,
                week: week,
                path_to_file: material.path_to_file,
                filename: material.filename
            };
        });

        res.json(materials);
    } catch (error) {
        console.error("取得課程檔案錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 更新課程教材
async function UpdateCourseMaterials(req, res) {
    try {
        let { courseId } = req.params;
        courseId = parseInt(courseId);
        const materials = req.body;
        if (!materials || !Array.isArray(materials) || materials.length === 0) {
            return res.status(400).json({ message: '請提供有效的教材數據' });
        }

        let results = [];
        const course = await FindCourseById(courseId);

        // 使用 start_date 而非 create_date
        const courseStartDate = course.start_date || course.create_date;
        const courseWeekNum = course.week_num || 16;
        // 只處理現有教材的更新
        for (const material of materials) {
            // 檢查是否是已存在的教材
            if (material.id) {
                // 如果沒有提供週次，嘗試計算
                let week = material.week;
                if (!week) {
                    // 獲取教材的顯示日期或創建日期
                    const existingMaterial = await FindMaterialById(parseInt(material.id));

                    if (existingMaterial && existingMaterial != []) {
                        // 使用 display_date 或備用 create_date
                        const materialDate = existingMaterial.display_date || existingMaterial.create_date;
                        week = CalculateWeek(courseStartDate, materialDate, courseWeekNum);
                    } else {
                        week = 1; // 默認值
                    }
                }
                // 創建更新對象
                const updateObj = {
                    m_name: material.name,
                    url: material.url,
                    description: material.description || ""
                };
                // 如果提供了顯示日期，添加到更新對象中，並強制轉型與防呆
                if (typeof material.displayDate !== 'undefined' && material.displayDate !== null && material.displayDate !== '') {
                    const dateObj = new Date(material.displayDate);
                    if (!isNaN(dateObj.getTime())) {
                        updateObj.display_date = dateObj;
                    } else {
                        console.warn('[UpdateMaterialsService] displayDate 轉換失敗:', material.displayDate);
                    }
                }

                // 更新現有教材
                const result = await UpdateMaterialById(material.id, updateObj);

                if (result.matchedCount > 0) {
                    results.push({
                        id: material.id,
                        name: material.name,
                        url: material.url,
                        description: material.description || "",
                        displayDate: material.displayDate || "",
                        week: week,
                        status: 'updated'
                    });
                }
            }
        }

        res.status(200).json(results);
    } catch (error) {
        console.error(`更新課程 ${req.params.courseId} 教材失敗:`, error);
        res.status(500).json({ message: '更新教材失敗', error: error.message });
    }
}

// 刪除課程教材
async function DeleteCourseMaterial(req, res) {
    try {
        const { materialId } = req.params;
        const result = await DeleteMaterialById(parseInt(materialId));
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: '未找到指定教材' });
        }
        res.status(200).json({ message: `成功刪除教材 ID: ${materialId}` });
    } catch (error) {
        console.error(`刪除課程 ${req.params.courseId} 教材 ${req.params.materialId} 失敗:`, error);
        res.status(500).json({ message: '刪除教材失敗', error: error.message });
    }
}

// 上傳課程教材 - 檔案
async function UploadCourseMaterialFile(req, res) {
    try {
        const { courseId } = req.params;
        const {
            createByUserId,
            mName,
            description,
            displayDate
        } = req.body;

        if (!mName || !mName.trim()) {
            return res.status(400).json({ message: "請輸入教材名稱" });
        }

        if (!displayDate) {
            return res.status(400).json({ message: "請選擇顯示日期" });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "請選擇檔案" });
        }

        const now = new Date();
        
        // 儲存檔案到硬碟
        const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "material");
        
        const materialData = {
            in_course_id: parseInt(courseId),
            create_by_user_id: parseInt(createByUserId),
            m_name: mName,
            description: description || "",
            create_date: now,
            display_date: new Date(displayDate),
            path_to_file: savedFile.relativeUrl,
            filename: savedFile.originalName
        };

        const dbResult = await InsertMaterialToDB(materialData);

        res.status(200).json({
            message: "教材檔案上傳成功",
            fileId: savedFile.fileId,
            fileName: savedFile.originalName,
            data: dbResult
        });

    } catch (error) {
        console.error("上傳教材檔案錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 上傳課程教材 - 連結
async function UploadCourseMaterialLink(req, res) {
    try {
        const { courseId } = req.params;
        const {
            createByUserId,
            mName,
            description,
            displayDate,
            url
        } = req.body;

        if (!mName || !mName.trim()) {
            return res.status(400).json({ message: "請輸入教材名稱" });
        }

        if (!displayDate) {
            return res.status(400).json({ message: "請選擇顯示日期" });
        }

        if (!url || !url.trim()) {
            return res.status(400).json({ message: "請輸入連結" });
        }

        const now = new Date();
        
        const materialData = {
            in_course_id: parseInt(courseId),
            create_by_user_id: parseInt(createByUserId),
            m_name: mName,
            description: description || "",
            create_date: now,
            display_date: new Date(displayDate),
            url: url
        };

        const dbResult = await InsertMaterialToDB(materialData);

        res.status(200).json({
            message: "教材連結新增成功",
            url: url,
            data: dbResult
        });

    } catch (error) {
        console.error("新增教材連結錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 下載教材檔案
function DownloadMaterial(req, res) {
    const { path: filePathParam } = req.query;

    if (!filePathParam) {
        return res.status(400).json({ message: "Missing path parameter" });
    }

    const sanitizedPath = filePathParam.replace(/^\/+/, ""); // 去除開頭的 "/"
    // 從當前控制器目錄往上回到 backend 根目錄，然後加上檔案路徑
    const filePath = path.join(__dirname, "../../", sanitizedPath);
    // console.log("Resolved file path:", filePath);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("❌ 檔案不存在:", filePath);
            return res.status(404).json({ message: "File not found" });
        }

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${path.basename(filePath)}"`
        );

        res.download(filePath, (err) => {
            if (err) {
                console.error("❌ 下載錯誤:", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });
    });
}

// 刪除教材檔案
async function DeleteMaterial(req, res) {
    try {
        const { path: filePath } = req.query;
        
        if (!filePath) {
            return res.status(400).json({ message: "缺少檔案路徑參數" });
        }
        
        const result = await DeleteFile(filePath);
        
        if (result) {
            return res.status(200).json({ message: "教材檔案刪除成功" });
        } else {
            return res.status(404).json({ message: "教材檔案不存在或刪除失敗" });
        }
    } catch (error) {
        console.error("刪除教材檔案時發生錯誤:", error);
        res.status(500).json({ message: "刪除教材檔案時發生錯誤", error: error.message });
    }
}

export {
    GetCourseFiles,
    UpdateCourseMaterials,
    DeleteCourseMaterial,
    UploadCourseMaterialFile,
    UploadCourseMaterialLink,
    DownloadMaterial,
    DeleteMaterial
};
