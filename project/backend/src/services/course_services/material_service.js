import mongoose from "mongoose";
import { GetCourseById } from '#src/services/course_services/course_service.js';
import CalculateWeek from '#src/utils/calculateWeek.js';
import { DeleteFile } from '#src/services/file_services/file_storage_service.js';

// 查詢課程教材
async function GetMaterialsByCourseId(courseId) {
    try {
        const course = await GetCourseById(courseId);
        if (!course) {
            throw new Error('找不到課程');
        }
        const courseStartDate = course.start_date || course.create_date;
        const courseWeekNum = course.week_num || 16;
        const materials = await mongoose.connection.db.collection('materials')
            .find({ in_course_id: parseInt(courseId) })
            .sort({ display_date: -1, create_date: -1 })
            .toArray();
        return Promise.all(materials.map(async (material) => {
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
        }));
    } catch (error) {
        console.error(`[GetMaterialsByCourseId] Error fetching materials for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course materials: ${error.message}`);
    }
}

// 更新課程教材
async function UpdateMaterialsService(courseId, materials) {
    try {
        const materialsCollection = mongoose.connection.db.collection('materials');
        const results = [];
        const course = await GetCourseById(courseId);
        if (!course) {
            throw new Error('找不到課程');
        }
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
                    const existingMaterial = await materialsCollection.findOne({
                        m_id: parseInt(material.id),
                        in_course_id: parseInt(courseId)
                    });
                    if (existingMaterial) {
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
                // debug log
                 console.log('[UpdateMaterialsService] updateObj:', updateObj);
                // 更新現有教材
                const result = await materialsCollection.updateOne(
                    { 
                        m_id: parseInt(material.id),
                        in_course_id: parseInt(courseId)
                    },
                    {
                        $set: updateObj
                    }
                );
                console.log('[UpdateMaterialsService] update result:', result);
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
        return results;
    } catch (error) {
        console.error(`[UpdateMaterialsService] Error updating materials for course ID ${courseId}:`, error);
        throw new Error(`Failed to update course materials: ${error.message}`);
    }
}

// 刪除教材
async function DeleteMaterialService(courseId, materialId) {
    try {
        const materialsCollection = mongoose.connection.db.collection('materials');
        // 強化查詢條件，允許字串與數字
        const query = {
            m_id: { $in: [parseInt(materialId), materialId] },
            in_course_id: { $in: [parseInt(courseId), courseId] }
        };
        const material = await materialsCollection.findOne(query);
        if (!material) {
            console.error(`[DeleteMaterialService] 找不到教材，查詢條件:`, query);
            return { deletedCount: 0 };
        }
        // 如果存在檔案路徑，執行檔案刪除操作
        if (material.path_to_file) {
            await DeleteFile(material.path_to_file);
        }
        // 刪除數據庫中的記錄
        const result = await materialsCollection.deleteOne(query);
        return result;
    } catch (error) {
        console.error(`[DeleteMaterialService] Error deleting material ID ${materialId} from course ID ${courseId}:`, error);
        throw new Error(`Failed to delete material: ${error.message}`);
    }
}

export { GetMaterialsByCourseId, UpdateMaterialsService, DeleteMaterialService };