import api from "@/ApiClient";

// watch backend/route/subass_route.js to be more precise

export const GetTheAssignSubAssForOneStuednt = async (assignmentId, userId) => {
    try {
        return (await api.get(`/submitted-assignment/assignment/${assignmentId}/user/${userId}`)).data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const CreateSubAssign = async (assignmentId, submitByUserId, formData) => {
    try {
        const endpoint = `/submitted-assignment/submit-to/${assignmentId}/user/${submitByUserId}`;
        
        const response = await api.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const UpdateSubAssign = async (subAssId, formData) => {
    try {
        const endpoint = `/submitted-assignment/sub-assign-id/${subAssId}`;
        
        const response = await api.put(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const DeleteSubAss = async (subAssId) => {
    try {
        return (await api.delete(`/submitted-assignment/sub-assign-id/${subAssId}`)).data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



