import axios from "./apiClient";

export const UploadFile = async (formData) => {
    try {
        const response = await axios.post("/file/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err) {
        console.error("上傳失敗", err);
        throw new Error(err.response?.data?.message || "上傳發生錯誤");
    }
};

export const DownloadFile = async (pathToFile, filename) => {
    try {
        const response = await axios.get(`/file/download`, {
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
        console.error("Download error:", error);
    }
};