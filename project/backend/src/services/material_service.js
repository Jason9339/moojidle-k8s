import mongoose from "mongoose";
import { DeleteFile } from '#src/services/file_services/file_storage_service.js';
import GetNextCounterId from '#src/utils/get_next_counter_id.js';

async function FindMaterialsByCourseId(courseId) {
    try {
        const materials = await mongoose.connection.db.collection('materials')
            .find({ in_course_id: parseInt(courseId) })
            .sort({ display_date: -1, create_date: -1 })
            .toArray();

        return materials;
    } catch (error) {
        console.error(`[GetMaterialsByCourseId] Error fetching materials for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course materials: ${error.message}`);
    }
}

async function DeleteMaterialById(materialId) {
    try {
        const materialsCollection = mongoose.connection.db.collection('materials');
        // 強化查詢條件，允許字串與數字
        const query = {
            m_id: { $in: [parseInt(materialId), materialId] },
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
        console.error(`[DeleteMaterialService] Error deleting material ID ${materialId}:`, error);
        throw new Error(`Failed to delete material: ${error.message}`);
    }
}

async function FindMaterialById(mId) {
    try {
        const material = await mongoose.connection.db.collection('materials').findOne({ m_id: parseInt(mId), });

        return material;
    } catch (error) {
        console.error(`[GetMaterialsById] Error fetching materials:`, error);
        throw new Error(`Failed to retrieve course materials: ${error.message}`);
    }
}

async function UpdateMaterialById(mId, updateObj) {
    try {
        const material = await mongoose.connection.db.collection('materials').updateOne(
            { 
                m_id: parseInt(mId)
            },
            {
                $set: updateObj
            }
        );

        return material;
    } catch (error) {
        console.error(`[UpdateMaterialsById] Error fetching materials:`, error);
        throw new Error(`Failed to retrieve course materials: ${error.message}`);
    }
}

const InsertMaterialToDB = async (materialData) => {
    // 生成下一個 material ID
    const nextMaterialId = await GetNextCounterId("materials");
    
    // 準備要插入的文檔
    const materialDoc = {
        m_id: nextMaterialId,
        ...materialData
    };
    
    const result = await mongoose.connection.db.collection("materials").insertOne(materialDoc);
    return result;
};

export {
    FindMaterialsByCourseId,
    FindMaterialById,
    UpdateMaterialById,
    DeleteMaterialById,
    InsertMaterialToDB
};