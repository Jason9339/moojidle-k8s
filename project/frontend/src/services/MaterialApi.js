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

// 上傳教材 - 檔案
export const UploadMaterialFile = async (formData) => {
    try {
        const courseId = formData.get('courseId');
        const endpoint = `/material/course/${courseId}/upload-file`;

        const response = await api.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err) {
        console.error("上傳教材檔案失敗", err);
        throw new Error(err.response?.data?.message || "上傳教材檔案發生錯誤");
    }
};

// 上傳教材 - 連結
export const UploadMaterialLink = async (courseId, linkData) => {
    try {
        const endpoint = `/material/course/${courseId}/upload-link`;

        const response = await api.post(endpoint, linkData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (err) {
        console.error("新增教材連結失敗", err);
        throw new Error(err.response?.data?.message || "新增教材連結發生錯誤");
    }
};

// 下載教材檔案
export const DownloadMaterial = async (pathToFile, fileName) => {
    try {
        const response = await api.get(`/material/download`, {
            params: { path: pathToFile },
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error("下載教材錯誤:", error);
    }
};

// 刪除教材檔案
export const DeleteMaterialFile = async (pathToFile) => {
    try {
        const response = await api.delete('/material/delete', {
            params: { path: pathToFile }
        });
        return response.data;
    } catch (error) {
        console.error("刪除教材失敗", error);
        throw new Error(error.response?.data?.message || "刪除教材時發生錯誤");
    }
};