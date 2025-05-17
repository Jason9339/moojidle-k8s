import { GetMaterialsByCourseId, UpdateMaterialsService, DeleteMaterialService } from '#src/services/course_services/material_service.js';

// 取得特定課程的檔案
async function GetCourseFiles(req, res) {
    try {
        const { courseId } = req.params;
        const files = await GetMaterialsByCourseId(courseId);
        res.json(files);
    } catch (error) {
        console.error("取得課程檔案錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 更新課程教材
async function UpdateCourseMaterials(req, res) {
    try {
        const { courseId } = req.params;
        const materials = req.body;
        if (!materials || !Array.isArray(materials) || materials.length === 0) {
            return res.status(400).json({ message: '請提供有效的教材數據' });
        }
        const updatedMaterials = await UpdateMaterialsService(parseInt(courseId), materials);
        res.status(200).json(updatedMaterials);
    } catch (error) {
        console.error(`更新課程 ${req.params.courseId} 教材失敗:`, error);
        res.status(500).json({ message: '更新教材失敗', error: error.message });
    }
}

// 刪除課程教材
async function DeleteCourseMaterial(req, res) {
    try {
        const { courseId, materialId } = req.params;
        const result = await DeleteMaterialService(parseInt(courseId), parseInt(materialId));
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: '未找到指定教材' });
        }
        res.status(200).json({ message: `成功刪除教材 ID: ${materialId}` });
    } catch (error) {
        console.error(`刪除課程 ${req.params.courseId} 教材 ${req.params.materialId} 失敗:`, error);
        res.status(500).json({ message: '刪除教材失敗', error: error.message });
    }
}

export { GetCourseFiles, UpdateCourseMaterials, DeleteCourseMaterial };
