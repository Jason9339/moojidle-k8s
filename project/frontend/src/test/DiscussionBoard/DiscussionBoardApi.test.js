import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/ApiClient"; 
import {
    GetBoardsGroupByCourseByUserID,
    CreateDiscussionBoard,
    DeleteDiscussionBoard,
    EditDiscussionBoard
} from "@/services/DiscussionBoardApi";

vi.mock("@/ApiClient", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn()
    }
}));

describe("Discussion Board API Functions", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should get boards grouped by course", async () => {
        const mockData = [{ course_id: 1, boards: ["Board 1", "Board 2"] }];
        api.get.mockResolvedValueOnce({ data: mockData });

        const result = await GetBoardsGroupByCourseByUserID(123);
        expect(api.get).toHaveBeenCalledWith("/discussion-board/user-course-boards/123");
        expect(result).toEqual(mockData);
    });

    it("should create a discussion board", async () => {
        const mockResponse = { data: { board_id: 1, name: "New Board" } };
        api.post.mockResolvedValueOnce(mockResponse);

        const result = await CreateDiscussionBoard(1, "New Board");
        expect(api.post).toHaveBeenCalledWith("/discussion-board/course-boards", {
            course_id: 1,
            name: "New Board"
        });
        expect(result).toEqual({ board_id: 1, board_name: "New Board" });
    });

    it("should delete a discussion board", async () => {
        api.delete.mockResolvedValueOnce({ data: "Board deleted" });

        const result = await DeleteDiscussionBoard(1);
        expect(api.delete).toHaveBeenCalledWith("/discussion-board/course-boards/1");
        expect(result.data).toEqual("Board deleted");
    });

    it("should edit a discussion board name", async () => {
        const mockResponse = { data: { board_id: 1, board_name: "Updated Board" } };
        api.patch.mockResolvedValueOnce(mockResponse);

        const result = await EditDiscussionBoard(1, "Updated Board");
        expect(api.patch).toHaveBeenCalledWith("/discussion-board/course-boards/1", { board_name: "Updated Board" });
        expect(result.data).toEqual(mockResponse.data);
    });
});