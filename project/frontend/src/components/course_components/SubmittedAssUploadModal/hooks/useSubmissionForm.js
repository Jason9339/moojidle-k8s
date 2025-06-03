import { useState, useRef, useEffect } from "react";
import { CreateSubAssign, UpdateSubAssign, DeleteSubAss } from "@/services/SubmittedAssignmentApi";
import { checkFilesAndAlert } from "@/utils/fileValidation";

export function useSubmissionForm({ courseId, assignmentId, existingSubmission, onSuccess }) {
    const [files, setFiles] = useState([]);
    const [deletedFiles, setDeletedFiles] = useState([]);
    const [description, setDescription] = useState(existingSubmission?.description || "");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const existingFiles = existingSubmission?.attachments || [];
    const submissionId = existingSubmission?.s_ass_id;

    useEffect(() => {
        setDescription(existingSubmission?.description || "");
        setFiles([]);
        setDeletedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [existingSubmission]);

    const createFormData = () => {
        const formData = new FormData();

        files.forEach((file) => {
            const renamedFile = new File([file], encodeURIComponent(file.name), { type: file.type });
            formData.append("uploadFile", renamedFile);
        });

        formData.append("description", description);
        formData.append("courseId", courseId);

        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.user_id) {
            formData.append("userId", user.user_id);
        }

        return formData;
    };

    const validateSubmission = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.user_id) {
            alert("請先登入");
            return false;
        }

        const isEmptyDescription = !description.trim();
        const hasNoNewFiles = files.length === 0;

        if (!submissionId && isEmptyDescription && hasNoNewFiles) {
            alert("沒有內容可以提交。");
            return false;
        }

        return true;
    };

    const handleCreateSubmission = async (formData) => {
        await CreateSubAssign(assignmentId, JSON.parse(localStorage.getItem("user")).user_id, formData);
        alert("作業提交成功！");
    };

    const handleUpdateSubmission = async (formData) => {
        const remainingExistingFiles = existingFiles.filter(
            (file) => !(deletedFiles.includes(file.path_to_file) || deletedFiles.includes(file.filename))
        );

        const isEmptyDescription = !description.trim();
        const hasNoNewFiles = files.length === 0;

        if (isEmptyDescription && hasNoNewFiles && remainingExistingFiles.length === 0) {
            if (existingFiles.length > 0 || (existingSubmission?.description || "").trim()) {
                await DeleteSubAss(submissionId);
                alert("作業提交記錄已因內容清空而被刪除！");
            } else {
                alert("沒有內容可更新。");
                return false;
            }
        } else {
            const originalDescription = existingSubmission?.description || "";
            const noChangeInDescription = description === originalDescription;
            const noFilesMarkedForDeletion = deletedFiles.length === 0;

            if (noChangeInDescription && hasNoNewFiles && noFilesMarkedForDeletion) {
                alert("內容未作修改。");
                return false;
            }

            if (existingFiles.length > 0) {
                const keepFilesData = remainingExistingFiles.map(f => ({
                    path_to_file: f.path_to_file,
                    filename: f.filename,
                    size: f.size
                }));
                formData.append("keepFiles", JSON.stringify(keepFilesData));
            }

            await UpdateSubAssign(submissionId, formData);

            const numNewFiles = files.length;
            const numActuallyDeleted = existingFiles.length - remainingExistingFiles.length;

            let message = "作業更新成功！";
            if (numNewFiles > 0 && numActuallyDeleted > 0) {
                message += ` 新增 ${numNewFiles} 個檔案，刪除 ${numActuallyDeleted} 個檔案。`;
            } else if (numNewFiles > 0) {
                message += ` 新增 ${numNewFiles} 個檔案。`;
            } else if (numActuallyDeleted > 0) {
                message += ` 刪除 ${numActuallyDeleted} 個檔案。`;
            } else if (description !== originalDescription) {
                message = "作業描述更新成功！";
            }
            alert(message);
        }
        return true;
    };

    const handleUpload = async () => {
        if (loading) return;

        if (!validateSubmission()) {
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const formData = createFormData();

            if (submissionId) {
                const success = await handleUpdateSubmission(formData);
                if (!success) {
                    setLoading(false);
                    return;
                }
            } else {
                await handleCreateSubmission(formData);
            }

            // 重置狀態
            setFiles([]);
            setDeletedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            onSuccess && onSuccess();
        } catch (error) {
            console.error("處理作業提交失敗:", error);
            alert("處理失敗：" + (error.response?.data?.message || error.message || "發生未知錯誤"));
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("確定要清空所有作業內容嗎？此操作將刪除所有已提交的檔案和描述，且無法復原。")) {
            return;
        }

        setLoading(true);

        try {
            // 清空本地狀態
            setFiles([]);
            setDeletedFiles([]);
            setDescription("");
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            if (submissionId) {
                await DeleteSubAss(submissionId);
                alert("作業提交記錄已完全清除！");
            } else {
                alert("本地內容已清空！");
            }

            onSuccess && onSuccess();
        } catch (error) {
            console.error("清空作業內容失敗:", error);
            alert("清空失敗：" + (error.response?.data?.message || error.message || "發生未知錯誤"));
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);

            if (!checkFilesAndAlert(newFiles)) {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const removeSelectedFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleDeleteExistingFile = (fileUrl) => {
        setDeletedFiles(prev => [...prev, fileUrl]);
    };

    const handleRestoreFile = (fileIdentifier) => {
        setDeletedFiles(prev => prev.filter(path => path !== fileIdentifier));
    };

    return {
        // 狀態
        files,
        deletedFiles,
        description,
        loading,
        fileInputRef,
        existingFiles,
        submissionId,

        // 狀態更新函數
        setFiles,
        setDeletedFiles,
        setDescription,

        // 事件處理函數
        handleUpload,
        handleClearAll,
        handleFileChange,
        removeSelectedFile,
        handleDeleteExistingFile,
        handleRestoreFile
    };
} 