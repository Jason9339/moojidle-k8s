import axios from "@/ApiClient";

// 上傳教材
export const UploadMaterial = async (formData) => {
    try {
        const courseId = formData.get('courseId');
        const endpoint = `/material/course/${courseId}/upload`;
        
        const response = await axios.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err) {
        console.error("上傳教材失敗", err);
        throw new Error(err.response?.data?.message || "上傳教材發生錯誤");
    }
};

// 上傳作業
export const UploadAssignment = async (formData) => {
    try {
        const courseId = formData.get('courseId');
        const endpoint = `/assignment/course/${courseId}/upload`;
        
        const response = await axios.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err) {
        console.error("上傳作業失敗", err);
        throw new Error(err.response?.data?.message || "上傳作業發生錯誤");
    }
};

// 下載教材檔案
export const DownloadMaterial = async (pathToFile, filename) => {
    try {
        const response = await axios.get(`/material/download`, {
            params: { path: pathToFile },
            responseType: 'blob',
        });

        const contentDisposition = response.headers['content-disposition'];
        let fileName = filename;
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
        }

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

// 下載作業檔案
export const DownloadAssignment = async (pathToFile, filename) => {
    try {
        const response = await axios.get(`/assignment/download`, {
            params: { path: pathToFile },
            responseType: 'blob',
        });

        const contentDisposition = response.headers['content-disposition'];
        let fileName = filename;
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error("下載作業錯誤:", error);
    }
};

// 刪除教材檔案
export const DeleteMaterial = async (pathToFile) => {
    try {
        const response = await axios.delete('/material/delete', {
            params: { path: pathToFile }
        });
        return response.data;
    } catch (error) {
        console.error("刪除教材失敗", error);
        throw new Error(error.response?.data?.message || "刪除教材時發生錯誤");
    }
};

// 刪除作業檔案
export const DeleteAssignment = async (pathToFile) => {
    try {
        const response = await axios.delete('/assignment/delete', {
            params: { path: pathToFile }
        });
        return response.data;
    } catch (error) {
        console.error("刪除作業失敗", error);
        throw new Error(error.response?.data?.message || "刪除作業時發生錯誤");
    }
};