import apiClient from "@/services/apiClient";

async function getUserInvolveCourseFake(userID) {
    // const response = await apiClient.get(``)
    const fake_data = [
        { course_id: 1, name: "電腦圖學" },
        { course_id: 2, name: "圖論" },
        { course_id: 3, name: "軟體工程" },
    ];
    const response = {
        data: fake_data,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
    };

    return response.data;
}

export { getUserInvolveCourseFake };
