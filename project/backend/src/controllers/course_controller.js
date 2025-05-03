import { AddCourse, RemoveCourse, RemoveCourseRelationships } from "#src/services/modify_course.js";



async function CreateCourse(req, res) {
    try {
        const courseData = req.body;

        console.log("courseData", courseData);
        if (!courseData || Object.keys(courseData).length === 0) {
            return res.status(400).send({ message: "Lack of Course Data." });
        }
        console.log("courseData", courseData);
        const newCourse = await AddCourse(courseData);
        res.status(201).send(newCourse); // 返回新增的課程物件

    } catch (error) {
        console.error("Failed to create course", error);
        res.status(500).send({ message: "Failed to create course", error: error.message });
    }
}

async function DeleteCourse(req, res) {
    try {
        // 1. 從路由參數獲取課程 ID
        const { id } = req.params;

        // 2. 驗證 ID 是否存在
        if (!id) {
            return res.status(400).send({ message: "Lack of Course ID" });
        }

        // 3. 調用 Service 層的 RemoveCourse 函式處理刪除邏輯
        //    假設 RemoveCourse 返回刪除的行數
        const deletedRowCount = await RemoveCourse(id);

        // 4. 根據刪除結果返回響應
        if (deletedRowCount > 0) {
            // Successfully deleted the main course document
            // console.log(`Successfully deleted course with ID = ${id}. Now deleting related data...`);

            // 4a. Call the service function to delete related data
            // Convert id to integer again for the relationship deletion function
            const courseIdInt = parseInt(id, 10);
            await RemoveCourseRelationships(courseIdInt); // Call the new function

            // 4b. Send success response after all deletions are attempted
            res.status(200).send({ message: `Successfully deleted course and its related data with ID = ${id}.` });
            // 或者返回 204 No Content，不帶響應體
            // res.status(204).send();
        } else {
            // 未找到對應 ID 的課程
            res.status(404).send({ message: `cannot find ID = ${id} course` });
        }

    } catch (error) {
        // 5. 如果過程中發生錯誤
        // console.error("刪除課程時發生錯誤:", error);
        res.status(500).send({ message: "Fail to Delete course", error: error.message });
    }
}

export {
    CreateCourse,
    DeleteCourse,
}
