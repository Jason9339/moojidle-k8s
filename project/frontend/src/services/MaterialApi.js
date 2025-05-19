import api from "@/ApiClient";

export const GetCourseMaterials = async (courseId) => {
    return (await api.get(`/material/course/${courseId}/materials`)).data;
};

export const UpdateCourseMaterials = async (courseId, materials) => {
    try {
        const response = await api.post(
            `/material/course/${courseId}/materials`,
            materials
        );
        return response.data;
    } catch (error) {
        console.error(`更新課程 ${courseId} 教材失敗:`, error);
        throw error;
    }
};

export const DeleteCourseMaterial = async (courseId, materialId) => {
    try {
        const response = await api.delete(
            `/material/course/${courseId}/materials/${materialId}`
        );
        return response.data;
    } catch (error) {
        console.error(`刪除課程 ${courseId} 教材 ${materialId} 失敗:`, error);
        throw error;
    }
};